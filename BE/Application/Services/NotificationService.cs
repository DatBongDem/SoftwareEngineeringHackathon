using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IUserRepository _userRepository;

        public NotificationService(
            INotificationRepository notificationRepository,
            IUserRepository userRepository)
        {
            _notificationRepository = notificationRepository;
            _userRepository = userRepository;
        }

        public async Task CreateNotificationAsync(string userId, string message, string type = "System")
        {
            var notification = new Notification
            {
                UserId = userId,
                Message = message,
                Type = type,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _notificationRepository.CreateAsync(notification);
        }

        public async Task BroadcastNotificationAsync(string message, string type = "System")
        {
            var users = await _userRepository.GetAllUsersAsync();
            foreach (var user in users)
            {
                await CreateNotificationAsync(user.Id, message, type);
            }
        }

        public async Task<List<Notification>> GetUserNotificationsAsync(string userId)
        {
            return await _notificationRepository.GetByUserIdAsync(userId);
        }

        public async Task<bool> MarkAsReadAsync(string notificationId)
        {
            var notification = await _notificationRepository.GetByIdAsync(notificationId);
            if (notification == null) return false;

            notification.IsRead = true;
            await _notificationRepository.UpdateAsync(notification);
            return true;
        }

        public async Task<bool> MarkAllAsReadAsync(string userId)
        {
            await _notificationRepository.MarkAllAsReadAsync(userId);
            return true;
        }
    }
}
