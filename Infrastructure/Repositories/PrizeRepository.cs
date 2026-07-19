using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistence;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class PrizeRepository : IPrizeRepository
    {
        private readonly MongoDbContext _context;

        public PrizeRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(Prize prize)
        {
            await _context.Prizes.InsertOneAsync(prize);
        }

        public async Task<List<Prize>> GetPrizesByEventIdAsync(string eventId)
        {
            return await _context.Prizes.Find(p => p.EventId == eventId).ToListAsync();
        }
    }
}
