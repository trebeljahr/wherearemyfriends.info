import 'package:flutter/material.dart';
import 'package:wamf/widgets/navbar.dart';
import 'package:wamf/widgets/user_search.dart';

class FriendsPage extends StatelessWidget {
  const FriendsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Friends Page')),
      drawer: const CustomNavbar(),

      body: const UserSearch(),
      // body: const FriendSearch(),
      // body: const FriendsPrivacySettings(),
      // body: const MapPageWithCustomWidget(),
      // body: const MapWithFriendsPage(),
      // child: StadiaMapsExample(),
      // child: CustomMarkerPage(),
    );
  }
}
