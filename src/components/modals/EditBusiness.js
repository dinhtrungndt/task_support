import React, { useState, useEffect } from 'react';

export const EditBusinessModal = ({ 
  business, 
  onClose, 
  onSave 
}) => {
  const [editedBusiness, setEditedBusiness] = useState(null);

  useEffect(() => {
    if (business) {
      setEditedBusiness({...business});
    }
  }, [business]);

  const handleInputChange = (e) => {
    if (editedBusiness) {
      setEditedBusiness({
        ...editedBusiness,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSave = () => {
    if (editedBusiness) {
      onSave({
        ...editedBusiness,
        lastModified: new Date().toISOString()
      });
    }
  };

  if (!editedBusiness) return null;

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs mb-1">MST (Tax Code)</label>
          <input
            type="text"
            name="mst"
            value={editedBusiness.mst}
            onChange={handleInputChange}
            className="w-full border rounded p-2 text-xs"
            disabled
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Company Name</label>
          <input
            type="text"
            name="name"
            value={editedBusiness.name}
            onChange={handleInputChange}
            className="w-full border rounded p-2 text-xs"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={editedBusiness.address}
            onChange={handleInputChange}
            className="w-full border rounded p-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Contact Person</label>
          <input
            type="text"
            name="contactPerson"
            value={editedBusiness.contactPerson}
            onChange={handleInputChange}
            className="w-full border rounded p-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={editedBusiness.phone}
            onChange={handleInputChange}
            className="w-full border rounded p-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={editedBusiness.email}
            onChange={handleInputChange}
            className="w-full border rounded p-2 text-xs"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs mb-1">Data Types</label>
          <input
            type="text"
            name="dataTypes"
            value={editedBusiness.dataTypes.join(', ')}
            onChange={(e) => {
              if (editedBusiness) {
                setEditedBusiness({
                  ...editedBusiness,
                  dataTypes: e.target.value.split(',').map(type => type.trim())
                });
              }
            }}
            className="w-full border rounded p-2 text-xs"
            placeholder="Enter data types separated by comma"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditBusinessModal;