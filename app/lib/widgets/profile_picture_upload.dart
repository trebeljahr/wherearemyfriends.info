// profile_picture_upload.dart

import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:provider/provider.dart';
import 'package:wamf/providers/user_provider.dart';
import 'package:wamf/services/auth_service.dart';
import 'package:wamf/services/user_service.dart';

class ProfilePictureUpload extends StatefulWidget {
  const ProfilePictureUpload({super.key});

  @override
  ProfilePictureUploadState createState() => ProfilePictureUploadState();
}

class ProfilePictureUploadState extends State<ProfilePictureUpload> {
  File? _imageFile;
  bool _isUploading = false;

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();

    final XFile? pickedFile = await showModalBottomSheet<XFile?>(
      context: context,
      builder: (context) => _buildImageSourceSheet(picker),
    );

    if (pickedFile != null) {
      final File? croppedFile = await _cropImage(File(pickedFile.path));

      if (croppedFile != null) {
        await _uploadImage(croppedFile);
      }
    }
  }

  Widget _buildImageSourceSheet(ImagePicker picker) {
    return SafeArea(
      child: Wrap(
        children: [
          ListTile(
            leading: const Icon(Icons.photo_library),
            title: const Text('Gallery'),
            onTap: () async {
              final XFile? pickedFile =
                  await picker.pickImage(source: ImageSource.gallery);
              if (mounted) {
                Navigator.pop(context, pickedFile);
              }
            },
          ),
          ListTile(
            leading: const Icon(Icons.camera_alt),
            title: const Text('Camera'),
            onTap: () async {
              final XFile? pickedFile =
                  await picker.pickImage(source: ImageSource.camera);
              if (mounted) {
                Navigator.pop(context, pickedFile);
              }
            },
          ),
        ],
      ),
    );
  }

  Future<File?> _cropImage(File imageFile) async {
    final croppedFile = await ImageCropper().cropImage(
      sourcePath: imageFile.path,
      uiSettings: [
        AndroidUiSettings(
          toolbarTitle: 'Crop Image',
          toolbarColor: Theme.of(context).primaryColor,
          toolbarWidgetColor: Colors.white,
          initAspectRatio: CropAspectRatioPreset.square,
          lockAspectRatio: true,
        ),
        IOSUiSettings(
          title: 'Crop Image',
          aspectRatioLockEnabled: true,
        ),
      ],
      aspectRatio: const CropAspectRatio(ratioX: 1, ratioY: 1),
    );

    if (croppedFile != null) {
      return File(croppedFile.path);
    } else {
      return null;
    }
  }

  Future<void> _uploadImage(File imageFile) async {
    setState(() {
      _isUploading = true;
    });

    try {
      final authState = Provider.of<AuthState>(context, listen: false);

      await userService.uploadProfilePicture(
          imageFile.readAsBytesSync(), imageFile.path);
      await authState.loadUser(); // Refresh user data

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile picture updated successfully')),
        );
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to upload profile picture')),
        );
      }
    } finally {
      setState(() {
        _isUploading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = Provider.of<AuthState>(context);
    final user = authState.user;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Update Profile Picture',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        Center(
          child: Stack(
            children: [
              CircleAvatar(
                radius: 64,
                backgroundImage: _imageFile != null
                    ? FileImage(_imageFile!)
                    : NetworkImage(
                        user?.profilePicture ?? '$backendBaseUrl/no-user.webp',
                      ) as ImageProvider,
              ),
              Positioned(
                bottom: 0,
                right: 4,
                child: _isUploading
                    ? const CircularProgressIndicator()
                    : ElevatedButton(
                        onPressed: _isUploading ? null : _pickImage,
                        style: ElevatedButton.styleFrom(
                          shape: const CircleBorder(),
                          padding: const EdgeInsets.all(12),
                          backgroundColor: Colors.blueAccent,
                        ),
                        child: const Icon(
                          Icons.camera_alt,
                          color: Colors.white,
                        ),
                      ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
