using Application.Features.Submissions;
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
    [Authorize]
    public class SubmissionsController : ControllerBase
    {
        private readonly ISubmissionService _submissionService;

        public SubmissionsController(ISubmissionService submissionService)
        {
            _submissionService = submissionService;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitProject([FromBody] CreateSubmissionDto dto)
        {
            var leaderUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(leaderUserId)) return Unauthorized();

            try
            {
                var submission = await _submissionService.SubmitProjectAsync(leaderUserId, dto);
                return Ok(submission);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubmissionById(string id)
        {
            var submission = await _submissionService.GetSubmissionByIdAsync(id);
            if (submission == null) return NotFound();
            return Ok(submission);
        }

        [HttpGet("/api/rounds/{roundId}/submissions")]
        public async Task<IActionResult> GetSubmissionsByRound(string roundId)
        {
            var submissions = await _submissionService.GetSubmissionsByRoundIdAsync(roundId);
            return Ok(submissions);
        }

        [HttpGet("/api/events/{eventId}/submissions")]
        public async Task<IActionResult> GetSubmissionsByEvent(string eventId)
        {
            var submissions = await _submissionService.GetSubmissionsByEventIdAsync(eventId);
            return Ok(submissions);
        }

        [HttpPost("{id}/disqualify")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> DisqualifySubmission(string id, [FromBody] DisqualifySubmissionDto dto)
        {
            var success = await _submissionService.DisqualifySubmissionAsync(id, dto.Reason);
            if (!success) return NotFound(new { message = "Submission not found." });
            return Ok(new { message = "Submission disqualified successfully." });
        }

        [HttpPost("{id}/sync-github")]
        public async Task<IActionResult> SyncGithub(string id)
        {
            var success = await _submissionService.SyncGithubMetadataAsync(id);
            if (!success) return BadRequest(new { message = "Failed to sync GitHub metadata. Verify repo URL." });
            return Ok(new { message = "GitHub metadata synced successfully." });
        }
    }
}
