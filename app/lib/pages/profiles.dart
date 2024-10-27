import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:wamf/providers/user_provider.dart';
import 'package:wamf/services/user_service.dart';
import 'package:wamf/types/friend.dart';
import 'package:wamf/widgets/default_privacy_settings_for_other_user.dart';
import 'package:wamf/widgets/navbar.dart';
import 'package:wamf/widgets/send_friend_request.dart';
import 'package:wamf/widgets/single_friend_request.dart';

class OtherUserProfile extends StatefulWidget {
  final String username;

  const OtherUserProfile({super.key, required this.username});

  @override
  OtherUserProfileState createState() => OtherUserProfileState();
}

class OtherUserProfileState extends State<OtherUserProfile> {
  OtherUser? _otherUser;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchOtherUser();
  }

  Future<void> _fetchOtherUser() async {
    try {
      final otherUser = await userService.getUserProfile(widget.username);
      setState(() {
        _otherUser = otherUser;
        _isLoading = false;
      });
    } catch (error) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = Provider.of<AuthState>(context);
    final currentUser = authState.user;

    final isSameUser = currentUser?.id == _otherUser?.id;
    final alreadyFriends =
        currentUser?.friends.any((friend) => friend.id == _otherUser?.id) ??
            false;
    final alreadySentFriendRequest = currentUser?.sentFriendRequests
            .any((request) => request.id == _otherUser?.id) ??
        false;
    final alreadyReceivedFriendRequest = currentUser?.receivedFriendRequests
            .any((request) => request.id == _otherUser?.id) ??
        false;

    return Scaffold(
      appBar: AppBar(title: const Text('User Profile Page')),
      drawer: const CustomNavbar(),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: _isLoading || _otherUser == null
            ? const Center(child: CircularProgressIndicator())
            : Column(
                children: [
                  CircleAvatar(
                    backgroundImage: NetworkImage(_otherUser!.profilePicture),
                    radius: 64,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Username: ${_otherUser!.username}',
                    style: const TextStyle(
                        fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  if (isSameUser)
                    const Text(
                      '(This is you)',
                      style:
                          TextStyle(fontSize: 16, fontStyle: FontStyle.italic),
                    ),
                  const SizedBox(height: 16),
                  DefaultPrivacySettingForOtherUser(otherUser: _otherUser!),
                  const SizedBox(height: 16),
                  if (alreadyFriends)
                    const Text('You are already friends with this user.')
                  else if (alreadySentFriendRequest)
                    const Text('Friend request already sent.')
                  else if (alreadyReceivedFriendRequest)
                    Column(
                      children: [
                        const Text(
                          'You already have a friend request from this person. Accept it?',
                        ),
                        const SizedBox(height: 8),
                        DisplaySingleFriendRequest(
                          request: _otherUser!,
                          onRequestHandled: (userId) {},
                        ),
                      ],
                    )
                  else if (!isSameUser)
                    SendFriendRequest(
                      friendId: _otherUser!.id,
                    ),
                ],
              ),
      ),
    );
  }
}
