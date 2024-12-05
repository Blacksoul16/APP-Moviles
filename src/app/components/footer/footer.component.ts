import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuController, IonFooter, IonToolbar, IonIcon, IonSegmentButton, IonSegment } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'duocuc-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],
	standalone: true,
	imports: [IonSegment, IonSegmentButton, IonIcon, IonToolbar, IonFooter, CommonModule, FormsModule, RouterModule, TranslateModule]
})
export class FooterComponent implements OnInit {

	public tabSeleccionada: string = "codigoqr"
	public usuario: any

	constructor(public auth: AuthService, private menu: MenuController) {}
	
	ngOnInit() {
		this.auth.userAuth$.subscribe((u) => { this.usuario = u })
		this.auth.tabSeleccionado.subscribe((tab) => { this.tabSeleccionada = tab })
	}

	togglearMenuLateral() { this.menu.toggle("menuLateral") }

	changeTab(e: any) {
		const temp = e.detail.value
		if (temp === "menulateral") {
			e.target.value = this.tabSeleccionada
		} else {
			this.tabSeleccionada = temp
			this.auth.tabSeleccionado.next(this.tabSeleccionada)
		}
	}
}
