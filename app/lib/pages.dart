import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:my_map/pages/auth.dart';
import 'package:my_map/pages/friends.dart';
import 'package:my_map/pages/home.dart';
import 'package:my_map/pages/location.dart';
import 'package:my_map/pages/profiles.dart';
import 'package:my_map/pages/settings.dart';

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
