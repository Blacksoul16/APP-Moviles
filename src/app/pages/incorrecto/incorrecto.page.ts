import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-incorrecto',
	templateUrl: './incorrecto.page.html',
	styleUrls: ['./incorrecto.page.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule, TranslateModule, RouterLink]
})
export class IncorrectoPage implements OnInit {

	constructor() {}

	ngOnInit() {}

}
