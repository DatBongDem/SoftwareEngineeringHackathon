using Application.Features.Submissions;
using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface ISubmissionService
    {
        Task<Submission> SubmitProjectAsync(string leaderUserId, CreateSubmissionDto dto);
        Task<Submission?> GetSubmissionByIdAsync(string id);
        Task<List<Submission>> GetSubmissionsByRoundIdAsync(string roundId);
        Task<List<Submission>> GetSubmissionsByEventIdAsync(string eventId);
        Task<bool> DisqualifySubmissionAsync(string submissionId, string reason);
        Task<bool> SyncGithubMetadataAsync(string submissionId);
    }
}
