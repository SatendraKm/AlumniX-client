import { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import uploadMedia from "../../../assets/images/upload.png";
import emoji from "../../../assets/images/emoji.png";
import Cookies from "js-cookie";
import axiosInstance from "../../../utils/axiosinstance"; // Ensure axios instance is properly set up.
import { toast } from "react-toastify";

const CreatePost = ({ onClose }) => {
  const userId = Cookies.get("id");
  const [userData, setUserData] = useState("");
  const profileImage = userData?.profileimageUrl;

  const [formData, setFormData] = useState({
    content: "",
    attachedFile: null,
  });

  const [previewImage, setPreviewImage] = useState(null); // Preview state for image
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [error, setError] = useState(""); // To display form errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`); // Replace '/data' with your actual API endpoint
        setUserData(response.data.data); // Set the data from response
      } catch (err) {
        setError(err.message); // Handle any errors
      }
    };

    fetchData();
  }, [userId]);

  // Handle input change (content)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change (validate file types and show preview)
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Validate the file type: Only images and videos allowed
    if (
      file &&
      (file.type.startsWith("image/") || file.type.startsWith("video/"))
    ) {
      setFormData((prev) => ({ ...prev, attachedFile: file }));
      setError(""); // Clear error if file is valid

      // Create a preview URL for the uploaded file
      const fileURL = URL.createObjectURL(file);
      setPreviewImage(fileURL);
    } else {
      setError("Please upload a valid image or video file.");
      setPreviewImage(null); // Reset preview if the file is invalid
    }
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiObject) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content + emojiObject.emoji,
    }));
    setEmojiPickerOpen(false); // Close emoji picker after selection
  };

  // Handle post submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      setError("Post content cannot be empty.");
      toast.error("Error: Post content cannot be empty.");
      return;
    }

    try {
      // Prepare the data to send to the server
      const postData = new FormData();
      postData.append("description", formData.content); // Add text content

      // If there's an attached file, append it
      if (formData.attachedFile) {
        postData.append("postPhoto", formData.attachedFile);
      }
      // Make the API request to submit the post
      await axiosInstance.post(
        "/post/create", // Corrected URL
        postData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file upload
          },
        }
      );

      toast.success("Post created successfully");

      // If submission is successful, clear the form and close the modal
      setFormData({
        content: "",
        attachedFile: null,
      });
      setError(""); // Clear any previous errors
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error posting data:", error);
      setError("Failed to post. Please try again.");
    }
  };

  // Discard changes and reset the form
  const handleDiscard = () => {
    setFormData({
      content: "",
      attachedFile: null,
    });
    setPreviewImage(null); // Reset image preview
    setError(""); // Clear error state
    onClose(); // Close modal
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-3xl relative">
        {/* Discard Button */}
        <button
          onClick={handleDiscard}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg font-bold"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit}>
          {/* User Info */}
          <div className="flex items-center mb-6">
            <img
              src={profileImage || "/path-to-profile-image.jpg"} // Use passed profile image or default path
              alt="Profile"
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="relative">
              <h2 className="font-semibold text-gray-800">
                {userData.firstName + " " + userData.lastName}
              </h2>
              {/* Post Type Toggle */}
              <div className="relative cursor-pointer mt-1 text-gray-500">
                Post
              </div>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Share Your Insights: Engage, Schedule, Poll"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:border-blue-300"
            rows="8"
          ></textarea>

          {/* Display Error Message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Image Preview */}
          {previewImage && (
            <div className="mt-4">
              <img
                src={previewImage}
                alt="Image Preview"
                className="max-w-full h-16 rounded-lg border border-gray-300"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center mt-6">
            {/* File Attach */}
            <label
              htmlFor="fileInput"
              className="flex items-center text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              <img
                src={uploadMedia}
                alt="Attach File"
                className="w-5 h-5 mr-1"
              />
              Media
              <input
                id="fileInput"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Emoji Picker */}
            <button
              type="button"
              onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
              className="flex items-center text-gray-500 hover:text-gray-800"
            >
              <img src={emoji} alt="Emoji Picker" className="w-5 h-5 mr-1" />
              <span className="ml-1">Emoji</span>
            </button>
            {emojiPickerOpen && (
              <div className="absolute mt-12">
                <EmojiPicker
                  onEmojiClick={(event, emojiObject) =>
                    handleEmojiClick(emojiObject)
                  }
                />
              </div>
            )}

            {/* Post Button */}
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
