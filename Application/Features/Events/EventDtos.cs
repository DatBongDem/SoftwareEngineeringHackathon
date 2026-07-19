using System;
using System.Collections.Generic;

namespace Application.Features.Events
{
    public class CreateEventDto
    {
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public string AcademicYear { get; set; } = default!;
        public string Term { get; set; } = default!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class CreateTrackDto
    {
        public string Name { get; set; } = default!;
        public string Description { get; set; } = default!;
        public int MaxTeams { get; set; } = 20;
    }

    public class AssignMentorDto
    {
        public string MentorUserId { get; set; } = default!;
    }

    public class CreateRoundDto
    {
        public int RoundNumber { get; set; }
        public string Name { get; set; } = default!;
        public DateTime SubmissionDeadline { get; set; }
        public int PromotionRuleTopN { get; set; } = 10;
        public List<string> CriteriaIds { get; set; } = new();
    }

    public class AssignJudgesDto
    {
        public List<string> JudgeUserIds { get; set; } = new();
    }

    public class CreateCriteriaDto
    {
        public string Name { get; set; } = default!;
        public string Description { get; set; } = default!;
        public double Weight { get; set; } = 1.0;
        public double MaxScore { get; set; } = 100;
        public bool IsDefaultTemplate { get; set; }
    }
}
