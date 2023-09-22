import React from 'react';
import DataGrid from 'react-data-grid';
import { ExcelData } from '../../types';
import 'react-data-grid/lib/styles.css';

interface ExcelGridProps {
    data: ExcelData[];
}

const ExcelGrid: React.FC<ExcelGridProps> = ({ data }) => {
    const extractColumn = (cell: string | undefined): string => {
        if (typeof cell !== 'string') {
            console.error('Unexpected cell value:', cell);
            return '';
        }
        const match = cell.match(/[A-Z]+/);
        return match ? match[0] : '';
    };

    const columnsSet = new Set(data.map(d => extractColumn(d.cellLocation)));
    const columnsArr = [...columnsSet].sort();
    const columns = columnsArr.map(col => ({ key: col, name: col }));

    const rows = [];
    const maxRowNumber = Math.max(...data.map(d => parseInt(d.cellLocation.match(/\d+/)![0])));

    for (let i = 1; i <= maxRowNumber; i++) {
        const row: { [key: string]: string } = {};
        data
            .filter(d => parseInt(d.cellLocation.match(/\d+/)![0]) === i)
            .forEach(d => {
                row[extractColumn(d.cellLocation)] = d.value;
            });
        rows.push(row);
    }

    return <DataGrid columns={columns} rows={rows} style={{ width: '100%', height: '100%' }}/>;
};

export default ExcelGrid;
