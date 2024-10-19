import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:my_map/widgets/navbar.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _emailOrUsernameController =
      TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isPasswordVisible = false;
  String _errorMessage = '';

  Future<void> _handleLogin() async {
    final emailOrUsername = _emailOrUsernameController.text;
    final password = _passwordController.text;

    if (emailOrUsername.isEmpty || password.isEmpty) {
      setState(() {
        _errorMessage = 'Please provide both email/username and password.';
      });
      return;
    }

    final url = Uri.parse('https://wherearemyfriends.info/auth/login');
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: json
            .encode({'emailOrUsername': emailOrUsername, 'password': password}),
      );

      // Log the response for debugging purposes
      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        final authToken = responseData['authToken'];
        // Store the token (in Flutter, you might use SharedPreferences or another secure storage method)
        // Navigate to the next page
        Navigator.pushNamed(context, '/location');
      } else {
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login Page')),
      drawer: const CustomNavbar(),
      body: Padding(
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
              controller: _emailOrUsernameController,
              decoration: const InputDecoration(
                labelText: 'Email or Username',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              obscureText: !_isPasswordVisible,
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
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _handleLogin,
              child: const Text('Login'),
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () {
                Navigator.pushNamed(context, '/signup');
              },
              child: const Text("Don't have an account? Sign Up"),
            ),
          ],
        ),
      ),
    );
  }
}
