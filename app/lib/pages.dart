import 'package:flutter/material.dart';
import 'package:wamf/pages/signup.dart';
import 'package:wamf/pages/friends.dart';
import 'package:wamf/pages/home.dart';
import 'package:wamf/pages/location.dart';
import 'package:wamf/pages/profiles.dart';
import 'package:wamf/pages/settings.dart';
import 'package:wamf/pages/login.dart';

class RoutesSetup extends StatelessWidget {
  const RoutesSetup({super.key});

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
