using Application.Features.Events;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;

        public EventService(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<HackathonEvent> CreateEventAsync(CreateEventDto dto)
        {
            var hackathonEvent = new HackathonEvent
            {
                Title = dto.Title,
                Description = dto.Description,
                AcademicYear = dto.AcademicYear,
                Term = dto.Term,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                IsActive = true
            };

            await _eventRepository.CreateAsync(hackathonEvent);
            return hackathonEvent;
        }

        public async Task<List<HackathonEvent>> GetAllEventsAsync()
        {
            return await _eventRepository.GetAllAsync();
        }

        public async Task<HackathonEvent?> GetEventByIdAsync(string id)
        {
            return await _eventRepository.GetByIdAsync(id);
        }

        public async Task<Track> CreateTrackAsync(string eventId, CreateTrackDto dto)
        {
            var track = new Track
            {
                EventId = eventId,
                Name = dto.Name,
                Description = dto.Description,
                MaxTeams = dto.MaxTeams
            };

            await _eventRepository.CreateTrackAsync(track);
            return track;
        }

        public async Task<List<Track>> GetTracksByEventIdAsync(string eventId)
        {
            return await _eventRepository.GetTracksByEventIdAsync(eventId);
        }

        public async Task<bool> AssignMentorToTrackAsync(string trackId, string mentorUserId)
        {
            var track = await _eventRepository.GetTrackByIdAsync(trackId);
            if (track == null) return false;

            if (!track.MentorUserIds.Contains(mentorUserId))
            {
                track.MentorUserIds.Add(mentorUserId);
                await _eventRepository.UpdateTrackAsync(track);
            }
            return true;
        }

        public async Task<Round> CreateRoundAsync(string eventId, CreateRoundDto dto)
        {
            var round = new Round
            {
                EventId = eventId,
                RoundNumber = dto.RoundNumber,
                Name = dto.Name,
                SubmissionDeadline = dto.SubmissionDeadline,
                PromotionRuleTopN = dto.PromotionRuleTopN,
                CriteriaIds = dto.CriteriaIds
            };

            await _eventRepository.CreateRoundAsync(round);
            return round;
        }

        public async Task<List<Round>> GetRoundsByEventIdAsync(string eventId)
        {
            return await _eventRepository.GetRoundsByEventIdAsync(eventId);
        }

        public async Task<bool> AssignJudgesToRoundAsync(string roundId, List<string> judgeUserIds)
        {
            var round = await _eventRepository.GetRoundByIdAsync(roundId);
            if (round == null) return false;

            round.JudgeUserIds = judgeUserIds;
            await _eventRepository.UpdateRoundAsync(round);
            return true;
        }

        public async Task<Criteria> CreateCriteriaAsync(string? eventId, CreateCriteriaDto dto)
        {
            var criteria = new Criteria
            {
                EventId = eventId,
                Name = dto.Name,
                Description = dto.Description,
                Weight = dto.Weight,
                MaxScore = dto.MaxScore,
                IsDefaultTemplate = dto.IsDefaultTemplate
            };

            await _eventRepository.CreateCriteriaAsync(criteria);
            return criteria;
        }

        public async Task<List<Criteria>> GetCriteriaByEventIdAsync(string eventId)
        {
            return await _eventRepository.GetCriteriaByEventIdAsync(eventId);
        }

        public async Task<List<Criteria>> GetDefaultCriteriaTemplatesAsync()
        {
            return await _eventRepository.GetDefaultCriteriaTemplatesAsync();
        }

        public async Task<List<Criteria>> InheritCriteriaTemplatesAsync(string eventId)
        {
            var templates = await _eventRepository.GetDefaultCriteriaTemplatesAsync();
            if (templates == null || templates.Count == 0)
            {
                templates = new List<Criteria>
                {
                    new Criteria { Name = "Tính Sáng Tạo & Đột Phá", Description = "Đánh giá mức độ đột phá và độc đáo của dự án", Weight = 1.0, MaxScore = 100, IsDefaultTemplate = true },
                    new Criteria { Name = "Kiến Trúc & Chất Lượng Mã Nguồn", Description = "Kiến trúc mã nguồn clean code và công nghệ áp dụng", Weight = 1.5, MaxScore = 100, IsDefaultTemplate = true },
                    new Criteria { Name = "Trải Nghiệm UI/UX & Demo", Description = "Giao diện thân thiện và demo chạy ổn định", Weight = 1.0, MaxScore = 100, IsDefaultTemplate = true },
                    new Criteria { Name = "Khả Năng Thuyết Trình & Slide", Description = "Slide chuyên nghiệp và thuyết trình thuyết phục", Weight = 0.5, MaxScore = 100, IsDefaultTemplate = true }
                };
                foreach (var t in templates)
                {
                    await _eventRepository.CreateCriteriaAsync(t);
                }
            }

            var existingCriteria = await _eventRepository.GetCriteriaByEventIdAsync(eventId);
            var existingNames = new HashSet<string>(existingCriteria.Select(c => c.Name), StringComparer.OrdinalIgnoreCase);

            var clonedList = new List<Criteria>();
            foreach (var t in templates)
            {
                if (!existingNames.Contains(t.Name))
                {
                    var cloned = new Criteria
                    {
                        EventId = eventId,
                        Name = t.Name,
                        Description = t.Description,
                        Weight = t.Weight,
                        MaxScore = t.MaxScore,
                        IsDefaultTemplate = false
                    };
                    await _eventRepository.CreateCriteriaAsync(cloned);
                    clonedList.Add(cloned);
                }
            }

            return await _eventRepository.GetCriteriaByEventIdAsync(eventId);
        }
    }
}
