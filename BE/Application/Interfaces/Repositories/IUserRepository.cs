using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByGoogleIdAsync(string googleId);
        Task<User?> GetByIdAsync(string id);
        Task<List<User>> GetPendingUsersAsync();
        Task CreateAsync(User user);
        Task UpdateAsync(User user);
        Task<List<User>> GetAllUsersAsync();
    }
}
