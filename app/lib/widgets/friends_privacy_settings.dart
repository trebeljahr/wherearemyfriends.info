// friends_privacy_settings.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:wamf/providers/user_provider.dart';
import 'package:wamf/services/user_service.dart';
import 'package:wamf/types/friend.dart';
import 'package:wamf/types/user.dart';
import 'package:wamf/widgets/default_privacy_settings.dart';
import 'package:wamf/widgets/friend_list.dart';
import 'package:wamf/widgets/friend_privacy.dart';

class FriendsPrivacySettings extends StatefulWidget {
  // ignore: use_super_parameters
  const FriendsPrivacySettings({Key? key}) : super(key: key);

  @override
  FriendsPrivacySettingsState createState() => FriendsPrivacySettingsState();
}

class FriendsPrivacySettingsState extends State<FriendsPrivacySettings> {
  bool _isLoading = true;
  List<Friend> _friends = [];

  @override
  void initState() {
    super.initState();
    _loadFriends();
  }

  Future<void> _loadFriends() async {
    try {
      final friends = await userService.fetchFriends();
      setState(() {
        _friends = friends;
        _isLoading = false;
      });
    } catch (e) {
      // Handle error
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _openFriendPrivacyModal(Friend friend) async {
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => FriendPrivacyModal(friend: friend),
    );
    // Refresh friends after modal is closed
    _loadFriends();
  }

  @override
  Widget build(BuildContext context) {
    final authState = Provider.of<AuthState>(context);

    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (authState.user == null) {
      return const Center(child: Text('No user data available.'));
    }

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Location Privacy Settings',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          DefaultPrivacySetting(
            defaultPrivacy: authState.user!.defaultPrivacy,
            onPrivacyChanged: (newPrivacy) async {
              if (newPrivacy == null) return;

              await userService.updateDefaultPrivacy(newPrivacy);
              await authState.loadUser();
            },
          ),
          const SizedBox(height: 16),
          _friends.isEmpty
              ? const Text('You have no friends yet.')
              : ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _friends.length,
                  itemBuilder: (context, index) {
                    final friend = _friends[index];
                    final privacySetting = authState.user?.privacySettings
                        .firstWhere(
                          (setting) => setting.friendId == friend.id,
                          orElse: () => PrivacySetting(
                            friendId: friend.id,
                            visibility:
                                authState.user?.defaultPrivacy ?? "none",
                          ),
                        )
                        .visibility;

                    return FriendListItem(
                      friend: friend,
                      onSettingsPressed: () => _openFriendPrivacyModal(friend),
                      privacySetting: privacySetting ?? "none",
                    );
                  },
                ),
        ],
      ),
    );
  }
}
