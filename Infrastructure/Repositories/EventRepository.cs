using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistence;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly MongoDbContext _context;

        public EventRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<HackathonEvent?> GetByIdAsync(string id)
        {
            return await _context.Events.Find(e => e.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<HackathonEvent>> GetAllAsync()
        {
            return await _context.Events.Find(_ => true).ToListAsync();
        }

        public async Task CreateAsync(HackathonEvent hackathonEvent)
        {
            await _context.Events.InsertOneAsync(hackathonEvent);
        }

        public async Task UpdateAsync(HackathonEvent hackathonEvent)
        {
            await _context.Events.ReplaceOneAsync(e => e.Id == hackathonEvent.Id, hackathonEvent);
        }

        public async Task<Track?> GetTrackByIdAsync(string trackId)
        {
            return await _context.Tracks.Find(t => t.Id == trackId).FirstOrDefaultAsync();
        }

        public async Task<List<Track>> GetTracksByEventIdAsync(string eventId)
        {
            return await _context.Tracks.Find(t => t.EventId == eventId).ToListAsync();
        }

        public async Task CreateTrackAsync(Track track)
        {
            await _context.Tracks.InsertOneAsync(track);
        }

        public async Task UpdateTrackAsync(Track track)
        {
            await _context.Tracks.ReplaceOneAsync(t => t.Id == track.Id, track);
        }

        public async Task<Round?> GetRoundByIdAsync(string roundId)
        {
            return await _context.Rounds.Find(r => r.Id == roundId).FirstOrDefaultAsync();
        }

        public async Task<List<Round>> GetRoundsByEventIdAsync(string eventId)
        {
            return await _context.Rounds.Find(r => r.EventId == eventId).ToListAsync();
        }

        public async Task CreateRoundAsync(Round round)
        {
            await _context.Rounds.InsertOneAsync(round);
        }

        public async Task UpdateRoundAsync(Round round)
        {
            await _context.Rounds.ReplaceOneAsync(r => r.Id == round.Id, round);
        }

        public async Task<Criteria?> GetCriteriaByIdAsync(string criteriaId)
        {
            return await _context.Criteria.Find(c => c.Id == criteriaId).FirstOrDefaultAsync();
        }

        public async Task<List<Criteria>> GetCriteriaByEventIdAsync(string eventId)
        {
            return await _context.Criteria.Find(c => c.EventId == eventId).ToListAsync();
        }

        public async Task<List<Criteria>> GetDefaultCriteriaTemplatesAsync()
        {
            return await _context.Criteria.Find(c => c.IsDefaultTemplate).ToListAsync();
        }

        public async Task CreateCriteriaAsync(Criteria criteria)
        {
            await _context.Criteria.InsertOneAsync(criteria);
        }
    }
}
