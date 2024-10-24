import 'package:flutter/material.dart';

class AvatarPinMarker extends StatelessWidget {
  final String imgSrc;
  final Color pinColor;
  final String userName;

  // ignore: use_super_parameters
  const AvatarPinMarker({
    Key? key,
    required this.imgSrc,
    required this.userName,
    this.pinColor = Colors.blue,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        Transform.rotate(
          angle: 45,
          child: Container(
            height: 56,
            width: 56,
            decoration: BoxDecoration(
              color: pinColor,
              border: Border.all(color: Colors.black),
              borderRadius: BorderRadius.circular(28),
            ),
          ),
        ),
        ClipOval(
          child: imgSrc.startsWith("http")
              ? Image.network(
                  imgSrc,
                  height: 48,
                  width: 48,
                  fit: BoxFit.cover,
                )
              : Image.asset(
                  "assets/no-user.webp",
                  height: 48,
                  width: 48,
                  fit: BoxFit.cover,
                ),
        ),
      ],
    );
  }
}
