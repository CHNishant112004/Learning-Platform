using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/quiz")]
[Authorize]
public class QuizController : ControllerBase
{
    private readonly LearningPlatformDbContext _dbContext;

    public QuizController(LearningPlatformDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("{topicId:guid}")]
    public IActionResult GetQuiz(Guid topicId)
    {
        var questions = _dbContext.QuizQuestions
            .Where(question => question.TopicId == topicId)
            .Select(question => new QuizQuestionDto(
                question.Id,
                question.Text,
                question.OptionsCsv.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
                question.Answer,
                question.Explanation))
            .ToList();

        return Ok(questions);
    }
}
