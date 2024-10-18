import 'package:flutter/material.dart';
import 'package:my_map/widgets/navbar.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings Page')),
      drawer: const CustomNavbar(),
      body: const Center(
        child: Text('This is Settings Page', style: TextStyle(fontSize: 24)),
      ),
    );
  }
}
