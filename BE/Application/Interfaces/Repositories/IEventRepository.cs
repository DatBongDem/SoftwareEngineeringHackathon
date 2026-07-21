using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IEventRepository
    {
        Task<HackathonEvent?> GetByIdAsync(string id);
        Task<List<HackathonEvent>> GetAllAsync();
        Task CreateAsync(HackathonEvent hackathonEvent);
        Task UpdateAsync(HackathonEvent hackathonEvent);

        // Track operations
        Task<Track?> GetTrackByIdAsync(string trackId);
        Task<List<Track>> GetTracksByEventIdAsync(string eventId);
        Task CreateTrackAsync(Track track);
        Task UpdateTrackAsync(Track track);

        // Round operations
        Task<Round?> GetRoundByIdAsync(string roundId);
        Task<List<Round>> GetRoundsByEventIdAsync(string eventId);
        Task CreateRoundAsync(Round round);
        Task UpdateRoundAsync(Round round);

        // Criteria operations
        Task<Criteria?> GetCriteriaByIdAsync(string criteriaId);
        Task<List<Criteria>> GetCriteriaByEventIdAsync(string eventId);
        Task<List<Criteria>> GetDefaultCriteriaTemplatesAsync();
        Task CreateCriteriaAsync(Criteria criteria);
    }
}
