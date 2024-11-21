import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = async (route, state) => {

	const authService = inject(AuthService)
	const router = inject(Router)

	if (await authService.isAuthed()) {
		router.navigate(["/inicio"])
		return false
	}
	return true
}
