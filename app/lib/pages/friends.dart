import 'package:flutter/material.dart';
import 'package:wamf/widgets/map_with_friends.dart';
import 'package:wamf/widgets/navbar.dart';

class FriendsPage extends StatelessWidget {
  const FriendsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Friends Page')),
      drawer: const CustomNavbar(),
      // body: const MapPageWithCustomWidget(),
      body: const MapWithFriendsPage(),
      // child: StadiaMapsExample(),
      // child: CustomMarkerPage(),
    );
  }
}
