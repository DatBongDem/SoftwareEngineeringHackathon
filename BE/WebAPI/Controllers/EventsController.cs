using Application.Features.Events;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "ApprovedUser")]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpPost]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto dto)
        {
            var result = await _eventService.CreateEventAsync(dto);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _eventService.GetAllEventsAsync();
            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEventById(string id)
        {
            var hackathonEvent = await _eventService.GetEventByIdAsync(id);
            if (hackathonEvent == null) return NotFound();
            return Ok(hackathonEvent);
        }

        [HttpPost("{eventId}/tracks")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> CreateTrack(string eventId, [FromBody] CreateTrackDto dto)
        {
            var track = await _eventService.CreateTrackAsync(eventId, dto);
            return Ok(track);
        }

        [HttpGet("{eventId}/tracks")]
        public async Task<IActionResult> GetTracksByEvent(string eventId)
        {
            var tracks = await _eventService.GetTracksByEventIdAsync(eventId);
            return Ok(tracks);
        }

        [HttpPost("/api/tracks/{trackId}/assign-mentor")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> AssignMentor(string trackId, [FromBody] AssignMentorDto dto)
        {
            var success = await _eventService.AssignMentorToTrackAsync(trackId, dto.MentorUserId);
            if (!success) return NotFound(new { message = "Track not found." });
            return Ok(new { message = "Mentor assigned to track successfully." });
        }

        [HttpPost("{eventId}/rounds")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> CreateRound(string eventId, [FromBody] CreateRoundDto dto)
        {
            var round = await _eventService.CreateRoundAsync(eventId, dto);
            return Ok(round);
        }

        [HttpGet("{eventId}/rounds")]
        public async Task<IActionResult> GetRoundsByEvent(string eventId)
        {
            var rounds = await _eventService.GetRoundsByEventIdAsync(eventId);
            return Ok(rounds);
        }

        [HttpPost("/api/rounds/{roundId}/assign-judges")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> AssignJudges(string roundId, [FromBody] AssignJudgesDto dto)
        {
            var success = await _eventService.AssignJudgesToRoundAsync(roundId, dto.JudgeUserIds);
            if (!success) return NotFound(new { message = "Round not found." });
            return Ok(new { message = "Judges assigned to round successfully." });
        }
    }
}
