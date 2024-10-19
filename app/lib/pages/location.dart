import 'package:flutter/material.dart';
import 'package:wamf/widgets/navbar.dart';

class MyLocationPage extends StatelessWidget {
  const MyLocationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Location Page')),
      drawer: const CustomNavbar(),
      body: const Center(
        child: Text('This is My Location Page', style: TextStyle(fontSize: 24)),
      ),
    );
  }
}
