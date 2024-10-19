import 'package:flutter/material.dart';
import 'pages.dart';
import 'package:provider/provider.dart';
import 'package:wamf/providers/userprovider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
            seedColor: const Color.fromARGB(255, 0, 46, 125)),
        useMaterial3: true,
      ),
      home: const RoutesSetup(),
    );
  }
}
