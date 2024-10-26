import 'package:flutter/material.dart';
import 'package:wamf/services/user_service.dart';
import 'package:wamf/widgets/send_friend_request.dart';

class UserSearch extends StatefulWidget {
  const UserSearch({super.key});

  @override
  UserSearchState createState() => UserSearchState();
}

class UserSearchState extends State<UserSearch> {
  final TextEditingController _usernameController = TextEditingController();
  String? _otherUserId;
  String? _message;
  bool _loading = false;

  @override
  void dispose() {
    _usernameController.dispose();
    super.dispose();
  }

  Future<void> _searchForUser() async {
    setState(() {
      _loading = true;
      _message = null;
      _otherUserId = null;
    });

    try {
      final username = _usernameController.text.trim();
      final foundUser = await userService.searchForUser(username);

      if (foundUser != null) {
        setState(() {
          _otherUserId = foundUser.id;
          _message = 'User found: ${foundUser.username}';
        });
      } else {
        setState(() {
          _message = 'No user found with that username.';
        });
      }
    } catch (error) {
      setState(() {
        _message = 'Error: ${error.toString()}';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  void _setFriendId(String? friendId) {
    setState(() {
      _otherUserId = friendId;
      if (friendId == null) {
        _usernameController.clear();
        _message = null;
        _loading = false;
        _otherUserId = null;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Add a New Friend',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _usernameController,
          decoration: const InputDecoration(
            hintText: "Enter friend's username",
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 8),
        ElevatedButton(
          onPressed: _loading ? null : _searchForUser,
          child: Text(_loading ? 'Searching...' : 'Search'),
        ),
        const SizedBox(height: 8),
        if (_message != null)
          Text(
            _message!,
            style: const TextStyle(fontSize: 16),
          ),
        const SizedBox(height: 8),
        if (_otherUserId != null)
          SendFriendRequest(
            friendId: _otherUserId!,
            setFriendId: _setFriendId,
          ),
      ],
    );
  }
}
