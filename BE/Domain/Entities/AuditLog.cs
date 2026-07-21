using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Domain.Entities
{
    public class AuditLog
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;

        public string? EventId { get; set; }

        public string Action { get; set; } = default!; // e.g. SUBMIT_SCORE, DISQUALIFY_SUBMISSION

        public string PerformedByUserId { get; set; } = default!;

        public string TargetEntityId { get; set; } = default!; // e.g. SubmissionId, TeamId

        public string Details { get; set; } = default!;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
