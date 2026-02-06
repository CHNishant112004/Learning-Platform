namespace LearningPlatform.Api.Dtos;

public record NotebookQueryRequest(string Query, string Language, List<Guid>? NoteIds);

public record NotebookAnswerResponse(
    string SimpleAnswer,
    List<string> BulletPoints,
    string RealLifeExample,
    List<string> PracticeQuestions,
    List<string> Sources);
