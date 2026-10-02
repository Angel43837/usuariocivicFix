using System.ComponentModel.DataAnnotations;

namespace CivicFix.Models;

public sealed class RegisterViewModel
{
    [Required(ErrorMessage = "Escribe tu nombre.")]
    [StringLength(120)]
    [Display(Name = "Nombre")]
    public string DisplayName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Escribe tu correo.")]
    [EmailAddress(ErrorMessage = "Ingresa un correo válido.")]
    [Display(Name = "Correo electrónico")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Escribe una contraseña.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos {2} caracteres.")]
    [DataType(DataType.Password)]
    [Display(Name = "Contraseña")]
    public string Password { get; set; } = string.Empty;

    [DataType(DataType.Password)]
    [Display(Name = "Confirmar contraseña")]
    [Compare(nameof(Password), ErrorMessage = "Las contraseñas no coinciden.")]
    public string ConfirmPassword { get; set; } = string.Empty;
}
