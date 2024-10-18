import 'package:flutter/material.dart';

class PagesSetup extends StatelessWidget {
  const PagesSetup({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Navigation Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: '/',
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/':
            return MaterialPageRoute(builder: (context) => const HomePage());
          case '/location':
            return MaterialPageRoute(
                builder: (context) => const MyLocationPage());
          case '/signup':
            return MaterialPageRoute(builder: (context) => const SignupPage());
          case '/login':
            return MaterialPageRoute(builder: (context) => const LoginPage());
          case '/friends':
            return MaterialPageRoute(builder: (context) => const FriendsPage());
          case '/settings':
            return MaterialPageRoute(
                builder: (context) => const SettingsPage());
          case '/profiles/:username':
            return MaterialPageRoute(
                builder: (context) => const OtherUserProfile());
          default:
            return MaterialPageRoute(builder: (context) => const HomePage());
        }
      },
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home Page')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Welcome to the Home Page!',
              style: TextStyle(fontSize: 24),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/location'),
              child: const Text('Go to My Location'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/signup'),
              child: const Text('Sign Up'),
            ),
          ],
        ),
      ),
    );
  }
}

class MyLocationPage extends StatelessWidget {
  const MyLocationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Location Page')),
      body: const Center(
        child: Text('This is My Location Page', style: TextStyle(fontSize: 24)),
      ),
    );
  }
}

// Similarly define the other pages.
class SignupPage extends StatelessWidget {
  const SignupPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Signup Page')),
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
      body: const Center(
        child: Text('This is Login Page', style: TextStyle(fontSize: 24)),
      ),
    );
  }
}

class FriendsPage extends StatelessWidget {
  const FriendsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Friends Page')),
      body: const Center(
        child: Text('This is Friends Page', style: TextStyle(fontSize: 24)),
      ),
    );
  }
}

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings Page')),
      body: const Center(
        child: Text('This is Settings Page', style: TextStyle(fontSize: 24)),
      ),
    );
  }
}

class OtherUserProfile extends StatelessWidget {
  const OtherUserProfile({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('User Profile Page')),
      body: const Center(
        child: Text('This is Other User Profile Page',
            style: TextStyle(fontSize: 24)),
      ),
    );
  }
}
