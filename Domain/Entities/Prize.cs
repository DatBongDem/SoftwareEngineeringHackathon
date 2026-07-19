using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Domain.Entities
{
    public class Prize
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;

        public string EventId { get; set; } = default!;

        public string? TrackId { get; set; }

        public string Name { get; set; } = default!;

        public string TeamId { get; set; } = default!;

        public string Reward { get; set; } = default!;
    }
}
