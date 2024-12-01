import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import jsQR, { QRCode } from 'jsqr';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { Subscription } from 'rxjs';

@Component({
	selector: 'duocuc-codigoqr',
	templateUrl: './codigoqr.component.html',
	styleUrls: ['./codigoqr.component.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule, RouterModule, TranslateModule]
})
export class CodigoqrComponent implements OnInit, OnDestroy {

	public salut: string = this.getSalut()
	public usuario: any

	private subs: Subscription = new Subscription()

	@ViewChild("video")
	private video!: ElementRef
	@ViewChild("canvas")
	private canvas!: ElementRef
	public escaneando = false
	public nativo = Capacitor.isNativePlatform()
	public datosQR: any = ""

	constructor(private auth: AuthService, private toast: ToastService) {}

	ngOnInit() { this.subs.add(this.auth.userAuth$.subscribe((u) => { this.usuario = u })) }
	ngOnDestroy() { this.subs.unsubscribe() }
	
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
			this.stopScan()
			return true
		} else {
			if (!esVideo) {
				this.toast.showMsg("No se detectó un código QR. Por favor, seleccione un archivo válido.", 2000, "danger")
			}
			return false
		}
	}

	async checkVideo() {
		if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
			if (this.procesarQR(this.video.nativeElement, true) || !this.escaneando) { return }
			requestAnimationFrame(this.checkVideo.bind(this))
		} else {
			requestAnimationFrame(this.checkVideo.bind(this))
		}
	}

	async stopScan() {
		this.escaneando = false
		if (Capacitor.isNativePlatform()) {
			await BarcodeScanner.stopScan()
		} else {
			const stream = this.video.nativeElement.srcObject as MediaStream
			if (stream) {
				const tracks = stream.getTracks()
				tracks.forEach(track => { track.stop() })
			}
			this.video.nativeElement.srcObject = null
		}
	}

	async initScan() {
		try {
			if (Capacitor.isNativePlatform()) {
				//Nativo
				const status = await BarcodeScanner.checkPermission({ force: true })
				if (!status.granted) {
					this.toast.showMsg("Sin permisos para usar la cámara.", 2500, "danger")
					return
				}
				this.escaneando = true
				// document.querySelector('body')?.classList.add('scanner-active')
				await BarcodeScanner.hideBackground()
				const scanResult = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] })
				if (scanResult.hasContent) {
					this.showQRData(scanResult.content)
					this.toast.showMsg("QR escaneado con éxito.", 2500, "success")
				} else {
					this.toast.showMsg("No se detectó contenido en el QR.", 2500, "warning")
				}
				// document.querySelector('body')?.classList.remove('scanner-active')
				await BarcodeScanner.showBackground()
				this.escaneando = false

			} else {
				//Web
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
			}
		} catch (e) {
			this.escaneando = false
			this.toast.showMsg(`No se pudo acceder a la cámara: ${e}`, 3000, "danger")
			console.error("No se pudo acceder a la cámara:", e)
		}
	}
	
	public showQRData(datosQR: string): void {
		const objetoDatosQR = JSON.parse(datosQR)
		this.auth.codigoQRData.next(objetoDatosQR)
		this.auth.tabSeleccionado.next("miclase")
	}
	
}
