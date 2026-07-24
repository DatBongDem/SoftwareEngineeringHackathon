using Application.Features.Rankings;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class RankingService : IRankingService
    {
        private readonly IEventRepository _eventRepository;
        private readonly ISubmissionRepository _submissionRepository;
        private readonly IScoreRepository _scoreRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly IPrizeRepository _prizeRepository;
        private readonly INotificationRepository _notificationRepository;

        public RankingService(
            IEventRepository eventRepository,
            ISubmissionRepository submissionRepository,
            IScoreRepository scoreRepository,
            ITeamRepository teamRepository,
            IPrizeRepository prizeRepository,
            INotificationRepository notificationRepository)
        {
            _eventRepository = eventRepository;
            _submissionRepository = submissionRepository;
            _scoreRepository = scoreRepository;
            _teamRepository = teamRepository;
            _prizeRepository = prizeRepository;
            _notificationRepository = notificationRepository;
        }

        // Shared per-criterion-weighted-average scoring used by round, track,
        // and event ranking so all three stay consistent.
        private static double CalculateWeightedScore(List<Score> scores, Dictionary<string, double> criteriaDict)
        {
            if (scores.Count == 0) return 0;

            double totalWeightedScore = 0;
            double totalWeight = 0;

            var groupedByCrit = scores.GroupBy(s => s.CriterionId);
            foreach (var group in groupedByCrit)
            {
                double avgCriterionScore = group.Average(s => s.ScoreValue);
                double weight = criteriaDict.ContainsKey(group.Key) ? criteriaDict[group.Key] : 1.0;

                totalWeightedScore += avgCriterionScore * weight;
                totalWeight += weight;
            }

            return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
        }

        public async Task<List<TeamRankingDto>> CalculateRoundRankingAsync(string roundId, string? trackId = null)
        {
            var round = await _eventRepository.GetRoundByIdAsync(roundId);
            if (round == null) throw new Exception("Round not found.");

            var criteriaList = await _eventRepository.GetCriteriaByEventIdAsync(round.EventId);
            var criteriaDict = criteriaList.ToDictionary(c => c.Id, c => c.Weight);

            var submissions = await _submissionRepository.GetSubmissionsByRoundIdAsync(roundId);
            var scoresInRound = await _scoreRepository.GetScoresByRoundIdAsync(roundId);
            var teams = await _teamRepository.GetTeamsByEventIdAsync(round.EventId);
            var teamsDict = teams.ToDictionary(t => t.Id, t => t);

            if (trackId != null)
            {
                submissions = submissions
                    .Where(sub => teamsDict.TryGetValue(sub.TeamId, out var team) && team.TrackId == trackId)
                    .ToList();
            }

            var rankings = new List<TeamRankingDto>();

            foreach (var sub in submissions)
            {
                var team = teamsDict.TryGetValue(sub.TeamId, out var t) ? t : null;
                var teamName = team?.TeamName ?? "Team " + sub.TeamId;
                var isPromoted = team?.Status == TeamStatus.Promoted;

                if (sub.IsDisqualified)
                {
                    rankings.Add(new TeamRankingDto
                    {
                        TeamId = sub.TeamId,
                        TeamName = teamName,
                        TrackId = team?.TrackId,
                        SubmissionId = sub.Id,
                        FinalWeightedScore = 0,
                        IsPromoted = false,
                        IsDisqualified = true
                    });
                    continue;
                }

                var subScores = scoresInRound.Where(s => s.SubmissionId == sub.Id).ToList();
                var finalScore = CalculateWeightedScore(subScores, criteriaDict);

                rankings.Add(new TeamRankingDto
                {
                    TeamId = sub.TeamId,
                    TeamName = teamName,
                    TrackId = team?.TrackId,
                    SubmissionId = sub.Id,
                    FinalWeightedScore = Math.Round(finalScore, 2),
                    IsPromoted = isPromoted,
                    IsDisqualified = false
                });
            }

            var sortedRankings = rankings
                .OrderByDescending(r => r.FinalWeightedScore)
                .Select((r, index) =>
                {
                    r.Rank = index + 1;
                    return r;
                }).ToList();

            return sortedRankings;
        }

        // Overall event standings: each team is placed by the furthest round it
        // still has a submission in (a team that reached the Final outranks one
        // eliminated in the Preliminary regardless of score), then by that
        // round's weighted score. Matches single-elimination tournament
        // standings semantics — see docs/frontend-plan.md Module 8 for the
        // rationale (TV.docx doesn't specify an exact formula).
        public async Task<List<EventRankingEntryDto>> CalculateEventRankingAsync(string eventId)
        {
            var rounds = await _eventRepository.GetRoundsByEventIdAsync(eventId);
            var roundsDict = rounds.ToDictionary(r => r.Id, r => r);

            var tracks = await _eventRepository.GetTracksByEventIdAsync(eventId);
            var tracksDict = tracks.ToDictionary(tr => tr.Id, tr => tr.Name);

            var criteriaList = await _eventRepository.GetCriteriaByEventIdAsync(eventId);
            var criteriaDict = criteriaList.ToDictionary(c => c.Id, c => c.Weight);

            var submissions = await _submissionRepository.GetSubmissionsByEventIdAsync(eventId);
            var teams = await _teamRepository.GetTeamsByEventIdAsync(eventId);
            var teamsDict = teams.ToDictionary(t => t.Id, t => t);

            var latestSubmissionByTeam = new Dictionary<string, Submission>();
            foreach (var sub in submissions)
            {
                if (!roundsDict.TryGetValue(sub.RoundId, out var round)) continue;

                if (!latestSubmissionByTeam.TryGetValue(sub.TeamId, out var existing) ||
                    roundsDict[existing.RoundId].RoundNumber < round.RoundNumber)
                {
                    latestSubmissionByTeam[sub.TeamId] = sub;
                }
            }

            var entries = new List<EventRankingEntryDto>();
            foreach (var (teamId, sub) in latestSubmissionByTeam)
            {
                var round = roundsDict[sub.RoundId];
                var team = teamsDict.TryGetValue(teamId, out var t) ? t : null;
                var teamName = team?.TeamName ?? "Team " + teamId;
                var trackId = team?.TrackId;
                var trackName = trackId != null && tracksDict.TryGetValue(trackId, out var tn) ? tn : null;
                var isPromoted = team?.Status == TeamStatus.Promoted;

                double finalScore = 0;
                if (!sub.IsDisqualified)
                {
                    var scoresForSub = await _scoreRepository.GetScoresBySubmissionIdAsync(sub.Id);
                    finalScore = CalculateWeightedScore(scoresForSub, criteriaDict);
                }

                entries.Add(new EventRankingEntryDto
                {
                    TeamId = teamId,
                    TeamName = teamName,
                    TrackId = trackId,
                    TrackName = trackName,
                    RoundId = round.Id,
                    RoundNumber = round.RoundNumber,
                    RoundName = round.Name,
                    SubmissionId = sub.Id,
                    FinalWeightedScore = Math.Round(finalScore, 2),
                    IsPromoted = isPromoted,
                    IsDisqualified = sub.IsDisqualified
                });
            }

            var sorted = entries
                .OrderByDescending(e => e.RoundNumber)
                .ThenByDescending(e => e.FinalWeightedScore)
                .Select((e, index) =>
                {
                    e.Rank = index + 1;
                    return e;
                }).ToList();

            return sorted;
        }

        // Promotes the top PromotionRuleTopN teams *within each Track* (not
        // top-N across the whole round) — a round commonly hosts multiple
        // Tracks competing in parallel, and TV.docx specifies "top N teams per
        // Hạng mục (Track)" advance, not top N overall.
        public async Task<bool> PromoteTopTeamsAsync(string roundId)
        {
            var round = await _eventRepository.GetRoundByIdAsync(roundId);
            if (round == null) return false;

            var rankings = await CalculateRoundRankingAsync(roundId);
            var groupedByTrack = rankings.GroupBy(r => r.TrackId);

            foreach (var trackGroup in groupedByTrack)
            {
                var topTeams = trackGroup
                    .Where(r => !r.IsDisqualified)
                    .OrderByDescending(r => r.FinalWeightedScore)
                    .Take(round.PromotionRuleTopN)
                    .ToList();

                foreach (var item in topTeams)
                {
                    var team = await _teamRepository.GetByIdAsync(item.TeamId);
                    if (team != null)
                    {
                        team.Status = TeamStatus.Promoted;
                        await _teamRepository.UpdateAsync(team);
                    }
                }
            }

            return true;
        }

        public async Task<Prize> CreatePrizeAsync(string eventId, CreatePrizeDto dto)
        {
            var prize = new Prize
            {
                EventId = eventId,
                TrackId = dto.TrackId,
                Name = dto.Name,
                TeamId = dto.TeamId,
                Reward = dto.Reward
            };

            await _prizeRepository.CreateAsync(prize);

            // Send Notification to Team members
            try
            {
                var team = await _teamRepository.GetByIdAsync(dto.TeamId);
                if (team != null)
                {
                    var msg = $"Chúc mừng! Đội {team.TeamName} của bạn đã được trao giải thưởng: {dto.Name} ({dto.Reward})!";
                    await _notificationRepository.CreateAsync(new Notification
                    {
                        UserId = team.LeaderUserId,
                        Message = msg,
                        Type = "Prize",
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
                                Type = "Prize",
                                IsRead = false,
                                CreatedAt = DateTime.UtcNow
                            });
                        }
                    }
                }
            }
            catch (Exception)
            {
                // Silence notification errors
            }

            return prize;
        }

        public async Task<List<Prize>> GetPrizesByEventIdAsync(string eventId)
        {
            return await _prizeRepository.GetPrizesByEventIdAsync(eventId);
        }

        public async Task<List<AnonymizedRblItemDto>> GetAnonymizedRblDatasetAsync(string eventId)
        {
            var submissions = await _submissionRepository.GetSubmissionsByEventIdAsync(eventId);
            var criteriaList = await _eventRepository.GetCriteriaByEventIdAsync(eventId);
            var criteriaDict = criteriaList.ToDictionary(c => c.Id, c => c);

            var dataset = new List<AnonymizedRblItemDto>();

            var subIdMap = new Dictionary<string, string>();
            var judgeIdMap = new Dictionary<string, string>();
            int subCounter = 1;
            int judgeCounter = 1;

            foreach (var sub in submissions)
            {
                if (!subIdMap.ContainsKey(sub.Id))
                {
                    subIdMap[sub.Id] = $"SUB_ANON_{subCounter++:D3}";
                }

                var scores = await _scoreRepository.GetScoresBySubmissionIdAsync(sub.Id);
                foreach (var s in scores)
                {
                    if (!judgeIdMap.ContainsKey(s.JudgeUserId))
                    {
                        judgeIdMap[s.JudgeUserId] = $"JUDGE_ANON_{judgeCounter++:D3}";
                    }

                    var critName = criteriaDict.ContainsKey(s.CriterionId) ? criteriaDict[s.CriterionId].Name : "Criterion " + s.CriterionId;
                    var weight = criteriaDict.ContainsKey(s.CriterionId) ? criteriaDict[s.CriterionId].Weight : 1.0;

                    dataset.Add(new AnonymizedRblItemDto
                    {
                        SubmissionAnonId = subIdMap[sub.Id],
                        JudgeAnonId = judgeIdMap[s.JudgeUserId],
                        CriterionId = s.CriterionId,
                        CriterionName = critName,
                        Weight = weight,
                        ScoreValue = s.ScoreValue
                    });
                }
            }

            return dataset;
        }
    }
}
