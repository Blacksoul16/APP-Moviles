import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from 'src/app/model/usuario';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'app-correcto',
	templateUrl: './correcto.page.html',
	styleUrls: ['./correcto.page.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule, TranslateModule, RouterLink]
})
export class CorrectoPage implements OnInit {
	public usuario: Usuario = new Usuario()

	constructor(private rutaActivada: ActivatedRoute, private ruta: Router, private translate: TranslateService) { 
		this.rutaActivada.queryParams.subscribe(() => {
			const nav = this.ruta.getCurrentNavigation();
			if (nav && nav.extras.state && nav.extras.state["usuario"]) {
				this.usuario = nav.extras.state["usuario"]
				return
			}
		})
	}

	ngOnInit() { this.translate.use(localStorage.getItem("selectedLang") || "es") }
}
