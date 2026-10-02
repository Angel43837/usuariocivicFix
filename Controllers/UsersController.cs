using CivicFix.Data;
using CivicFix.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CivicFix.Controllers;

public sealed class UsersController(CivicFixContext database) : Controller
{
    public async Task<IActionResult> Index()
    {
        var users = await database.Users
            .AsNoTracking()
            .OrderByDescending(user => user.CreatedAt)
            .Select(user => new UserSummaryViewModel
            {
                DisplayName = user.DisplayName,
                Email = user.Email ?? string.Empty,
                CreatedAt = user.CreatedAt,
                ReportCount = database.Reports.Count(report => report.UserId == user.Id)
            })
            .ToListAsync();

        ViewData["ReportCount"] = await database.Reports.CountAsync();
        return View(users);
    }
}
