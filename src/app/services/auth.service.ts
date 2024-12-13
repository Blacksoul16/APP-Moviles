import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../model/usuario';
import { Router } from '@angular/router';
import { DataBaseService } from './database.service';
import { ToastsService } from './toasts.service';
import { Storage } from "@ionic/storage-angular";

@Injectable({ providedIn: 'root' })
export class AuthService {

	private userSubject = new BehaviorSubject<Usuario | null>(null)
	private router = inject(Router)
	private bd = inject(DataBaseService)
	private storage = inject(Storage)
	private toast = inject(ToastsService)
	private keyUsuario = "USUARIO_AUTENTICADO"
	protected keyQR = "CODIGO_QR"
    
	userAuth$ = this.userSubject.asObservable()
	primerInicioSesion = new BehaviorSubject<boolean>(false)
	codigoQRData = new BehaviorSubject<string | null>(null)
	tabSeleccionado = new BehaviorSubject<string>("codigoqr")

	constructor() { this.initAuth() }

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
				this.toast.showMsg("Inicio de sesión exitoso.", 2000, "success")
				this.userSubject.next(authUser)
				this.primerInicioSesion.next(false)
				this.tabSeleccionado.next("codigoqr")
				await this.router.navigate(["/inicio"])
				return true
			}
			const user = await this.bd.findUser(cuenta, password)
			if (user && user.cuenta === cuenta && user.password === password) {
				this.toast.showMsg("Inicio de sesión exitoso.", 2000, "success")
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
}