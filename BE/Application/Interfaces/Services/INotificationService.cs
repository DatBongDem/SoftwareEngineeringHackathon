using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(string userId, string message, string type = "System");
        Task BroadcastNotificationAsync(string message, string type = "System");
        Task<List<Notification>> GetUserNotificationsAsync(string userId);
        Task<bool> MarkAsReadAsync(string notificationId);
        Task<bool> MarkAllAsReadAsync(string userId);
    }
}
