import { inject, Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';
import { DataBaseService } from './database.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class InitappService {

	private sqlServ = inject(SqliteService)
	private stgServ = inject(DataBaseService)
	private authServ = inject(AuthService)
	
	public isAppInit: boolean = false

	async initApp() {
		await this.sqlServ.initPlugin().then(async (ret) => {
			try {
				if (this.sqlServ.platform === "web") {
					await this.sqlServ.initWebStorage()
				}
				await this.stgServ.initBD()
				this.authServ.initAuth()
				this.isAppInit = true
			} catch (e) {
				console.log(`[initapp.service.ts] Error en initApp: ${e}`)
			}
		})
	}
}
