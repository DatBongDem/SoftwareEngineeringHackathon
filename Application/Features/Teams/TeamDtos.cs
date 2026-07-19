using Domain.Entities;
using Domain.Enums;
using System.Collections.Generic;

namespace Application.Features.Teams
{
    public class CreateTeamDto
    {
        public string EventId { get; set; } = default!;
        public string TeamName { get; set; } = default!;
        public string? TrackId { get; set; }
    }

    public class InviteMemberDto
    {
        public string EmailOrStudentId { get; set; } = default!;
    }

    public class RegisterTrackDto
    {
        public string TrackId { get; set; } = default!;
    }

    public class TeamResponseDto
    {
        public string Id { get; set; } = default!;
        public string EventId { get; set; } = default!;
        public string? TrackId { get; set; }
        public string TeamName { get; set; } = default!;
        public string LeaderUserId { get; set; } = default!;
        public List<TeamMemberInfo> Members { get; set; } = new();
        public TeamStatus Status { get; set; }
    }
}
