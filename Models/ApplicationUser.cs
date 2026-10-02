using Microsoft.AspNetCore.Identity;

namespace CivicFix.Models;

public sealed class ApplicationUser : IdentityUser
{
    public string DisplayName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
