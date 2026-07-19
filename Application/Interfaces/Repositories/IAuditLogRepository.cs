using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IAuditLogRepository
    {
        Task LogAsync(AuditLog log);
        Task<List<AuditLog>> GetLogsByEventIdAsync(string eventId);
    }
}
