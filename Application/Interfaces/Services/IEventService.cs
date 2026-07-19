using Application.Features.Events;
using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface IEventService
    {
        Task<HackathonEvent> CreateEventAsync(CreateEventDto dto);
        Task<List<HackathonEvent>> GetAllEventsAsync();
        Task<HackathonEvent?> GetEventByIdAsync(string id);

        Task<Track> CreateTrackAsync(string eventId, CreateTrackDto dto);
        Task<List<Track>> GetTracksByEventIdAsync(string eventId);
        Task<bool> AssignMentorToTrackAsync(string trackId, string mentorUserId);

        Task<Round> CreateRoundAsync(string eventId, CreateRoundDto dto);
        Task<List<Round>> GetRoundsByEventIdAsync(string eventId);
        Task<bool> AssignJudgesToRoundAsync(string roundId, List<string> judgeUserIds);

        Task<Criteria> CreateCriteriaAsync(string? eventId, CreateCriteriaDto dto);
        Task<List<Criteria>> GetCriteriaByEventIdAsync(string eventId);
        Task<List<Criteria>> GetDefaultCriteriaTemplatesAsync();
    }
}
