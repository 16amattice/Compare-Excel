import React, { useState } from 'react';
import './MenuBar.scss'
interface Props {
  onNew: () => void;
}

const MenuBar: React.FC<Props> = ({ onNew }) => {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);

  return (
    <div className="custom-menu">
      <div 
        className="menu-item" 
        onMouseEnter={() => setIsFileMenuOpen(true)} 
        onMouseLeave={() => setIsFileMenuOpen(false)}
      >
        File
        {isFileMenuOpen && (
          <div className="sub-menu">
            <div className="sub-menu-item" onClick={onNew}>New</div>
          </div>
        )}
      </div>
      {/* Add more menu items as needed */}
    </div>
  );
};

export default MenuBar;
