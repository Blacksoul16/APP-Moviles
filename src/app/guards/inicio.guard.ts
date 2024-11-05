import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { ToastService } from '../servicios/toast.service';

export const inicioGuard: CanActivateFn = async (route, state) => {
	
	const authService = inject(AuthService)
	const router = inject(Router)
	const toast = inject(ToastService)

	if (await authService.isAuthed()) {
		return true
	}

	toast.showMsg("Debes iniciar sesión para acceder a esta página.", 2000, "danger")
	router.navigate(["/login"])
	return false
}
