namespace LearningPlatform.Api.Dtos;

public record LectureNoteDto(Guid Id, Guid LectureId, string LectureTitle, string Title, string FileUrl, string Summary, DateTime UploadedAt);

public record CreateLectureNoteRequest(Guid LectureId, string Title, string FileUrl, string Summary);

public record TeacherOverviewResponse(
    List<SubjectDto> Subjects,
    List<LectureDto> Lectures,
    List<LiveSessionDto> LiveSessions,
    List<LectureNoteDto> Notes);
