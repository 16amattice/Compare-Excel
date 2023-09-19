import React, { useState } from 'react';
import './Dashboard.scss';
import MainPage from './main-page/MainPage';
import MenuBar from './menu-bar/MenuBar'

const useFileHandler = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);


  const handleFileUpload = (file: File, setData: React.Dispatch<React.SetStateAction<any>>) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    return fetch("http://localhost:5000/api/comparison/upload", { method: 'POST', body: formData })
      .then(response => {
        if (!response.ok) throw new Error(`Error uploading file: ${response.statusText}`);
        return response.json();
      })
      .then(data => {
        setData(data.sheets);
        setUploading(false);
      })
      .catch(error => {
        alert(`Failed to send files to the server. ${error.message}`);
        setUploading(false);
      });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFile(file);
      handleFileUpload(file, setFileData);
    }
  };

  return [fileData, handleFileSelect, uploading] as const;
};

const FileUploadPopup: React.FC<{ 
  onCompare: () => void, 
  file1Data: any, 
  file2Data: any, 
  handleFile1Select: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  handleFile2Select: (e: React.ChangeEvent<HTMLInputElement>) => void,
  uploadingFile1: boolean,
  uploadingFile2: boolean
}> = ({ onCompare, file1Data, file2Data, handleFile1Select, handleFile2Select, uploadingFile1, uploadingFile2 }) => {
  
  return (
    <div className="popup">
      <div className="file-inputs">
        <input type="file" accept=".xlsx, .xls, .xlsm" onChange={handleFile1Select} />
        <input type="file" accept=".xlsx, .xls, .xlsm" onChange={handleFile2Select} />
        <button
          onClick={onCompare}
          disabled={!file1Data || !file2Data || uploadingFile1 || uploadingFile2}
        >
          Compare
        </button>
      </div>
      {(uploadingFile1 || uploadingFile2) && <p>Please Wait...Uploading Data</p>}
    </div>
  );
};


const Dashboard: React.FC = () => {
  const [isCompared, setIsCompared] = useState(false);
  const [file1Data, handleFile1Select, uploadingFile1] = useFileHandler();
  const [file2Data, handleFile2Select, uploadingFile2] = useFileHandler();
  const [showPopup, setShowPopup] = useState(true);

  const handleCompareClick = () => {
    if (!file1Data || !file2Data) {
      alert('Please select and upload both Excel files before comparing.');
      return;
    }
    setIsCompared(true);
    setShowPopup(false);
  };

  const handleNewClick = () => {
    setIsCompared(false);
    setShowPopup(true);
  };

  return (
    <div className="dashboard">
      <MenuBar onNew={handleNewClick} />
      {showPopup && <FileUploadPopup onCompare={handleCompareClick} file1Data={file1Data} file2Data={file2Data} handleFile1Select={handleFile1Select} handleFile2Select={handleFile2Select} uploadingFile1={uploadingFile1} uploadingFile2={uploadingFile2} />}
      {isCompared && <MainPage file1Data={file1Data} file2Data={file2Data} />}
    </div>
);
};

export default Dashboard;
