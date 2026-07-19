using Application.Interfaces.Services;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;

namespace Infrastructure.Services
{
    public class CsvExportService : ICsvExportService
    {
        public byte[] ExportRankingsToCsv<T>(IEnumerable<T> data)
        {
            return ExportGenericToCsv(data);
        }

        public byte[] ExportAnonymizedRblDatasetToCsv<T>(IEnumerable<T> data)
        {
            return ExportGenericToCsv(data);
        }

        private byte[] ExportGenericToCsv<T>(IEnumerable<T> data)
        {
            var sb = new StringBuilder();
            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            // Write CSV Headers
            var header = string.Join(",", System.Linq.Enumerable.Select(properties, p => EscapeCsv(p.Name)));
            sb.AppendLine(header);

            // Write CSV Rows
            foreach (var item in data)
            {
                var rowValues = System.Linq.Enumerable.Select(properties, p =>
                {
                    var val = p.GetValue(item, null);
                    return EscapeCsv(val?.ToString() ?? "");
                });
                sb.AppendLine(string.Join(",", rowValues));
            }

            return Encoding.UTF8.GetBytes(sb.ToString());
        }

        private string EscapeCsv(string str)
        {
            if (str.Contains(",") || str.Contains("\"") || str.Contains("\n"))
            {
                return $"\"{str.Replace("\"", "\"\"")}\"";
            }
            return str;
        }
    }
}
