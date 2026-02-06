using LearningPlatform.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningPlatform.Api.Controllers;

[ApiController]
[Route("api/ai")]
[Authorize]
public class AiController : ControllerBase
{
    [HttpPost("explain")]
    public IActionResult Explain([FromBody] ExplainRequest request)
    {
        return Ok(new
        {
            simple = $"{request.Question} का सरल जवाब यहां आएगा।",
            summary = new[] { "मुख्य बिंदु 1", "मुख्य बिंदु 2" },
            example = "स्थानीय उदाहरण से समझाया जाएगा।",
            practice = new[] { "प्रश्न 1", "प्रश्न 2" }
        });
    }
}
