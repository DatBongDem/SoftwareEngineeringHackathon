using Application.Features.Rankings;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "ApprovedUser")]
    public class PrizesController : ControllerBase
    {
        private readonly IRankingService _rankingService;

        public PrizesController(IRankingService rankingService)
        {
            _rankingService = rankingService;
        }

        [HttpPost("/api/events/{eventId}/prizes")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> CreatePrize(string eventId, [FromBody] CreatePrizeDto dto)
        {
            var prize = await _rankingService.CreatePrizeAsync(eventId, dto);
            return Ok(prize);
        }

        [HttpGet("/api/events/{eventId}/prizes")]
        public async Task<IActionResult> GetPrizesByEvent(string eventId)
        {
            var prizes = await _rankingService.GetPrizesByEventIdAsync(eventId);
            return Ok(prizes);
        }
    }
}
