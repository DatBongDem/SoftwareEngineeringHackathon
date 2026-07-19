using Domain.Entities;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface IGithubService
    {
        Task<GithubRepoMetadata?> FetchMetadataAsync(string repoUrl);
    }
}
