using Application.Features.Rankings;
using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface IRankingService
    {
        Task<List<TeamRankingDto>> CalculateRoundRankingAsync(string roundId);
        Task<bool> PromoteTopTeamsAsync(string roundId);
        Task<Prize> CreatePrizeAsync(string eventId, CreatePrizeDto dto);
        Task<List<Prize>> GetPrizesByEventIdAsync(string eventId);
        Task<List<AnonymizedRblItemDto>> GetAnonymizedRblDatasetAsync(string eventId);
    }
}
