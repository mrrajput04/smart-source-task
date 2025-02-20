// src/components/VideoUploadModal.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../../config/api';

function VideoUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  const handleChange = (e) => {
    if (e.target.name === 'video') {
      const file = e.target.files[0];
      if (file && file.size > 6 * 1024 * 1024) {
        setError('Video must be less than 6MB');
        return;
      }
      if (file && file.type !== 'video/mp4') {
        setError('Please upload an MP4 video');
        return;
      }
      setFormData({ ...formData, video: file });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.video || !formData.title || !formData.description) {
      setError('All fields are required');
      return;
    }

    const videoData = new FormData();
    videoData.append('video', formData.video);
    videoData.append('title', formData.title);
    videoData.append('description', formData.description);

    try {
      setLoading(true);
      const response = await api.post('/api/videos/upload-video', videoData,
        {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${user.token}` 
          }
          }
      );
      onUploadSuccess(response.data.video);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Upload Video</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video (MP4, max 6MB)
            </label>
            <input
              type="file"
              name="video"
              accept="video/mp4"
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VideoUploadModal;