import * as React from 'react';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const [file1, setFile1] = React.useState<File | null>(null);
  const [file2, setFile2] = React.useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setter(file);
    }
  };

  const handleCompareClick = () => {
    if (!file1 || !file2) {
      alert('Please select both files before comparing.');
      return;
    }
    // TODO: Add logic to send these files to the backend API or compare them
  };

  return (
    <div className="dashboard">
      <div className="file-inputs">
        <input type="file" onChange={(e) => handleFileSelect(e, setFile1)} />
        <input type="file" onChange={(e) => handleFileSelect(e, setFile2)} />
        <button onClick={handleCompareClick}>Compare</button>
      </div>
      <div className="data-grid">
        {/* Placeholder for Data Grid of file 1 */}
        <div className="data-grid-view">Please compare two files to populate grid...</div>
      </div>
      <div className="data-grid">
        {/* Placeholder for Data Grid of file 2 */}
        <div className="data-grid-view">Please compare two files to populate grid...</div>
      </div>
    </div>
  );
};

export default Dashboard;

