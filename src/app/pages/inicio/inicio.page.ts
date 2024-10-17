import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsQR, { QRCode } from 'jsqr';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { ToastService } from '../servicios/toast.service';
import { ThemeService } from '../servicios/theme.service';
// import { state } from '@angular/animations';

@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.page.html',
	styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

	public usuario: Usuario
	public salut: string = ""
	public darkMode: boolean = true

	/* COSAS RELACIONADAS A LA LECTURA DE QR */
	@ViewChild("video")
	private video!: ElementRef
	@ViewChild("canvas")
	private canvas!: ElementRef;
	public escaneando = false
	public datosQR: any = ""
	/* FIN COSAS RELACIONADAS AL QR */

	constructor(private rutaActivada: ActivatedRoute, private ruta: Router, private toast: ToastService, private theme: ThemeService) {
		this.usuario = new Usuario("", "", "", "", "", "", "", true, NivelEducacional.findNivelEducacional(1)!, undefined)
		this.rutaActivada.queryParams.subscribe(params => {
			const nav = this.ruta.getCurrentNavigation()
			if (nav && nav.extras.state) {
				this.usuario = nav.extras.state["usuario"] ? nav.extras.state["usuario"] : null
				this.datosQR = nav.extras.state["datosQR"] ? nav.extras.state["datosQR"] : null
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
	
	getSalut(): string {
		const h = new Date().getHours()
		if (h >= 5 && h < 12) { return "Buenos días" }
		else if (h >= 12 && h < 18) { return "Buenas tardes" }
		else { return "Buenas noches" }
	}

  	ngOnInit() {
		this.theme.darkMode$.subscribe(isDark => { this.darkMode = isDark })
		//this.initScan()
		localStorage.setItem("usuarioActual", JSON.stringify(this.usuario))
		Usuario.getUsuarioPorCuenta(this.usuario.cuenta)
	}

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
					this.procesarQR(img)
					fileInput.value = ""
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

	// public procesarIMG(img: HTMLImageElement): void { this.procesarQR(img) }
	// public procesarVideo(): boolean { return this.procesarQR(this.video.nativeElement, true) }

	async checkVideo() {
		if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
			if (this.procesarQR(this.video.nativeElement, true) || !this.escaneando) { return }
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
		this.ruta.navigate(["miclase"], { state: { "datosQR": objetoDatosQR } })
	}
	
	/* FIN DE COSAS RELACIONADAS AL QR */
}
