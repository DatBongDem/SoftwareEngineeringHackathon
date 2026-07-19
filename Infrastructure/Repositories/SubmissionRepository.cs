using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistence;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class SubmissionRepository : ISubmissionRepository
    {
        private readonly MongoDbContext _context;

        public SubmissionRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<Submission?> GetByIdAsync(string id)
        {
            return await _context.Submissions.Find(s => s.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Submission?> GetTeamSubmissionInRoundAsync(string teamId, string roundId)
        {
            return await _context.Submissions.Find(s => s.TeamId == teamId && s.RoundId == roundId).FirstOrDefaultAsync();
        }

        public async Task<List<Submission>> GetSubmissionsByRoundIdAsync(string roundId)
        {
            return await _context.Submissions.Find(s => s.RoundId == roundId).ToListAsync();
        }

        public async Task<List<Submission>> GetSubmissionsByEventIdAsync(string eventId)
        {
            return await _context.Submissions.Find(s => s.EventId == eventId).ToListAsync();
        }

        public async Task CreateAsync(Submission submission)
        {
            await _context.Submissions.InsertOneAsync(submission);
        }

        public async Task UpdateAsync(Submission submission)
        {
            await _context.Submissions.ReplaceOneAsync(s => s.Id == submission.Id, submission);
        }
    }
}
