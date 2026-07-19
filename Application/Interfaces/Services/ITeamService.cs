using Application.Features.Teams;
using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface ITeamService
    {
        Task<TeamResponseDto> CreateTeamAsync(string leaderUserId, CreateTeamDto dto);
        Task<bool> JoinTeamRequestAsync(string teamId, string userId);
        Task<bool> InviteMemberAsync(string teamId, string leaderUserId, InviteMemberDto dto);
        Task<bool> AcceptMemberAsync(string teamId, string memberUserId, bool accept);
        Task<bool> RegisterTrackAsync(string teamId, string leaderUserId, string trackId);
        Task<TeamResponseDto?> GetTeamByIdAsync(string teamId);
        Task<List<TeamResponseDto>> GetTeamsByEventIdAsync(string eventId);
        Task<List<TeamResponseDto>> GetTeamsByTrackIdAsync(string trackId);
    }
}
