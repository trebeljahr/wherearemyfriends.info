import 'package:flutter/material.dart';
import 'package:wamf/types/friend.dart';
import 'package:wamf/widgets/privacy_options.dart';

class FriendListItem extends StatelessWidget {
  final Friend friend;
  final VoidCallback onSettingsPressed;
  final String privacySetting;

  // ignore: use_super_parameters
  const FriendListItem({
    Key? key,
    required this.friend,
    required this.onSettingsPressed,
    required this.privacySetting,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final privacyOption = getPrivacyOption(privacySetting);

    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundImage: NetworkImage(friend.profilePicture),
        ),
        title: Text(friend.username),
        subtitle: Row(
          children: [
            privacyOption.icon,
            const SizedBox(width: 8),
            Text(privacyOption.label),
          ],
        ),
        trailing: IconButton(
          icon: const Icon(Icons.settings),
          onPressed: onSettingsPressed,
        ),
      ),
    );
  }
}
