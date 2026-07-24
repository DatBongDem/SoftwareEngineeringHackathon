using Application.Interfaces.Services;
using Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Application.DependencyInjection
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IEventService, EventService>();
            services.AddScoped<ITeamService, TeamService>();
            services.AddScoped<ISubmissionService, SubmissionService>();
            services.AddScoped<IScoringService, ScoringService>();
            services.AddScoped<IRankingService, RankingService>();
            services.AddScoped<INotificationService, NotificationService>();
            return services;
        }
    }
}
