import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:wamf/providers/user_provider.dart';
import 'package:wamf/widgets/change_password.dart';
import 'package:wamf/widgets/navbar.dart';
import 'package:wamf/widgets/profile_picture_upload.dart';
import 'package:wamf/widgets/qr_code.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

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
                      const DisplayQRCode(),
                      const SizedBox(height: 24),
                      const ProfilePictureUpload(),
                      const SizedBox(height: 24),
                      const ChangePasswordWidget(),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: () {
                          context.read<AuthState>().logout();
                          Navigator.pushNamedAndRemoveUntil(
                              context, '/login', (route) => false);
                        },
                        child: const Text('Logout'),
                      ),
                    ],
                  ),
                ),
              ));
  }
}
