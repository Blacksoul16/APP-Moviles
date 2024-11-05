export const convertirFechaAString = (d: Date): string => {
	try {
		const dd = String(d.getDate()).padStart(2, "0")
		const mm = String(d.getMonth() + 1).padStart(2, "0")
		const yy = d.getFullYear()
		return `${dd}/${mm}/${yy}`
	} catch (e) {
		console.error(`[funcFechas.ts] Error en convertirFechaAString: ${e}`)
		return ""
	}
}

export const convertirStringAFecha = (dS: string): Date => {
	try {
		const r = /^\d{2}\/\d{2}\/\d{4}$/
		if (!r.test(dS)) {
			console.error(`[funcFechas.ts] Error en convertirStringAFecha: El formato entregado no es válido, asegúrate de que sea "dd/mm/yyy".`)
			return new Date()
		}
		const [dd, mm, yy] = dS.split("/").map(Number)
		const d = new Date(yy, mm - 1, dd)
		if (d.getFullYear() !== yy || d.getMonth() !== mm - 1 || d.getDate() !== dd) {
			console.error(`[funcFechas.ts] Error en convertirStringAFecha: La fecha es inválida.`)
			return new Date()
		}
		return d
	} catch (e) {
		console.error(`[funcFechas.ts] Error en convertirStringAFecha: ${e}`)
		return new Date()
	}
}