import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:flutter_svg/flutter_svg.dart';

class AltchaWidget extends StatefulWidget {
  final String verificationUrl;
  final ValueChanged<String> onChallengeSolved;

  const AltchaWidget({
    Key? key,
    required this.verificationUrl,
    required this.onChallengeSolved,
  }) : super(key: key);

  @override
  _AltchaWidgetState createState() => _AltchaWidgetState();
}

class _AltchaWidgetState extends State<AltchaWidget> {
  bool _isLoading = false;
  String _errorMessage = '';
  bool _isSolved = false;

  Future<void> _fetchChallenge() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final response = await http.get(Uri.parse(widget.verificationUrl));

      print('altcha challenge ${response.body}');

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        final String challenge = responseData['challenge'];
        final String salt = responseData['salt'];
        final String algorithm = responseData['algorithm'];
        final int maxNumber = responseData['maxnumber'];

        final resolvedValue =
            await _solveChallenge(challenge, salt, algorithm, maxNumber);
        if (resolvedValue != null) {
          final payload = {
            "algorithm": algorithm,
            "challenge": challenge,
            "number": resolvedValue['number'],
            "salt": salt,
            "signature": responseData['signature'],
            "took": resolvedValue['took'],
          };
          final encodedPayload =
              base64.encode(utf8.encode(json.encode(payload)));
          widget.onChallengeSolved(encodedPayload);
          setState(() {
            _isSolved = true;
          });
        } else {
          setState(() {
            _errorMessage = 'Failed to solve the challenge. Please try again.';
          });
        }
      } else {
        setState(() {
          _errorMessage = 'Failed to fetch the challenge. Please try again.';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'An error occurred: \$e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<Map<String, dynamic>?> _solveChallenge(
      String challenge, String salt, String algorithm, int max) async {
    final Stopwatch stopwatch = Stopwatch()..start();
    for (int n = 0; n <= max; n++) {
      final String hashedValue = await _hashChallenge(salt, n, algorithm);
      if (hashedValue == challenge) {
        stopwatch.stop();
        return {
          'number': n,
          'took': stopwatch.elapsedMilliseconds,
        };
      }
    }
    return null;
  }

  Future<String> _hashChallenge(String salt, int num, String algorithm) async {
    final bytes = utf8.encode(salt + num.toString());
    Digest digest;
    switch (algorithm.toUpperCase()) {
      case 'SHA-256':
        digest = sha256.convert(bytes);
        break;
      case 'SHA-384':
        digest = sha384.convert(bytes);
        break;
      case 'SHA-512':
        digest = sha512.convert(bytes);
        break;
      default:
        throw UnsupportedError('Unsupported hashing algorithm: \$algorithm');
    }
    return digest.toString();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(
          color: Colors.grey,
          width: 1.0,
        ),
        borderRadius: BorderRadius.circular(3.0),
        color: Colors.white,
      ),
      padding: const EdgeInsets.fromLTRB(12.0, 20.0, 12.0, 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              if (_isLoading)
                const Row(
                  children: [
                    SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(strokeWidth: 2.0),
                    ),
                    SizedBox(width: 8.0),
                    Text(
                      "Verifying...",
                      style: TextStyle(fontSize: 16.0),
                    ),
                  ],
                )
              else if (_isSolved)
                const Row(
                  children: [
                    SizedBox(
                      width: 24,
                      height: 24,
                      child: Icon(
                        Icons.check_circle,
                        color: Colors.blue,
                        size: 24,
                      ),
                    ),
                    SizedBox(width: 8.0),
                    Text(
                      "Verified",
                      style: TextStyle(fontSize: 16.0),
                    ),
                  ],
                )
              else
                Row(
                  children: [
                    SizedBox(
                      width: 24,
                      height: 24,
                      child: Checkbox(
                        value: _isSolved,
                        onChanged: (value) => _fetchChallenge(),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(4.0),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8.0),
                    const Text(
                      "I'm not a robot",
                      style: TextStyle(fontSize: 16.0),
                    ),
                  ],
                ),
              const Spacer(),
              SvgPicture.string(
                altchaLogoSvg,
                width: 24,
                height: 24,
                colorFilter:
                    const ColorFilter.mode(Colors.grey, BlendMode.srcIn),
              ),
            ],
          ),
          if (_errorMessage.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: Text(
                _errorMessage,
                style: const TextStyle(color: Colors.red),
              ),
            ),
          const Align(
            alignment: Alignment.centerRight,
            child: Text(
              'Protected by Altcha',
              style: TextStyle(color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }
}

const String altchaLogoSvg = '''
<svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2.33955 16.4279C5.88954 20.6586 12.1971 21.2105 16.4279 17.6604C18.4699 15.947 19.6548 13.5911 19.9352 11.1365L17.9886 10.4279C17.8738 12.5624 16.909 14.6459 15.1423 16.1284C11.7577 18.9684 6.71167 18.5269 3.87164 15.1423C1.03163 11.7577 1.4731 6.71166 4.8577 3.87164C8.24231 1.03162 13.2883 1.4731 16.1284 4.8577C16.9767 5.86872 17.5322 7.02798 17.804 8.2324L19.9522 9.01429C19.7622 7.07737 19.0059 5.17558 17.6604 3.57212C14.1104 -0.658624 7.80283 -1.21043 3.57212 2.33956C-0.658625 5.88958 -1.21046 12.1971 2.33955 16.4279Z" fill="currentColor"/>
  <path d="M3.57212 2.33956C1.65755 3.94607 0.496389 6.11731 0.12782 8.40523L2.04639 9.13961C2.26047 7.15832 3.21057 5.25375 4.8577 3.87164C8.24231 1.03162 13.2883 1.4731 16.1284 4.8577L13.8302 6.78606L19.9633 9.13364C19.7929 7.15555 19.0335 5.20847 17.6604 3.57212C14.1104 -0.658624 7.80283 -1.21043 3.57212 2.33956Z" fill="currentColor"/>
  <path d="M7 10H5C5 12.7614 7.23858 15 10 15C12.7614 15 15 12.7614 15 10H13C13 11.6569 11.6569 13 10 13C8.3431 13 7 11.6569 7 10Z" fill="currentColor"/>
</svg>
''';
