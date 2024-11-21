import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LangSelectComponent } from 'src/app/componentes/lang-select/lang-select.component';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	correo: string
	password: string

	constructor(private poppy: PopoverController, private translate: TranslateService, private auth: AuthService) {
		this.correo = "sgarday"
		this.password = "1234"
	}

	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }

	public login() { this.auth.login(this.correo, this.password) }

	async langSelector(e: Event) {
		const popover = await this.poppy.create({
			component: LangSelectComponent,
			event: e,
			translucent: true,
			backdropDismiss: true,
			side: "top",
			alignment: "start",
			size: "auto",
		})
		await popover.present()
	}

}
