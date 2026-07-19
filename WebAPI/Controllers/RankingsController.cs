using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RankingsController : ControllerBase
    {
        private readonly IRankingService _rankingService;

        public RankingsController(IRankingService rankingService)
        {
            _rankingService = rankingService;
        }

        [HttpGet("round/{roundId}")]
        public async Task<IActionResult> GetRoundRanking(string roundId)
        {
            try
            {
                var ranking = await _rankingService.CalculateRoundRankingAsync(roundId);
                return Ok(ranking);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("round/{roundId}/promote")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> PromoteTopTeams(string roundId)
        {
            var success = await _rankingService.PromoteTopTeamsAsync(roundId);
            if (!success) return NotFound(new { message = "Round not found." });
            return Ok(new { message = "Top teams promoted to next round successfully." });
        }
    }
}
