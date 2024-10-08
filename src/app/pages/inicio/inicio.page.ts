import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import jsQR, { QRCode } from 'jsqr';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { ToastService } from '../servicios/toast.service';
import { state } from '@angular/animations';

@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.page.html',
	styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

	public usuario: Usuario
	public tabSeleccionada: string = "inicio"
	public salut: string = ""
	public paletteToggle: boolean = true

	/* COSAS RELACIONADAS A LA LECTURA DE QR */
	@ViewChild("video")
	private video!: ElementRef
	@ViewChild("canvas")
	private canvas!: ElementRef;
	public escaneando = false
	public datosQR: any = ""
	public datosQRKeys: any[] = []
	/* FIN COSAS RELACIONADAS AL QR */

	constructor(private rutaActivada: ActivatedRoute, private ruta: Router, private menu: MenuController, private toast: ToastService) {
		this.usuario = new Usuario("", "", "", "", "", "", "", NivelEducacional.findNivelEducacional(1)!, undefined)
		this.rutaActivada.queryParams.subscribe(params => {
			const nav = this.ruta.getCurrentNavigation()
			if (nav) {
				if (nav.extras.state && nav.extras.state["usuario"]) {
					this.usuario = nav.extras.state["usuario"]
					return
				}
			}
			const usuarioGuardado = localStorage.getItem("usuarioActual")
			if (usuarioGuardado) {
			this.usuario = JSON.parse(usuarioGuardado)
			} else {
			this.toast.showMsg("Debes iniciar sesión para acceder a esta página.", 2000, "danger")
			this.ruta.navigate(["login"])
    		}
		})
		this.salut = this.getSalut()
	}

	togglearMenuLateral() { this.menu.toggle() }

	seleccionarTab(tab: string) {

		if(tab === 'miclase'){
			this.seleccionarTab('miclase')
		}else if(tab === 'misdatos'){
			this.ruta.navigate(['misdatos'], { state: { user: this.usuario } })
		}
	}
	
	getSalut(): string {
		const h = new Date().getHours()
		if (h >= 5 && h < 12) { return "Buenos días" }
		else if (h >= 12 && h < 18) { return "Buenas tardes" }
		else { return "Buenas noches" }
	}

  	ngOnInit() {
		// const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
		// this.initializeDarkPalette(prefersDark.matches)
		// prefersDark.addEventListener("change", (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches))
		this.initializeDarkPalette(true)
		this.initScan()
		localStorage.setItem("usuarioActual", JSON.stringify(this.usuario))
		Usuario.getUsuarioPorCuenta(this.usuario.cuenta)
	}

	initializeDarkPalette(isDark: any) { this.paletteToggle = isDark; this.toggleDarkPalette(isDark) }
	toggleChange(e: any) { this.toggleDarkPalette(e.detail.checked) }
	toggleDarkPalette(shouldAdd: any) { document.documentElement.classList.toggle("ion-palette-dark", shouldAdd) }

	/* COSAS RELACIONADAS A LA LECTURA DE QR */
	public seleccionarArchivo(e: Event) {
		const fileInput = e.target as HTMLInputElement
		if (fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0]
			const reader = new FileReader()
			reader.onload = (e: ProgressEvent<FileReader>) => {
				const img = new Image()
				img.src = e.target?.result as string
				img.onload = () => {
					this.procesarIMG(img)
				}
			}
			reader.readAsDataURL(file)
		}
	}

	public procesarQR(source: HTMLImageElement | HTMLVideoElement, esVideo: boolean = false): boolean {
		let w: number, h: number
		if (source instanceof HTMLVideoElement) {
			w = source.videoWidth
			h = source.videoHeight
		} else {
			w = source.width
			h = source.height
		}

		this.canvas.nativeElement.width = w
		this.canvas.nativeElement.height = h
		const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d")
		ctx.drawImage(source, 0, 0, w, h)
		const imgData: ImageData = ctx.getImageData(0, 0, w, h)
		const qrCode: QRCode | null = jsQR(imgData.data, w, h, { inversionAttempts: "dontInvert" })
		if (qrCode && qrCode.data !== "") {
			this.showQRData(qrCode.data)
			if (esVideo) {
				this.stopScan()
			}
			return true
		} else {
			if (!esVideo) {
				this.toast.showMsg("No se detectó un código QR. Por favor, seleccione un archivo válido.", 2000, "danger")
			}
			return false
		}
	}

	public procesarIMG(img: HTMLImageElement): void { this.procesarQR(img) }
	public procesarVideo(): boolean { return this.procesarQR(this.video.nativeElement, true) }

	async checkVideo() {
		if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
			if (this.procesarVideo() || !this.escaneando) { return }
			requestAnimationFrame(this.checkVideo.bind(this))
		} else {
			requestAnimationFrame(this.checkVideo.bind(this))
		}
	}

	public stopScan(): void {
		this.escaneando = false
		const stream = this.video.nativeElement.srcObject as MediaStream
		if (stream) {
			const tracks = stream.getTracks()
			tracks.forEach(track => { track.stop() })
		}
		this.video.nativeElement.srcObject = null
	}

	public async initScan() {
		const mediaProvider: MediaProvider = await navigator.mediaDevices.getUserMedia({ video: {facingMode: "environment"} })
		this.video.nativeElement.srcObject = mediaProvider
		this.video.nativeElement.setAttribute("playsinline", "true")
		this.video.nativeElement.play()
		this.escaneando = true
		requestAnimationFrame(this.checkVideo.bind(this))
	}
	
	public showQRData(datosQR: string): void {
		const objetoDatosQR = JSON.parse(datosQR)
		this.datosQR = objetoDatosQR
		this.datosQRKeys = Object.keys(objetoDatosQR).map(k => {
			return { k: this.formatearKey(k), v: objetoDatosQR[k] }
		})
		this.ruta.navigate(['miclase'], { state: objetoDatosQR })
	}

	public formatearKey(k: string): string {
		const s = k.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()
		let r = s.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
		// let r = s.replace(/_/g, "").split("").map((c, i) => i === 0 || s[i - 1] === "_" ? c.toUpperCase() : c).join(" ")
		// console.log("S: " + s)
		// console.log("R: " + r)
		return r
	}

	public limpiarDatosQR(): void { this.datosQR = null; this.datosQRKeys = [] }
	/* FIN DE COSAS RELACIONADAS AL QR */



	/* Sección mis datos */
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
