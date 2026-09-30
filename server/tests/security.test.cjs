const assert = require("node:assert/strict");
const { test, before, after } = require("node:test");
Object.assign(process.env, {
  TOKEN_SECRET: "fixture-only-secret-at-least-32-characters",
  CLOUDFRONT_URL: "https://images.invalid",
  PORT: "59999",
  MONGODB_URI: "mongodb://127.0.0.1:1/unused",
  ALTCHA_HMAC_KEY: "fixture-only",
  S3_BUCKET_NAME: "fixture-only",
  AWS_ACCESS_KEY_ID: "fixture",
  AWS_SECRET_ACCESS_KEY: "fixture",
  AWS_REGION: "us-east-1",
});
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User").default;
const userRoutes = require("../routes/user.routes").default;
const authRoutes = require("../routes/auth.routes").default;
const errors = require("../error-handling").default;
const aliceId = "000000000000000000000001";
const bobId = "000000000000000000000002";
let alice, bob, queries, server, base;
function reset() {
  alice = new User({
    _id: aliceId,
    username: "alice",
    email: "alice@example.invalid",
    password: "alice-secret",
  });
  bob = new User({
    _id: bobId,
    username: "bob",
    email: "bob@example.invalid",
    password: "bob-secret",
    location: {
      lastUpdated: new Date(),
      exact: { name: "private home", latitude: 12.345678, longitude: 98.765432 },
      city: { name: "City", latitude: 12, longitude: 98 },
      country: { name: "Country", latitude: 10, longitude: 90 },
    },
    defaultPrivacy: "none",
  });
  for (const user of [alice, bob]) user.save = async () => user;
  queries = [];
}
function query(value, projection) {
  return {
    select() {
      return this;
    },
    populate() {
      return this;
    },
    lean() {
      if (value === alice && alice.friends.length)
        return Promise.resolve({ ...alice.toObject(), friends: [bob.toObject()] });
      return Promise.resolve(value?.toObject());
    },
    then(resolve, reject) {
      return Promise.resolve(value).then(resolve, reject);
    },
  };
}
const originalFindOne = User.findOne;
const originalFindById = User.findById;
before(async () => {
  User.findOne = (filter, projection) => {
    queries.push({ filter, projection });
    return query(bob, projection);
  };
  User.findById = (id) => {
    queries.push({ id });
    return query(id === aliceId ? alice : id === bobId ? bob : null);
  };
  const app = express();
  app.use(express.json());
  app.use("/api", userRoutes);
  app.use("/auth", authRoutes);
  errors(app);
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  User.findOne = originalFindOne;
  User.findById = originalFindById;
  await new Promise((resolve) => server.close(resolve));
});
async function request(
  path,
  { method = "GET", body, authenticated = true, tokenId = aliceId } = {},
) {
  const headers = {};
  if (authenticated)
    headers.authorization = `Bearer ${jwt.sign({ _id: tokenId }, process.env.TOKEN_SECRET)}`;
  if (body && !(body instanceof FormData)) {
    headers["content-type"] = "application/json";
    body = JSON.stringify(body);
  }
  const response = await fetch(base + path, { method, headers, body });
  return { status: response.status, body: await response.json() };
}
test("two unrelated users: search and profile disclose only public DTO, even if query returns private fields", async () => {
  reset();
  for (const path of ["/api/users/search?username=bob", "/api/profiles/bob"]) {
    const response = await request(path);
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      _id: bobId,
      username: "bob",
      profilePicture: "https://images.invalid/no-user.webp",
      defaultPrivacy: "none",
    });
    for (const secret of [
      "bob-secret",
      "bob@example.invalid",
      "12.345678",
      "98.765432",
      "private home",
    ])
      assert.ok(!JSON.stringify(response.body).includes(secret));
  }
  assert.equal(
    queries[0].projection,
    "username profilePicture defaultPrivacy friends receivedFriendRequests",
  );
  assert.equal(User.schema.path("password").options.select, false);
  assert.equal(bob.toJSON().password, undefined);
});
test("structured username and IDs are rejected before Mongo queries", async () => {
  reset();
  for (const path of [
    "/api/users/search?username[$ne]=x",
    "/api/USERS/search/?username[$ne]=x",
    "/api/users/search?username=a&username=b",
    "/api/users/search",
  ])
    assert.equal((await request(path)).status, 400);
  for (const [path, body] of [
    ["/api/friends/requests", { friendId: { $ne: null } }],
    ["/api/friends/requests/accept", { requesterId: { $ne: null } }],
  ])
    assert.equal((await request(path, { method: "POST", body })).status, 400);
  assert.equal(
    (
      await request("/auth/login", {
        method: "POST",
        body: { emailOrUsername: { $ne: null }, password: "x" },
      })
    ).status,
    400,
  );
  assert.equal(queries.length, 0);
});
test("friend location respects every visibility and fails closed when absent", async () => {
  for (const visibility of ["none", "city", "country", "exact", undefined]) {
    reset();
    alice.friends.push(bobId);
    bob.friends.push(aliceId);
    if (visibility) bob.privacySettings.push({ friendId: aliceId, visibility });
    const response = await request("/api/friends");
    assert.equal(response.status, 200);
    assert.equal(response.body[0].sharingState, visibility || "none");
    assert.equal(
      response.body[0].location?.name,
      visibility === "exact"
        ? "private home"
        : visibility === "city"
          ? "City"
          : visibility === "country"
            ? "Country"
            : undefined,
    );
    assert.equal(response.body[0].email, undefined);
    assert.equal(response.body[0].password, undefined);
  }
});
test("cannot accept unrequested friendship or change stranger privacy; accepted requests honor defaults", async () => {
  reset();
  assert.equal(
    (
      await request("/api/friends/requests/accept", {
        method: "POST",
        body: { requesterId: bobId },
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await request("/api/friends/privacy", {
        method: "PUT",
        body: { friendId: bobId, newVisibility: "exact" },
      })
    ).status,
    404,
  );
  assert.equal(alice.friends.length, 0);
  assert.equal(bob.privacySettings.length, 0);
  alice.receivedFriendRequests.push(bobId);
  bob.sentFriendRequests.push(aliceId);
  assert.equal(
    (
      await request("/api/friends/requests/accept", {
        method: "POST",
        body: { requesterId: bobId },
      })
    ).status,
    200,
  );
  assert.equal(bob.privacySettings[0].visibility, "none");
  assert.equal(alice.privacySettings[0].visibility, "city");
});
test("duplicate requests and invalid privacy are rejected", async () => {
  reset();
  alice.sentFriendRequests.push(bobId);
  assert.equal(
    (await request("/api/friends/requests", { method: "POST", body: { friendId: bobId } })).status,
    400,
  );
  assert.equal(bob.receivedFriendRequests.length, 0);
  assert.equal(
    (
      await request("/api/users/default-privacy", {
        method: "PUT",
        body: { defaultPrivacy: { $ne: null } },
      })
    ).status,
    400,
  );
});
test("uploads authenticate before parsing and reject fields, extra files and oversized files", async () => {
  reset();
  const field = new FormData();
  field.append("unexpected", "value");
  assert.equal(
    (
      await request("/api/users/profile-picture", {
        method: "POST",
        body: field,
        authenticated: false,
      })
    ).status,
    401,
  );
  assert.equal(
    (await request("/api/users/profile-picture", { method: "POST", body: field, tokenId: "bad" }))
      .status,
    401,
  );
  assert.equal(queries.length, 0);
  assert.equal(
    (await request("/api/users/profile-picture", { method: "POST", body: field })).status,
    400,
  );
  const files = new FormData();
  for (let i = 0; i < 2; i++)
    files.append("profilePicture", new Blob(["fixture"], { type: "image/png" }), `${i}.png`);
  assert.equal(
    (await request("/api/users/profile-picture", { method: "POST", body: files })).status,
    400,
  );
  const large = new FormData();
  large.append(
    "profilePicture",
    new Blob([Buffer.alloc(5 * 1024 * 1024 + 1)], { type: "image/png" }),
    "large.png",
  );
  assert.equal(
    (await request("/api/users/profile-picture", { method: "POST", body: large })).status,
    400,
  );
  assert.equal(queries.length, 0);
});

test("normal single image upload still succeeds with storage stubbed", async () => {
  reset();
  const { Jimp } = require("jimp");
  const { s3Client } = require("../config/s3Client");
  const send = s3Client.send;
  const uploaded = [];
  s3Client.send = async (command) => {
    uploaded.push(command.input);
    return {};
  };
  try {
    const image = new Jimp({ width: 2, height: 2, color: 0xff0000ff });
    const png = await image.getBuffer("image/png");
    const form = new FormData();
    form.append("profilePicture", new Blob([png], { type: "image/png" }), "avatar.png");
    const response = await request("/api/users/profile-picture", { method: "POST", body: form });
    assert.equal(response.status, 200);
    assert.match(response.body.profilePicture, /^https:\/\/images\.invalid\/.+\.jpeg$/);
    assert.equal(uploaded.length, 1);
    assert.equal(uploaded[0].ContentType, "image/jpeg");
    assert.equal(uploaded[0].Body[0], 0xff);
  } finally {
    s3Client.send = send;
  }
});

test("one-sided friendship does not authorize location access", async () => {
  reset();
  alice.friends.push(bobId);
  bob.privacySettings.push({ friendId: aliceId, visibility: "exact" });
  const response = await request("/api/friends");
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, []);
});
test("password selection preserves login and password changes without serializing hashes", async () => {
  reset();
  const bcrypt = require("bcryptjs");
  bob.password = bcrypt.hashSync("FixturePassword!123", 4);
  const response = await request("/auth/login", {
    method: "POST",
    body: { emailOrUsername: "bob", password: "FixturePassword!123" },
  });
  assert.equal(response.status, 200);
  assert.ok(response.body.authToken);
  alice.password = bcrypt.hashSync("FixturePassword!123", 4);
  const changed = await request("/auth/change-password", {
    method: "POST",
    body: { oldPassword: "FixturePassword!123", newPassword: "NewFixturePassword!456" },
  });
  assert.equal(changed.status, 200);
  assert.ok(bcrypt.compareSync("NewFixturePassword!456", alice.password));
  assert.equal(alice.toJSON().password, undefined);
});
