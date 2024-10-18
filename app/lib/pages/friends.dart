import 'package:flutter/material.dart';
import 'package:my_map/widgets/navbar.dart';

class FriendsPage extends StatelessWidget {
  const FriendsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Friends Page')),
      drawer: const CustomNavbar(),
      body: const Center(
        child: Text('This is Friends Page', style: TextStyle(fontSize: 24)),
      ),
    );
  }
}
