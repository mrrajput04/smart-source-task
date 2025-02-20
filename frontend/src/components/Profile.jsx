// src/components/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import VideoUploadModal from './VideoModal';
import api from '../../config/api';

function Profile() {
  const { user, logout } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchUserInfo();
    fetchVideos();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/api/users/user-info',{
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token}` 
        }
        });
      setUserInfo(response.data);
    } catch (err) {
      setError('Failed to load user information');
      console.error('Error fetching user info:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await api.get('/api/videos/videos', {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token}` 
        }
        });
      setVideos(response.data);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    }
  };

  const handleVideoUploadSuccess = (newVideo) => {
    setVideos([...videos, newVideo]);
  };

  const handleProfilePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    if (file.size > 1024 * 1024) {
      setError('Image must be less than 1MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    let user = localStorage.getItem("user")
    user = JSON.parse(user)
    try {
      setLoading(true);
      await api.post('/api/users/upload-profile-picture', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token}` 
        }
        });
      // Refresh user data or update profile picture URL
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size and type
    if (file.size > 6 * 1024 * 1024) {
      setError('Video must be less than 6MB');
      return;
    }
    if (file.type !== 'video/mp4') {
      setError('Please upload an MP4 video');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    try {
      setLoading(true);
      await api.post('/api/users/upload-video', formData);
      // Refresh user data or update video list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Profile</h2>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {/* <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicture}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 border rounded"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Video
            </label>
            <input
              type="file"
              accept="video/mp4"
              onChange={handleVideoUpload}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  ); */}
   <div className="flex items-start space-x-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                {userInfo?.profilePicture ? (
                  <img
                    src={userInfo.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Photo
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicture}
                className="hidden"
                id="profile-picture"
              />
              <label
                htmlFor="profile-picture"
                className="cursor-pointer text-blue-500 hover:text-blue-600 text-sm"
              >
                Update Photo
              </label>
            </div>

            {/* User Details */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  First Name
                </label>
                <div className="text-lg">{userInfo?.firstName}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Last Name
                </label>
                <div className="text-lg">{userInfo?.lastName}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Email
                </label>
                <div className="text-lg">{userInfo?.email}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Phone Number
                </label>
                <div className="text-lg">{userInfo?.phoneNumber}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">My Videos</h3>
            <button
              onClick={() => setShowVideoModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Upload Video
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <div key={video._id} className="border rounded p-4">
                <h4 className="font-bold">{video.title}</h4>
                <p className="text-gray-600 text-sm">{video.description}</p>
                <p className="text-gray-500 text-xs mt-2">
                  Uploaded: {new Date(video.uploadDate).toLocaleDateString()}
                </p>
                <video
                  className="mt-2 w-full"
                  controls
                  src={video.videoUrl}
                />
              </div>
            ))}
          </div>
        </div>

        <VideoUploadModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          onUploadSuccess={handleVideoUploadSuccess}
        />
      </div>
   
  );
}

export default Profile;
