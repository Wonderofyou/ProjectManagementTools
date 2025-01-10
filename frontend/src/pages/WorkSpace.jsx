import React, { useState } from "react";

const Workspace = () => {
  const [documents, setDocuments] = useState([]);
  const [activeDocument, setActiveDocument] = useState(null);
  const [inputText, setInputText] = useState("");

  const handleAddDocument = () => {
    setDocuments([...documents, { id: documents.length + 1, title: `Document ${documents.length + 1}`, content: "" }]);
  };

  const handleSelectDocument = (document) => {
    setActiveDocument(document);
    setInputText(document.content);
  };

  const handleChangeContent = (e) => {
    setInputText(e.target.value);
    if (activeDocument) {
      setDocuments(
        documents.map(doc =>
          doc.id === activeDocument.id ? { ...doc, content: e.target.value } : doc
        )
      );
    }
  };

  const handleSave = () => {
    // Implement the save functionality here
    alert("Document saved!");
  };

  return (
    <div className="flex">
      {/* Sidebar - dính bên trái màn hình */}
      <div className="fixed left-0 w-64 bg-gray-800 text-white p-4 min-h-screen">
        <button
          onClick={handleAddDocument}
          className="absolute top-8 right-8 bg-blue-500 text-white p-3 rounded-full"
        >
          Add
        </button>
        <ul className="mt-4">
          {documents.map((doc) => (
            <li
              key={doc.id}
              onClick={() => handleSelectDocument(doc)}
              className="cursor-pointer hover:bg-gray-600 p-2 rounded mb-2"
            >
              {doc.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="ml-64 flex-1 p-8">
        {activeDocument ? (
          <textarea
            className="w-500 h-96 p-4 border-2 border-gray-300 rounded"
            value={inputText}
            onChange={handleChangeContent}
            placeholder="Start typing..."
          />
        ) : (
          <div className="text-center text-gray-500">Select a document to start writing</div>
        )}
      </div>

      {/* Save Button - dính dưới phải màn hình */}
      <button
        onClick={handleSave}
        className="fixed bottom-8 right-8 bg-green-500 text-white p-3 rounded-full"
      >
        Save
      </button>
    </div>
  );
};

export default Workspace;
