import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import uploadMedia from "../../../assets/images/upload.png";
import emoji from "../../../assets/images/emoji.png";
import axiosInstance from "../../../utils/axiosinstance"; // Ensure axios instance is correctly set up
import Cookies from "js-cookie"; // For user ID
import { toast } from "react-toastify";


const CreateStory = ({ onClose }) => {
  const userId = Cookies.get("id"); // Assuming user ID is stored in cookies
  const [userData, setUserData] = useState("");
  const role = Cookies.get("role");
  const [formData, setFormData] = useState({
    title: "",
    storyType: "Story", // Default story type
    storyImage: null,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // Preview state for image
  const [error, setError] = useState(""); // To display form errors

  // Fetch user data for profile image
  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      setUserData(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useState(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoryTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, storyType: type }));
    setDropdownOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Validate file type (images or videos only)
    if (
      file &&
      (file.type.startsWith("image/") || file.type.startsWith("video/"))
    ) {
      setFormData((prev) => ({ ...prev, storyImage: file }));
      setError(""); // Clear error
      const fileURL = URL.createObjectURL(file); // Generate preview URL
      setPreviewImage(fileURL);
    } else {
      setError("Please upload a valid image or video.");
      setPreviewImage(null); // Reset preview
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setFormData((prev) => ({
      ...prev,
      title: prev.title + emojiObject.emoji, // Append emoji to content
    }));
    setEmojiPickerOpen(false); // Close emoji picker
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for content
    if (!formData.title.trim()) {
      setError("Story title cannot be empty.");
      return;
    }

    // Create FormData to send to API
    const postData = new FormData();
    postData.append("title", formData.title); // Map content to title (API request)

    // Attach file if selected

    if (formData.storyImage) {
      postData.append("storyImage", formData.storyImage); // Attach the selected file
    }

    try {
      // Make API call to create story
      const response = await axiosInstance.post(
        "/stories/new-story", // The API endpoint to create a new story
        postData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // For file upload
          },
        }
      );
      console.log(response);
      toast.success("Story created successfully");

      // Reset form and close modal
      setFormData({
        title: "",
        storyType: "Story",
        storyImage: null,
      });
      setError(""); // Clear any previous errors
      onClose(); // Close the modal after successful submission
    } catch (error) {
      toast.error("Failed to create Story");
      console.error("Error creating story:", error);
      setError("Failed to create story. Please try again.");
    }
  };

  const handleDiscard = () => {
    setFormData({
      title: "",
      storyType: "Story",
      storyImage: null,
    });
    setPreviewImage(null); // Reset image preview
    setError(""); // Clear any errors
    onClose(); // Close the modal without submitting
  };

  return (
    <div className="fixed h-full inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
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
              src={userData?.profileimageUrl || "/path-to-profile-image.jpg"} // Profile image or default path
              alt="Profile"
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="relative">
              <h2 className="font-semibold text-gray-800">
                {userData.firstName + " " + userData.lastName}
              </h2>
              {/* Story Type Dropdown */}
              <div
                className="relative cursor-pointer mt-1 text-gray-500"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {formData.storyType}{" "}
                <span className="ml-1 text-sm">&#x25BC;</span>
              </div>
              {dropdownOpen && (
                <div className="absolute bg-white border border-gray-300 rounded mt-2 shadow-lg w-48 z-10">
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleStoryTypeChange("Story")}
                  >
                    Story
                  </div>
                  {(role === "alumni" || role === "faculty") && (
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleStoryTypeChange("Impact Story")}
                  >
                    Impact Story
                  </div>
                )}
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleStoryTypeChange("Funding Story")}
                  >
                    Funding Story
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text Area */}
          <textarea
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Share your insights"
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

export default CreateStory;
