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

        print('resolvedValue $resolvedValue');

        if (resolvedValue != null) {
          final payload = {
            "algorithm": algorithm,
            "challenge": challenge,
            "number": resolvedValue['number'],
            "salt": salt,
            "signature": responseData['signature'],
            "took": resolvedValue['took'],
          };

          print('payload $payload');

          final encodedPayload =
              base64.encode(utf8.encode(json.encode(payload)));

          print('encodedPayload $encodedPayload');

          widget.onChallengeSolved(encodedPayload);
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
    return Column(
      children: [
        if (_errorMessage.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Text(
              _errorMessage,
              style: const TextStyle(color: Colors.red),
            ),
          ),
        if (_isLoading)
          const CircularProgressIndicator()
        else
          ElevatedButton(
            onPressed: _fetchChallenge,
            child: const Text('Verify with Altcha'),
          ),
      ],
    );
  }
}
