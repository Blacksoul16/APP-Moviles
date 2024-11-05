import { Injectable } from "@angular/core";
import { CapacitorSQLite, CapacitorSQLitePlugin, capSQLiteUpgradeOptions, SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";
import { Capacitor } from "@capacitor/core";

@Injectable({
	providedIn: "root"
})
export class SQLiteService {

	sqliteConnection!: SQLiteConnection
	isService: boolean = false
	platform!: string
	sqlitePlugin!: CapacitorSQLitePlugin
	native: boolean = false

	constructor() {}

	async initPlugin(): Promise<boolean> {
		try {
			this.platform = Capacitor.getPlatform()
			this.native = this.platform === "ios" || this.platform === "android"
			this.sqlitePlugin = CapacitorSQLite
			this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin)
			this.isService = true
			return true
		} catch (e) {
			return Promise.reject(`[sqlite.service.ts] Error en initPlugin: ${e}`)
		}
	}

	async initWebStorage(): Promise<void> {
		try {
			await this.sqliteConnection.initWebStore()
		} catch (e: any) {
			const m = e.message ? e.message : e
			return Promise.reject(`[sqlite.service.ts] Error en initWebStorage: ${m}`)
		}
	}

	async openDB(dbName: string, encrypted: boolean, mode: string, version: number, readonly: boolean): Promise<SQLiteDBConnection> {
		try {
			const isConsistent = (await this.sqliteConnection.checkConnectionsConsistency()).result
			const isConnected = (await this.sqliteConnection.isConnection(dbName, readonly)).result
			const db = isConsistent && isConnected ? await this.sqliteConnection.retrieveConnection(dbName, readonly) : await this.sqliteConnection.createConnection(dbName, encrypted, mode, version, readonly)
			await db.open()
			return db
		} catch (e) {
			return Promise.reject(`[sqlite.service.ts] Error en openDB: ${e}`)
		}
	}

	async retrieveConnection(dbName: string, readonly: boolean): Promise<SQLiteDBConnection> {
		try {
			return await this.sqliteConnection.retrieveConnection(dbName, readonly)
		} catch (e) {
			return Promise.reject(`[sqlite.service.ts] Error en retrieveConnection: ${e}`)
		}
	}

	async closeConnection(db: string, readonly: boolean = false): Promise<void> {
		try {
			return await this.sqliteConnection.closeConnection(db, readonly)
		} catch (e) {
			return Promise.reject(`[sqlite.service.ts] Error en closeConnection: ${e}`)
		}
	}

	async createDB(options: capSQLiteUpgradeOptions): Promise<void> {
		try {
			return await this.sqlitePlugin.addUpgradeStatement(options)
		} catch (e) {
			return Promise.reject(`[sqlite.service.ts] Error en createDB: ${e}`)
		}
	}

	async saveDBName(dbName: string): Promise<void> {
		try {
			return await this.sqliteConnection.saveToStore(dbName)
		} catch (e) {
			return Promise.reject(`[sqlite.service.ts] Error en saveDBName: ${e}`)
		}
	}

	async deleteDB(dbName: string): Promise<void> {
		try {
			return this.sqlitePlugin.deleteDatabase({ database: dbName })
		} catch (e) {
			return Promise.reject(`[sqlite.service.ts] Error en deleteDB: ${e}`)
		}
	}

}