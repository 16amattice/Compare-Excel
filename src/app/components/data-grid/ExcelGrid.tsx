import React from 'react';
import DataGrid from 'react-data-grid';
import { ExcelData } from '../../types';


interface ExcelGridProps {
    data: ExcelData[];
}

const ExcelGrid: React.FC<ExcelGridProps> = ({ data }) => {
    const columns = [
        { key: 'Worksheet', name: 'Worksheet' },
        { key: 'CellLocation', name: 'Cell Location' },
        { key: 'Value', name: 'Value' }
    ];

    return <DataGrid columns={columns} rows={data} />;
};

export default ExcelGrid;
