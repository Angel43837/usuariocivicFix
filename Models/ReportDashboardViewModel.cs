namespace CivicFix.Models;

public sealed class ReportDashboardViewModel
{
    public IReadOnlyList<CivicReport> Reports { get; set; } = [];
    public IReadOnlyList<string> Categories { get; set; } = [];
    public int TotalCount { get; set; }
    public int ResolvedCount { get; set; }
    public int PendingCount { get; set; }
    public int InProgressCount { get; set; }
    public string SelectedStatus { get; set; } = string.Empty;
    public string SelectedCategory { get; set; } = string.Empty;
    public string SearchTerm { get; set; } = string.Empty;
}