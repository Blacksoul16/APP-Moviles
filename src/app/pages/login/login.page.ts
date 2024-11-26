import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LangSelectComponent } from 'src/app/components/lang-select/lang-select.component';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PopoverController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule, RouterModule, TranslateModule]
})
export class LoginPage implements OnInit {

	correo: string = ""
	password: string = ""

	constructor(private poppy: PopoverController, private translate: TranslateService, private auth: AuthService) {
		// this.correo = "sgarday"
		// this.password = "1234"
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
