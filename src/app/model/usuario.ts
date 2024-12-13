import { NivelEducacional } from "./nivel-educacional";
import { Persona } from "./persona";
import { convertirFechaAString } from "../tools/funcFechas";

export class Usuario extends Persona {

	public cuenta: string = ""
	public correo: string = ""
	public password: string = ""
	public preguntaSecreta: string = ""
	public respuestaSecreta: string = ""
	public imagen: string = ""
	public rol: number = 0

	public constructor() { super() }

	static getNewUser(cu: string, co: string, pa: string, pr: string, re: string, no: string, ap: string, ni: NivelEducacional, fe: Date, di: string, im: string, ro: number) {
		let u = new Usuario()
		u.cuenta = cu
		u.correo= co
		u.password = pa
		u.preguntaSecreta = pr
		u.respuestaSecreta = re
		u.nombre = no
		u.apellido = ap
		u.nivelEducacional = ni
		u.fechaNacimiento = fe,
		u.direccion = di,
		u.imagen = im,
		u.rol = ro
		return u
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
			${convertirFechaAString(this.fechaNacimiento)}
			${this.direccion}
			${this.imagen !== ""}
			${this.rol}
		`
	}
}
