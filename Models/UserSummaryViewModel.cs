namespace CivicFix.Models;

public sealed class UserSummaryViewModel
{
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int ReportCount { get; set; }
}
