using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistence;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly MongoDbContext _context;

        public NotificationRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(Notification notification)
        {
            await _context.Notifications.InsertOneAsync(notification);
        }

        public async Task<Notification?> GetByIdAsync(string id)
        {
            return await _context.Notifications.Find(n => n.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<Notification>> GetByUserIdAsync(string userId)
        {
            return await _context.Notifications.Find(n => n.UserId == userId)
                .SortByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task UpdateAsync(Notification notification)
        {
            await _context.Notifications.ReplaceOneAsync(n => n.Id == notification.Id, notification);
        }

        public async Task MarkAllAsReadAsync(string userId)
        {
            var update = Builders<Notification>.Update.Set(n => n.IsRead, true);
            await _context.Notifications.UpdateManyAsync(n => n.UserId == userId && !n.IsRead, update);
        }
    }
}
