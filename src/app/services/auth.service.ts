import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../model/usuario';
import { Router } from '@angular/router';
import { DataBaseService } from './database.service';
import { ToastService } from './toast.service';
import { Storage } from "@ionic/storage-angular";

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private userSubject = new BehaviorSubject<Usuario | null>(null)
	userAuth$ = this.userSubject.asObservable()
	primerInicioSesion = new BehaviorSubject<boolean>(false)
	codigoQRData = new BehaviorSubject<string | null>(null)
	tabSeleccionado = new BehaviorSubject<string>("codigoqr")
	keyUsuario = "USUARIO_AUTENTICADO"
	keyQR = "CODIGO_QR"

	constructor(private router: Router, private bd: DataBaseService, private storage: Storage, private toast: ToastService) { this.initAuth() }

	async initAuth() {
		try {
			await this.storage.create()
		} catch (e) {
			console.error(`[auth.service.ts] Error en initAuth: ${e}`)
		}
	}
	
	async isAuthed(): Promise<boolean> {
		try {
			return Boolean(await this.readAuthUser())
		} catch (e) {
			console.error(`[auth.service.ts] Error en isAuthed: ${e}`)
			return false
		}
	}

	async readAuthUser(): Promise<Usuario | null> {
		try {
			const u = (await this.storage.get(this.keyUsuario)) as Usuario | null
			this.userSubject.next(u ?? null)
			return u
		} catch (e) {
			console.error(`[auth.service.ts] Error en readAuthUser: ${e}`)
			return null
		}
	}
	
	async saveAuthUser(u: Usuario) {
		try {
			await this.storage.set(this.keyUsuario, u)
			this.userSubject.next(u)
			return u
		} catch (e) {
			console.error(`[auth.service.ts] Error en saveAuthUser: ${e}`)
			return null
		}
	}

	async deleteAuthUser(): Promise<boolean> {
		try {
			await this.storage.remove(this.keyUsuario)
			this.userSubject.next(null)
			return true
		} catch (e) {
			console.error(`[auth.servicve.ts] Error en deleteAuthUser: ${e}`)
			return false
		}
	}

	async login(cuenta: string, password: string): Promise<boolean> {
		try {
			const authUser = await this.storage.get(this.keyUsuario)
			if (authUser) {
				this.toast.showMsg("Inicio de sesión exitoso (via storage).", 2000, "success")
				this.userSubject.next(authUser)
				this.primerInicioSesion.next(false)
				this.tabSeleccionado.next("codigoqr")
				await this.router.navigate(["/inicio"])
				return true
			}
			const user = await this.bd.findUser(cuenta, password)
			if (user && user.cuenta === cuenta && user.password === password) {
				this.toast.showMsg("Inicio de sesión exitoso (via bd).", 2000, "success")
				await this.saveAuthUser(user)
				this.primerInicioSesion.next(true)
				this.tabSeleccionado.next("codigoqr")
				await this.router.navigate(["/inicio"])
				return true
			}
			this.toast.showMsg("Las credenciales no parecen ser correctas.", 3000, "danger")
			await this.router.navigate(["/login"])
			return false
		} catch (e) {
			console.error(`[auth.service.ts] Error en login: ${e}`)
			return false
		}
	}

	async logout(): Promise<boolean> {
		try {
			const user = await this.readAuthUser()
			if (user) {
				this.toast.showMsg("Se cerró la sesión.", 2000, "success")
				await this.deleteAuthUser()
			}
			await this.router.navigate(["/login"])
			return true
		} catch (e) {
			console.error(`[auth.service.ts] Error en logout: ${e}`)
			return false
		}
	}

	// public hasPermission(perm: string): boolean {
	// 	const rol = this.userSubject.value?.rol
	// 	if (rol === undefined || rol === null) return false

	// 	const perms = ROLES_PERMISOS[rol] || []
	// 	return perms.includes(perm)
	// }

	// public getUserRole(): string {
	// 	const rol = this.userSubject.value ? this.userSubject.value.rol : 0
	// 	return ROLES[rol as keyof typeof ROLES]
	// }
}

// export const ROLES = { 1: "Administrador", 0: "Alumno" }
// export const PERMS = {
// 	TABS: { MISDATOS: "tab.misdatos", FORO: "tab.foro", CODIGOQR: "tab.codigoqr", MICLASE: "tab.miclase", USUARIOS: "tab.usuarios" },
// 	ACCIONES: { LEER: "accion.leer", ESCRIBIR: "accion.escribir", EDITAR: "accion.editar" },
// 	LOGIN: "login",
// 	LOGOUT: "logout"
// }

/**
 * 1: Administrador
 * 0: Alumno / Usuario regular
 */
// export const ROLES_PERMISOS: any = {
// 	1: [
// 		PERMS.TABS.FORO, PERMS.TABS.USUARIOS, PERMS.TABS.MISDATOS, PERMS.ACCIONES.LEER, 
// 		PERMS.ACCIONES.ESCRIBIR, PERMS.ACCIONES.EDITAR, PERMS.LOGIN, PERMS.LOGOUT
// 	],
// 	0: [
// 		PERMS.TABS.CODIGOQR, PERMS.TABS.MICLASE, PERMS.ACCIONES.LEER, PERMS.LOGIN, 
// 		PERMS.LOGOUT
// 	]
// }