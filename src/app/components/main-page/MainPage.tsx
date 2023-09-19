import React, { useState, useMemo } from 'react';
import './MainPage.scss';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

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

    const extractUniqueSheetNames = (data: SheetData[]) => data.map(sheet => sheet.name);

    const sheetsFromBothFiles = useMemo(() => Array.from(new Set([...extractUniqueSheetNames(file1Data), ...extractUniqueSheetNames(file2Data)])), [file1Data, file2Data]);

    const WorkbookData: React.FC<{ workbookData: SheetData[] }> = ({ workbookData }) => {
        const sheet = workbookData.find(s => s.name === activeSheet);
        const activeSheetData = sheet ? sheet.data : [];

        if (!activeSheetData.length) {
            return <div className="workbook-data-placeholder">Please select a sheet to view data...</div>;
        }

        return <div className="workbook-data">{JSON.stringify(activeSheetData)}</div>;
    };

    const SheetListItem: React.FC<{ sheet: string }> = ({ sheet }) => (
        <div key={sheet} onClick={() => setActiveSheet(sheet)}>
            {sheet}
        </div>
    );

    return (
        <div className="main-page">
            <PanelGroup direction="horizontal">
                <Panel defaultSize={20} minSize={20} className="sheet-list">
                    {sheetsFromBothFiles.map(sheet => <SheetListItem key={sheet} sheet={sheet} />)}
                </Panel>
                <PanelResizeHandle />

                <Panel minSize={30} className="workbook-view">
                    <WorkbookData workbookData={file1Data} />
                </Panel>
                <PanelResizeHandle />

                <Panel minSize={30} className="workbook-view">
                    <WorkbookData workbookData={file2Data} />
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default MainPage;
