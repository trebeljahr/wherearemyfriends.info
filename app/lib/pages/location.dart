import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:wamf/providers/user_provider.dart';
import 'package:wamf/widgets/navbar.dart';

class MyLocationPage extends StatelessWidget {
  const MyLocationPage({super.key});

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthState>().user;

    return Scaffold(
        appBar: AppBar(title: const Text('My Location Page')),
        drawer: const CustomNavbar(),
        body: user == null
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Username: ${user.username}',
                          style: const TextStyle(fontSize: 20)),
                      const SizedBox(height: 8),
                      Text('Email: ${user.email}',
                          style: const TextStyle(fontSize: 16)),
                      const SizedBox(height: 16),
                      const Text('Location:', style: TextStyle(fontSize: 20)),
                      if (user.location.exact != null) ...[
                        const SizedBox(height: 8),
                        Text(
                            'Exact Location: ${user.location.exact!.name} (Lat: ${user.location.exact!.latitude}, Lng: ${user.location.exact!.longitude})'),
                      ],
                      if (user.location.city != null) ...[
                        const SizedBox(height: 8),
                        Text('City: ${user.location.city!.name}'),
                      ],
                      if (user.location.country != null) ...[
                        const SizedBox(height: 8),
                        Text('Country: ${user.location.country!.name}'),
                      ],
                    ],
                  ),
                ),
              ));
  }
}
