IF DB_ID(N'LearningPlatform') IS NULL
BEGIN
    CREATE DATABASE LearningPlatform;
END;
GO

USE LearningPlatform;
GO

IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Phone NVARCHAR(20) NOT NULL,
        PasswordHash NVARCHAR(200) NOT NULL,
        PreferredLanguage NVARCHAR(20) NOT NULL DEFAULT('hi'),
        City NVARCHAR(120) NOT NULL DEFAULT(''),
        Role NVARCHAR(50) NOT NULL DEFAULT('Student')
    );
    CREATE UNIQUE INDEX IX_Users_Phone ON dbo.Users(Phone);
END;
GO

IF OBJECT_ID(N'dbo.Subjects', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Subjects (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Description NVARCHAR(400) NOT NULL DEFAULT(''),
        Language NVARCHAR(20) NOT NULL DEFAULT('hi')
    );
END;
GO

IF OBJECT_ID(N'dbo.Courses', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Courses (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        Title NVARCHAR(200) NOT NULL,
        Description NVARCHAR(500) NOT NULL DEFAULT(''),
        Subject NVARCHAR(200) NOT NULL DEFAULT(''),
        SubjectId UNIQUEIDENTIFIER NULL,
        CONSTRAINT FK_Courses_Subjects FOREIGN KEY (SubjectId) REFERENCES dbo.Subjects(Id)
    );
END;
GO

IF OBJECT_ID(N'dbo.Chapters', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Chapters (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        CourseId UNIQUEIDENTIFIER NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Completed BIT NOT NULL DEFAULT(0),
        CONSTRAINT FK_Chapters_Courses FOREIGN KEY (CourseId) REFERENCES dbo.Courses(Id)
    );
END;
GO

IF OBJECT_ID(N'dbo.Topics', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Topics (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        ChapterId UNIQUEIDENTIFIER NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Content NVARCHAR(MAX) NOT NULL DEFAULT(''),
        Completed BIT NOT NULL DEFAULT(0),
        CONSTRAINT FK_Topics_Chapters FOREIGN KEY (ChapterId) REFERENCES dbo.Chapters(Id)
    );
END;
GO

IF OBJECT_ID(N'dbo.Enrollments', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Enrollments (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        UserId UNIQUEIDENTIFIER NOT NULL,
        CourseId UNIQUEIDENTIFIER NOT NULL,
        Progress INT NOT NULL DEFAULT(0),
        CONSTRAINT FK_Enrollments_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id),
        CONSTRAINT FK_Enrollments_Courses FOREIGN KEY (CourseId) REFERENCES dbo.Courses(Id)
    );
END;
GO

IF OBJECT_ID(N'dbo.QuizQuestions', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.QuizQuestions (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        TopicId UNIQUEIDENTIFIER NOT NULL,
        Text NVARCHAR(400) NOT NULL,
        OptionsCsv NVARCHAR(600) NOT NULL,
        Answer NVARCHAR(200) NOT NULL,
        Explanation NVARCHAR(500) NOT NULL DEFAULT(''),
        CONSTRAINT FK_QuizQuestions_Topics FOREIGN KEY (TopicId) REFERENCES dbo.Topics(Id)
    );
END;
GO

IF OBJECT_ID(N'dbo.StaffAssignments', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.StaffAssignments (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        StaffId UNIQUEIDENTIFIER NOT NULL,
        SubjectId UNIQUEIDENTIFIER NOT NULL,
        AssignedById UNIQUEIDENTIFIER NOT NULL,
        Role NVARCHAR(50) NOT NULL DEFAULT('Teacher'),
        AssignedAt DATETIME2 NOT NULL,
        CONSTRAINT FK_StaffAssignments_Staff FOREIGN KEY (StaffId) REFERENCES dbo.Users(Id),
        CONSTRAINT FK_StaffAssignments_Subjects FOREIGN KEY (SubjectId) REFERENCES dbo.Subjects(Id),
        CONSTRAINT FK_StaffAssignments_AssignedBy FOREIGN KEY (AssignedById) REFERENCES dbo.Users(Id)
    );
END;
GO

IF OBJECT_ID(N'dbo.Lectures', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Lectures (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        CourseId UNIQUEIDENTIFIER NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        ScheduledAt DATETIME2 NOT NULL,
        DurationMinutes INT NOT NULL DEFAULT(0),
        IsLive BIT NOT NULL DEFAULT(0),
        CONSTRAINT FK_Lectures_Courses FOREIGN KEY (CourseId) REFERENCES dbo.Courses(Id)
    );
END;
GO

IF OBJECT_ID(N'dbo.LiveSessions', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.LiveSessions (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        LectureId UNIQUEIDENTIFIER NOT NULL,
        TeacherId UNIQUEIDENTIFIER NOT NULL,
        StartsAt DATETIME2 NOT NULL,
        EndsAt DATETIME2 NULL,
        Status NVARCHAR(40) NOT NULL DEFAULT('Scheduled'),
        StreamUrl NVARCHAR(400) NOT NULL DEFAULT(''),
        RoomCode NVARCHAR(60) NOT NULL DEFAULT(''),
        CONSTRAINT FK_LiveSessions_Lectures FOREIGN KEY (LectureId) REFERENCES dbo.Lectures(Id),
        CONSTRAINT FK_LiveSessions_Teachers FOREIGN KEY (TeacherId) REFERENCES dbo.Users(Id)
    );
END;
GO

IF OBJECT_ID(N'dbo.LectureNotes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.LectureNotes (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        LectureId UNIQUEIDENTIFIER NOT NULL,
        UploadedById UNIQUEIDENTIFIER NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        FileUrl NVARCHAR(400) NOT NULL,
        Summary NVARCHAR(600) NOT NULL DEFAULT(''),
        UploadedAt DATETIME2 NOT NULL,
        CONSTRAINT FK_LectureNotes_Lectures FOREIGN KEY (LectureId) REFERENCES dbo.Lectures(Id),
        CONSTRAINT FK_LectureNotes_Users FOREIGN KEY (UploadedById) REFERENCES dbo.Users(Id)
    );
END;
GO

IF OBJECT_ID(N'dbo.MembershipPlans', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.MembershipPlans (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Price DECIMAL(10,2) NOT NULL DEFAULT(0),
        BillingCycle NVARCHAR(50) NOT NULL DEFAULT('Monthly'),
        FeaturesCsv NVARCHAR(800) NOT NULL DEFAULT(''),
        IsActive BIT NOT NULL DEFAULT(1)
    );
END;
GO

IF OBJECT_ID(N'dbo.Subscriptions', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Subscriptions (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        UserId UNIQUEIDENTIFIER NOT NULL,
        MembershipPlanId UNIQUEIDENTIFIER NOT NULL,
        Status NVARCHAR(50) NOT NULL DEFAULT('Active'),
        StartsAt DATETIME2 NOT NULL,
        EndsAt DATETIME2 NULL,
        CONSTRAINT FK_Subscriptions_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id),
        CONSTRAINT FK_Subscriptions_Plans FOREIGN KEY (MembershipPlanId) REFERENCES dbo.MembershipPlans(Id)
    );
END;
GO

IF OBJECT_ID(N'dbo.Notifications', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Notifications (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        UserId UNIQUEIDENTIFIER NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Message NVARCHAR(600) NOT NULL,
        IsRead BIT NOT NULL DEFAULT(0),
        Channel NVARCHAR(40) NOT NULL DEFAULT('InApp'),
        CreatedAt DATETIME2 NOT NULL,
        CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id)
    );
END;
GO
