using Application.Interfaces.Repositories;
using Application.Interfaces.Security;
using Application.Interfaces.Services;
using Infrastructure.Identity;
using Infrastructure.Integrations;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<MongoDbSettings>(options =>
            {
                options.ConnectionString = configuration["MongoDbSettings:ConnectionString"] 
                    ?? "mongodb+srv://se181844nguyentiendat_db_user:Bongdemno.1@cluster0.erjjjy2.mongodb.net/?retryWrites=true&w=majority";
                options.DatabaseName = configuration["MongoDbSettings:DatabaseName"] ?? "SEALHackathonDb";
            });

            services.AddSingleton<MongoDbContext>();
            services.AddScoped<DbSeeder>();

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IEventRepository, EventRepository>();
            services.AddScoped<ITeamRepository, TeamRepository>();
            services.AddScoped<ISubmissionRepository, SubmissionRepository>();
            services.AddScoped<IScoreRepository, ScoreRepository>();
            services.AddScoped<IAuditLogRepository, AuditLogRepository>();
            services.AddScoped<IPrizeRepository, PrizeRepository>();
            
            services.AddScoped<IPasswordHasher, PasswordHasher>();
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IGoogleAuthService, GoogleAuthService>();
            services.AddScoped<ICsvExportService, CsvExportService>();
            
            services.AddHttpClient<IGithubService, GithubService>();

            return services;
        }
    }
}
