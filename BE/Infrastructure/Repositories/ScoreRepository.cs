using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistence;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class ScoreRepository : IScoreRepository
    {
        private readonly MongoDbContext _context;

        public ScoreRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task CreateOrUpdateScoresAsync(List<Score> scores)
        {
            foreach (var score in scores)
            {
                var filter = Builders<Score>.Filter.Where(s =>
                    s.SubmissionId == score.SubmissionId &&
                    s.JudgeUserId == score.JudgeUserId &&
                    s.CriterionId == score.CriterionId);

                await _context.Scores.ReplaceOneAsync(filter, score, new ReplaceOptions { IsUpsert = true });
            }
        }

        public async Task<List<Score>> GetScoresBySubmissionIdAsync(string submissionId)
        {
            return await _context.Scores.Find(s => s.SubmissionId == submissionId).ToListAsync();
        }

        public async Task<List<Score>> GetScoresByRoundIdAsync(string roundId)
        {
            return await _context.Scores.Find(s => s.RoundId == roundId).ToListAsync();
        }

        public async Task<List<Score>> GetScoresByJudgeAsync(string judgeUserId, string roundId)
        {
            return await _context.Scores.Find(s => s.JudgeUserId == judgeUserId && s.RoundId == roundId).ToListAsync();
        }
    }
}
