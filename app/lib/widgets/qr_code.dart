// display_qr_code.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:wamf/providers/user_provider.dart';
import 'package:wamf/services/auth_service.dart';

class DisplayQRCode extends StatelessWidget {
  const DisplayQRCode({super.key});

  @override
  Widget build(BuildContext context) {
    final authState = Provider.of<AuthState>(context);
    final user = authState.user;

    if (user == null) {
      return const Center(child: Text('User not logged in.'));
    }

    final profileUrl = '$backendBaseUrl/profiles/${user.username}';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Share Your Profile',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        QrImageView(
          data: profileUrl,
          version: QrVersions.auto,
          size: 200.0,
        ),
        const SizedBox(height: 16),
        Text(
          'Scan this QR code to view my profile and send me a friend request.',
          style: TextStyle(fontSize: 16, color: Colors.grey[700]),
        ),
        const SizedBox(height: 8),
        GestureDetector(
          onTap: () {
            Navigator.pushNamed(context, '/profiles', arguments: user.username);
          },
          child: Text(
            'View my profile',
            style: TextStyle(
              fontSize: 16,
              color: Theme.of(context).primaryColor,
              decoration: TextDecoration.underline,
            ),
          ),
        ),
      ],
    );
  }
}
