import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:wamf/providers/user_provider.dart';
import 'package:wamf/services/user_service.dart';
import 'package:wamf/types/friend.dart';
import 'package:wamf/widgets/single_friend_request.dart';

class ReceivedFriendRequests extends StatefulWidget {
  const ReceivedFriendRequests({super.key});

  @override
  ReceivedFriendRequestsState createState() => ReceivedFriendRequestsState();
}

class ReceivedFriendRequestsState extends State<ReceivedFriendRequests> {
  List<OtherUser> _receivedRequests = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchPendingRequests();
  }

  Future<void> _fetchPendingRequests() async {
    final authState = Provider.of<AuthState>(context, listen: false);
    if (authState.user == null) {
      return;
    }

    try {
      final data = await userService.fetchReceivedRequests();
      setState(() {
        _receivedRequests = data;
        _loading = false;
      });
    } catch (err) {
      setState(() {
        _error = 'Failed to fetch pending friend requests.';
        _loading = false;
      });
    }
  }

  void _removeRequest(String userId) {
    setState(() {
      _receivedRequests.removeWhere((request) => request.id == userId);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        const Text(
          'Received Friend Requests',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        if (_loading)
          const Center(child: CircularProgressIndicator())
        else if (_error != null)
          Text(_error!)
        else if (_receivedRequests.isEmpty)
          const Text('No pending friend requests.')
        else
          ListView.builder(
            shrinkWrap: true,
            itemCount: _receivedRequests.length,
            itemBuilder: (context, index) {
              final request = _receivedRequests[index];
              return DisplaySingleFriendRequest(
                request: request,
                onRequestHandled: _removeRequest,
              );
            },
          ),
      ],
    );
  }
}
