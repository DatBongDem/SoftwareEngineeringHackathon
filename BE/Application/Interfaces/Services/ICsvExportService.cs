using System.Collections.Generic;

namespace Application.Interfaces.Services
{
    public interface ICsvExportService
    {
        byte[] ExportRankingsToCsv<T>(IEnumerable<T> data);
        byte[] ExportAnonymizedRblDatasetToCsv<T>(IEnumerable<T> data);
    }
}
