using Application.Features.Auth;
using Application.Interfaces.Repositories;
using Application.Interfaces.Security;
using Application.Interfaces.Services;
using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;
        private readonly IGoogleAuthService _googleAuthService;
        private readonly IPasswordHasher _passwordHasher;

        public AuthService(
            IUserRepository userRepository,
            IJwtService jwtService,
            IGoogleAuthService googleAuthService,
            IPasswordHasher passwordHasher)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _googleAuthService = googleAuthService;
            _passwordHasher = passwordHasher;
        }

        public async Task<AuthResponseDto> GoogleLoginAsync(GoogleLoginDto dto)
        {
            var googleUser = await _googleAuthService.ValidateGoogleTokenAsync(dto.IdToken);
            if (googleUser == null)
            {
                throw new Exception("Invalid Google ID Token.");
            }

            var existingUser = await _userRepository.GetByEmailAsync(googleUser.Email);
            if (existingUser == null)
            {
                // Auto-approve if email ends with @fpt.edu.vn or @fe.edu.vn
                bool isFptEmail = googleUser.Email.EndsWith("@fpt.edu.vn", StringComparison.OrdinalIgnoreCase) ||
                                 googleUser.Email.EndsWith("@fe.edu.vn", StringComparison.OrdinalIgnoreCase);

                existingUser = new User
                {
                    FullName = googleUser.Name,
                    Email = googleUser.Email,
                    GoogleId = googleUser.GoogleId,
                    AvatarUrl = googleUser.Picture,
                    IsApproved = isFptEmail, // Auto approve FPT emails or set to false for manual approval
                    UserType = isFptEmail ? UserType.FPTStudent : UserType.ExternalStudent,
                    Roles = new List<string> { nameof(UserRole.TeamMember) }
                };

                await _userRepository.CreateAsync(existingUser);
            }
            else
            {
                // Update GoogleId / Avatar if missing
                if (string.IsNullOrEmpty(existingUser.GoogleId))
                {
                    existingUser.GoogleId = googleUser.GoogleId;
                    existingUser.AvatarUrl = googleUser.Picture;
                    await _userRepository.UpdateAsync(existingUser);
                }
            }

            var token = _jwtService.GenerateToken(existingUser);
            return MapToAuthResponse(existingUser, token);
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                throw new Exception("Email is already registered.");
            }

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = _passwordHasher.Hash(dto.Password),
                UserType = dto.UserType,
                StudentId = dto.StudentId,
                UniversityName = dto.UniversityName,
                IsApproved = false, // Must be approved by Coordinator
                Roles = dto.UserType == UserType.Lecturer 
                    ? new List<string> { nameof(UserRole.Mentor), nameof(UserRole.Judge) }
                    : new List<string> { nameof(UserRole.TeamMember) }
            };

            await _userRepository.CreateAsync(user);

            var token = _jwtService.GenerateToken(user);
            return MapToAuthResponse(user, token);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null || string.IsNullOrEmpty(user.PasswordHash))
            {
                throw new Exception("Invalid email or password.");
            }

            if (!_passwordHasher.Verify(dto.Password, user.PasswordHash))
            {
                throw new Exception("Invalid email or password.");
            }

            var token = _jwtService.GenerateToken(user);
            return MapToAuthResponse(user, token);
        }

        public async Task<bool> ApproveUserAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return false;

            user.IsApproved = true;
            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<UserDto> CreateGuestJudgeAsync(CreateGuestJudgeDto dto)
        {
            var existing = await _userRepository.GetByEmailAsync(dto.Email);
            if (existing != null)
            {
                throw new Exception("Email already exists.");
            }

            var judge = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                UserType = UserType.GuestJudge,
                IsApproved = true,
                Roles = new List<string> { nameof(UserRole.Judge) }
            };

            await _userRepository.CreateAsync(judge);
            return MapToUserDto(judge);
        }

        public async Task<List<UserDto>> GetPendingUsersAsync()
        {
            var users = await _userRepository.GetPendingUsersAsync();
            return users.Select(MapToUserDto).ToList();
        }

        public async Task<UserDto?> GetProfileAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            return user == null ? null : MapToUserDto(user);
        }

        private AuthResponseDto MapToAuthResponse(User user, string token)
        {
            return new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Roles = user.Roles,
                IsApproved = user.IsApproved,
                UserType = user.UserType
            };
        }

        private UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Roles = user.Roles,
                IsApproved = user.IsApproved,
                UserType = user.UserType,
                StudentId = user.StudentId,
                UniversityName = user.UniversityName
            };
        }
    }
}
