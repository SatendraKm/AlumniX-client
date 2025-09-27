import { useState } from 'react';

const CreateFund = ({onClose}) => {
  const [formData, setFormData] = useState({
    fundPic: null,
    fundPicPreview: null,
    fundName: '',
    fundDescription: '',
  });

 
  // Handle closing the popup
 

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        fundPic: file,
        fundPicPreview: URL.createObjectURL(file),
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Submit logic here
    
  };

  return (
    <div className="p-5">
      

      
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg relative w-full max-w-md">
            {/* Discard (cross) button */}
            <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            &times;
          </button>

            <h2 className="text-2xl font-bold mb-4">Create New Fund</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Fund Pic Field with Preview */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fund Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-white file:bg-blue-500 hover:file:bg-blue-600 cursor-pointer"
                />
                {formData.fundPicPreview && (
                  <img
                    src={formData.fundPicPreview}
                    alt="Fund Preview"
                    className="mt-2 h-32 w-full object-cover rounded border"
                  />
                )}
              </div>

              {/* Fund Name Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fund Name
                </label>
                <input
                  type="text"
                  name="fundName"
                  value={formData.fundName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter fund name"
                  required
                />
              </div>

              {/* Fund Description Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fund Description
                </label>
                <textarea
                  name="fundDescription"
                  value={formData.fundDescription}
                  onChange={handleChange}
                  className="w-full border p-2 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter fund description"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Create Fund
                </button>
              </div>
            </form>
          </div>
        </div>
      
    </div>
  );
};

export default CreateFund;
