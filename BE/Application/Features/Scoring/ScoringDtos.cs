using System.Collections.Generic;

namespace Application.Features.Scoring
{
    public class CriterionScoreItemDto
    {
        public string CriterionId { get; set; } = default!;
        public double Score { get; set; }
        public string? Comment { get; set; }
    }

    public class SubmitScoreDto
    {
        public string SubmissionId { get; set; } = default!;
        public string RoundId { get; set; } = default!;
        public List<CriterionScoreItemDto> CriterionScores { get; set; } = new();
    }

    public class CriterionVarianceDto
    {
        public string CriterionId { get; set; } = default!;
        public string CriterionName { get; set; } = default!;
        public double MeanScore { get; set; }
        public double Variance { get; set; }
        public double StandardDeviation { get; set; }
        public int TotalJudges { get; set; }
    }

    public class CalibrationResultDto
    {
        public string RoundId { get; set; } = default!;
        public List<CriterionVarianceDto> CriteriaVariances { get; set; } = new();
    }
}
