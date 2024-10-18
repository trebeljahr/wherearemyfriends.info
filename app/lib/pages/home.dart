import 'package:flutter/material.dart';
import 'package:my_map/widgets/navbar.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home Page')),
      drawer: const CustomNavbar(),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Welcome to the Home Page!',
              style: TextStyle(fontSize: 24),
            )
          ],
        ),
      ),
    );
  }
}
