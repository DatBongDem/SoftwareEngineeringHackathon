using Application.Features.Auth;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> GoogleLoginAsync(GoogleLoginDto dto);
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<bool> ApproveUserAsync(string userId);
        Task<UserDto> CreateGuestJudgeAsync(CreateGuestJudgeDto dto);
        Task<List<UserDto>> GetPendingUsersAsync();
        Task<UserDto?> GetProfileAsync(string userId);
    }
}
