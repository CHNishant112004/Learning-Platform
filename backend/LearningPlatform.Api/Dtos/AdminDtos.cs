namespace LearningPlatform.Api.Dtos;

public record SubjectDto(Guid Id, string Name, string Description, string Language);

public record CreateSubjectRequest(string Name, string Description, string Language);

public record StaffDto(Guid Id, string Name, string Role, string Phone);

public record StaffAssignmentDto(Guid Id, Guid StaffId, string StaffName, Guid SubjectId, string SubjectName, string Role, DateTime AssignedAt);

public record AssignStaffRequest(Guid StaffId, Guid SubjectId, string Role);

public record CreateCourseRequest(string Title, string Description, Guid SubjectId);

public record LectureDto(Guid Id, Guid CourseId, string CourseTitle, string Title, DateTime ScheduledAt, int DurationMinutes, bool IsLive);

public record CreateLectureRequest(Guid CourseId, string Title, DateTime ScheduledAt, int DurationMinutes);

public record AdminOverviewResponse(
    List<SubjectDto> Subjects,
    List<StaffDto> Staff,
    List<StaffAssignmentDto> Assignments,
    List<CourseSummaryDto> Courses,
    List<LectureDto> Lectures,
    List<MembershipPlanDto> MembershipPlans);
