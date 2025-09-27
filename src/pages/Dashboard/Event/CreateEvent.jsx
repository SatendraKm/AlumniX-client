import { useState } from "react";
import CheckmarkAnimation from "../../../assets/animations/checkmark.gif";
import axiosInstance from "../../../utils/axiosinstance"; // Import the axios instance
import { toast } from "react-toastify"; // Import toast for notifications

const CreateEvent = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    eventphoto: null, // Updated to null for file handling
    type: "",
    mode: "",
    venue: "",
    link: "",
    date: "",
    time: "",
    eventDescription: "",
    eventCoordinator: "",
    coordinatorphone: "",
    tagsTopic: "",
    eligibility: "",
    speaker: "",
    organizedBy: "",
    reminder: "",
  });

  const handleImageInputChange = (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        // Generate a preview URL for the image
        const previewUrl = URL.createObjectURL(file);

        // Update state with the file and preview URL
        setFormData({
          ...formData,
          eventphoto: file,
        });
        setPreviewImage(previewUrl);
      } else {
        alert("Please select a valid image file.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" || type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked ? value : prevData[name],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleAddTag = (e) => {
    if (tagInput && tags.length < 7) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = "Event Title is required.";
    if (!formData.date) errors.date = "Event Date is required.";
    if (!formData.time) errors.time = "Event Time is required.";
    if (!formData.eventDescription)
      errors.eventDescription = "Event Description is required.";
    if (!formData.eventCoordinator)
      errors.eventCoordinator = "Coordinator is required.";
    if (!formData.coordinatorphone)
      errors.coordinatorphone = "Coordinator Phone is required.";
    if (!tags.length) errors.tagsTopic = "At least 2 tags are required.";
    if (!formData.eligibility) errors.eligibility = "Eligibility is required.";
    if (!formData.speaker) errors.speaker = "Speaker is required.";
    if (!formData.organizedBy) errors.organizedBy = "Organizer is required.";
    return errors;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setError({});
    setIsLoading(true);

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("type", formData.type);
    formPayload.append("mode", formData.mode);
    formPayload.append("date", formData.date);
    formPayload.append("time", formData.time);
    formPayload.append("eventDescription", formData.eventDescription);
    formPayload.append("eventCoordinator", formData.eventCoordinator);
    formPayload.append("coordinatorphone", formData.coordinatorphone);
    formPayload.append("tagsTopic", tags.join(", "));
    formPayload.append("eligibility", formData.eligibility);
    formPayload.append("speaker", formData.speaker);
    formPayload.append("organizedBy", formData.organizedBy);
    formPayload.append("reminder", formData.reminder);

    if (formData.mode === "Offline") {
      formPayload.append("venue", formData.venue);
    } else if (formData.mode === "Online") {
      formPayload.append("link", formData.link);
    }
    if (formData.eventphoto) {
      formPayload.append("eventphoto", formData.eventphoto);
    }

    try {
      const response = await axiosInstance.post(
        "/event/create-event",
        formPayload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Event created successfully!");
      setStep(5); // Move to the success step
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleDiscard = () => {
    setFormData({
      title: "",
      eventphoto: null,
      type: "",
      mode: "",
      venue: "",
      link: "",
      date: "",
      time: "",
      eventDescription: "",
      eventCoordinator: "",
      coordinatorphone: "",
      tagsTopic: "",
      eligibility: "",
      speaker: "",
      organizedBy: "",
      reminder: "",
    });
    setTags([]);
    setTagInput("");
    setStep(1);
    onClose(); // Reset to step 1
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[90%] max-w-lg rounded-lg shadow-lg p-6 relative">
        <button
          onClick={handleDiscard}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg font-bold"
        >
          ×
        </button>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold items-center">
            {step === 5 ? "Event Created Successfully!" : "Create an Event"}
          </h2>
        </div>
        {step === 1 && (
          <div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter Event Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error.title && (
                <span className="text-red-500 text-sm">{error.title}</span>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold mb-2">
                Upload Cover Image
              </label>
              {previewImage ? (
                <div className="w-full h-40 border border-gray-300 bg-gray-100 flex items-center justify-center rounded-lg">
                  <img
                    src={previewImage}
                    alt="Cover Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="w-full h-40 border border-gray-300 bg-gray-100 flex items-center justify-center rounded-lg cursor-pointer">
                  <label
                    htmlFor="eventphoto"
                    className="text-gray-500 font-semibold"
                  >
                    Add Image
                    <input
                      type="file"
                      name="eventphoto"
                      id="eventphoto"
                      onChange={handleImageInputChange}
                      className=""
                    />
                  </label>
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Next
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Type of Event
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" className="font-semibold text-gray-300">
                  Select Event Type
                </option>
                <option value="workshop">workshop</option>
                <option value="seminar">seminar</option>
                <option value="conference">conference</option>
                <option value="webinar">webinar</option>
                <option value="training">training</option>
              </select>
            </div>

            <div className="flex gap-4 mt-4">
              <label className="block text-sm font-semibold mb-2">
                Event Mode
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="Online"
                    checked={formData.mode === "Online"}
                    onChange={handleInputChange}
                    className="form-radio"
                  />
                  Online
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="Offline"
                    checked={formData.mode === "Offline"}
                    onChange={handleInputChange}
                    className="form-radio"
                  />
                  Offline
                </label>
              </div>
            </div>

            {formData.mode === "Offline" && (
              <div className="mt-4">
                <label className="block text-sm font-semibold mb-2">
                  Enter Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="Enter Venue"
                  className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {formData.mode === "Online" && (
              <div className="mt-4">
                <label className="block text-sm font-semibold mb-2">
                  Event Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="Enter Event Link (e.g. Zoom, Google Meet)"
                  className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">
                Event Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error.date && (
                <span className="text-red-500 text-sm">{error.date}</span>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">
                Event Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error.time && (
                <span className="text-red-500 text-sm">{error.time}</span>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">
                Event Description
              </label>
              <textarea
                name="eventDescription"
                value={formData.eventDescription}
                onChange={handleInputChange}
                rows="3"
                placeholder="Add a brief description about the event"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleBack}
                className="px-4 py-2 border font-semibold border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 font-semibold text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Event Coordinator
              </label>
              <input
                type="text"
                name="eventCoordinator"
                value={formData.eventCoordinator}
                onChange={handleInputChange}
                placeholder="Enter Event Coordinator's Name"
                className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error.eventCoordinator && (
                <span className="text-red-500 text-sm">
                  {error.eventCoordinator}
                </span>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">
                Contact Details
              </label>
              <input
                type="text"
                name="coordinatorphone"
                value={formData.coordinatorphone}
                onChange={handleInputChange}
                placeholder="Enter coordinator phone"
                className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error.coordinatorphone && (
                <span className="text-red-500 text-sm">
                  {error.coordinatorphone}
                </span>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">
                Tags / Topics
              </label>
              <div className="w-full border border-gray-300 rounded-lg p-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTag();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={tags.length >= 7}
                  >
                    Add
                  </button>
                </form>

                {tags.length < 2 && (
                  <p className="mt-2 text-sm text-red-500">
                    You must add at least 2 tags before proceeding.
                  </p>
                )}
                {tags.length > 7 && (
                  <p className="mt-2 text-sm text-red-500">
                    You cannot add more than 7 tags.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">
                Eligibility
              </label>
              <select
                name="eligibility"
                value={formData.eligibility}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Eligibility</option>
                <option value="All">All</option>
                <option value="Faculty and Alumni">Faculty and Alumni</option>
                <option value="Faculty and Student">Faculty and Student</option>
                <option value="Alumni and Student">Alumni and Student</option>
                <option value="Only Faculty">Only Faculty</option>
                <option value="Only Alumni">Only Alumni</option>
                <option value="Only Student">Only Student</option>
              </select>
              {error.eligibility && (
                <span className="text-red-500 text-sm">
                  {error.eligibility}
                </span>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">
                Speaker Name
              </label>
              <input
                type="text"
                name="speaker"
                value={formData.speaker}
                onChange={handleInputChange}
                placeholder="Enter Speaker's Name"
                className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error.speaker && (
                <span className="text-red-500 text-sm">{error.speaker}</span>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">
                Organized By
              </label>
              <input
                type="text"
                name="organizedBy"
                value={formData.organizedBy}
                onChange={handleInputChange}
                placeholder="Enter Name of Organizer"
                className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error.organizedBy && (
                <span className="text-red-500 text-sm">
                  {error.organizedBy}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleBack}
                className="px-4 py-2 border font-semibold border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mt-4">
            <h2 className="text-2xl font bold mb-6 text-center">
              Schedule Reminder
            </h2>

            <label className="block text-sm font-semibold mb-4">
              Notify your Viewer
            </label>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="reminder"
                  value="15 minutes before"
                  checked={formData.reminder === "15 minutes before"}
                  onChange={handleInputChange}
                  className="form-radio"
                />
                15 minutes Before
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="reminder"
                  value="30 minutes before"
                  checked={formData.reminder === "30 minutes before"}
                  onChange={handleInputChange}
                  className="form-radio"
                />
                30 minutes Before
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="reminder"
                  value="1 hour before"
                  checked={formData.reminder === "1 hour before"}
                  onChange={handleInputChange}
                  className="form-radio"
                />
                1 Hour Before
              </label>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Back
              </button>
              <button
                onClick={handleSubmit} // This now submits the form if Step 4
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={isLoading} // Disable if no reminder is selected
              >
                {isLoading === false ? "Submit" : "Creating Event"}
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg font-bold mb-4">
              Your event has been created successfully!
            </p>
            <div className="w-24 h-24 mb-6 flex items-center justify-center">
              <img
                src={CheckmarkAnimation}
                alt="Checkmark Animation"
                className="w-full h-full"
              />
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
