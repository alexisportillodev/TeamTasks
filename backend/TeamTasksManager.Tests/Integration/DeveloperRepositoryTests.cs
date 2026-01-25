using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Infrastructure.Data.Context;
using TeamTasksManager.Infrastructure.Data.Repositories;
using TeamTasksManager.Tests.Fixtures;

namespace TeamTasksManager.Tests.Integration
{
    public class DeveloperRepositoryTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly DeveloperRepository _repository;

        public DeveloperRepositoryTests()
        {
            var options = new DbContextOptionsBuilder()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _repository = new DeveloperRepository(_context);
        }

        [Fact]
        public async Task GetActiveDevelopersAsync_ReturnsOnlyActive()
        {
            // Arrange - REGLA DE NEGOCIO: Solo devolver desarrolladores activos
            _context.Developers.AddRange(
                new Developer { DeveloperId = 1, FirstName = "Active", LastName = "Dev", Email = "active@test.com", IsActive = true },
                new Developer { DeveloperId = 2, FirstName = "Inactive", LastName = "Dev", Email = "inactive@test.com", IsActive = false }
            );
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetActiveDevelopersAsync();

            // Assert
            result.Should().HaveCount(1);
            result.Should().OnlyContain(d => d.IsActive);
            result.First().FirstName.Should().Be("Active");
        }

        [Fact]
        public async Task ExistsAsync_ValidatesExistence()
        {
            // Arrange - REGLA DE NEGOCIO: Validar existencia antes de asignar tareas
            var developer = TestDataFixture.GetValidDeveloper();
            _context.Developers.Add(developer);
            await _context.SaveChangesAsync();

            // Act
            var exists = await _repository.ExistsAsync(d => d.DeveloperId == 1);
            var notExists = await _repository.ExistsAsync(d => d.DeveloperId == 999);

            // Assert
            exists.Should().BeTrue();
            notExists.Should().BeFalse();
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
