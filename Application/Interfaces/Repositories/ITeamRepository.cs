using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface ITeamRepository
    {
        Task<Team?> GetByIdAsync(string id);
        Task<Team?> GetUserTeamInEventAsync(string userId, string eventId);
        Task<List<Team>> GetTeamsByEventIdAsync(string eventId);
        Task<List<Team>> GetTeamsByTrackIdAsync(string trackId);
        Task CreateAsync(Team team);
        Task UpdateAsync(Team team);
    }
}
