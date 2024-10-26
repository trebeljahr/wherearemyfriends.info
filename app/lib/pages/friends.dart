import 'package:flutter/material.dart';
import 'package:wamf/widgets/friends_privacy_settings.dart';
import 'package:wamf/widgets/navbar.dart';
import 'package:wamf/widgets/received_friend_requests.dart';
import 'package:wamf/widgets/sent_friend_requests.dart';
import 'package:wamf/widgets/user_search.dart';

class FriendsPage extends StatelessWidget {
  const FriendsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text('Friends Page')),
        drawer: const CustomNavbar(),
        body: const Column(
          children: [
            UserSearch(),
            ReceivedFriendRequests(),
            SentFriendRequests(),
            FriendsPrivacySettings(),
          ],
        )
        // body: const FriendSearch(),
        // body: const MapPageWithCustomWidget(),
        // body: const MapWithFriendsPage(),
        // child: StadiaMapsExample(),
        // child: CustomMarkerPage(),
        );
  }
}
