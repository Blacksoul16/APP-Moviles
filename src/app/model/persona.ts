import { NivelEducacional } from "./nivel-educacional"

export class Persona {

	public nombre: string = ""
	public apellido: string = ""
	public nivelEducacional: NivelEducacional = NivelEducacional.findNivelEducacional(1)!
	public fechaNacimiento: Date = new Date()
	public direccion: string = ""

	public constructor() {}

}
