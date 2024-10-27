import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:wamf/pages/friends.dart';
import 'package:wamf/pages/home.dart';
import 'package:wamf/pages/location.dart';
import 'package:wamf/pages/login.dart';
import 'package:wamf/pages/profiles.dart';
import 'package:wamf/pages/settings.dart';
import 'package:wamf/pages/signup.dart';
import 'package:wamf/providers/user_provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => AuthState()),
        // other providers
      ],
      builder: (context, child) => MaterialApp(
        title: 'Where Are My Friends',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
              seedColor: const Color.fromARGB(255, 0, 46, 125)),
          useMaterial3: true,
        ),
        routes: {
          '/location': (context) => const MyLocationPage(),
          '/signup': (context) => const SignupPage(),
          '/login': (context) => const LoginPage(),
          '/friends': (context) => const FriendsPage(),
          '/settings': (context) => const SettingsPage(),
          '/profiles': (context) => OtherUserProfile(
              username: ModalRoute.of(context)!.settings.arguments as String),
        },
        home: Consumer<AuthState>(builder: (context, authState, _) {
          return authState.isAuthorized
              ? const MyLocationPage()
              : const LoginPage();
        }),
      ),
    );
  }
}
