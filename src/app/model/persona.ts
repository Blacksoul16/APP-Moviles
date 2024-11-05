import { NivelEducacional } from "./nivel-educacional"

export class Persona {

	public nombre: string = ""
	public apellido: string = ""
	public nivelEducacional: NivelEducacional = NivelEducacional.findNivelEducacional(1)!
	public fechaNacimiento: Date = new Date()
	public direccion: string = ""

	public constructor() {}

	// public getFechaNacimiento(): string {
	// 	if (!this.fechaNacimiento) {
	// 		return "No asignado"
	// 	}

	// 	const d = this.fechaNacimiento.getDate().toString().padStart(2, "0")
	// 	const m = (this.fechaNacimiento.getMonth() + 1).toString().padStart(2, "0")
	// 	const y = this.fechaNacimiento.getFullYear()
	// 	return `${d}/${m}/${y}`
	// }

}
