using Domain.Enums;
using System.Collections.Generic;

namespace Application.Features.Auth
{
    public class GoogleLoginDto
    {
        public string IdToken { get; set; } = default!;
    }

    public class RegisterDto
    {
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
        public UserType UserType { get; set; }
        public string? StudentId { get; set; }
        public string? UniversityName { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = default!;
        public string UserId { get; set; } = default!;
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public List<string> Roles { get; set; } = new();
        public bool IsApproved { get; set; }
        public UserType UserType { get; set; }
    }

    public class CreateGuestJudgeDto
    {
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
    }

    public class UserDto
    {
        public string Id { get; set; } = default!;
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public List<string> Roles { get; set; } = new();
        public bool IsApproved { get; set; }
        public UserType UserType { get; set; }
        public string? StudentId { get; set; }
        public string? UniversityName { get; set; }
    }
}
