using Application.Features.Scoring;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class ScoringService : IScoringService
    {
        private readonly IScoreRepository _scoreRepository;
        private readonly ISubmissionRepository _submissionRepository;
        private readonly IEventRepository _eventRepository;
        private readonly IAuditLogRepository _auditLogRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly INotificationRepository _notificationRepository;

        public ScoringService(
            IScoreRepository scoreRepository,
            ISubmissionRepository submissionRepository,
            IEventRepository eventRepository,
            IAuditLogRepository auditLogRepository,
            ITeamRepository teamRepository,
            INotificationRepository notificationRepository)
        {
            _scoreRepository = scoreRepository;
            _submissionRepository = submissionRepository;
            _eventRepository = eventRepository;
            _auditLogRepository = auditLogRepository;
            _teamRepository = teamRepository;
            _notificationRepository = notificationRepository;
        }

        public async Task<bool> SubmitScoresAsync(string judgeUserId, SubmitScoreDto dto)
        {
            var submission = await _submissionRepository.GetByIdAsync(dto.SubmissionId);
            if (submission == null) throw new Exception("Submission not found.");

            if (submission.IsDisqualified)
            {
                throw new Exception("Cannot score a disqualified submission.");
            }

            var scoresToSave = dto.CriterionScores.Select(item => new Score
            {
                SubmissionId = dto.SubmissionId,
                RoundId = dto.RoundId,
                JudgeUserId = judgeUserId,
                CriterionId = item.CriterionId,
                ScoreValue = item.Score,
                Comment = item.Comment,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            await _scoreRepository.CreateOrUpdateScoresAsync(scoresToSave);

            // Send Notification to Team Members
            try
            {
                var team = await _teamRepository.GetByIdAsync(submission.TeamId);
                if (team != null)
                {
                    var msg = $"Giám khảo đã nhập điểm số mới cho bài nộp của đội {team.TeamName}!";
                    await _notificationRepository.CreateAsync(new Notification
                    {
                        UserId = team.LeaderUserId,
                        Message = msg,
                        Type = "Scoring",
                        IsRead = false,
                        CreatedAt = DateTime.UtcNow
                    });

                    foreach (var member in team.Members)
                    {
                        if (member.IsAccepted && member.UserId != team.LeaderUserId)
                        {
                            await _notificationRepository.CreateAsync(new Notification
                            {
                                UserId = member.UserId,
                                Message = msg,
                                Type = "Scoring",
                                IsRead = false,
                                CreatedAt = DateTime.UtcNow
                            });
                        }
                    }
                }
            }
            catch (Exception)
            {
                // Silence notification error to not fail scoring operation
            }

            // Write Audit Log
            await _auditLogRepository.LogAsync(new AuditLog
            {
                EventId = submission.EventId,
                Action = "SUBMIT_SCORE",
                PerformedByUserId = judgeUserId,
                TargetEntityId = dto.SubmissionId,
                Details = $"Judge submitted scores for {scoresToSave.Count} criteria on submission {dto.SubmissionId}."
            });

            return true;
        }

        public async Task<List<Score>> GetSubmissionScoresAsync(string submissionId)
        {
            return await _scoreRepository.GetScoresBySubmissionIdAsync(submissionId);
        }

        public async Task<CalibrationResultDto> CalculateCalibrationVarianceAsync(string roundId)
        {
            var round = await _eventRepository.GetRoundByIdAsync(roundId);
            if (round == null) throw new Exception("Round not found.");

            var allScoresInRound = await _scoreRepository.GetScoresByRoundIdAsync(roundId);
            var criteriaList = await _eventRepository.GetCriteriaByEventIdAsync(round.EventId);
            var criteriaDict = criteriaList.ToDictionary(c => c.Id, c => c.Name);

            var submissions = await _submissionRepository.GetSubmissionsByRoundIdAsync(roundId);
            var targetSubmissions = submissions.Where(s => s.IsCalibration).ToList();
            if (targetSubmissions.Count == 0)
            {
                targetSubmissions = submissions; // Fallback to all if none explicitly marked
            }

            var result = new CalibrationResultDto
            {
                RoundId = roundId,
                SubmissionsVariances = new List<CalibrationSubmissionVarianceDto>()
            };

            foreach (var sub in targetSubmissions)
            {
                var team = await _teamRepository.GetByIdAsync(sub.TeamId);
                var teamName = team?.TeamName ?? "Team " + sub.TeamId;

                var subVariance = new CalibrationSubmissionVarianceDto
                {
                    SubmissionId = sub.Id,
                    TeamName = teamName,
                    CriteriaVariances = new List<CriterionVarianceDto>()
                };

                var scoresForSub = allScoresInRound.Where(s => s.SubmissionId == sub.Id).ToList();

                foreach (var critId in round.CriteriaIds)
                {
                    var critName = criteriaDict.TryGetValue(critId, out var name) ? name : "Criterion " + critId;
                    var critScores = scoresForSub.Where(s => s.CriterionId == critId).Select(s => s.ScoreValue).ToList();

                    if (critScores.Count == 0)
                    {
                        subVariance.CriteriaVariances.Add(new CriterionVarianceDto
                        {
                            CriterionId = critId,
                            CriterionName = critName,
                            MeanScore = 0,
                            Variance = 0,
                            StandardDeviation = 0,
                            TotalJudges = 0
                        });
                        continue;
                    }

                    double mean = critScores.Average();
                    double sumOfSquares = critScores.Sum(s => Math.Pow(s - mean, 2));
                    double variance = critScores.Count > 1 ? sumOfSquares / (critScores.Count - 1) : 0;
                    double stdDev = Math.Sqrt(variance);

                    subVariance.CriteriaVariances.Add(new CriterionVarianceDto
                    {
                        CriterionId = critId,
                        CriterionName = critName,
                        MeanScore = Math.Round(mean, 2),
                        Variance = Math.Round(variance, 2),
                        StandardDeviation = Math.Round(stdDev, 2),
                        TotalJudges = critScores.Count
                    });
                }

                result.SubmissionsVariances.Add(subVariance);
            }

            return result;
        }

        public async Task<List<AuditLog>> GetAuditLogsByEventIdAsync(string eventId)
        {
            return await _auditLogRepository.GetLogsByEventIdAsync(eventId);
        }
    }
}
