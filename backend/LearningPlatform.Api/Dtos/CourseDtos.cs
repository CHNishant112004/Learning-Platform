namespace LearningPlatform.Api.Dtos;

public record CourseSummaryDto(Guid Id, string Title, string Description, string Subject, int Progress);

public record TopicDto(Guid Id, string Title, string Content, bool Completed);

public record ChapterDto(Guid Id, string Title, bool Completed, List<TopicDto> Topics);

public record CourseDetailDto(Guid Id, string Title, string Description, string Subject, int Progress, List<ChapterDto> Chapters);
