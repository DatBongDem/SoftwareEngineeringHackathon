using Application.Features.Scoring;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "ApprovedUser")]
    public class ScoringController : ControllerBase
    {
        private readonly IScoringService _scoringService;

        public ScoringController(IScoringService scoringService)
        {
            _scoringService = scoringService;
        }

        [HttpPost("submit-scores")]
        [Authorize(Roles = "Judge,Coordinator")]
        public async Task<IActionResult> SubmitScores([FromBody] SubmitScoreDto dto)
        {
            var judgeUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(judgeUserId)) return Unauthorized();

            try
            {
                var success = await _scoringService.SubmitScoresAsync(judgeUserId, dto);
                return Ok(new { message = "Scores submitted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("submission/{submissionId}")]
        public async Task<IActionResult> GetSubmissionScores(string submissionId)
        {
            var scores = await _scoringService.GetSubmissionScoresAsync(submissionId);
            return Ok(scores);
        }

        [HttpGet("calibration/variance")]
        [Authorize(Roles = "Judge,Coordinator")]
        public async Task<IActionResult> GetCalibrationVariance([FromQuery] string roundId)
        {
            try
            {
                var result = await _scoringService.CalculateCalibrationVarianceAsync(roundId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
