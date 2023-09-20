export interface ExcelData {
    Worksheet: string;
    CellLocation: string;
    Value: string;
}

// Using 'declare global' to extend the global Window
declare global {
    interface Window {
        electronAPI: {
            openDevTools: () => void;
        }
    }
}
