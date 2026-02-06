using LearningPlatform.Api.Models;
using LearningPlatform.Api.Services;

namespace LearningPlatform.Api.Data;

public static class SeedData
{
    public static void EnsureSeeded(LearningPlatformDbContext context)
    {
        if (context.Courses.Any())
        {
            return;
        }

        var passwordHasher = new PasswordHasher();

        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            Name = "Admin",
            Phone = "9000000001",
            City = "Delhi",
            PreferredLanguage = "hi",
            Role = "Admin",
            PasswordHash = passwordHasher.Hash("Admin@123")
        };

        var teacherUser = new User
        {
            Id = Guid.NewGuid(),
            Name = "Teacher",
            Phone = "9000000002",
            City = "Jaipur",
            PreferredLanguage = "hi",
            Role = "Teacher",
            PasswordHash = passwordHasher.Hash("Teacher@123")
        };

        var studentUser = new User
        {
            Id = Guid.NewGuid(),
            Name = "Student Demo",
            Phone = "9000000003",
            City = "Lucknow",
            PreferredLanguage = "hi",
            Role = "Student",
            PasswordHash = passwordHasher.Hash("Student@123")
        };

        var scienceSubject = new Subject
        {
            Id = Guid.NewGuid(),
            Name = "Science",
            Description = "आसान विज्ञान विषय",
            Language = "hi"
        };

        var mathSubject = new Subject
        {
            Id = Guid.NewGuid(),
            Name = "Mathematics",
            Description = "गणित आसान तरीके से",
            Language = "hi"
        };

        var englishSubject = new Subject
        {
            Id = Guid.NewGuid(),
            Name = "English",
            Description = "English communication basics",
            Language = "en"
        };

        var scienceTopic1 = new Topic
        {
            Id = Guid.NewGuid(),
            Title = "ऑक्सीकरण और अपचयन",
            Content = "ऑक्सीकरण मतलब किसी पदार्थ में ऑक्सीजन मिलना या इलेक्ट्रॉन का हटना। अपचयन इसका उल्टा है।",
            Completed = false
        };

        var scienceTopic2 = new Topic
        {
            Id = Guid.NewGuid(),
            Title = "दैनिक जीवन के उदाहरण",
            Content = "लोहे पर जंग लगना ऑक्सीकरण का आसान उदाहरण है।",
            Completed = false
        };

        var scienceCourse = new Course
        {
            Id = Guid.NewGuid(),
            Title = "Class 10 Science",
            Description = "आसान भाषा में विज्ञान सीखें",
            Subject = scienceSubject.Name,
            SubjectId = scienceSubject.Id,
            Chapters = new List<Chapter>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    Title = "रासायनिक अभिक्रिया",
                    Completed = false,
                    Topics = new List<Topic>
                    {
                        scienceTopic1,
                        scienceTopic2
                    }
                }
            }
        };

        var englishCourse = new Course
        {
            Id = Guid.NewGuid(),
            Title = "Basic English Grammar",
            Description = "Daily use English for real-life situations",
            Subject = englishSubject.Name,
            SubjectId = englishSubject.Id,
            Chapters = new List<Chapter>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    Title = "Tenses",
                    Completed = false,
                    Topics = new List<Topic>
                    {
                        new()
                        {
                            Id = Guid.NewGuid(),
                            Title = "Present Simple",
                            Content = "Present simple का उपयोग आदत या रोज़मर्रा की बातों के लिए होता है।",
                            Completed = false
                        }
                    }
                }
            }
        };

        var quizQuestions = new List<QuizQuestion>
        {
            new()
            {
                Id = Guid.NewGuid(),
                TopicId = scienceTopic1.Id,
                Text = "ऑक्सीकरण किसे कहते हैं?",
                OptionsCsv = "ऑक्सीजन मिलना,ऑक्सीजन हटना,पानी जमना",
                Answer = "ऑक्सीजन मिलना",
                Explanation = "ऑक्सीकरण में पदार्थ में ऑक्सीजन मिलती है या इलेक्ट्रॉन निकलते हैं।"
            }
        };

        var membershipPlans = new List<MembershipPlan>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Starter",
                Price = 0,
                BillingCycle = "Monthly",
                FeaturesCsv = "Free notes|Basic quizzes|Hindi support",
                IsActive = true
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Pro Learner",
                Price = 299,
                BillingCycle = "Monthly",
                FeaturesCsv = "Live classes|AI Notebook|Priority support",
                IsActive = true
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Family Plan",
                Price = 499,
                BillingCycle = "Monthly",
                FeaturesCsv = "Up to 4 learners|Live + Notes|AI Coach",
                IsActive = true
            }
        };

        var staffAssignment = new StaffAssignment
        {
            Id = Guid.NewGuid(),
            StaffId = teacherUser.Id,
            SubjectId = scienceSubject.Id,
            AssignedById = adminUser.Id,
            Role = "Teacher",
            AssignedAt = DateTime.UtcNow.AddDays(-3)
        };

        var lecture = new Lecture
        {
            Id = Guid.NewGuid(),
            CourseId = scienceCourse.Id,
            Title = "ऑक्सीकरण की लाइव क्लास",
            ScheduledAt = DateTime.UtcNow.AddHours(3),
            DurationMinutes = 45,
            IsLive = false
        };

        var liveSession = new LiveSession
        {
            Id = Guid.NewGuid(),
            LectureId = lecture.Id,
            TeacherId = teacherUser.Id,
            StartsAt = DateTime.UtcNow.AddHours(3),
            Status = "Scheduled",
            StreamUrl = $"https://stream.local/{lecture.Id}",
            RoomCode = "ROOM-2024"
        };

        var lectureNote = new LectureNote
        {
            Id = Guid.NewGuid(),
            LectureId = lecture.Id,
            UploadedById = teacherUser.Id,
            Title = "ऑक्सीकरण नोट्स",
            FileUrl = "https://files.local/notes/oxidation.pdf",
            Summary = "ऑक्सीकरण की परिभाषा और रोज़मर्रा के उदाहरण",
            UploadedAt = DateTime.UtcNow.AddDays(-1)
        };

        var enrollment = new Enrollment
        {
            Id = Guid.NewGuid(),
            CourseId = scienceCourse.Id,
            UserId = studentUser.Id,
            Progress = 25
        };

        var subscription = new Subscription
        {
            Id = Guid.NewGuid(),
            UserId = studentUser.Id,
            MembershipPlanId = membershipPlans[1].Id,
            Status = "Active",
            StartsAt = DateTime.UtcNow.AddDays(-10)
        };

        var notifications = new List<Notification>
        {
            new()
            {
                Id = Guid.NewGuid(),
                UserId = studentUser.Id,
                Title = "आज की लाइव क्लास",
                Message = "शाम 6 बजे ऑक्सीकरण की लाइव क्लास शुरू होगी।",
                Channel = "InApp",
                CreatedAt = DateTime.UtcNow.AddHours(-5),
                IsRead = false
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = studentUser.Id,
                Title = "नई नोट्स अपलोड",
                Message = "Teacher ने नए नोट्स साझा किए हैं।",
                Channel = "InApp",
                CreatedAt = DateTime.UtcNow.AddHours(-2),
                IsRead = false
            }
        };

        context.Users.AddRange(adminUser, teacherUser, studentUser);
        context.Subjects.AddRange(scienceSubject, mathSubject, englishSubject);
        context.Courses.AddRange(scienceCourse, englishCourse);
        context.QuizQuestions.AddRange(quizQuestions);
        context.Lectures.Add(lecture);
        context.LiveSessions.Add(liveSession);
        context.LectureNotes.Add(lectureNote);
        context.MembershipPlans.AddRange(membershipPlans);
        context.StaffAssignments.Add(staffAssignment);
        context.Enrollments.Add(enrollment);
        context.Subscriptions.Add(subscription);
        context.Notifications.AddRange(notifications);
        context.SaveChanges();
    }
}
