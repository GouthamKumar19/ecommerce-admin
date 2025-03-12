
import CategoryForm from "../../components/Category/CategoryForm";

export const CategoryDetails = () => {
  // Add handlers for the Add and Cancel actions
  const handleAdd = () => {
    // Implement the add functionality
    console.log("Add button clicked");
    // You might want to submit the form data or trigger a save action
  };

  const handleCancel = () => {
    // Implement the cancel functionality
    console.log("Cancel button clicked");
    // You might want to reset the form or navigate back
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow example">
      {/* Buttons at top */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={handleCancel}
          className="w-24 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleAdd}
          className="w-24 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Category Form */}
      <CategoryForm />
    </div>
  );
};
