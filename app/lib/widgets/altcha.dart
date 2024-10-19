import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

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

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        final challenge = responseData['challenge'];
        final resolvedValue = _decodeChallenge(challenge);
        widget.onChallengeSolved(resolvedValue);
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

  String _decodeChallenge(String challenge) {
    // Placeholder decoding logic - replace with actual decoding logic.
    return String.fromCharCodes(base64.decode(challenge));
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
