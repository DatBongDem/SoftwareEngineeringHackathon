using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Auth.Register
{
    public class RegisterRequest
    {
        public string FullName { get; set; } = default!;

        public string Email { get; set; } = default!;

        public string Password { get; set; } = default!;

        public UserType UserType { get; set; }

        public string? StudentCode { get; set; }

        public string? University { get; set; }
    }
}
