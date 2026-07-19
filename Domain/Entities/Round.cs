using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class Round
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;

        public string EventId { get; set; } = default!;

        public int RoundNumber { get; set; }

        public string Name { get; set; } = default!;

        public DateTime SubmissionDeadline { get; set; }

        public int PromotionRuleTopN { get; set; } = 10;

        public List<string> CriteriaIds { get; set; } = new();

        public List<string> JudgeUserIds { get; set; } = new();
    }
}
