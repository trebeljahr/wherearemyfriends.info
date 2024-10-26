// display_single_friend_request.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:wamf/providers/user_provider.dart';
import 'package:wamf/services/user_service.dart';
import 'package:wamf/types/friend.dart';

class DisplaySingleFriendRequest extends StatelessWidget {
  final OtherUser request;
  final void Function(String userId) onRequestHandled;

  const DisplaySingleFriendRequest({
    super.key,
    required this.request,
    required this.onRequestHandled,
  });

  Future<void> _handleAccept(BuildContext context) async {
    final authState = Provider.of<AuthState>(context, listen: false);

    try {
      await userService.acceptFriendRequest(request.id);
      onRequestHandled(request.id);
      await authState.loadUser();
    } catch (err) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to accept friend request.')),
        );
      }
    }
  }

  Future<void> _handleDecline(BuildContext context) async {
    try {
      await userService.declineFriendRequest(request.id);
      onRequestHandled(request.id);
    } catch (err) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to decline friend request.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        backgroundImage: NetworkImage(request.profilePicture),
        radius: 24,
      ),
      title: Text(request.username),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          ElevatedButton(
            onPressed: () => _handleAccept(context),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
            child: const Text('Accept'),
          ),
          const SizedBox(width: 8),
          ElevatedButton(
            onPressed: () => _handleDecline(context),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Decline'),
          ),
        ],
      ),
    );
  }
}
