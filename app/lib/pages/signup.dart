import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:wamf/services/authservice.dart';
import 'dart:convert';
import 'package:wamf/widgets/altcha.dart';
import 'package:wamf/widgets/navbar.dart';
import 'dart:typed_data';
import 'package:wamf/providers/userprovider.dart';
import 'package:provider/provider.dart';

String encodeAltchaPayload(String payload) {
  // Convert payload string to Uint8List
  Uint8List payloadBytes = utf8.encode(payload);

  // Encode to Base64
  String base64String = base64.encode(payloadBytes);

  return base64String;
}

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  _SignupPageState createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _isPasswordVisible = false;
  String _errorMessage = '';
  bool _isPasswordValid = false;
  String? _challengeResolved;

  Future<void> _handleSignup() async {
    if (_challengeResolved == null) {
      setState(() {
        _errorMessage = 'Please complete the verification challenge.';
      });
      return;
    }

    final email = _emailController.text;
    final username = _usernameController.text;
    final password = _passwordController.text;

    if (email.isEmpty || password.isEmpty || username.isEmpty) {
      setState(() {
        _errorMessage = 'Please provide email, username and password.';
      });
      return;
    }

    if (!_validatePassword(password)) {
      setState(() {
        _errorMessage =
            'Password must be at least 12 characters long and contain uppercase, lowercase, a number, and a special character.';
      });
      return;
    }

    final url = Uri.parse('https://wherearemyfriends.info/auth/signup');
    try {
      print(_challengeResolved);

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          'username': username,
          'password': password,
          'altchaPayload': _challengeResolved,
        }),
      );

      print('Response $response');
      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = json.decode(response.body);
        final authToken = responseData['authToken'];

        await authService.setAuthToken(authToken);
        await context.read<UserProvider>().loadUser();

        Navigator.pushNamed(context, '/location');
      } else {
        print("Error: ${response.statusCode}");
        setState(() {
          _errorMessage = 'Invalid credentials. Please try again.';
        });
      }
    } catch (error) {
      setState(() {
        _errorMessage = 'An error occurred. Please try again later.';
      });
    }
  }

  bool _validatePassword(String password) {
    final uppercase = RegExp(r'[A-Z]');
    final lowercase = RegExp(r'[a-z]');
    final number = RegExp(r'[0-9]');
    final specialChar = RegExp(r'[!@#\$&*~]');
    return password.length >= 12 &&
        uppercase.hasMatch(password) &&
        lowercase.hasMatch(password) &&
        number.hasMatch(password) &&
        specialChar.hasMatch(password);
  }

  void _updatePasswordValidation(String password) {
    setState(() {
      _isPasswordValid = _validatePassword(password);
    });
  }

  void _handleChallengeSolved(String resolvedValue) {
    setState(() {
      _challengeResolved = resolvedValue;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Signup Page')),
      drawer: const CustomNavbar(),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (_errorMessage.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(bottom: 16.0),
                  child: Text(
                    _errorMessage,
                    style: const TextStyle(color: Colors.red),
                  ),
                ),
              TextField(
                controller: _usernameController,
                decoration: const InputDecoration(
                  labelText: 'Username',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _passwordController,
                obscureText: !_isPasswordVisible,
                onChanged: (value) => _updatePasswordValidation(value),
                decoration: InputDecoration(
                  labelText: 'Password',
                  border: const OutlineInputBorder(),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _isPasswordVisible
                          ? Icons.visibility
                          : Icons.visibility_off,
                    ),
                    onPressed: () {
                      setState(() {
                        _isPasswordVisible = !_isPasswordVisible;
                      });
                    },
                  ),
                ),
              ),
              const SizedBox(height: 8),
              _buildPasswordStrengthMeter(),
              const SizedBox(height: 8),
              _buildPasswordCriteria(),
              const SizedBox(height: 24),
              AltchaWidget(
                verificationUrl:
                    'https://wherearemyfriends.info/auth/altcha-challenge',
                onChallengeSolved: _handleChallengeSolved,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isPasswordValid && _challengeResolved != null
                    ? _handleSignup
                    : null,
                child: const Text('Sign Up'),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/login');
                },
                child: const Text("Already have an account? Login"),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPasswordCriteria() {
    final password = _passwordController.text;
    final atLeastOneUppercase = RegExp(r'[A-Z]').hasMatch(password);
    final atLeastOneLowercase = RegExp(r'[a-z]').hasMatch(password);
    final atLeastOneNumber = RegExp(r'[0-9]').hasMatch(password);
    final atLeastOneSpecialChar = RegExp(r'[!@#\$&*~]').hasMatch(password);
    final atLeastTwelveCharacters = password.length >= 12;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildCriteriaRow('At least 12 characters', atLeastTwelveCharacters),
        _buildCriteriaRow('At least one uppercase letter', atLeastOneUppercase),
        _buildCriteriaRow('At least one lowercase letter', atLeastOneLowercase),
        _buildCriteriaRow('At least one number', atLeastOneNumber),
        _buildCriteriaRow(
            'At least one special character', atLeastOneSpecialChar),
      ],
    );
  }

  Widget _buildCriteriaRow(String text, bool isMet) {
    return Row(
      children: [
        Icon(
          isMet ? Icons.check_circle : Icons.cancel,
          color: isMet ? Colors.green : Colors.red,
        ),
        const SizedBox(width: 8),
        Text(text),
      ],
    );
  }

  Widget _buildPasswordStrengthMeter() {
    final password = _passwordController.text;
    final strength = _calculatePasswordStrength(password);
    final strengthColors = [
      Colors.grey[300],
      Colors.red,
      Colors.orange,
      Colors.yellow,
      Colors.lightGreen,
      Colors.green
    ];

    final strengthColor = strengthColors[strength];
    final strengthWidth = MediaQuery.of(context).size.width * (strength / 5);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Password Strength:'),
        const SizedBox(height: 4),
        Container(
          width: double.infinity,
          height: 10,
          decoration: BoxDecoration(
            color: Colors.grey[300],
            borderRadius: BorderRadius.circular(5),
          ),
          child: Align(
            alignment: Alignment.centerLeft,
            child: Container(
              width: strengthWidth,
              height: 10,
              decoration: BoxDecoration(
                color: strengthColor,
                borderRadius: BorderRadius.circular(5),
              ),
            ),
          ),
        ),
      ],
    );
  }

  int _calculatePasswordStrength(String password) {
    int strength = 0;
    if (RegExp(r'[A-Z]').hasMatch(password)) strength++;
    if (RegExp(r'[a-z]').hasMatch(password)) strength++;
    if (RegExp(r'[0-9]').hasMatch(password)) strength++;
    if (RegExp(r'[!@#\$&*~]').hasMatch(password)) strength++;
    if (password.length >= 12) strength++;

    return strength;
  }
}
