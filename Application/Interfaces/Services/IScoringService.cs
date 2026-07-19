using Application.Features.Scoring;
using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface IScoringService
    {
        Task<bool> SubmitScoresAsync(string judgeUserId, SubmitScoreDto dto);
        Task<List<Score>> GetSubmissionScoresAsync(string submissionId);
        Task<CalibrationResultDto> CalculateCalibrationVarianceAsync(string roundId);
        Task<List<AuditLog>> GetAuditLogsByEventIdAsync(string eventId);
    }
}
