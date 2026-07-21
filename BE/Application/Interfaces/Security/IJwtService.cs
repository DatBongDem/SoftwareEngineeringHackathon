using Domain.Entities;

namespace Application.Interfaces.Security
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
