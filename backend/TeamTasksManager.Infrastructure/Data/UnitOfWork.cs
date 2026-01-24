using Microsoft.EntityFrameworkCore.Storage;
using TeamTasksManager.Domain.Interfaces;
using TeamTasksManager.Domain.Interfaces.Repositories;
using TeamTasksManager.Infrastructure.Data.Context;
using TeamTasksManager.Infrastructure.Data.Repositories;

namespace TeamTasksManager.Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;

        public IDeveloperRepository Developers { get; }
        public IProjectRepository Projects { get; }
        public ITaskRepository Tasks { get; }

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;

            Developers = new DeveloperRepository(_context);
            Projects = new ProjectRepository(_context);
            Tasks = new TaskRepository(_context);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            try
            {
                await SaveChangesAsync();

                if (_transaction != null)
                    await _transaction.CommitAsync();
            }
            catch
            {
                await RollbackTransactionAsync();
                throw;
            }
            finally
            {
                if (_transaction != null)
                {
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
