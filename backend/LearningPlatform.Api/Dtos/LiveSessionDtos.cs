namespace LearningPlatform.Api.Dtos;

public record LiveSessionDto(
    Guid Id,
    Guid LectureId,
    string LectureTitle,
    Guid TeacherId,
    string TeacherName,
    DateTime StartsAt,
    string Status,
    string StreamUrl,
    string RoomCode);

public record StartLiveSessionRequest(Guid LectureId);

public record JoinLiveSessionResponse(Guid SessionId, string StreamUrl, string RoomCode);
