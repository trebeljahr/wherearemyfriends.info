import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:typed_data';
import 'package:crypto/crypto.dart';

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
          color: _isSolved ? Colors.green : Colors.grey,
          width: 1.0,
        ),
        borderRadius: BorderRadius.circular(3.0),
        color: Colors.white,
      ),
      padding: const EdgeInsets.all(8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              if (_isLoading)
                const SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(strokeWidth: 2.0),
                )
              else if (_isSolved)
                Row(
                  children: [
                    Icon(
                      Icons.check_circle,
                      color: Colors.green,
                      size: 24,
                    ),
                    const SizedBox(width: 8.0),
                    const Text(
                      "Verified",
                      style: TextStyle(fontSize: 16.0),
                    ),
                  ],
                )
              else
                Row(
                  children: [
                    Checkbox(
                      value: _isSolved,
                      onChanged: (value) => _fetchChallenge(),
                    ),
                    const SizedBox(width: 8.0),
                    const Text(
                      "I'm not a robot",
                      style: TextStyle(fontSize: 16.0),
                    ),
                  ],
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
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: _fetchChallenge,
              child: const Text('Verify with Altcha'),
            ),
          ),
        ],
      ),
    );
  }
}
