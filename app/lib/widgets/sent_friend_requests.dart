// sent_friend_requests.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:wamf/providers/user_provider.dart';
import 'package:wamf/services/user_service.dart';

class SentFriendRequests extends StatelessWidget {
  const SentFriendRequests({super.key});

  Future<void> _revokeFriendRequest(
      BuildContext context, String friendId) async {
    final authState = Provider.of<AuthState>(context, listen: false);
    try {
      await userService.revokeFriendRequest(friendId);
      await authState.loadUser();
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to revoke friend request.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = Provider.of<AuthState>(context);
    final user = authState.user;

    if (user == null) {
      return const SizedBox.shrink();
    }

    if (user.sentFriendRequests.isEmpty) {
      return const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Sent Friend Requests',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 16),
          Text('No pending friend requests.'),
        ],
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Sent Friend Requests',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        ListView.builder(
          shrinkWrap: true,
          itemCount: user.sentFriendRequests.length,
          itemBuilder: (context, index) {
            final potentialFriend = user.sentFriendRequests[index];
            return ListTile(
              leading: CircleAvatar(
                backgroundImage: NetworkImage(potentialFriend.profilePicture),
                radius: 24,
              ),
              title: Text(potentialFriend.username),
              subtitle: const Text('Waiting for approval'),
              trailing: IconButton(
                icon: const Icon(FontAwesomeIcons.trash, color: Colors.red),
                onPressed: () =>
                    _revokeFriendRequest(context, potentialFriend.id),
              ),
            );
          },
        ),
      ],
    );
  }
}
