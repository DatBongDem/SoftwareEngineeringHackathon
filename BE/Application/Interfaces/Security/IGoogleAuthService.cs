using System.Threading.Tasks;

namespace Application.Interfaces.Security
{
    public class GoogleUserInfo
    {
        public string GoogleId { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? Picture { get; set; }
    }

    public interface IGoogleAuthService
    {
        Task<GoogleUserInfo?> ValidateGoogleTokenAsync(string idToken);
    }
}
