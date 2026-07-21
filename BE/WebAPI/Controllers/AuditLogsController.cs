using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Coordinator")]
    public class AuditLogsController : ControllerBase
    {
        private readonly IScoringService _scoringService;

        public AuditLogsController(IScoringService scoringService)
        {
            _scoringService = scoringService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAuditLogs([FromQuery] string eventId)
        {
            var logs = await _scoringService.GetAuditLogsByEventIdAsync(eventId);
            return Ok(logs);
        }
    }
}
