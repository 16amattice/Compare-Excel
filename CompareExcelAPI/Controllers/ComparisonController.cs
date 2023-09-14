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

        var data = ReadExcel(file);

        // For now, return the data read from the file
        // You may want to store this data somewhere (like in memory cache) for further comparison
        return Ok(data);
    }

    private List<ExcelData> ReadExcel(IFormFile file)
    {
        var data = new List<ExcelData>();

        using (var stream = file.OpenReadStream())
        {
            using (var package = new ExcelPackage(stream))
            {
                foreach (var worksheet in package.Workbook.Worksheets)
                {
                    if (worksheet.Dimension == null) continue;

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
                                data.Add(new ExcelData
                                {
                                    Worksheet = worksheet.Name,
                                    CellLocation = cellAddress,
                                    Value = value
                                });
                            }
                        }
                    }
                }
            }
        }

        return data;
    }
}
