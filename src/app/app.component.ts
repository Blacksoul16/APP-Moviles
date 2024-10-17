import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ToastService } from './pages/servicios/toast.service';
import { ThemeService } from './pages/servicios/theme.service';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {

	public mostrarComponentes: boolean = false
	public darkMode: boolean = false

	constructor(private ruta: Router, private menu: MenuController, private toast: ToastService, private theme: ThemeService) {
		this.ruta.events.subscribe((e: any) => {
			if (e.url) {
				this.mostrarComponentes = this.checkComponentes(e.url)
			}
		})
	}

	ngOnInit() { this.darkMode = this.theme.getDarkMode() }

	toggleChange(e: any) { 
		this.theme.toggleDarkMode(e.detail.checked)
		this.darkMode = e.detail.checked
	}

	checkComponentes(url: string): boolean {
		return url.includes("inicio") || url.includes("misdatos") || url.includes("miclase")
	}

	public togglearMenuLateral() { this.menu.toggle() }

	public cerrarSesion(): void {
		this.menu.close().then(() => {
			this.ruta.navigate(["login"])
			this.toast.showMsg("Se ha cerrado la sesión.", 2000, "success")
			// localStorage.clear()
		})
	}


}
