using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistence;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly MongoDbContext _context;

        public UserRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.Find(u => u.Email.ToLower() == email.ToLower()).FirstOrDefaultAsync();
        }

        public async Task<User?> GetByGoogleIdAsync(string googleId)
        {
            return await _context.Users.Find(u => u.GoogleId == googleId).FirstOrDefaultAsync();
        }

        public async Task<User?> GetByIdAsync(string id)
        {
            return await _context.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<User>> GetPendingUsersAsync()
        {
            return await _context.Users.Find(u => !u.IsApproved).ToListAsync();
        }

        public async Task CreateAsync(User user)
        {
            await _context.Users.InsertOneAsync(user);
        }

        public async Task UpdateAsync(User user)
        {
            await _context.Users.ReplaceOneAsync(u => u.Id == user.Id, user);
        }
    }
}
