import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import axios from 'axios';
import Cookies from 'js-cookie';

const RoomPage = () => {
  const [roomId, setRoomId] = useState('');
  const userId = Cookies.get('id');
  const [userName, setUserName] = useState('User');
  const meetingRef = useRef(null);
  const navigate = useNavigate();
  let zc; // Zego Cloud instance

  // Fetch user data by ID
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        console.log('Fetching user data for user ID:', userId);
        const response = await axios.get(`/users/${userId}`);

        if (response.status === 200) {
          const userData = response.data?.data;
          console.log('User data:', userData);
          if (userData) {
            setUserName(`${userData.firstName} ${userData.lastName}`);
            console.log('User name:', userName);
          }
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserName();
  }, [userId, userName]);

  // Function to initialize Zego Cloud meeting
  const joinMeeting = async () => {
    if (!roomId) {
      alert('Please enter a valid room ID.');
      return;
    }

    console.log('Initializing Zego Cloud meeting with room ID:', roomId);

    const appID = 661628401; // Replace with your Zego Cloud app ID
    const serverSecret = '9b99792e893708ef250012276bdef8ab'; // Replace with your Zego Cloud server secret

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      userId,
      userName
    );

    zc = ZegoUIKitPrebuilt.create(kitToken);

    zc.joinRoom({
      container: meetingRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      maxUsers: 10,
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      showUserJoinAndLeave: true,
      onLeaveRoom: () => {
        console.log('User has left the room.');
        zc.destroy();
        navigate('/'); // Redirect to the homepage or another page
      },
    });
  };

  useEffect(() => {
    return () => {
      if (zc) {
        console.log('Destroying Zego Cloud instance...');
        zc.destroy();
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-green-400 relative">
      {/* Background Blur Effect */}
      <div className="absolute inset-0 backdrop-blur-lg bg-gradient-to-br from-purple-500 via-blue-500 to-green-400 opacity-60"></div>

      {/* Room Container */}
      <div className="relative z-10 h-[80vh] w-full max-w-4xl bg-white shadow-2xl rounded-3xl flex flex-col p-8 items-center">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">
          Welcome, {userName}
        </h2>

        <div className="flex flex-col md:flex-row w-full gap-4 items-center justify-center mb-6">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full md:w-2/3 p-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={joinMeeting}
            className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition duration-300"
          >
            Join Room
          </button>
        </div>

        <div ref={meetingRef} className="w-full h-[60vh] bg-gray-200 rounded-lg overflow-hidden"></div>
      </div>
    </div>
  );
};

export default RoomPage;