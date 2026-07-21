using Application.Interfaces.Services;
using System.Threading.Tasks;

namespace Application.Features.Auth.Login
{
    public class LoginHandler
    {
        private readonly IAuthService _authService;

        public LoginHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<LoginResponse> Handle(LoginRequest request)
        {
            var res = await _authService.LoginAsync(new LoginDto
            {
                Email = request.Email,
                Password = request.Password
            });

            return new LoginResponse
            {
                Token = res.Token
            };
        }
    }
}
