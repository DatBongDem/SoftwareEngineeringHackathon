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
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var notifications = await _notificationService.GetUserNotificationsAsync(userId);
            return Ok(notifications);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(string id)
        {
            var success = await _notificationService.MarkAsReadAsync(id);
            if (!success) return NotFound(new { message = "Notification not found." });
            return Ok(new { message = "Notification marked as read." });
        }

        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _notificationService.MarkAllAsReadAsync(userId);
            return Ok(new { message = "All notifications marked as read." });
        }

        [HttpPost("broadcast")]
        [Authorize(Policy = "ApprovedUser", Roles = "Coordinator")]
        public async Task<IActionResult> Broadcast([FromBody] string message)
        {
            if (string.IsNullOrWhiteSpace(message))
            {
                return BadRequest(new { message = "Message content is required." });
            }

            try
            {
                await _notificationService.BroadcastNotificationAsync(message, "System");
                return Ok(new { message = "Broadcast notification sent to all participants successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
