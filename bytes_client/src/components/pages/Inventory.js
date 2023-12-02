import React, { useEffect, useState } from 'react';
import './Inventory.css';
import axios from "axios";

// function components
function Inventory() {
  // State Hooks
  const [images, setImages] = useState([]);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typedItems, setTypedItems] = useState([]);
  const fileInputRef = React.createRef();


  // fetch user's inventory items
  useEffect(() => {
    const fetchExistingItems = async () => {
      try {
        const response = await axios.get('get_inventory/');
        if (response.status === 200) {
          const data = response.data;
          setResults(data.items);
        } else {
          console.error('Error fetching existing items:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching existing items:', error.response ? error.response.data : error.message);
      }
    };

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

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const processImages = () => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', image);
    });

    axios
      .post('cv/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      .then(function (response) {
        if (response.status === 200) {
          console.log('image uploaded');
          const data = response.data;
          setResults(data.items);
        } else {
          console.error('Error processing images');
        }
      })
      .catch(function (error) {
        console.error('Error processing images:', error);
      });
  };

  const manualInput = async () => {
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

  const handleRemoveTypedItem = (index) => {
    const updatedTypedItems = [...typedItems];
    updatedTypedItems.splice(index, 1);
    setTypedItems(updatedTypedItems);
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
      </div>
      {/* <div className="results">
        <h2>Analysis Results:</h2>
        <ul className='items'>
          {results.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}

export default Inventory;
