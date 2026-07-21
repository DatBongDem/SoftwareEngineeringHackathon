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

        public RankingService(
            IEventRepository eventRepository,
            ISubmissionRepository submissionRepository,
            IScoreRepository scoreRepository,
            ITeamRepository teamRepository,
            IPrizeRepository prizeRepository)
        {
            _eventRepository = eventRepository;
            _submissionRepository = submissionRepository;
            _scoreRepository = scoreRepository;
            _teamRepository = teamRepository;
            _prizeRepository = prizeRepository;
        }

        public async Task<List<TeamRankingDto>> CalculateRoundRankingAsync(string roundId)
        {
            var round = await _eventRepository.GetRoundByIdAsync(roundId);
            if (round == null) throw new Exception("Round not found.");

            var criteriaList = await _eventRepository.GetCriteriaByEventIdAsync(round.EventId);
            var criteriaDict = criteriaList.ToDictionary(c => c.Id, c => c.Weight);

            var submissions = await _submissionRepository.GetSubmissionsByRoundIdAsync(roundId);
            var scoresInRound = await _scoreRepository.GetScoresByRoundIdAsync(roundId);
            var teams = await _teamRepository.GetTeamsByEventIdAsync(round.EventId);
            var teamsDict = teams.ToDictionary(t => t.Id, t => t.TeamName);
            var teamStatusDict = teams.ToDictionary(t => t.Id, t => t.Status);

            var rankings = new List<TeamRankingDto>();

            foreach (var sub in submissions)
            {
                var teamName = teamsDict.ContainsKey(sub.TeamId) ? teamsDict[sub.TeamId] : "Team " + sub.TeamId;
                var isPromoted = teamStatusDict.TryGetValue(sub.TeamId, out var teamStatus) && teamStatus == TeamStatus.Promoted;
                if (sub.IsDisqualified)
                {
                    rankings.Add(new TeamRankingDto
                    {
                        TeamId = sub.TeamId,
                        TeamName = teamName,
                        SubmissionId = sub.Id,
                        FinalWeightedScore = 0,
                        IsPromoted = false,
                        IsDisqualified = true
                    });
                    continue;
                }

                var subScores = scoresInRound.Where(s => s.SubmissionId == sub.Id).ToList();
                if (subScores.Count == 0)
                {
                    rankings.Add(new TeamRankingDto
                    {
                        TeamId = sub.TeamId,
                        TeamName = teamName,
                        SubmissionId = sub.Id,
                        FinalWeightedScore = 0,
                        IsPromoted = isPromoted,
                        IsDisqualified = false
                    });
                    continue;
                }

                double totalWeightedScore = 0;
                double totalWeight = 0;

                var groupedByCrit = subScores.GroupBy(s => s.CriterionId);
                foreach (var group in groupedByCrit)
                {
                    double avgCriterionScore = group.Average(s => s.ScoreValue);
                    double weight = criteriaDict.ContainsKey(group.Key) ? criteriaDict[group.Key] : 1.0;

                    totalWeightedScore += avgCriterionScore * weight;
                    totalWeight += weight;
                }

                double finalScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

                rankings.Add(new TeamRankingDto
                {
                    TeamId = sub.TeamId,
                    TeamName = teamName,
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

        public async Task<bool> PromoteTopTeamsAsync(string roundId)
        {
            var round = await _eventRepository.GetRoundByIdAsync(roundId);
            if (round == null) return false;

            var rankings = await CalculateRoundRankingAsync(roundId);
            var topTeams = rankings.Where(r => !r.IsDisqualified).Take(round.PromotionRuleTopN).ToList();

            foreach (var item in topTeams)
            {
                var team = await _teamRepository.GetByIdAsync(item.TeamId);
                if (team != null)
                {
                    team.Status = TeamStatus.Promoted;
                    await _teamRepository.UpdateAsync(team);
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
