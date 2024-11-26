import { Injectable } from "@angular/core";
import { capSQLiteChanges, SQLiteDBConnection } from "@capacitor-community/sqlite";
import { BehaviorSubject } from "rxjs";
import { Usuario } from "../model/usuario";
import { SqliteService } from "./sqlite.service";
import { NivelEducacional } from "../model/nivel-educacional";
import { convertirFechaAString, convertirStringAFecha } from "../tools/funcFechas";

@Injectable({
	providedIn: "root"
})
export class DataBaseService {

	u1Test = Usuario.getNewUser("sgarday", "s.garday@duocuc.cl", "1234", "¿Cuál es tu color favorito?", "Negro", "Seth", "Garday", NivelEducacional.findNivelEducacional(5)!, new Date(2000, 2, 4), "Recoleta", "sgarday.png", 1)
	u2Test = Usuario.getNewUser("testuser", "test@user.test", "1234", "Toc toc", "¿Quién es?", "Test", "User", NivelEducacional.findNivelEducacional(5)!, new Date(1999, 10, 5), "Puente Alto", "default-user.webp", 0)

	userUpgrades = [
		{
			toVersion: 1,
			statements: [`
				CREATE TABLE IF NOT EXISTS USUARIO (
					cuenta TEXT PRIMARY KEY NOT NULL,
					correo TEXT NOT NULL,
					password TEXT NOT NULL,
					preguntaSecreta TEXT NOT NULL,
					respuestaSecreta TEXT NOT NULL,
					nombre TEXT NOT NULL,
					apellido TEXT NOT NULL,
					nivelEducacional INTEGER NOT NULL,
					fechaNacimiento INTEGER NOT NULL,
					direccion TEXT NOT NULL,
					imagen TEXT NOT NULL,
					rol INTEGER NOT NULL
				);
				`]
		}
	]

	sqlInsertUpdate = `
		INSERT OR REPLACE INTO USUARIO (
			cuenta, 
			correo, 
			password, 
			preguntaSecreta, 
			respuestaSecreta,
			nombre, 
			apellido,
			nivelEducacional, 
			fechaNacimiento,
			direccion,
			imagen,
			rol
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
	`

	nombreBD = "SistemaAsistencia"
	db!: SQLiteDBConnection
	listaUsers: BehaviorSubject<Usuario[]> = new BehaviorSubject<Usuario[]>([])

	constructor (private sqlService: SqliteService) {}

	async initBD() {
		try {
			await this.sqlService.createDB({ database: this.nombreBD, upgrade: this.userUpgrades })
			this.db = await this.sqlService.openDB(this.nombreBD, false, "no-encryption", 1, false)
			await this.createTestUsers()
			await this.readUsers()
		} catch (e) {
			console.error(`[DBService.ts] Ocurrió un error en initBD: ${e}`)
		}
	}

	async createTestUsers() {
		try {
			if (!await this.readUser(this.u1Test.cuenta)) { await this.saveUser(this.u1Test) }
			if (!await this.readUser(this.u2Test.cuenta)) { await this.saveUser(this.u2Test) }
		} catch (e) {
			console.error(`[DBService.ts] Ocurrió un error en createTestUsers: ${e}`)
		}
	}

	async saveUser(u: Usuario): Promise<void> {
		try {
			this.sqlInsertUpdate = `
			INSERT OR REPLACE INTO USUARIO (
				cuenta,
				correo,
				password,
				preguntaSecreta,
				respuestaSecreta,
				nombre,
				apellido,
				nivelEducacional,
				fechaNacimiento,
				direccion,
				imagen,
				rol
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
			`
			await this.db.run(this.sqlInsertUpdate, [u.cuenta, u.correo, u.password, u.preguntaSecreta, u.respuestaSecreta, u.nombre, u.apellido, u.nivelEducacional.id, convertirFechaAString(u.fechaNacimiento), u.direccion, u.imagen, u.rol])
			await this.readUsers()
		} catch (e) {
			console.error(`[DBService.ts] Ocurrió un error en saveUser: ${e}`)
		}
	}

	async readUsers(): Promise<Usuario[]> {
		try {
			const q = "SELECT * FROM USUARIO;"
			const rows = (await this.db.query(q)).values
			let users: Usuario[] = []
			if (rows) {
				users = rows.map((row: any) => this.rowToUser(row))
			}
			this.listaUsers.next(users)
			return users
		} catch (e) {
			console.error(`[DBService.ts] Ocurrió un error en readUsers: ${e}`)
			return []
		}
	}

	async readUser(cuenta: string): Promise<Usuario | undefined> {
		try {
			const q = "SELECT * FROM USUARIO WHERE cuenta=?;"
			const rows = (await this.db.query(q, [cuenta])).values
			return rows?.length? this.rowToUser(rows[0]) : undefined
		} catch (e) {
			console.error(`[DBService.ts] Ocurrió un error en readUser: ${e}`)
			return undefined
		}
	}

	async deleteUserByAccount(cuenta: string): Promise<boolean> {
		try {
			const q = "DELETE FROM USUARIO WHERE cuenta=?;"
			const resultado: capSQLiteChanges = await this.db.run(q, [cuenta])
			const rowsAffected = resultado.changes?.changes ?? 0
			await this.readUsers()
			return rowsAffected > 0
		} catch (e) {
			console.error(`[DBService.ts] Ocurrió un error en delteUserByAccount: ${e}`)
			return false
		}
	}

	async findUser(cuenta: string, password: string): Promise<Usuario | undefined> {
		try {
			const q = "SELECT * FROM USUARIO WHERE cuenta=? AND password=?;"
			const rows = (await this.db.query(q, [cuenta, password])).values
			return rows && rows.length > 0 ? this.rowToUser(rows[0]) : undefined
		} catch (e) {
			console.error(`[DBService.ts] Ocurrió un error en findUser: ${e}`)
			return undefined
		}
	}

	async findUserAccount(cuenta: string): Promise<Usuario | undefined> {
		try {
			const q = "SELECT * FROM USUARIO WHERE cuenta=?;"
			const rows = (await this.db.query(q, [cuenta])).values
			return rows && rows.length > 0 ? this.rowToUser(rows[0]) : undefined
		} catch (e) {
			console.error(`[DBService.ts] Ocurrió un error en findUserAccount: ${e}`)
			return undefined
		}
	}

	async findUserEmail(correo: string): Promise<Usuario | undefined> {
		try {
			const q = "SELECT * FROM USUARIO WHERE correo=?;"
			const rows = (await this.db.query(q, [correo])).values
			return rows && rows.length > 0 ? this.rowToUser(rows[0]) : undefined
		} catch (e) {
			console.error(`[DBService.ts] Ocurrió un error en findUserEmail: ${e}`)
			return undefined
		}
	}

	// Se llama dos veces cuando solo debería ser una. Verlo más adelante.
	private rowToUser(row: any): Usuario {
		try {
			const u = new Usuario()
			u.cuenta = row.cuenta
			u.correo = row.correo
			u.password = row.password
			u.preguntaSecreta = row.preguntaSecreta
			u.respuestaSecreta = row.respuestaSecreta
			u.nombre = row.nombre
			u.apellido = row.apellido
			u.nivelEducacional = NivelEducacional.findNivelEducacional(row.nivelEducacional) || new NivelEducacional()
			u.fechaNacimiento = convertirStringAFecha(row.fechaNacimiento)
			u.direccion = row.direccion
			u.imagen = row.imagen
			u.rol = row.rol
			return u
		} catch (e) {
			console.error(`[DBService.ts] Ocurrió un error en rowToUser: ${e}`)
			return new Usuario()
		}
	}

}