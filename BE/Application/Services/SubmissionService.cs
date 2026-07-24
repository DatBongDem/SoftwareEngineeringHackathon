using Application.Features.Submissions;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Services
{
    public class SubmissionService : ISubmissionService
    {
        private readonly ISubmissionRepository _submissionRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly IEventRepository _eventRepository;
        private readonly IGithubService _githubService;

        public SubmissionService(
            ISubmissionRepository submissionRepository,
            ITeamRepository teamRepository,
            IEventRepository eventRepository,
            IGithubService githubService)
        {
            _submissionRepository = submissionRepository;
            _teamRepository = teamRepository;
            _eventRepository = eventRepository;
            _githubService = githubService;
        }

        public async Task<Submission> SubmitProjectAsync(string leaderUserId, CreateSubmissionDto dto)
        {
            var team = await _teamRepository.GetByIdAsync(dto.TeamId);
            if (team == null || team.LeaderUserId != leaderUserId)
            {
                throw new Exception("Only the Team Leader can submit the project.");
            }

            var round = await _eventRepository.GetRoundByIdAsync(dto.RoundId);
            if (round == null)
            {
                throw new Exception("Round not found.");
            }

            if (round.RoundNumber > 1)
            {
                if (team.Status != Domain.Enums.TeamStatus.Promoted)
                {
                    throw new Exception("Your team has not been promoted to this round and cannot submit projects.");
                }
            }

            if (DateTime.UtcNow > round.SubmissionDeadline)
            {
                throw new Exception("Submission deadline has passed.");
            }

            // Fetch optional GitHub metadata
            var metadata = await _githubService.FetchMetadataAsync(dto.RepoUrl);

            var existingSubmission = await _submissionRepository.GetTeamSubmissionInRoundAsync(dto.TeamId, dto.RoundId);
            if (existingSubmission != null)
            {
                if (existingSubmission.IsDisqualified)
                {
                    throw new Exception("This submission has been disqualified and cannot be updated.");
                }

                // Update existing submission
                existingSubmission.RepoUrl = dto.RepoUrl;
                existingSubmission.DemoUrl = dto.DemoUrl;
                existingSubmission.ReportUrl = dto.ReportUrl;
                existingSubmission.Notes = dto.Notes;
                existingSubmission.IsCalibration = dto.IsCalibration;
                existingSubmission.GithubMetadata = metadata;
                existingSubmission.SubmittedAt = DateTime.UtcNow;

                await _submissionRepository.UpdateAsync(existingSubmission);
                return existingSubmission;
            }

            var submission = new Submission
            {
                TeamId = dto.TeamId,
                EventId = dto.EventId,
                RoundId = dto.RoundId,
                RepoUrl = dto.RepoUrl,
                DemoUrl = dto.DemoUrl,
                ReportUrl = dto.ReportUrl,
                Notes = dto.Notes,
                IsCalibration = dto.IsCalibration,
                GithubMetadata = metadata,
                SubmittedAt = DateTime.UtcNow
            };

            await _submissionRepository.CreateAsync(submission);
            return submission;
        }

        public async Task<Submission?> GetSubmissionByIdAsync(string id)
        {
            return await _submissionRepository.GetByIdAsync(id);
        }

        public async Task<List<Submission>> GetSubmissionsByRoundIdAsync(string roundId)
        {
            return await _submissionRepository.GetSubmissionsByRoundIdAsync(roundId);
        }

        public async Task<List<Submission>> GetSubmissionsByEventIdAsync(string eventId)
        {
            return await _submissionRepository.GetSubmissionsByEventIdAsync(eventId);
        }

        public async Task<bool> DisqualifySubmissionAsync(string submissionId, string reason)
        {
            var submission = await _submissionRepository.GetByIdAsync(submissionId);
            if (submission == null) return false;

            submission.IsDisqualified = true;
            submission.DisqualificationReason = reason;
            await _submissionRepository.UpdateAsync(submission);
            return true;
        }

        public async Task<bool> SyncGithubMetadataAsync(string submissionId)
        {
            var submission = await _submissionRepository.GetByIdAsync(submissionId);
            if (submission == null) return false;

            var metadata = await _githubService.FetchMetadataAsync(submission.RepoUrl);
            if (metadata == null) return false;

            submission.GithubMetadata = metadata;
            await _submissionRepository.UpdateAsync(submission);
            return true;
        }

        public async Task<bool> SetCalibrationStatusAsync(string submissionId, bool isCalibration)
        {
            var submission = await _submissionRepository.GetByIdAsync(submissionId);
            if (submission == null) return false;

            submission.IsCalibration = isCalibration;
            await _submissionRepository.UpdateAsync(submission);
            return true;
        }
    }
}
