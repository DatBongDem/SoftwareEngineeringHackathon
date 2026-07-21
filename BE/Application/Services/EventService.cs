using Application.Features.Events;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using System;
using System.Collections.Generic;
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
    }
}
