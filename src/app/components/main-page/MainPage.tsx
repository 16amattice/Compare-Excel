import React, { useState } from 'react';
import './MainPage.scss';


interface SheetData {
    name: string;
    data: ExcelData[];
}

interface MainPageProps {
    file1Data: SheetData[] | null;
    file2Data: SheetData[] | null;
}

interface ExcelData {
    Worksheet: string;
    CellLocation: string;
    Value: string;
}

const MainPage: React.FC<MainPageProps> = ({ file1Data = [], file2Data = [] }) => {
    const [activeSheet, setActiveSheet] = useState<string | null>(null);

    const extractUniqueSheetNames = (data: SheetData[] = []) => {
        return data.map(sheet => sheet.name);
    };

    const sheetsFromBothFiles = Array.from(new Set([...extractUniqueSheetNames(file1Data), ...extractUniqueSheetNames(file2Data)]));

    const WorkbookData: React.FC<{ workbookData: SheetData[] }> = ({ workbookData }) => {
        if (!workbookData || !activeSheet) {
            return <div className="workbook-data-placeholder">Please select a sheet to view data.</div>;
        }
    
        const sheet = workbookData.find(s => s.name === activeSheet);
        const activeSheetData = sheet ? sheet.data : [];
    
        return (
            <div className="workbook-data">
                {JSON.stringify(activeSheetData)}
            </div>
        );
    };

    return (
        <div className="main-page">
            <div className="sheet-list">
                {sheetsFromBothFiles.map((sheet: string) => (
                    <div key={sheet} onClick={() => setActiveSheet(sheet)}>
                        {sheet}
                    </div>
                ))}
            </div>
            <div className="workbook-views">
                <div className="workbook-view">
                    <WorkbookData workbookData={file1Data} />
                </div>
                <div className="workbook-view">
                    <WorkbookData workbookData={file2Data} />
                </div>
            </div>
        </div>
    );
};

export default MainPage;
