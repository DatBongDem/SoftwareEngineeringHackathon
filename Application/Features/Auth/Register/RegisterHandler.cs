using Application.Interfaces.Services;
using System.Threading.Tasks;

namespace Application.Features.Auth.Register
{
    public class RegisterHandler
    {
        private readonly IAuthService _authService;

        public RegisterHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<RegisterResponse> Handle(RegisterRequest request)
        {
            var res = await _authService.RegisterAsync(new RegisterDto
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = request.Password,
                UserType = request.UserType,
                StudentId = request.StudentCode,
                UniversityName = request.University
            });

            return new RegisterResponse
            {
                Message = "Registration successful. Please wait for Coordinator approval."
            };
        }
    }
}
