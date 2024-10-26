// send_friend_request.dart
import 'package:flutter/material.dart';
import 'package:wamf/services/user_service.dart';

class SendFriendRequest extends StatefulWidget {
  final String friendId;
  final void Function(String? friendId)? setFriendId;

  const SendFriendRequest({
    super.key,
    required this.friendId,
    this.setFriendId,
  });

  @override
  SendFriendRequestState createState() => SendFriendRequestState();
}

class SendFriendRequestState extends State<SendFriendRequest> {
  bool _loading = false;
  String? _message;

  Future<void> _addFriend() async {
    setState(() {
      _loading = true;
      _message = null;
    });

    try {
      final data = await userService.makeFriendRequest(widget.friendId);
      widget.setFriendId?.call(null);

      setState(() {
        _message = data?.message ?? 'Friend request sent!';
      });
    } catch (error) {
      setState(() {
        _message = 'Error: ${error.toString()}';
      });
      widget.setFriendId?.call(null);
    } finally {
      setState(() {
        _loading = false;
        widget.setFriendId?.call(null);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_message != null) {
      return Text(
        _message!,
        style: const TextStyle(fontSize: 16),
      );
    } else {
      return ElevatedButton(
        onPressed: _loading ? null : _addFriend,
        child: Text(_loading ? 'Adding...' : 'Add Friend'),
      );
    }
  }
}
