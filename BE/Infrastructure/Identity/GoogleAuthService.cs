using Application.Interfaces.Security;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace Infrastructure.Identity
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly IConfiguration _configuration;

        public GoogleAuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<GoogleUserInfo?> ValidateGoogleTokenAsync(string idToken)
        {
            try
            {
                var clientId = _configuration["GoogleAuth:ClientId"];
                var settings = new GoogleJsonWebSignature.ValidationSettings();

                if (!string.IsNullOrEmpty(clientId))
                {
                    settings.Audience = new[] { clientId };
                }

                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
                if (payload == null) return null;

                return new GoogleUserInfo
                {
                    GoogleId = payload.Subject,
                    Email = payload.Email,
                    Name = payload.Name,
                    Picture = payload.Picture
                };
            }
            catch (Exception)
            {
                // Fallback for development/mocking if needed
                return null;
            }
        }
    }
}
