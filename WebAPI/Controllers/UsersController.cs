using Application.Features.Auth;
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
    public class UsersController : ControllerBase
    {
        private readonly IAuthService _authService;

        public UsersController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var profile = await _authService.GetProfileAsync(userId);
            if (profile == null) return NotFound();

            return Ok(profile);
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> GetPendingUsers()
        {
            var pending = await _authService.GetPendingUsersAsync();
            return Ok(pending);
        }

        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> ApproveUser(string id)
        {
            var result = await _authService.ApproveUserAsync(id);
            if (!result) return NotFound(new { message = "User not found." });

            return Ok(new { message = "User account approved successfully." });
        }

        [HttpPost("guest-judge")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> CreateGuestJudge([FromBody] CreateGuestJudgeDto dto)
        {
            try
            {
                var judge = await _authService.CreateGuestJudgeAsync(dto);
                return Ok(judge);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
