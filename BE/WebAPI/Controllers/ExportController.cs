using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Coordinator")]
    public class ExportController : ControllerBase
    {
        private readonly IRankingService _rankingService;
        private readonly ICsvExportService _csvExportService;

        public ExportController(IRankingService rankingService, ICsvExportService csvExportService)
        {
            _rankingService = rankingService;
            _csvExportService = csvExportService;
        }

        [HttpGet("rankings/csv")]
        public async Task<IActionResult> ExportRankingsCsv([FromQuery] string roundId)
        {
            var rankings = await _rankingService.CalculateRoundRankingAsync(roundId);
            var fileBytes = _csvExportService.ExportRankingsToCsv(rankings);
            return File(fileBytes, "text/csv", $"rankings_round_{roundId}.csv");
        }

        [HttpGet("rbl-dataset/csv")]
        public async Task<IActionResult> ExportAnonymizedRblDatasetCsv([FromQuery] string eventId)
        {
            var dataset = await _rankingService.GetAnonymizedRblDatasetAsync(eventId);
            var fileBytes = _csvExportService.ExportAnonymizedRblDatasetToCsv(dataset);
            return File(fileBytes, "text/csv", $"anonymized_rbl_dataset_event_{eventId}.csv");
        }
    }
}
