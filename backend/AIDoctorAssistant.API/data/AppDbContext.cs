using Microsoft.EntityFrameworkCore;
using AIDoctorAssistant.API.Models;

namespace AIDoctorAssistant.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Consultation> Consultations { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Summary> Summaries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Consultation>()
                .HasMany(c => c.Messages)
                .WithOne(m => m.Consultation)
                .HasForeignKey(m => m.ConsultationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Consultation>()
                .HasOne(c => c.Summary)
                .WithOne(s => s.Consultation)
                .HasForeignKey<Summary>(s => s.ConsultationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}