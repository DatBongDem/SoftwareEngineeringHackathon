namespace Application.Features.Rankings
{
    public class TeamRankingDto
    {
        public int Rank { get; set; }
        public string TeamId { get; set; } = default!;
        public string TeamName { get; set; } = default!;
        public string SubmissionId { get; set; } = default!;
        public double FinalWeightedScore { get; set; }
        public bool IsPromoted { get; set; }
        public bool IsDisqualified { get; set; }
    }

    public class CreatePrizeDto
    {
        public string Name { get; set; } = default!;
        public string? TrackId { get; set; }
        public string TeamId { get; set; } = default!;
        public string Reward { get; set; } = default!;
    }

    public class AnonymizedRblItemDto
    {
        public string SubmissionAnonId { get; set; } = default!;
        public string JudgeAnonId { get; set; } = default!;
        public string CriterionId { get; set; } = default!;
        public string CriterionName { get; set; } = default!;
        public double Weight { get; set; }
        public double ScoreValue { get; set; }
    }
}
