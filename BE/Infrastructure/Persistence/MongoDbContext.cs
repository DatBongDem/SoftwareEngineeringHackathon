using Domain.Entities;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Infrastructure.Persistence
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            _database = client.GetDatabase(settings.Value.DatabaseName);
        }

        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
        public IMongoCollection<HackathonEvent> Events => _database.GetCollection<HackathonEvent>("Events");
        public IMongoCollection<Track> Tracks => _database.GetCollection<Track>("Tracks");
        public IMongoCollection<Round> Rounds => _database.GetCollection<Round>("Rounds");
        public IMongoCollection<Criteria> Criteria => _database.GetCollection<Criteria>("Criteria");
        public IMongoCollection<Team> Teams => _database.GetCollection<Team>("Teams");
        public IMongoCollection<Submission> Submissions => _database.GetCollection<Submission>("Submissions");
        public IMongoCollection<Score> Scores => _database.GetCollection<Score>("Scores");
        public IMongoCollection<AuditLog> AuditLogs => _database.GetCollection<AuditLog>("AuditLogs");
        public IMongoCollection<Prize> Prizes => _database.GetCollection<Prize>("Prizes");
        public IMongoCollection<Notification> Notifications => _database.GetCollection<Notification>("Notifications");
    }
}
