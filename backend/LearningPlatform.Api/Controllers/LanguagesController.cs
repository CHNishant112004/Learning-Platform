using LearningPlatform.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/languages")]
public class LanguagesController : ControllerBase
{
    private readonly LearningPlatformDbContext _dbContext;

    public LanguagesController(LearningPlatformDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public IActionResult GetLanguages()
    {
        var languages = _dbContext.Subjects
            .Select(subject => subject.Language)
            .Distinct()
            .OrderBy(language => language)
            .ToList();

        return Ok(languages);
    }
}
