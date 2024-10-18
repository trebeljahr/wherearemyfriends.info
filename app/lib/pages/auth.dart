import 'package:flutter/material.dart';
import 'package:my_map/widgets/navbar.dart';

class SignupPage extends StatelessWidget {
  const SignupPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Signup Page')),
      drawer: const CustomNavbar(),
      body: const Center(
        child: Text('This is Signup Page', style: TextStyle(fontSize: 24)),
      ),
    );
  }
}

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login Page')),
      drawer: const CustomNavbar(),
      body: const Center(
        child: Text('This is Login Page', style: TextStyle(fontSize: 24)),
      ),
    );
  }
}
