using Application.Interfaces.Security;
using Domain.Entities;
using Domain.Enums;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Persistence
{
    public class DbSeeder
    {
        private readonly MongoDbContext _context;
        private readonly IPasswordHasher _passwordHasher;

        public DbSeeder(MongoDbContext context, IPasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task SeedAsync()
        {
            // 1. Seed Users if collection is empty
            if (await _context.Users.CountDocumentsAsync(_ => true) == 0)
            {
                var passwordHash = _passwordHasher.Hash("Password123!");

                var users = new List<User>
                {
                    // Coordinator (Admin)
                    new User
                    {
                        FullName = "Trần Văn Ban Tổ Chức",
                        Email = "coordinator@fpt.edu.vn",
                        PasswordHash = passwordHash,
                        Roles = new List<string> { nameof(UserRole.Coordinator) },
                        IsApproved = true,
                        UserType = UserType.Lecturer,
                        UniversityName = "Đại học FPT TP.HCM"
                    },
                    // Mentor
                    new User
                    {
                        FullName = "Nguyễn Văn Mentor",
                        Email = "mentor.lecturer@fpt.edu.vn",
                        PasswordHash = passwordHash,
                        Roles = new List<string> { nameof(UserRole.Mentor) },
                        IsApproved = true,
                        UserType = UserType.Lecturer,
                        UniversityName = "Đại học FPT TP.HCM"
                    },
                    // Judges
                    new User
                    {
                        FullName = "Lê Thị Giám Khảo Nội Bộ 1",
                        Email = "judge.internal1@fpt.edu.vn",
                        PasswordHash = passwordHash,
                        Roles = new List<string> { nameof(UserRole.Judge) },
                        IsApproved = true,
                        UserType = UserType.Lecturer,
                        UniversityName = "Đại học FPT TP.HCM"
                    },
                    new User
                    {
                        FullName = "Phạm Văn Giám Khảo Nội Bộ 2",
                        Email = "judge.internal2@fpt.edu.vn",
                        PasswordHash = passwordHash,
                        Roles = new List<string> { nameof(UserRole.Judge) },
                        IsApproved = true,
                        UserType = UserType.Lecturer,
                        UniversityName = "Đại học FPT TP.HCM"
                    },
                    new User
                    {
                        FullName = "Hoàng Chuyên Gia (Guest Judge)",
                        Email = "guest.judge@techcompany.com",
                        PasswordHash = passwordHash,
                        Roles = new List<string> { nameof(UserRole.Judge) },
                        IsApproved = true,
                        UserType = UserType.GuestJudge
                    },
                    // Team Leaders
                    new User
                    {
                        FullName = "Nguyễn Tiến Đạt (Leader Team 1)",
                        Email = "leader1@fpt.edu.vn",
                        PasswordHash = passwordHash,
                        Roles = new List<string> { nameof(UserRole.TeamLeader), nameof(UserRole.TeamMember) },
                        IsApproved = true,
                        UserType = UserType.FPTStudent,
                        StudentId = "SE181844",
                        UniversityName = "Đại học FPT TP.HCM"
                    },
                    new User
                    {
                        FullName = "Vũ Hoàng Nam (Leader Team 2)",
                        Email = "leader2@fpt.edu.vn",
                        PasswordHash = passwordHash,
                        Roles = new List<string> { nameof(UserRole.TeamLeader), nameof(UserRole.TeamMember) },
                        IsApproved = true,
                        UserType = UserType.FPTStudent,
                        StudentId = "SE181234",
                        UniversityName = "Đại học FPT TP.HCM"
                    },
                    // Team Members
                    new User
                    {
                        FullName = "Đặng Văn Thành (Member 1)",
                        Email = "member1@fpt.edu.vn",
                        PasswordHash = passwordHash,
                        Roles = new List<string> { nameof(UserRole.TeamMember) },
                        IsApproved = true,
                        UserType = UserType.FPTStudent,
                        StudentId = "SE181555",
                        UniversityName = "Đại học FPT TP.HCM"
                    },
                    new User
                    {
                        FullName = "Bùi Thị Mai (Member 2)",
                        Email = "member2@fpt.edu.vn",
                        PasswordHash = passwordHash,
                        Roles = new List<string> { nameof(UserRole.TeamMember) },
                        IsApproved = true,
                        UserType = UserType.FPTStudent,
                        StudentId = "SE181666",
                        UniversityName = "Đại học FPT TP.HCM"
                    }
                };

                await _context.Users.InsertManyAsync(users);
            }

            // Fetch created Users
            var coordinatorUser = await _context.Users.Find(u => u.Email == "coordinator@fpt.edu.vn").FirstOrDefaultAsync();
            var mentorUser = await _context.Users.Find(u => u.Email == "mentor.lecturer@fpt.edu.vn").FirstOrDefaultAsync();
            var judge1 = await _context.Users.Find(u => u.Email == "judge.internal1@fpt.edu.vn").FirstOrDefaultAsync();
            var judge2 = await _context.Users.Find(u => u.Email == "judge.internal2@fpt.edu.vn").FirstOrDefaultAsync();
            var guestJudge = await _context.Users.Find(u => u.Email == "guest.judge@techcompany.com").FirstOrDefaultAsync();
            var leader1 = await _context.Users.Find(u => u.Email == "leader1@fpt.edu.vn").FirstOrDefaultAsync();
            var leader2 = await _context.Users.Find(u => u.Email == "leader2@fpt.edu.vn").FirstOrDefaultAsync();
            var member1 = await _context.Users.Find(u => u.Email == "member1@fpt.edu.vn").FirstOrDefaultAsync();
            var member2 = await _context.Users.Find(u => u.Email == "member2@fpt.edu.vn").FirstOrDefaultAsync();

            // 2. Seed Hackathon Event if empty
            if (await _context.Events.CountDocumentsAsync(_ => true) == 0)
            {
                var sealEvent = new HackathonEvent
                {
                    Title = "SEAL Fall 2026 - Software Engineering Hackathon",
                    Description = "Cuộc thi lập trình Hackathon thường niên dành cho sinh viên ngành Kỹ thuật Phần mềm và các trường đối tác.",
                    AcademicYear = "2026",
                    Term = "Fall",
                    StartDate = DateTime.UtcNow.AddDays(-5),
                    EndDate = DateTime.UtcNow.AddDays(15),
                    IsActive = true
                };

                await _context.Events.InsertOneAsync(sealEvent);
            }

            var hackathonEvent = await _context.Events.Find(_ => true).FirstOrDefaultAsync();

            // 3. Seed Tracks if empty
            if (await _context.Tracks.CountDocumentsAsync(_ => true) == 0 && hackathonEvent != null)
            {
                var tracks = new List<Track>
                {
                    new Track
                    {
                        EventId = hackathonEvent.Id,
                        Name = "AI & Machine Learning",
                        Description = "Hạng mục ứng dụng Trí tuệ nhân tạo và Học máy giải quyết bài toán thực tế.",
                        MaxTeams = 20,
                        MentorUserIds = mentorUser != null ? new List<string> { mentorUser.Id } : new List<string>()
                    },
                    new Track
                    {
                        EventId = hackathonEvent.Id,
                        Name = "Web & Mobile Applications",
                        Description = "Hạng mục xây dựng giải pháp Web/Mobile đột phá cho doanh nghiệp.",
                        MaxTeams = 20,
                        MentorUserIds = mentorUser != null ? new List<string> { mentorUser.Id } : new List<string>()
                    }
                };

                await _context.Tracks.InsertManyAsync(tracks);
            }

            var aiTrack = await _context.Tracks.Find(t => t.Name.Contains("AI")).FirstOrDefaultAsync();
            var webTrack = await _context.Tracks.Find(t => t.Name.Contains("Web")).FirstOrDefaultAsync();

            // 4. Seed Criteria Templates & Event Criteria if empty
            if (await _context.Criteria.CountDocumentsAsync(_ => true) == 0 && hackathonEvent != null)
            {
                var criteriaList = new List<Criteria>
                {
                    new Criteria
                    {
                        EventId = hackathonEvent.Id,
                        Name = "Tính Sáng Tạo & Đột Phá",
                        Description = "Ý tưởng mới mẻ, độc đáo và ứng dụng công nghệ hiện đại.",
                        Weight = 1.0,
                        MaxScore = 100,
                        IsDefaultTemplate = true
                    },
                    new Criteria
                    {
                        EventId = hackathonEvent.Id,
                        Name = "Kiến Trúc & Chất Lượng Mã Nguồn",
                        Description = "Mã nguồn sạch (Clean Code), áp dụng Clean Architecture, ít lỗi.",
                        Weight = 1.5,
                        MaxScore = 100,
                        IsDefaultTemplate = true
                    },
                    new Criteria
                    {
                        EventId = hackathonEvent.Id,
                        Name = "Trải Nghiệm UI/UX & Demo",
                        Description = "Giao diện thân thiện, trải nghiệm mượt mà và bản demo hoạt động ổn định.",
                        Weight = 1.0,
                        MaxScore = 100,
                        IsDefaultTemplate = true
                    },
                    new Criteria
                    {
                        EventId = hackathonEvent.Id,
                        Name = "Khả Năng Thuyết Trình & Khảo Sát Tệp Khách Hàng",
                        Description = "Báo cáo slide rõ ràng, thuyết phục ban giám khảo.",
                        Weight = 0.5,
                        MaxScore = 100,
                        IsDefaultTemplate = true
                    }
                };

                await _context.Criteria.InsertManyAsync(criteriaList);
            }

            var allCriteria = await _context.Criteria.Find(_ => true).ToListAsync();
            var criteriaIds = allCriteria.Select(c => c.Id).ToList();

            // 5. Seed Rounds if empty
            if (await _context.Rounds.CountDocumentsAsync(_ => true) == 0 && hackathonEvent != null)
            {
                var judgesList = new List<string>();
                if (judge1 != null) judgesList.Add(judge1.Id);
                if (judge2 != null) judgesList.Add(judge2.Id);
                if (guestJudge != null) judgesList.Add(guestJudge.Id);

                var rounds = new List<Round>
                {
                    new Round
                    {
                        EventId = hackathonEvent.Id,
                        RoundNumber = 1,
                        Name = "Vòng Sơ Loại (Preliminary Round)",
                        SubmissionDeadline = DateTime.UtcNow.AddDays(5),
                        PromotionRuleTopN = 5,
                        CriteriaIds = criteriaIds,
                        JudgeUserIds = judgesList
                    },
                    new Round
                    {
                        EventId = hackathonEvent.Id,
                        RoundNumber = 2,
                        Name = "Vòng Chung Kết (Final Round)",
                        SubmissionDeadline = DateTime.UtcNow.AddDays(12),
                        PromotionRuleTopN = 3,
                        CriteriaIds = criteriaIds,
                        JudgeUserIds = judgesList
                    }
                };

                await _context.Rounds.InsertManyAsync(rounds);
            }

            var round1 = await _context.Rounds.Find(r => r.RoundNumber == 1).FirstOrDefaultAsync();

            // 6. Seed Teams if empty
            if (await _context.Teams.CountDocumentsAsync(_ => true) == 0 && hackathonEvent != null && leader1 != null && leader2 != null)
            {
                var team1 = new Team
                {
                    EventId = hackathonEvent.Id,
                    TrackId = aiTrack?.Id,
                    TeamName = "CodeWarriors",
                    LeaderUserId = leader1.Id,
                    Status = TeamStatus.Approved,
                    Members = new List<TeamMemberInfo>
                    {
                        new TeamMemberInfo { UserId = leader1.Id, FullName = leader1.FullName, Email = leader1.Email, IsAccepted = true },
                        new TeamMemberInfo { UserId = member1?.Id ?? "m1", FullName = member1?.FullName ?? "Member 1", Email = member1?.Email ?? "m1@fpt.edu.vn", IsAccepted = true }
                    }
                };

                var team2 = new Team
                {
                    EventId = hackathonEvent.Id,
                    TrackId = webTrack?.Id,
                    TeamName = "InnovateX",
                    LeaderUserId = leader2.Id,
                    Status = TeamStatus.Approved,
                    Members = new List<TeamMemberInfo>
                    {
                        new TeamMemberInfo { UserId = leader2.Id, FullName = leader2.FullName, Email = leader2.Email, IsAccepted = true },
                        new TeamMemberInfo { UserId = member2?.Id ?? "m2", FullName = member2?.FullName ?? "Member 2", Email = member2?.Email ?? "m2@fpt.edu.vn", IsAccepted = true }
                    }
                };

                await _context.Teams.InsertManyAsync(new[] { team1, team2 });
            }

            var teamCodeWarriors = await _context.Teams.Find(t => t.TeamName == "CodeWarriors").FirstOrDefaultAsync();
            var teamInnovateX = await _context.Teams.Find(t => t.TeamName == "InnovateX").FirstOrDefaultAsync();

            // 7. Seed Submissions if empty
            if (await _context.Submissions.CountDocumentsAsync(_ => true) == 0 && round1 != null && teamCodeWarriors != null && teamInnovateX != null)
            {
                var sub1 = new Submission
                {
                    TeamId = teamCodeWarriors.Id,
                    EventId = hackathonEvent!.Id,
                    RoundId = round1.Id,
                    RepoUrl = "https://github.com/fpt-codewarriors/seal-ai-bot",
                    DemoUrl = "https://youtu.be/demo_codewarriors",
                    ReportUrl = "https://drive.google.com/file/d/doc_codewarriors/view",
                    Notes = "Dự án nhận diện cảm xúc khuôn mặt tích hợp AI.",
                    SubmittedAt = DateTime.UtcNow.AddHours(-10),
                    GithubMetadata = new GithubRepoMetadata
                    {
                        Stars = 15,
                        Forks = 4,
                        PrimaryLanguage = "C#",
                        OpenIssues = 1,
                        LastCommitDate = DateTime.UtcNow.AddDays(-1)
                    }
                };

                var sub2 = new Submission
                {
                    TeamId = teamInnovateX.Id,
                    EventId = hackathonEvent!.Id,
                    RoundId = round1.Id,
                    RepoUrl = "https://github.com/innovate-x/seal-web-platform",
                    DemoUrl = "https://youtu.be/demo_innovatex",
                    ReportUrl = "https://drive.google.com/file/d/doc_innovatex/view",
                    Notes = "Nền tảng quản lý sự kiện thông minh.",
                    SubmittedAt = DateTime.UtcNow.AddHours(-5),
                    GithubMetadata = new GithubRepoMetadata
                    {
                        Stars = 9,
                        Forks = 2,
                        PrimaryLanguage = "TypeScript",
                        OpenIssues = 0,
                        LastCommitDate = DateTime.UtcNow.AddHours(-3)
                    }
                };

                await _context.Submissions.InsertManyAsync(new[] { sub1, sub2 });
            }

            var sub1Record = await _context.Submissions.Find(s => s.RepoUrl.Contains("codewarriors")).FirstOrDefaultAsync();
            var sub2Record = await _context.Submissions.Find(s => s.RepoUrl.Contains("innovate-x")).FirstOrDefaultAsync();

            // 8. Seed Sample Scores if empty
            if (await _context.Scores.CountDocumentsAsync(_ => true) == 0 && round1 != null && sub1Record != null && sub2Record != null && judge1 != null && judge2 != null)
            {
                var scores = new List<Score>();

                foreach (var crit in allCriteria)
                {
                    // Judge 1 scores
                    scores.Add(new Score
                    {
                        SubmissionId = sub1Record.Id,
                        RoundId = round1.Id,
                        JudgeUserId = judge1.Id,
                        CriterionId = crit.Id,
                        ScoreValue = 88.5,
                        Comment = "Ý tưởng tốt, mã nguồn khá sạch."
                    });

                    scores.Add(new Score
                    {
                        SubmissionId = sub2Record.Id,
                        RoundId = round1.Id,
                        JudgeUserId = judge1.Id,
                        CriterionId = crit.Id,
                        ScoreValue = 82.0,
                        Comment = "Giao diện mượt."
                    });

                    // Judge 2 scores
                    scores.Add(new Score
                    {
                        SubmissionId = sub1Record.Id,
                        RoundId = round1.Id,
                        JudgeUserId = judge2.Id,
                        CriterionId = crit.Id,
                        ScoreValue = 92.0,
                        Comment = "Rất ấn tượng với AI model."
                    });

                    scores.Add(new Score
                    {
                        SubmissionId = sub2Record.Id,
                        RoundId = round1.Id,
                        JudgeUserId = judge2.Id,
                        CriterionId = crit.Id,
                        ScoreValue = 85.5,
                        Comment = "Thuyết trình tự tin."
                    });
                }

                await _context.Scores.InsertManyAsync(scores);
            }
        }
    }
}
