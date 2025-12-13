import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { authorsAPI } from '../services/api';
import { Plus, Edit, Trash2, X, Users, Mail, Globe } from 'lucide-react';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState({
    name: '',
    email: '',
    bio: '',
    country: ''
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await authorsAPI.getAll();
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await authorsAPI.update(currentAuthor.id, currentAuthor);
      } else {
        await authorsAPI.create(currentAuthor);
      }
      fetchAuthors();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will also delete all books by this author.')) {
      try {
        await authorsAPI.delete(id);
        fetchAuthors();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const openModal = (author = null) => {
    if (author) {
      setCurrentAuthor(author);
      setEditMode(true);
    } else {
      setCurrentAuthor({ name: '', email: '', bio: '', country: '' });
      setEditMode(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentAuthor({ name: '', email: '', bio: '', country: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <Users className="h-8 w-8 text-indigo-600" />
              <span>Authors Management</span>
            </h1>
            <p className="text-gray-600 mt-1">Manage book authors</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Author</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <div key={author.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{author.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Mail className="h-4 w-4 mr-1" />
                    {author.email}
                  </div>
                  {author.country && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="h-4 w-4 mr-1" />
                      {author.country}
                    </div>
                  )}
                </div>
              </div>

              {author.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{author.bio}</p>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-semibold">{author.books_count || 0}</span> book(s) published
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(author)}
                    className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition flex items-center justify-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(author.id)}
                    className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {authors.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No authors found</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-2xl font-bold text-gray-900">
                {editMode ? 'Edit Author' : 'Add New Author'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={currentAuthor.name}
                  onChange={(e) => setCurrentAuthor({ ...currentAuthor, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={currentAuthor.email}
                  onChange={(e) => setCurrentAuthor({ ...currentAuthor, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={currentAuthor.country}
                  onChange={(e) => setCurrentAuthor({ ...currentAuthor, country: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biography
                </label>
                <textarea
                  value={currentAuthor.bio}
                  onChange={(e) => setCurrentAuthor({ ...currentAuthor, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                ></textarea>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
                >
                  {editMode ? 'Update Author' : 'Create Author'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Authors;