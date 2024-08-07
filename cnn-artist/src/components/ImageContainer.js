import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

function ImageContainer() {
    const [image, setImage] = useState(null);
    const [prediction, setPredictions] = useState([]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };
    const handleClearImage = () => {
        setImage(null);
        setPredictions([]);
    };
    const handlePrediction = async () => {
        if (!image) return;

        try {
            const model = await tf.loadLayersModel("output_model/model.json");
            const imgElement = document.createElement('img');
            imgElement.src = image;

            imgElement.onload = async () => {
                const tensor = tf.browser.fromPixels(imgElement).resizeNearestNeighbor([512, 512]).toFloat().expandDims();
                const predictions = await model.predict(tensor).data();
                setPredictions(predictions);
            };
        } catch (error) {
            console.error('Error loading or parsing model:', error);
        }
    };

    return (
        <div>
            {!image && (
                <div className="flex items-center justify-center w-full mb-4 mt-4">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">WEBP, PNG, JPG</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleImageUpload} />
                    </label>
                </div>
            )}
            {image && (
                <div className="flex items-center justify-center w-full mb-4 mt-4">
                    <img src={image} alt="Uploaded" className="max-w-full max-h-64" />
                </div>
            )}
            <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handleClearImage}>Clear</button>            
            <button type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handlePrediction}>Predict</button>        
        </div>
    );
}

export default ImageContainer;