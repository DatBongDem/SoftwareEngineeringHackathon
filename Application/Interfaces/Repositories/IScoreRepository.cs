using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IScoreRepository
    {
        Task CreateOrUpdateScoresAsync(List<Score> scores);
        Task<List<Score>> GetScoresBySubmissionIdAsync(string submissionId);
        Task<List<Score>> GetScoresByRoundIdAsync(string roundId);
        Task<List<Score>> GetScoresByJudgeAsync(string judgeUserId, string roundId);
    }
}
