import 'package:flutter/material.dart';
import 'package:wamf/widgets/navbar.dart';

class OtherUserProfile extends StatelessWidget {
  const OtherUserProfile({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('User Profile Page')),
      drawer: const CustomNavbar(),
      body: const Center(
        child: Text('This is Other User Profile Page',
            style: TextStyle(fontSize: 24)),
      ),
    );
  }
}
