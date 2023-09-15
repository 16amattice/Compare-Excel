namespace CompareExcel.Models
{
    public class SheetData
    {
        public string Name { get; set; }
        public List<ExcelData> Data { get; set; } = new List<ExcelData>();
    }
}
