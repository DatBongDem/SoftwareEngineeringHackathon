using Domain.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;

        public string FullName { get; set; } = default!;

        public string Email { get; set; } = default!;

        public string? PasswordHash { get; set; }

        public string? GoogleId { get; set; }

        public string? AvatarUrl { get; set; }

        public List<string> Roles { get; set; } = new();

        public bool IsApproved { get; set; }

        [BsonRepresentation(BsonType.String)]
        public UserType UserType { get; set; }

        public string? StudentId { get; set; }

        public string? UniversityName { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
