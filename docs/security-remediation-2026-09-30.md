# Security remediation — 30 September 2026

Local source review and synthetic fixtures only. No production databases, users' locations, provider settings, credentials, or deployed logs were accessed. No push, deployment, service restart, credential revocation, or history rewrite was performed.

## Verified findings and corrections

- **F01 confirmed.** Authenticated `/api/users/search` returned a complete target User document. This included email, password hash, exact coordinates, relationship lists, and sharing settings. Searching for a non-friend bypassed the `/friends` privacy response.
- Search and `/profiles/:username` now use an explicit public DTO: `_id`, `username`, `profilePicture`, `defaultPrivacy`. Search projects only identity and relationship fields needed for its checks. Passwords are excluded by default at the schema and removed from document JSON; login and password changes explicitly select the hash.
- `/friends` only discloses the selected location granularity for reciprocal friendships. Missing privacy rules now disclose no location. Friend requests return identity fields only. `/auth/verify` intentionally returns the authenticated caller's own email/location; populated users are projected to identity fields.
- **Adjacent authorization issues:** a duplicate outgoing request check compared against the caller's own ID; fixed to check the target and incoming requests. Accept requires matching incoming/outgoing requests, and initializes sharing from each account's chosen default rather than forcing city sharing. Delete, revoke, decline, and privacy updates require the caller's applicable relationship. These multi-document writes are still not transactional; partial failures can require reconciliation, but location reads now fail closed for one-sided friendship state.
- **Mongo inputs:** structured/repeated usernames, non-string login/signup identifiers, invalid object IDs, invalid privacy enums, malformed JWT subjects, and structured CAPTCHA challenge IDs are rejected before database queries. Location writes remain scoped to the authenticated caller.
- **F04 confirmed, with correction:** JWT authentication already preceded the upload parser. It was not anonymous in this application. Multer was old and allowed 50 MiB files without file/field/part bounds. It is now 2.3.0 or newer, with 5 MiB file limit, one file, no text fields, bounded parts and field names, and `fieldArrayIndexLimit: 0`. Image dimensions are checked before decoding (16 million pixels). Normal uploads still resize to 288px JPEG and use the existing storage path. Unsupported and malformed images return 400. JPEG, PNG, GIF, BMP and TIFF remain supported; Jimp did not support WebP despite the old permissive MIME filter.
- Fixed the error middleware's missing fourth argument so authentication and multipart errors reach the intended JSON handler.
- **Additional confirmed exposure:** S3 initialization printed both AWS credential environment variables. Removed the logging. Whether those values reached retained production logs remains unknown.

## Dependencies and audit scope

The root pnpm lockfile covers tooling, not the separately installed application packages. Always audit `server/package-lock.json` and `client/package-lock.json`; `npm run audit:dependencies` runs both full audits. The server uses Express in production, so Express was moved from development dependencies into runtime dependencies. Removed unused native `bcrypt`; actual password code uses `bcryptjs`.

Fresh full audits before changes reported 57 server advisories (3 critical, 7 high, 43 moderate, 4 low) and 31 client advisories (2 critical, 17 high, 9 moderate, 3 low). These are dependency graph counts, not exploit counts. Counts differ from the original review's production-only scans. Final full audits report zero advisories for both server and client; see `dependency-audit-summary-2026-09-30.json`. This is a point-in-time registry result, not a guarantee of no vulnerabilities.

Compatible updates covered Mongoose, AWS SDK, Jimp, Express, Axios and transitive packages. Required version changes include Multer 2.3, ALTCHA 2, MapLibre 6, react-map-gl 8, React Router 7, Vite 7 and its React plugin 5. ALTCHA retains the challenge URL/statechange integration; obfuscation mode is not used. MapLibre renders third-party map attribution, so its sanitizer advisory warranted an upgrade. The map type import uses the MapLibre entry point after the wrapper upgrade. Node 24 remains the repository runtime requirement.

Maintainer advisories:
- https://github.com/expressjs/multer/security/advisories/GHSA-535w-7cp7-47q4
- https://github.com/maplibre/maplibre-gl-js/security/advisories/GHSA-jrc7-96c5-q579

## Validation

Completed: full server and client npm audits (zero advisories), Biome checks for changed TypeScript/JSON, `git diff --check`, and Node syntax validation of the regression test file.

Completed after host pressure cleared, holding the shared atomic heavy-check lock:

- Server TypeScript build: passed.
- Security regression suite: 9/9 passed, including real multipart parsing and a successful image upload with stubbed storage.
- Client `tsc --noEmit`: passed.
- Client production build: passed; Vite reports its non-blocking large-chunk warning (about 1.83 MB minified JS).
- Server build/tests and client build also passed on the project's Node 24.14.1 runtime. Initial checks used the shell's Node 26.

Validation caught and corrected the MapLibre namespace import and optional popup type changes, plus the populated Mongoose request-list type. No browser, live MongoDB, production storage, or real-account smoke test was performed. Regression tests use two synthetic Mongoose documents, a real Express router/JWT/multipart stack, mocked database queries, and stubbed S3 writes. They do not connect to MongoDB or AWS. This validates HTTP disclosure/authorization boundaries and upload parsing, but does not simulate database concurrency or prove production configuration.

## Separate rollout and incident review

These steps require an authorized production operator; they are not completed by this local change.

1. Identify whether and when the vulnerable commit was deployed, including all origins and old replicas. If deployed, restrict the search route until the patched release is validated. Preserve relevant access/application logs with limited access before retention expiry.
2. Review search-route access over that deployment window: authenticated caller, timestamp, target username and request volume where already recorded. Do not export private location payloads for testing or add new sensitive response logging. A request log establishes access to a route; it does not prove which data was retained or misused. Missing logs do not rule out exposure.
3. Determine potentially exposed accounts and data classes. Assess password-hash exposure, account-recovery needs, location sensitivity, and notification obligations through the incident owner. Decide whether password resets and session invalidation are required; do not treat changing the DTO as revoking old sessions or remediating already disclosed data.
4. Review historical process logs and log sinks for the removed AWS credential logging without copying credential values into tickets. Establish credential scope/access history and obtain authorization for rotation or revocation. Removing log calls does not invalidate credentials or delete existing logs.
5. Build from the committed lockfiles using Node 24. Install each nested package with `npm ci`, run server build/tests and client typecheck/build, and audit both nested locks. Deploy only with direct authorization; ensure old application processes and static assets are replaced.
6. Smoke-test with two controlled test accounts: search/profile DTO; none/country/city/exact sharing; requests and defaults; login and password change; CAPTCHA signup; map rendering/attribution/navigation; valid JPEG/PNG upload and invalid/oversized upload. Confirm storage credentials are absent from startup logs. Use synthetic locations, never another user's real location data.
7. Verify reverse-proxy upload body limits and request timeouts, monitor upload error/resource rates, and confirm rollback does not re-enable the vulnerable search response. Back up needed state; do not restore a vulnerable release merely to undo a cosmetic client regression.
