using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface ISubmissionRepository
    {
        Task<Submission?> GetByIdAsync(string id);
        Task<Submission?> GetTeamSubmissionInRoundAsync(string teamId, string roundId);
        Task<List<Submission>> GetSubmissionsByRoundIdAsync(string roundId);
        Task<List<Submission>> GetSubmissionsByEventIdAsync(string eventId);
        Task CreateAsync(Submission submission);
        Task UpdateAsync(Submission submission);
    }
}
