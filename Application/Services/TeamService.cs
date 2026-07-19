using Application.Features.Teams;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class TeamService : ITeamService
    {
        private readonly ITeamRepository _teamRepository;
        private readonly IUserRepository _userRepository;

        public TeamService(ITeamRepository teamRepository, IUserRepository userRepository)
        {
            _teamRepository = teamRepository;
            _userRepository = userRepository;
        }

        public async Task<TeamResponseDto> CreateTeamAsync(string leaderUserId, CreateTeamDto dto)
        {
            var leader = await _userRepository.GetByIdAsync(leaderUserId);
            if (leader == null) throw new Exception("User not found.");

            // Check if leader already belongs to a team in this event
            var existingTeam = await _teamRepository.GetUserTeamInEventAsync(leaderUserId, dto.EventId);
            if (existingTeam != null)
            {
                throw new Exception("You are already part of a team in this event.");
            }

            var team = new Team
            {
                EventId = dto.EventId,
                TrackId = dto.TrackId,
                TeamName = dto.TeamName,
                LeaderUserId = leaderUserId,
                Status = TeamStatus.Approved,
                Members = new List<TeamMemberInfo>
                {
                    new TeamMemberInfo
                    {
                        UserId = leaderUserId,
                        FullName = leader.FullName,
                        Email = leader.Email,
                        IsAccepted = true
                    }
                }
            };

            await _teamRepository.CreateAsync(team);

            // Update user role to TeamLeader if not already
            if (!leader.Roles.Contains(nameof(UserRole.TeamLeader)))
            {
                leader.Roles.Add(nameof(UserRole.TeamLeader));
                await _userRepository.UpdateAsync(leader);
            }

            return MapToResponse(team);
        }

        public async Task<bool> JoinTeamRequestAsync(string teamId, string userId)
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            if (team == null) return false;

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return false;

            if (team.Members.Count >= 5)
            {
                throw new Exception("Team already reached maximum capacity of 5 members.");
            }

            if (team.Members.Any(m => m.UserId == userId))
            {
                throw new Exception("Member already exists in this team.");
            }

            team.Members.Add(new TeamMemberInfo
            {
                UserId = userId,
                FullName = user.FullName,
                Email = user.Email,
                IsAccepted = false // Needs leader acceptance
            });

            await _teamRepository.UpdateAsync(team);
            return true;
        }

        public async Task<bool> InviteMemberAsync(string teamId, string leaderUserId, InviteMemberDto dto)
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            if (team == null || team.LeaderUserId != leaderUserId) return false;

            var user = await _userRepository.GetByEmailAsync(dto.EmailOrStudentId);
            if (user == null) return false;

            if (team.Members.Count >= 5)
            {
                throw new Exception("Team already reached maximum capacity of 5 members.");
            }

            if (!team.Members.Any(m => m.UserId == user.Id))
            {
                team.Members.Add(new TeamMemberInfo
                {
                    UserId = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    IsAccepted = true // Leader invited, auto-accepted
                });
                await _teamRepository.UpdateAsync(team);
            }
            return true;
        }

        public async Task<bool> AcceptMemberAsync(string teamId, string memberUserId, bool accept)
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            if (team == null) return false;

            var member = team.Members.FirstOrDefault(m => m.UserId == memberUserId);
            if (member == null) return false;

            if (accept)
            {
                member.IsAccepted = true;
            }
            else
            {
                team.Members.Remove(member);
            }

            await _teamRepository.UpdateAsync(team);
            return true;
        }

        public async Task<bool> RegisterTrackAsync(string teamId, string leaderUserId, string trackId)
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            if (team == null || team.LeaderUserId != leaderUserId) return false;

            team.TrackId = trackId;
            await _teamRepository.UpdateAsync(team);
            return true;
        }

        public async Task<TeamResponseDto?> GetTeamByIdAsync(string teamId)
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            return team == null ? null : MapToResponse(team);
        }

        public async Task<List<TeamResponseDto>> GetTeamsByEventIdAsync(string eventId)
        {
            var teams = await _teamRepository.GetTeamsByEventIdAsync(eventId);
            return teams.Select(MapToResponse).ToList();
        }

        public async Task<List<TeamResponseDto>> GetTeamsByTrackIdAsync(string trackId)
        {
            var teams = await _teamRepository.GetTeamsByTrackIdAsync(trackId);
            return teams.Select(MapToResponse).ToList();
        }

        private TeamResponseDto MapToResponse(Team team)
        {
            return new TeamResponseDto
            {
                Id = team.Id,
                EventId = team.EventId,
                TrackId = team.TrackId,
                TeamName = team.TeamName,
                LeaderUserId = team.LeaderUserId,
                Members = team.Members,
                Status = team.Status
            };
        }
    }
}
