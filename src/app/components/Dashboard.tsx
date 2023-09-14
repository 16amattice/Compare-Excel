import * as React from 'react';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const [file1, setFile1] = React.useState<File | null>(null);
  const [file2, setFile2] = React.useState<File | null>(null);
  const [file1Data, setFile1Data] = React.useState<any | null>(null);
  const [file2Data, setFile2Data] = React.useState<any | null>(null);

  const handleFileUpload = async (file: File, setData: React.Dispatch<React.SetStateAction<any>>) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5001/api/comparison/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        setData(data);
      } else {
        alert('Error uploading file: ' + data.message);
      }
    } catch (error) {
      alert('Failed to send files to the server. ' + error.message);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>, setData: React.Dispatch<React.SetStateAction<any>>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setter(file);
      handleFileUpload(file, setData);
    }
  };

  const handleCompareClick = () => {
    if (!file1Data || !file2Data) {
      alert('Please select and upload both Excel files before comparing.');
      return;
    }
    // Update UI here based on file1Data and file2Data
  };

  return (
    <div className="dashboard">
      <div className="file-inputs">
        <input type="file" accept=".xlsx, .xls, .xlsm" onChange={(e) => handleFileSelect(e, setFile1, setFile1Data)} />
        <input type="file" accept=".xlsx, .xls, .xlsm" onChange={(e) => handleFileSelect(e, setFile2, setFile2Data)} />
        <button onClick={handleCompareClick}>Compare</button>
      </div>
      <div className="data-grid">
        {/* Display data from file1Data or a placeholder */}
        <div className="data-grid-view">{file1Data ? JSON.stringify(file1Data) : 'Please compare two files to populate grid.'}</div>
      </div>
      <div className="data-grid">
        {/* Display data from file2Data or a placeholder */}
        <div className="data-grid-view">{file2Data ? JSON.stringify(file1Data) : 'Please compare two files to populate grid.'}</div>
      </div>
    </div>
  );
};

export default Dashboard;

