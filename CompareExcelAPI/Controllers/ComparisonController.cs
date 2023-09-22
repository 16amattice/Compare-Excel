using CompareExcel.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class ComparisonController : ControllerBase
{
    [HttpPost("upload")]
    public IActionResult Upload([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Invalid file.");

        var sheetsData = ReadExcel(file);

        return Ok(new { sheets = sheetsData });
    }


    private List<SheetData> ReadExcel(IFormFile file)
    {
        var sheetsData = new List<SheetData>();

        using (var stream = file.OpenReadStream())
        {
            using (var package = new ExcelPackage(stream))
            {
                foreach (var worksheet in package.Workbook.Worksheets)
                {
                    if (worksheet.Dimension == null) continue;

                    var sheetData = new SheetData { name = worksheet.Name };

                    var start = worksheet.Dimension.Start;
                    var end = worksheet.Dimension.End;

                    for (int row = start.Row; row <= end.Row; row++)
                    {
                        for (int col = start.Column; col <= end.Column; col++)
                        {
                            var value = worksheet.Cells[row, col].Text;

                            if (!string.IsNullOrWhiteSpace(value))
                            {
                                var cellAddress = worksheet.Cells[row, col].Address;
                                sheetData.data.Add(new ExcelData
                                {
                                    worksheet = worksheet.Name,
                                    cellLocation = cellAddress,
                                    value = value
                                });
                            }
                        }
                    }

                    sheetsData.Add(sheetData);
                }
            }
        }

        return sheetsData;
    }
}
