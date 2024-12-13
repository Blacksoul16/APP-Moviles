import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopoverController, IonInput, IonContent, IonBadge, IonCard, IonCardTitle, IonLabel, IonCardContent, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangSelectComponent } from 'src/app/components/lang-select/lang-select.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
	standalone: true,
	imports: [IonInput, IonFabButton, IonFab, IonCol, IonRow, IonGrid, IonIcon, IonButton, IonCardContent, IonLabel, IonCardTitle, IonCard, IonBadge, IonContent, CommonModule, FormsModule, RouterModule, TranslateModule]
})
export class LoginPage implements OnInit {

	private translate = inject(TranslateService)
	private poppy = inject(PopoverController)
	private auth = inject(AuthService)

	public correo: string = ""
	public password: string = ""

	constructor() {}

	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }

	public login() { this.auth.login(this.correo, this.password) }

	public async langSelector(e: any) {
		const popover = await this.poppy.create({
			component: LangSelectComponent,
			event: e,
			translucent: true,
			backdropDismiss: true,
			side: "top",
			alignment: "start",
			size: "auto"
		})
		popover.present()
	}

}
