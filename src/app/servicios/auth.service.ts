import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Usuario } from "../model/usuario";
import { Router } from "@angular/router";
import { DataBaseService } from "./db.service";
import { Storage } from "@ionic/storage-angular"
import { ToastService } from "./toast.service";

@Injectable({
	providedIn: "root"
})
export class AuthService {
	keyUsuario = "USUARIO_AUTENTICADO"
	keyQR = "CODIGO_QR"
	usuarioAutenticado = new BehaviorSubject<Usuario | null>(null)
	primerInicioSesion = new BehaviorSubject<boolean>(false)
	codigoQRData = new BehaviorSubject<string | null>(null)
	tabSeleccionado = new BehaviorSubject<string>("codigoqr")

	constructor(private router: Router, private bd: DataBaseService, private storage: Storage, private toast: ToastService) {
		this.initAuth()
	}

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
			this.usuarioAutenticado.next(u ?? null)
			return u
		} catch (e) {
			console.error(`[auth.service.ts] Error en readAuthUser: ${e}`)
			return null
		}
	}
	
	async saveAuthUser(u: Usuario) {
		try {
			await this.storage.set(this.keyUsuario, u)
			this.usuarioAutenticado.next(u)
			return u
		} catch (e) {
			console.error(`[auth.service.ts] Error en saveAuthUser: ${e}`)
			return null
		}
	}

	async deleteAuthUser(): Promise<boolean> {
		try {
			await this.storage.remove(this.keyUsuario)
			this.usuarioAutenticado.next(null)
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
				this.usuarioAutenticado.next(authUser)
				this.primerInicioSesion.next(false)
				await this.router.navigate(["/inicio"])
				return true
			}
			const user = await this.bd.findUser(cuenta, password)
			if (user && user.cuenta === cuenta && user.password === password) {
				this.toast.showMsg("Inicio de sesión exitoso (via bd).", 2000, "success")
				await this.saveAuthUser(user)
				this.primerInicioSesion.next(true)
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

}