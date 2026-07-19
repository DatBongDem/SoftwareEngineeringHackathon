using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly DbSeeder _dbSeeder;

        public SeedController(DbSeeder dbSeeder)
        {
            _dbSeeder = dbSeeder;
        }

        [HttpPost]
        public async Task<IActionResult> SeedData()
        {
            try
            {
                await _dbSeeder.SeedAsync();
                return Ok(new
                {
                    message = "Seed data completed successfully to MongoDB Atlas!",
                    sampleAccounts = new[]
                    {
                        new { Role = "Coordinator (Admin)", Email = "coordinator@fpt.edu.vn", Password = "Password123!" },
                        new { Role = "Mentor", Email = "mentor.lecturer@fpt.edu.vn", Password = "Password123!" },
                        new { Role = "Internal Judge 1", Email = "judge.internal1@fpt.edu.vn", Password = "Password123!" },
                        new { Role = "Internal Judge 2", Email = "judge.internal2@fpt.edu.vn", Password = "Password123!" },
                        new { Role = "Guest Judge", Email = "guest.judge@techcompany.com", Password = "Password123!" },
                        new { Role = "Team Leader 1", Email = "leader1@fpt.edu.vn", Password = "Password123!" },
                        new { Role = "Team Leader 2", Email = "leader2@fpt.edu.vn", Password = "Password123!" }
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
