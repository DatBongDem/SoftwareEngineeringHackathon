namespace Application.Features.Submissions
{
    public class CreateSubmissionDto
    {
        public string TeamId { get; set; } = default!;
        public string EventId { get; set; } = default!;
        public string RoundId { get; set; } = default!;
        public string RepoUrl { get; set; } = default!;
        public string? DemoUrl { get; set; }
        public string? ReportUrl { get; set; }
        public string? Notes { get; set; }
    }

    public class DisqualifySubmissionDto
    {
        public string Reason { get; set; } = default!;
    }
}
