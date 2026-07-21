using Domain.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class TeamMemberInfo
    {
        public string UserId { get; set; } = default!;
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public bool IsAccepted { get; set; }
    }

    public class Team
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;

        public string EventId { get; set; } = default!;

        public string? TrackId { get; set; }

        public string TeamName { get; set; } = default!;

        public string LeaderUserId { get; set; } = default!;

        public List<TeamMemberInfo> Members { get; set; } = new();

        [BsonRepresentation(BsonType.String)]
        public TeamStatus Status { get; set; } = TeamStatus.Approved;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
