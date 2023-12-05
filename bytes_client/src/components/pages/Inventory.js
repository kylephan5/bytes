import React, { useEffect, useState } from 'react';
import './Inventory.css';
import { Link } from 'react-router-dom';
import axios from "axios";

// function components
function Inventory() {
  // State Hooks
  const [images, setImages] = useState([]);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typedItems, setTypedItems] = useState([]);
  const fileInputRef = React.createRef();

  const fetchExistingItems = async () => {
    try {
      const response = await axios.get('get_inventory/');
      if (response.status === 200) {
        const data = response.data;
        setTypedItems(data[Object.keys(data)[0]]);
      } else {
        console.error('Error fetching existing items:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching existing items:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchExistingItems();
  }, []);


  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setImages([...images, ...droppedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages([...images, ...selectedFiles]);
  };

  const processImages = async () => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    try {
      const response = await axios.post('cv/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const data = response.data;
        const analysisResults = data.items || [];
        setResults(analysisResults);

        // Fetch and update inventory after processing images
        await fetchExistingItems();

        console.log('Analysis Results:', analysisResults);
      } else {
        console.error('Error processing images');
      }

    } catch (error) {
      console.error('Error processing images:', error);
    }
  };


  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const manualInput = async () => {
    // do not allow duplicate entry
    if (typedItems.includes(searchTerm)) {
      alert('Item already exists in inventory')
      return;
    }

    const newTypedItems = [...typedItems, searchTerm];
    setTypedItems(newTypedItems);
    setSearchTerm('');

    try {
      const response = await axios.post('manual_input/', { items: [searchTerm] });
      if (response.status === 200) {
        const data = response.data;
      } else {
        console.error('Error updating backend :(', response.statusText);
      }
    } catch (error) {
      console.error('Error updating backend:', error.response ? error.response.data : error.message);
    }
  };

  // Delete item in inventory
  const handleRemoveTypedItem = async (index) => {
    const itemToRemove = typedItems[index];

    try {
      await axios.post('delete_item/', { item: itemToRemove });

      const updatedTypedItems = [...typedItems];
      updatedTypedItems.splice(index, 1);
      setTypedItems(updatedTypedItems);
    } catch (error) {
      console.error('Error deleting item:', error.response ? error.response.data : error.message);
    }
  };


  return (
    <div className="inventory-container">
      <div
        className="drop-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>Drag and drop images here</p>
        <button type="button" onClick={handleUploadClick}>
          Upload Images
        </button>
        <input
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          ref={fileInputRef}
        />
        <button onClick={processImages}>Process Images</button>
      </div>
      <div className="image-preview">
        {images.map((image, index) => (
          <div key={index} className="image-container">
            <img src={URL.createObjectURL(image)} alt={`Image ${index}`} />
            <button className="remove-button" onClick={() => handleRemoveImage(index)}>
              X
            </button>
          </div>
        ))}
      </div>
      <div className="manual-input">
        <h2>Input Inventory</h2>
        {typedItems.map((item, index) => (
          <div key={index} className="typed-item">
            {item}
            <button className="remove-button" onClick={() => handleRemoveTypedItem(index)}>
              X
            </button>
          </div>
        ))}
        <input
          type="text"
          placeholder="Type in items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className='add-input' onClick={manualInput}>Add</button>
        <Link to='/recommendations'>
          <button className="recipe_button">Find Recipes</button>
        </Link>
      </div>
    </div>
  );
}

export default Inventory;
