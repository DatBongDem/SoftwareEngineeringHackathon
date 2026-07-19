using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IPrizeRepository
    {
        Task CreateAsync(Prize prize);
        Task<List<Prize>> GetPrizesByEventIdAsync(string eventId);
    }
}
