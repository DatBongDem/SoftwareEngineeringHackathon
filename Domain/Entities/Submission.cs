using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Domain.Entities
{
    public class GithubRepoMetadata
    {
        public int Stars { get; set; }
        public int Forks { get; set; }
        public string PrimaryLanguage { get; set; } = default!;
        public int OpenIssues { get; set; }
        public DateTime? LastCommitDate { get; set; }
    }

    public class Submission
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;

        public string TeamId { get; set; } = default!;

        public string EventId { get; set; } = default!;

        public string RoundId { get; set; } = default!;

        public string RepoUrl { get; set; } = default!;

        public string? DemoUrl { get; set; }

        public string? ReportUrl { get; set; }

        public string? Notes { get; set; }

        public bool IsDisqualified { get; set; }

        public string? DisqualificationReason { get; set; }

        public GithubRepoMetadata? GithubMetadata { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}
