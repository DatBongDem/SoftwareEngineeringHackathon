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

                // Use $set (not ReplaceOneAsync) so the update body never carries an explicit
                // `_id` field. ReplaceOneAsync sends the full document including Score.Id
                // (which is never set client-side), and the Mongo C# driver does NOT
                // auto-generate an ObjectId for a ReplaceOneAsync upsert the way it does for
                // InsertOneAsync — so every upsert-insert after the first hit
                // "E11000 duplicate key error ... _id: null". Omitting `_id` from $set lets
                // MongoDB assign it server-side on insert and leave it untouched on update.
                var update = Builders<Score>.Update
                    .Set(s => s.SubmissionId, score.SubmissionId)
                    .Set(s => s.RoundId, score.RoundId)
                    .Set(s => s.JudgeUserId, score.JudgeUserId)
                    .Set(s => s.CriterionId, score.CriterionId)
                    .Set(s => s.ScoreValue, score.ScoreValue)
                    .Set(s => s.Comment, score.Comment)
                    .Set(s => s.CreatedAt, score.CreatedAt);

                await _context.Scores.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
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
