import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'package:wamf/providers/user_provider.dart';
import 'package:wamf/services/auth_service.dart';
import 'package:wamf/widgets/altcha.dart';
import 'package:wamf/widgets/password_field.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  SignupPageState createState() => SignupPageState();
}

class SignupPageState extends State<SignupPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  String _errorMessage = '';
  bool _isPasswordValid = false;
  String? _challengeResolved;

  void _onPasswordValidChanged(bool isValid) {
    setState(() {
      _isPasswordValid = isValid;
    });
  }

  void _handleChallengeSolved(String resolvedValue) {
    setState(() {
      _challengeResolved = resolvedValue;
    });
  }

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
        _errorMessage = 'Please provide email, username, and password.';
      });
      return;
    }

    final url = Uri.parse('https://wherearemyfriends.info/auth/signup');
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'username': username,
          'password': password,
          'altchaPayload': _challengeResolved,
        }),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        final authToken = responseData['authToken'];

        await authService.setAuthToken(authToken);

        if (mounted) {
          await context.read<AuthState>().loadUser();
        }

        if (mounted) {
          Navigator.pushNamed(context, '/location');
        }
      } else {
        final responseData = json.decode(response.body);
        setState(() {
          _errorMessage = responseData['message'] ?? 'Something went wrong.';
        });
      }
    } catch (error) {
      setState(() {
        _errorMessage = 'An error occurred. Please try again later.';
      });
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Signup Page')),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
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
              PasswordFieldWidget(
                passwordController: _passwordController,
                label: 'Password',
                onPasswordValid: _onPasswordValidChanged,
              ),
              const SizedBox(height: 24),
              AltchaWidget(
                verificationUrl: '$backendBaseUrl/auth/altcha-challenge',
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
}
