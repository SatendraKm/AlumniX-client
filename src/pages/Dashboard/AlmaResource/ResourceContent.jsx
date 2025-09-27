import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import folderIcon from "../../../assets/icons/folder.svg";

const ResourceContent = () => {
  const [folders, setFolders] = useState(() => {
    // Load folders from localStorage or use a default value
    const savedFolders = JSON.parse(localStorage.getItem("folders"));
    return (
      savedFolders || [
        {
          id: 1,
          name: "Question Paper",
          year: "2022",
          icon: folderIcon,
          link: "https://sih.gov.in/",
        },
        {
          id: 2,
          name: "Imp Questions",
          year: "2021",
          icon: folderIcon,
          link: "https://example.com/family",
        },
        {
          id: 3,
          name: "Mid Sem Questions",
          year: "2023",
          icon: folderIcon,
          link: "https://example.com/work",
        },
      ]
    );
  });

  const [selectedFolderIds, setSelectedFolderIds] = useState([]); // Track selected folders
  const [newLink, setNewLink] = useState("");
  const [newName, setNewName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFolderIdForEdit, setSelectedFolderIdForEdit] = useState(null); // Track folder being edited

  // Function to add a new folder
  const addFolder = () => {
    const newFolder = {
      id: folders.length + 1,
      name: `New Folder ${folders.length + 1}`,
      year: "2024",
      icon: folderIcon,
      link: `https://example.com/new-folder-${folders.length + 1}`,
    };
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    localStorage.setItem("folders", JSON.stringify(updatedFolders)); // Save updated folders to localStorage
  };

  // Function to handle renaming and updating folder link
  const handleRename = () => {
    if (
      selectedFolderIds.length > 0 &&
      newName.trim() !== "" &&
      newLink.trim() !== ""
    ) {
      const updatedFolders = folders.map((folder) => {
        if (selectedFolderIds.includes(folder.id)) {
          return { ...folder, name: newName, link: newLink }; // Update selected folder's name and link
        }
        return folder;
      });
      setFolders(updatedFolders);
      localStorage.setItem("folders", JSON.stringify(updatedFolders)); // Save updated folders to localStorage
      setNewName("");
      setNewLink("");
      setSelectedFolderIds([]); // Clear selected folders after renaming
      setIsModalOpen(false); // Close modal
    }
  };

  // Function to handle deleting selected folders
  const handleDelete = () => {
    const updatedFolders = folders.filter(
      (folder) => !selectedFolderIds.includes(folder.id)
    ); // Remove selected folders
    setFolders(updatedFolders);
    localStorage.setItem("folders", JSON.stringify(updatedFolders)); // Save updated folders to localStorage
    setSelectedFolderIds([]); // Clear selected folders after deletion
  };

  // Function to handle folder selection for renaming or deletion (using checkbox)
  const handleFolderSelect = (id) => {
    if (selectedFolderIds.includes(id)) {
      setSelectedFolderIds(
        selectedFolderIds.filter((folderId) => folderId !== id)
      ); // Deselect folder
    } else {
      setSelectedFolderIds([...selectedFolderIds, id]); // Select folder
    }
  };

  // Function to open folder in a new tab when clicking on the folder icon
  const handleFolderClick = (link) => {
    window.open(link, "_blank"); // Open the link in a new tab
  };

  // Function to open modal for updating folder name and link
  const openEditModal = (folder) => {
    setSelectedFolderIdForEdit(folder.id);
    setNewName(folder.name);
    setNewLink(folder.link);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg p-8 w-full h-full mx-auto">
      {/* Top Header: Title, Add Folder, Rename, and Delete Buttons */}
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-3xl font-bold">Almuni Resources</h2>
        <div className="flex space-x-2">
          <button
            onClick={addFolder}
            className="bg-blue-500 text-white px-6 py-2 rounded-md flex items-center hover:bg-blue-600 transition"
          >
            <FaPlus size={20} className="mr-2" />
            Add Folder
          </button>

          {/* Only show Rename and Delete buttons if folders are selected */}
          {selectedFolderIds.length > 0 && (
            <>
              <button
                onClick={() =>
                  openEditModal(
                    folders.find((f) => selectedFolderIds.includes(f.id))
                  )
                }
                className="bg-green-400 text-Black px-6 py-2 rounded-md flex items-center hover:bg-green-500 transition"
              >
                Rename Folder
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-400 text-Black px-6 py-2 rounded-md flex items-center hover:bg-red-500 transition"
              >
                Delete Folder
              </button>
            </>
          )}
        </div>
      </div>

      {/* Folders Display Below */}
      <div className="mt-4 w-2/4">
        <div className="grid grid-rows-1 grid-cols-3 gap-1">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`flex flex-col items-center justify-center hover:bg-gray-50 transition w-56 h-56 cursor-pointer relative ${selectedFolderIds.includes(folder.id) ? "bg-gray-200" : ""}`} // Highlight selected folder
            >
              {/* Folder Icon (clickable to open in new tab) */}
              <div
                className="w-full h-full flex justify-center items-center"
                onClick={() => handleFolderClick(folder.link)} // Open link in new tab
              >
                <img
                  src={folder.icon}
                  alt="Folder"
                  className="w-24 h-24 object-contain"
                />
              </div>

              {/* Folder Name and Year */}
              <div className="flex flex-col items-center">
                <input
                  type="checkbox"
                  checked={selectedFolderIds.includes(folder.id)} // Check if folder is selected
                  onChange={() => handleFolderSelect(folder.id)} // Select/Deselect folder
                  className="absolute top-2 right-2"
                />
                <span className="text-lg font-medium text-center">
                  {folder.name}
                </span>
                <span className="mb-4 text-sm text-gray-500">
                  {folder.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for updating folder name and link */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-2xl font-bold mb-4">Edit Folder</h3>
            {/* Folder Name Input */}
            <div className="mb-4">
              <label htmlFor="folderName" className="block text-lg mb-1">
                Folder Name
              </label>
              <input
                type="text"
                id="folderName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter new folder name"
              />
            </div>
            {/* Folder Link Input */}
            <div className="mb-4">
              <label htmlFor="folderLink" className="block text-lg mb-1">
                Folder Link
              </label>
              <input
                type="text"
                id="folderLink"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter new folder link"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceContent;
