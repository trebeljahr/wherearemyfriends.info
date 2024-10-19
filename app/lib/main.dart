import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:wamf/pages/friends.dart';
import 'package:wamf/pages/home.dart';
import 'package:wamf/pages/location.dart';
import 'package:wamf/pages/login.dart';
import 'package:wamf/pages/profiles.dart';
import 'package:wamf/pages/settings.dart';
import 'package:wamf/pages/signup.dart';
import 'package:wamf/providers/userprovider.dart';
import 'package:wamf/widgets/splashscreen.dart';

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
        initialRoute: '/location',
        onGenerateRoute: (settings) {
          switch (settings.name) {
            case '/':
              return MaterialPageRoute(builder: (context) => const HomePage());
            case '/location':
              return MaterialPageRoute(
                  builder: (context) => const MyLocationPage());
            case '/signup':
              return MaterialPageRoute(
                  builder: (context) => const SignupPage());
            case '/login':
              return MaterialPageRoute(builder: (context) => const LoginPage());
            case '/friends':
              return MaterialPageRoute(
                  builder: (context) => const FriendsPage());
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
        home: Consumer<AuthState>(builder: (context, authState, _) {
          return authState.isAuthorized
              ? const HomePage()
              : FutureBuilder(
                  future: authState.loadUser(),
                  builder: (context, snapshot) =>
                      snapshot.connectionState == ConnectionState.waiting
                          ? const SplashScreen()
                          : const LoginPage());
        }),
      ),
    );
  }
}
