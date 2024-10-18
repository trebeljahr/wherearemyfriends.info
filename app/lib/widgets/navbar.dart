import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class CustomNavbar extends StatelessWidget {
  const CustomNavbar({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          const DrawerHeader(
            decoration: BoxDecoration(
              color: Colors.deepPurple,
            ),
            child: Text(
              'wherearemyfriends.info',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
              ),
            ),
          ),
          ListTile(
            leading: const Icon(FontAwesomeIcons.locationDot),
            title: const Text('My Location'),
            onTap: () {
              Navigator.pushNamed(context, '/location');
            },
          ),
          ListTile(
            leading: const Icon(FontAwesomeIcons.userFriends),
            title: const Text('Friends'),
            onTap: () {
              Navigator.pushNamed(context, '/friends');
            },
          ),
          ListTile(
            leading: const Icon(FontAwesomeIcons.user),
            title: const Text('Login'),
            onTap: () {
              Navigator.pushNamed(context, '/login');
            },
          ),
          ListTile(
            leading: const Icon(FontAwesomeIcons.userPlus),
            title: const Text('Sign Up'),
            onTap: () {
              Navigator.pushNamed(context, '/signup');
            },
          ),
          ListTile(
            leading: const Icon(FontAwesomeIcons.cog),
            title: const Text('Settings'),
            onTap: () {
              Navigator.pushNamed(context, '/settings');
            },
          ),
        ],
      ),
    );
  }
}
