using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistence;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class TeamRepository : ITeamRepository
    {
        private readonly MongoDbContext _context;

        public TeamRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<Team?> GetByIdAsync(string id)
        {
            return await _context.Teams.Find(t => t.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Team?> GetUserTeamInEventAsync(string userId, string eventId)
        {
            return await _context.Teams.Find(t => t.EventId == eventId &&
                (t.LeaderUserId == userId || t.Members.Exists(m => m.UserId == userId && m.IsAccepted)))
                .FirstOrDefaultAsync();
        }

        public async Task<List<Team>> GetTeamsByEventIdAsync(string eventId)
        {
            return await _context.Teams.Find(t => t.EventId == eventId).ToListAsync();
        }

        public async Task<List<Team>> GetTeamsByTrackIdAsync(string trackId)
        {
            return await _context.Teams.Find(t => t.TrackId == trackId).ToListAsync();
        }

        public async Task CreateAsync(Team team)
        {
            await _context.Teams.InsertOneAsync(team);
        }

        public async Task UpdateAsync(Team team)
        {
            await _context.Teams.ReplaceOneAsync(t => t.Id == team.Id, team);
        }
    }
}
