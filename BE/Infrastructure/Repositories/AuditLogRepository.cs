using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistence;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly MongoDbContext _context;

        public AuditLogRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task LogAsync(AuditLog log)
        {
            await _context.AuditLogs.InsertOneAsync(log);
        }

        public async Task<List<AuditLog>> GetLogsByEventIdAsync(string eventId)
        {
            return await _context.AuditLogs.Find(l => l.EventId == eventId).ToListAsync();
        }
    }
}
