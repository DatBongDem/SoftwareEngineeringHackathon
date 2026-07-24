using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface INotificationRepository
    {
        Task CreateAsync(Notification notification);
        Task<Notification?> GetByIdAsync(string id);
        Task<List<Notification>> GetByUserIdAsync(string userId);
        Task UpdateAsync(Notification notification);
        Task MarkAllAsReadAsync(string userId);
    }
}
