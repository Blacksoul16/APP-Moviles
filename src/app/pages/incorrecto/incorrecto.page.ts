import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
	selector: 'app-incorrecto',
	templateUrl: './incorrecto.page.html',
	styleUrls: ['./incorrecto.page.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule, TranslateModule, RouterLink, HeaderComponent]
})
export class IncorrectoPage implements OnInit {

	constructor(private translate: TranslateService) {}

	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }

}
