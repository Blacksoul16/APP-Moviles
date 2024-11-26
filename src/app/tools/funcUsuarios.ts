import { AuthService, ROLES } from "../servicios/auth.service"

export function getRolUsuario(): string {
	const rol = AuthService.prototype.usuarioAutenticado.value ? AuthService.prototype.usuarioAutenticado.value.rol : 0
	return ROLES[rol as keyof typeof ROLES]
}