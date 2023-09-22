export interface ExcelData {
    worksheet: string;
    cellLocation: string;
    value: string;
}

declare global {
    interface Window {
        electronAPI: {
            openDevTools: () => void;
        }
    }
}
