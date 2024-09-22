import { NivelEducacional } from "./nivel-educacional";
import { Persona } from "./persona";

export class Usuario extends Persona {

	public cuenta: string
	public correo: string
	public password: string
	public preguntaSecreta: string
	public respuestaSecreta: string

	public constructor(cuenta: string, correo: string, password: string, preguntaSecreta: string, respuestaSecreta: string, nombre: string, apellido: string, nivelEducacional: NivelEducacional, fechaNacimiento: Date | undefined) {
		super()
		this.cuenta = cuenta
		this.correo = correo
		this.password = password
		this.preguntaSecreta = preguntaSecreta
		this.respuestaSecreta = respuestaSecreta
		this.nombre = nombre
		this.apellido = apellido
		this.nivelEducacional = nivelEducacional
		this.fechaNacimiento = fechaNacimiento
	}

	public buscarUsuarioValido(cuenta: string, password: string): Usuario | undefined { return Usuario.getListaUsuarios().find(u => u.cuenta === cuenta && u.password === password) }
	public buscarUsuarioPorCorreo(correo: string): Usuario | undefined { return Usuario.getListaUsuarios().find(u => u.correo === correo) }

	public validarCuenta(): string {
		if (!this.buscarUsuarioValido(this.cuenta, this.password)) {
			return "Para ingresar al sistema debes ingresar una cuenta y contraseña válidas."
		}
		return ""
	}

	public validarCorreo(): string {
		const regex = /\S+@\S+\.\S+/
		if (!regex.test(this.correo)) {
			return "El formato del correo no es válido."
		}
		return ""
	}

	public validarPassword(): string {
		if (this.password.trim() === "") {
			return "Para entrar al sistema debe ingresar la contraseña."
		}
		for (let i = 0; i < this.password.length; i++) {
			if ("0123456789".indexOf(this.password.charAt(i)) === -1) {
				return "La contraseña debe ser numérica."
			}
		}
		if (this.password.length !== 4) {
			return "La contraseña debe tener al menos 4 dígitos."
		}
		return ""
	}

	public validarUsuario(): string {
		return this.validarCuenta() || this.validarPassword()
	}

	public getNivelEducacionalString(): string {
		if (!this.nivelEducacional) {
			return "No asignado."
		}
		return this.nivelEducacional.getNivelEducacionalString()
	}

	public override toString(): string {
		return `
		${this.cuenta}
		${this.correo}
		${this.password}
		${this.preguntaSecreta}
		${this.respuestaSecreta}
		${this.nombre}
		${this.apellido}
		${this.nivelEducacional.getNivelEducacionalString()}
		${this.formatDate(this.fechaNacimiento)}
		`
	}

	public formatDate(date: Date | undefined): string {
		if (!date) return ""
		const d = date.getDate().toString().padStart(2, "0")
		const m = (date.getMonth() + 1).toString().padStart(2, "0")
		const y = date.getFullYear()
		return `${d}/${m}/${y}`
	}

	public static getListaUsuarios(): Usuario[] {
		const usuariosGuadados = localStorage.getItem("usuarios")
		if (usuariosGuadados) {
			return JSON.parse(usuariosGuadados).map((u: any) => new Usuario(u.cuenta, u.correo, u.password, u.preguntaSecreta, u.respuestaSecreta, u.nombre, u.apellido, NivelEducacional.findNivelEducacional(u.nivelEducacional.id)!, new Date(u.fechaNacimiento)))
		}
		return [
			new Usuario("sgarday", "s.garday@duocuc.cl", "1234", "¿Cuál es tu color favorito?", "Negro", "Seth", "Garday", NivelEducacional.findNivelEducacional(5)!, new Date(2000, 2, 4)),
		]
	}

	public static guardarListaUsuarios(usuarios: Usuario[]): void { localStorage.setItem("usuarios", JSON.stringify(usuarios)) }
	
}
