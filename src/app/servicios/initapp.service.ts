import { Injectable } from "@angular/core";
import { SQLiteService } from "./sqlite.service";
import { DataBaseService } from "./db.service";
import { AuthService } from "./auth.service";

@Injectable({
	providedIn: "root"
})
export class InitAppService {
	
	isAppInit: boolean = false
	platform!: string

	constructor(private sqliteService: SQLiteService, private storageService: DataBaseService, private authService: AuthService) {}

	async initApp() {
		await this.sqliteService.initPlugin().then(async (ret) => {
			this.platform = this.sqliteService.platform
			try {
				if (this.sqliteService.platform === "web") {
					await this.sqliteService.initWebStorage()
				}
				await this.storageService.initBD()
				this.authService.initAuth()
				this.isAppInit = true
			} catch (e) {
				console.log(`[initapp.service.ts] Error en initApp: ${e}`)
			}
		})
	}
}