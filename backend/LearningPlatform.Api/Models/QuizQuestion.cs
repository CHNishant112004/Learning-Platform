namespace LearningPlatform.Api.Models;

public class QuizQuestion
{
    public Guid Id { get; set; }
    public Guid TopicId { get; set; }
    public Topic? Topic { get; set; }
    public string Text { get; set; } = string.Empty;
    public string OptionsCsv { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
}
