import { Component, inject, OnInit } from '@angular/core';
import { IonMenu, IonThumbnail, IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonCol, IonRow, IonCard, IonCardTitle, IonCardContent, IonCardSubtitle, IonBadge, IonItemDivider, IonButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bookOutline, shieldCheckmarkOutline, addCircleOutline, alertCircleOutline, arrowUpCircleOutline, barChartOutline, caretDownCircleOutline, checkmarkCircleOutline, colorPalette, createOutline, documentTextOutline, filterOutline, homeOutline, informationCircleOutline, languageOutline, logInOutline, logOutOutline, mapOutline, menuOutline, newspaperOutline, pencilOutline, peopleOutline, qrCodeOutline, saveOutline, schoolOutline, settingsOutline, shieldSharp, stopCircleOutline, trashOutline, videocamOutline, warningOutline } from 'ionicons/icons';
import { MenuController } from "@ionic/angular/standalone"
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MenuStateService } from './services/menu-state.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	standalone: true,
	imports: [
		CommonModule, TranslateModule, IonMenu, IonThumbnail, IonLabel, IonIcon, IonButton, IonItemDivider, 
		IonBadge, IonCardSubtitle, IonCardContent, IonCardTitle, IonCard, IonRow, IonCol, IonGrid, IonContent, 
		IonTitle, IonToolbar, IonHeader, IonApp, IonRouterOutlet
	],
})
export class AppComponent implements OnInit {

	private ruta = inject(Router)
	private auth = inject(AuthService)
	private menu = inject(MenuController)
	private menuState = inject(MenuStateService)
	private cdr = inject(ChangeDetectorRef)

	public usuario: any
	public roleKey: string = "0"
	public showMenu: boolean = false

	constructor() {
		addIcons({ 
			peopleOutline, barChartOutline, newspaperOutline, arrowUpCircleOutline, videocamOutline, menuOutline, saveOutline, filterOutline,
			trashOutline, shieldSharp, logOutOutline, createOutline, schoolOutline, caretDownCircleOutline, mapOutline, qrCodeOutline,
			addCircleOutline, stopCircleOutline, settingsOutline, logInOutline, documentTextOutline, languageOutline, colorPalette,
			homeOutline, pencilOutline, alertCircleOutline, warningOutline, checkmarkCircleOutline, informationCircleOutline,
			shieldCheckmarkOutline, bookOutline
		})
		this.auth.userAuth$.subscribe((u) => { this.usuario = u; this.roleKey = `usuarios.role.${u?.rol}` })
		this.ruta.events.subscribe((e: any) => { if (e && e.url) { this.showMenu = e.url.includes("inicio"); this.cdr.detectChanges() } })
	}

	ngOnInit() {}

	onMenuOpen() { this.menuState.setMenuOpen(true) }
	onMenuClose() { this.menuState.setMenuOpen(false) }
	cerrarSesion() { this.menu.close("menuLateral").then(() => { this.auth.logout() }) }
}
