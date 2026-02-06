namespace LearningPlatform.Api.Dtos;

public record QuizQuestionDto(Guid Id, string Text, List<string> Options, string Answer, string Explanation);
