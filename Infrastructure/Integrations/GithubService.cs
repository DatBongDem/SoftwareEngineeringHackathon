using Application.Interfaces.Services;
using Domain.Entities;
using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Integrations
{
    public class GithubService : IGithubService
    {
        private readonly HttpClient _httpClient;

        public GithubService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("SEAL-Hackathon-App");
        }

        public async Task<GithubRepoMetadata?> FetchMetadataAsync(string repoUrl)
        {
            if (string.IsNullOrEmpty(repoUrl) || !repoUrl.Contains("github.com"))
            {
                return null;
            }

            try
            {
                // Parse owner and repo name from URL (e.g., https://github.com/owner/repo)
                var uri = new Uri(repoUrl);
                var segments = uri.AbsolutePath.Trim('/').Split('/');
                if (segments.Length < 2) return null;

                var owner = segments[0];
                var repo = segments[1];

                var apiUrl = $"https://api.github.com/repos/{owner}/{repo}";
                var response = await _httpClient.GetAsync(apiUrl);
                if (!response.IsSuccessStatusCode) return null;

                var jsonStr = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(jsonStr);
                var root = doc.RootElement;

                var stars = root.TryGetProperty("stargazers_count", out var s) ? s.GetInt32() : 0;
                var forks = root.TryGetProperty("forks_count", out var f) ? f.GetInt32() : 0;
                var language = root.TryGetProperty("language", out var l) && l.ValueKind != JsonValueKind.Null ? l.GetString() ?? "Unknown" : "Unknown";
                var openIssues = root.TryGetProperty("open_issues_count", out var i) ? i.GetInt32() : 0;
                
                DateTime? lastCommitDate = null;
                if (root.TryGetProperty("updated_at", out var u) && u.TryGetDateTime(out var dt))
                {
                    lastCommitDate = dt;
                }

                return new GithubRepoMetadata
                {
                    Stars = stars,
                    Forks = forks,
                    PrimaryLanguage = language,
                    OpenIssues = openIssues,
                    LastCommitDate = lastCommitDate
                };
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
