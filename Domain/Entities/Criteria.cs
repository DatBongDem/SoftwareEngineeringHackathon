using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Domain.Entities
{
    public class Criteria
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;

        public string? EventId { get; set; } // Null for global templates

        public string Name { get; set; } = default!;

        public string Description { get; set; } = default!;

        public double Weight { get; set; } = 1.0;

        public double MaxScore { get; set; } = 100;

        public bool IsDefaultTemplate { get; set; }
    }
}
