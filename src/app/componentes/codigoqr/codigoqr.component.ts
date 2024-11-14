import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jsQR, { QRCode } from 'jsqr';
import { AuthService } from 'src/app/servicios/auth.service';
import { ThemeService } from 'src/app/servicios/theme.service';
import { ToastService } from 'src/app/servicios/toast.service';

@Component({
	selector: 'duocuc-codigoqr',
	templateUrl: './codigoqr.component.html',
	styleUrls: ['./codigoqr.component.scss']
})
export class CodigoqrComponent implements OnInit {

	public darkMode: boolean = true
	public salut: string = ""
	public usuario: any

	@ViewChild("video")
	private video!: ElementRef
	@ViewChild("canvas")
	private canvas!: ElementRef
	public escaneando = false
	public datosQR: any = ""

	constructor(private auth: AuthService, private toast: ToastService, private theme: ThemeService) {
		this.usuario = this.auth.usuarioAutenticado.value
		this.salut = this.getSalut()
	}

	ngOnInit() {
		this.theme.darkMode$.subscribe(isDark => { this.darkMode = isDark })
	}

	private getSalut(): string {
		const h = new Date().getHours()
		if (h >= 5 && h < 12) { return "Buenos días" }
		else if (h >= 12 && h < 18) { return "Buenas tardes" }
		else { return "Buenas noches" }
	}

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
		try {
			const devices = await navigator.mediaDevices.enumerateDevices()
			const tieneCamara = devices.some(device => device.kind === "videoinput")
			if (!tieneCamara) {
				this.toast.showMsg("No se detectó una cámara en el dispositivo.", 2500, "danger")
				return
			}
			const mediaProvider: MediaProvider = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
			this.video.nativeElement.srcObject = mediaProvider
			this.video.nativeElement.setAttribute("playsinline", "true")
			this.video.nativeElement.play()
			this.escaneando = true
			requestAnimationFrame(this.checkVideo.bind(this))
		} catch (e) {
			this.toast.showMsg(`Hubo un error al intentar acceder a la cámara: ${e}`, 3000, "danger")
			console.error("Error al intentar acceder a la cámara:", e)
		}
	}
	
	public showQRData(datosQR: string): void {
		const objetoDatosQR = JSON.parse(datosQR)
		this.auth.codigoQRData.next(objetoDatosQR)
		this.auth.tabSeleccionado.next("miclase")
	}
	
}
