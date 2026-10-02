using System.ComponentModel.DataAnnotations;

namespace CivicFix.Models;

public sealed class LoginViewModel
{
    [Required(ErrorMessage = "Escribe tu correo.")]
    [EmailAddress(ErrorMessage = "Ingresa un correo válido.")]
    [Display(Name = "Correo electrónico")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Escribe tu contraseña.")]
    [DataType(DataType.Password)]
    [Display(Name = "Contraseña")]
    public string Password { get; set; } = string.Empty;

    [Display(Name = "Recordarme")]
    public bool RemindMe { get; set; }

    public string? ReturnUrl { get; set; }
}
