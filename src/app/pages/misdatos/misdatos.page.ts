import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import jsQR, { QRCode } from 'jsqr';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { ToastService } from '../servicios/toast.service';


@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.page.html',
  styleUrls: ['./misdatos.page.scss'],
})
export class MisdatosPage implements OnInit {

  	public usuario: Usuario
	public tabSeleccionada: string = "midatos"
	public paletteToggle: boolean = true

  constructor(private rutaActivada: ActivatedRoute, private ruta: Router, private menu: MenuController, private toast: ToastService) { 
    this.usuario = new Usuario("", "", "", "", "", "", "", NivelEducacional.findNivelEducacional(1)!, undefined);

    this.rutaActivada.queryParams.subscribe(params => {
      const nav = this.ruta.getCurrentNavigation();
      if (nav) {
        if (nav.extras.state && nav.extras.state["usuario"]) {
          this.usuario = nav.extras.state["usuario"];
          localStorage.setItem("usuarioActual", JSON.stringify(this.usuario));
          return;
        }
      }
      const usuarioGuardado = localStorage.getItem("usuarioActual");
      if (usuarioGuardado) {
        this.usuario = JSON.parse(usuarioGuardado);
      } else {
        this.toast.showMsg("Debes iniciar sesión para acceder a esta página.", 2000, "danger");
        this.ruta.navigate(["login"]);
      }
    });
  }

  togglearMenuLateral() { this.menu.toggle() }

	seleccionarTab(tab: string) {
		this.tabSeleccionada = tab

		if(tab === 'miclase'){
			this.seleccionarTab('miclase')
		}else if(tab === 'inicio'){
			this.ruta.navigate(['inicio'], { state: { user: this.usuario } })
		}
	}

	getSalut(): string {
		const h = new Date().getHours()
		if (h >= 5 && h < 12) { return "Buenos días" }
		else if (h >= 12 && h < 18) { return "Buenas tardes" }
		else { return "Buenas noches" }
	}

  ngOnInit() {
    this.seleccionarTab('misdatos')
  }

  initializeDarkPalette(isDark: any) { this.paletteToggle = isDark; this.toggleDarkPalette(isDark) }
	toggleChange(e: any) { this.toggleDarkPalette(e.detail.checked) }
	toggleDarkPalette(shouldAdd: any) { document.documentElement.classList.toggle("ion-palette-dark", shouldAdd) }

  public listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales();
	public actualizarNivelEducacional(event: any) { this.usuario.nivelEducacional = NivelEducacional.findNivelEducacional(event.detail.value)!; }

  public guardarCambios(): void {
		if (!this.usuario) {
			this.toast.showMsg("Error al guardar los cambios: No se encontró el usuario.", 2000, "danger")
			return
		}
		const listaUsuarios = Usuario.getListaUsuarios()
		const i = listaUsuarios.findIndex(u => u.cuenta === this.usuario.cuenta)
		if (i !== -1) {
			listaUsuarios[i] = this.usuario
			Usuario.guardarListaUsuarios(listaUsuarios)
      Usuario.getUsuarioPorCuenta(this.usuario.cuenta)
		}
		this.toast.showMsg("Cambios guardados correctamente.", 2000, "success");
	}

  public cerrarSesion(): void {
    this.togglearMenuLateral()
		this.ruta.navigate(["login"], { state: { user: this.usuario } })
		this.toast.showMsg("Se ha cerrado la sesión.", 2000, "success")
	}
  
  public paginaMisdatos(): void {
		this.ruta.navigate(["misdatos"], { state: {user: this.usuario} })
	}

}
