import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { ToastService } from './services/toast.service';
import { AuthService } from './services/auth.service';
import { MenuController } from '@ionic/angular';
import { addCircleOutline, arrowUpCircleOutline, barChartOutline, caretDownCircleOutline, colorPalette, createOutline, documentTextOutline, filterOutline, homeOutline, languageOutline, logInOutline, logOutOutline, mapOutline, menuOutline, newspaperOutline, pencilOutline, peopleOutline, qrCodeOutline, saveOutline, schoolOutline, settingsOutline, shieldSharp, stopCircleOutline, trashOutline, videocamOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule, RouterModule, TranslateModule,]
})
export class AppComponent {

	public mostrarComponentes: boolean = false
	public usuario: any
	public roleKey: string = "0"

	constructor(private ruta: Router, private menu: MenuController, private toast: ToastService, private auth: AuthService) {
		addIcons({ 
			peopleOutline, barChartOutline, newspaperOutline, arrowUpCircleOutline, videocamOutline, menuOutline, saveOutline, filterOutline,
			trashOutline, shieldSharp, logOutOutline, createOutline, schoolOutline, caretDownCircleOutline, mapOutline, qrCodeOutline,
			addCircleOutline, stopCircleOutline, settingsOutline, logInOutline, documentTextOutline, languageOutline, colorPalette,
			homeOutline, pencilOutline
		})
		this.auth.userAuth$.subscribe((u) => { this.usuario = u; this.roleKey = `usuarios.role.${u?.rol}` })
		this.ruta.events.subscribe((e: any) => {
			if (e.url) {
				this.mostrarComponentes = this.checkComponentes(e.url)
			}
		})
	}
	
	ngOnInit() {}

	checkComponentes(url: string): boolean { return url.includes("inicio") }

	cerrarSesion(): void {
		this.menu.close("menuLateral").then(() => {
			this.auth.logout()
			this.toast.showMsg("Se ha cerrado la sesión.", 2000, "success")
		})
	}
}