using LearningPlatform.Api.Data;
using LearningPlatform.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/notebook")]
[Authorize]
public class NotebookController : ControllerBase
{
    private readonly LearningPlatformDbContext _dbContext;

    public NotebookController(LearningPlatformDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("query")]
    public IActionResult QueryNotes([FromBody] NotebookQueryRequest request)
    {
        var query = request.Query.Trim();
        var noteIds = request.NoteIds ?? new List<Guid>();

        var notesQuery = _dbContext.LectureNotes.Include(note => note.Lecture).AsQueryable();
        if (noteIds.Count > 0)
        {
            notesQuery = notesQuery.Where(note => noteIds.Contains(note.Id));
        }

        var notes = notesQuery.Take(5).ToList();
        var sources = notes
            .Select(note => $"{note.Lecture.Title} - {note.Title}")
            .ToList();

        var response = new NotebookAnswerResponse(
            $"'{query}' का सरल उत्तर आपके नोट्स के आधार पर तैयार किया गया है।",
            new List<string>
            {
                "मुख्य परिभाषा आसान भाषा में समझाई गई है।",
                "हर स्टेप के साथ छोटा उदाहरण दिया गया है।",
                "अगली कक्षा के लिए याद रखने योग्य पॉइंट्स।"
            },
            "अपने आसपास की रोज़मर्रा की चीज़ों से इस कॉन्सेप्ट को जोड़कर देखें।",
            new List<string>
            {
                "इस कॉन्सेप्ट का सबसे आसान उदाहरण क्या है?",
                "आप इसे अपने शहर/गांव में कैसे देख सकते हैं?"
            },
            sources);

        return Ok(response);
    }
}
