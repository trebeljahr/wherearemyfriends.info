// default_privacy_setting_for_other_user.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:wamf/providers/user_provider.dart';
import 'package:wamf/types/friend.dart';
import 'privacy_options.dart';

class DefaultPrivacySettingForOtherUser extends StatelessWidget {
  final OtherUser otherUser;

  const DefaultPrivacySettingForOtherUser({super.key, required this.otherUser});

  @override
  Widget build(BuildContext context) {
    final authState = Provider.of<AuthState>(context);
    final currentUser = authState.user;
    final isYou = currentUser?.id == otherUser.id;

    final options = generatePrivacyOptions(isYou ? 'your' : 'their');
    final privacyOption = options.firstWhere(
      (option) => option.value == otherUser.defaultPrivacy,
    );

    if (currentUser == null) {
      return const SizedBox.shrink();
    }

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 16),
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Wrap(
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          Text(isYou ? 'You are' : '${otherUser.username} is'),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey),
              borderRadius: BorderRadius.circular(8),
              color: Colors.white,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                privacyOption.icon,
                const SizedBox(width: 8),
                Text(privacyOption.label),
              ],
            ),
          ),
          const SizedBox(width: 8),
          const Text('with new friends per default.'),
        ],
      ),
    );
  }
}
