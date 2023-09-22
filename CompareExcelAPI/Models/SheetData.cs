namespace CompareExcel.Models
{
    public class SheetData
    {
        public string name { get; set; } = string.Empty;
        public List<ExcelData> data { get; set; } = new List<ExcelData>();
    }
}
