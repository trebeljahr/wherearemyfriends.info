// friend_privacy_modal.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:wamf/providers/user_provider.dart';
import 'package:wamf/services/user_service.dart';
import 'package:wamf/types/friend.dart';
import 'package:wamf/types/user.dart';
import 'package:wamf/widgets/privacy_options.dart';

class FriendPrivacyModal extends StatefulWidget {
  final Friend friend;

  // ignore: use_super_parameters
  const FriendPrivacyModal({Key? key, required this.friend}) : super(key: key);

  @override
  FriendPrivacyModalState createState() => FriendPrivacyModalState();
}

class FriendPrivacyModalState extends State<FriendPrivacyModal> {
  late String _privacySetting;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadPrivacySetting();
  }

  void _loadPrivacySetting() {
    try {
      setState(() {
        _isLoading = true;
      });

      final authState = Provider.of<AuthState>(context, listen: false);
      final user = authState.user!;

      final privacySetting = user.privacySettings
          .firstWhere(
            (setting) => setting.friendId == widget.friend.id,
            orElse: () => PrivacySetting(
              friendId: widget.friend.id,
              visibility: user.defaultPrivacy,
            ),
          )
          .visibility;

      setState(() {
        _privacySetting = privacySetting;
      });
    } catch (err) {
      // Handle error
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _updatePrivacySetting(String? newPrivacy) async {
    if (newPrivacy == null) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      await userService.updateFriendPrivacy(widget.friend.id, newPrivacy);

      if (mounted) {
        final authState = Provider.of<AuthState>(context, listen: false);
        await authState.loadUser();
      }

      setState(() {
        _privacySetting = newPrivacy;
      });
    } catch (e) {
      // Handle error
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _removeFriend() async {
    try {
      await userService.removeFriend(widget.friend.id);
      if (mounted) {
        final authState = Provider.of<AuthState>(context, listen: false);
        await authState.loadUser(); // Refresh user data
      }

      if (mounted) {
        Navigator.of(context).pop();
      }
    } catch (e) {
      // Handle error
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Wrap(
        children: [
          ListTile(
            leading: CircleAvatar(
              backgroundImage: NetworkImage(widget.friend.profilePicture),
            ),
            title: Text(widget.friend.username),
          ),
          if (_isLoading)
            const Center(child: CircularProgressIndicator())
          else
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  const Text('Privacy Settings:'),
                  const SizedBox(height: 8),
                  PrivacyOptionsComponent(
                    value: _privacySetting,
                    onChanged: _updatePrivacySetting,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: _removeFriend,
                    icon: const Icon(Icons.delete),
                    label: const Text('Remove Friend'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
