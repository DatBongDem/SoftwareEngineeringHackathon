using Application.Features.Events;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CriteriaController : ControllerBase
    {
        private readonly IEventService _eventService;

        public CriteriaController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet("templates")]
        public async Task<IActionResult> GetDefaultTemplates()
        {
            var templates = await _eventService.GetDefaultCriteriaTemplatesAsync();
            return Ok(templates);
        }

        [HttpPost("templates")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> CreateTemplate([FromBody] CreateCriteriaDto dto)
        {
            dto.IsDefaultTemplate = true;
            var criteria = await _eventService.CreateCriteriaAsync(null, dto);
            return Ok(criteria);
        }

        [HttpPost("/api/events/{eventId}/criteria")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> CreateEventCriteria(string eventId, [FromBody] CreateCriteriaDto dto)
        {
            dto.IsDefaultTemplate = false;
            var criteria = await _eventService.CreateCriteriaAsync(eventId, dto);
            return Ok(criteria);
        }

        [HttpGet("/api/events/{eventId}/criteria")]
        public async Task<IActionResult> GetEventCriteria(string eventId)
        {
            var criteriaList = await _eventService.GetCriteriaByEventIdAsync(eventId);
            return Ok(criteriaList);
        }
    }
}
