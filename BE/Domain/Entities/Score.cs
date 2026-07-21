using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Domain.Entities
{
    public class Score
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;

        public string SubmissionId { get; set; } = default!;

        public string RoundId { get; set; } = default!;

        public string JudgeUserId { get; set; } = default!;

        public string CriterionId { get; set; } = default!;

        public double ScoreValue { get; set; }

        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
