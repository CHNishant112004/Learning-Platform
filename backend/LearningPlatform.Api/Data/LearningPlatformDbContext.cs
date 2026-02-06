using LearningPlatform.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Data;

public class LearningPlatformDbContext : DbContext
{
    public LearningPlatformDbContext(DbContextOptions<LearningPlatformDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Chapter> Chapters => Set<Chapter>();
    public DbSet<Topic> Topics => Set<Topic>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<QuizQuestion> QuizQuestions => Set<QuizQuestion>();
    public DbSet<StaffAssignment> StaffAssignments => Set<StaffAssignment>();
    public DbSet<Lecture> Lectures => Set<Lecture>();
    public DbSet<LiveSession> LiveSessions => Set<LiveSession>();
    public DbSet<LectureNote> LectureNotes => Set<LectureNote>();
    public DbSet<MembershipPlan> MembershipPlans => Set<MembershipPlan>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(user => user.Phone)
            .IsUnique();

        modelBuilder.Entity<Course>()
            .HasOne(course => course.SubjectRef)
            .WithMany(subject => subject.Courses)
            .HasForeignKey(course => course.SubjectId);

        modelBuilder.Entity<StaffAssignment>()
            .HasOne(assignment => assignment.Staff)
            .WithMany()
            .HasForeignKey(assignment => assignment.StaffId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<StaffAssignment>()
            .HasOne(assignment => assignment.AssignedBy)
            .WithMany()
            .HasForeignKey(assignment => assignment.AssignedById)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<StaffAssignment>()
            .HasOne(assignment => assignment.Subject)
            .WithMany(subject => subject.StaffAssignments)
            .HasForeignKey(assignment => assignment.SubjectId);

        modelBuilder.Entity<Lecture>()
            .HasOne(lecture => lecture.Course)
            .WithMany(course => course.Lectures)
            .HasForeignKey(lecture => lecture.CourseId);

        modelBuilder.Entity<LiveSession>()
            .HasOne(session => session.Lecture)
            .WithMany(lecture => lecture.LiveSessions)
            .HasForeignKey(session => session.LectureId);

        modelBuilder.Entity<LiveSession>()
            .HasOne(session => session.Teacher)
            .WithMany()
            .HasForeignKey(session => session.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<LectureNote>()
            .HasOne(note => note.Lecture)
            .WithMany(lecture => lecture.Notes)
            .HasForeignKey(note => note.LectureId);

        modelBuilder.Entity<LectureNote>()
            .HasOne(note => note.UploadedBy)
            .WithMany()
            .HasForeignKey(note => note.UploadedById)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Subscription>()
            .HasOne(subscription => subscription.MembershipPlan)
            .WithMany(plan => plan.Subscriptions)
            .HasForeignKey(subscription => subscription.MembershipPlanId);

        modelBuilder.Entity<Subscription>()
            .HasOne(subscription => subscription.User)
            .WithMany(user => user.Subscriptions)
            .HasForeignKey(subscription => subscription.UserId);

        modelBuilder.Entity<Notification>()
            .HasOne(notification => notification.User)
            .WithMany(user => user.Notifications)
            .HasForeignKey(notification => notification.UserId);

        base.OnModelCreating(modelBuilder);
    }
}
