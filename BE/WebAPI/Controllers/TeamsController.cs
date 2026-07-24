using Application.Features.Teams;
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
    public class TeamsController : ControllerBase
    {
        private readonly ITeamService _teamService;

        public TeamsController(ITeamService teamService)
        {
            _teamService = teamService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTeam([FromBody] CreateTeamDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var team = await _teamService.CreateTeamAsync(userId, dto);
                return Ok(team);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTeamById(string id)
        {
            var team = await _teamService.GetTeamByIdAsync(id);
            if (team == null) return NotFound();
            return Ok(team);
        }

        [HttpGet("/api/events/{eventId}/teams")]
        public async Task<IActionResult> GetTeamsByEvent(string eventId)
        {
            var teams = await _teamService.GetTeamsByEventIdAsync(eventId);
            return Ok(teams);
        }

        [HttpGet("/api/tracks/{trackId}/teams")]
        public async Task<IActionResult> GetTeamsByTrack(string trackId)
        {
            var teams = await _teamService.GetTeamsByTrackIdAsync(trackId);
            return Ok(teams);
        }

        [HttpPost("{teamId}/join-request")]
        public async Task<IActionResult> JoinTeamRequest(string teamId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var success = await _teamService.JoinTeamRequestAsync(teamId, userId);
                if (!success) return NotFound(new { message = "Team not found." });
                return Ok(new { message = "Join request submitted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{teamId}/invite")]
        public async Task<IActionResult> InviteMember(string teamId, [FromBody] InviteMemberDto dto)
        {
            var leaderUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(leaderUserId)) return Unauthorized();

            try
            {
                var success = await _teamService.InviteMemberAsync(teamId, leaderUserId, dto);
                if (!success) return BadRequest(new { message = "Failed to invite member. Verify team leader or user email." });
                return Ok(new { message = "Member invited successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{teamId}/members/{userId}/accept")]
        public async Task<IActionResult> AcceptMember(string teamId, string userId, [FromQuery] bool accept = true)
        {
            var success = await _teamService.AcceptMemberAsync(teamId, userId, accept);
            if (!success) return NotFound(new { message = "Team or member request not found." });
            return Ok(new { message = accept ? "Member accepted into team." : "Member request rejected." });
        }

        [HttpPost("{teamId}/register-track")]
        public async Task<IActionResult> RegisterTrack(string teamId, [FromBody] RegisterTrackDto dto)
        {
            var leaderUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(leaderUserId)) return Unauthorized();

            var success = await _teamService.RegisterTrackAsync(teamId, leaderUserId, dto.TrackId);
            if (!success) return BadRequest(new { message = "Failed to register track for team." });
            return Ok(new { message = "Registered track successfully." });
        }
    }
}
