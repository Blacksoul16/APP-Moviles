import { Component, ElementRef, inject, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastsService } from 'src/app/services/toasts.service';
import jsQR, { QRCode } from 'jsqr';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'
import { IonTitle, IonBadge, IonCard, IonCardContent, IonButton, IonIcon, IonText } from "@ionic/angular/standalone";

@Component({
	selector: 'duocuc-codigoqr',
	templateUrl: './codigoqr.component.html',
	styleUrls: ['./codigoqr.component.scss'],
	standalone: true,
	imports: [
		IonText, IonIcon, IonButton, IonCardContent, IonCard, IonBadge, IonTitle, 
		CommonModule, FormsModule, RouterModule, TranslateModule
	]
})
export class CodigoqrComponent implements OnInit, OnDestroy {

	private auth = inject(AuthService)
	private toast = inject(ToastsService)
	private menuState = inject(MenuStateService)
	private zone = inject(NgZone)

	protected salut: string = this.getSalut()
	protected usuario: any

	private scanTimeout: any
	private subs: Subscription = new Subscription()

	@ViewChild("video") private video!: ElementRef
	@ViewChild("canvas") private canvas!: ElementRef
	protected escaneando = false
	protected nativo = Capacitor.isNativePlatform()
	protected datosQR: any = ""

	constructor() {}

	ngOnInit() { 
		this.subs.add(this.auth.userAuth$.subscribe((u) => { this.usuario = u }))
		this.subs.add(this.menuState.menuOpen$.subscribe((i) => { if (i && this.escaneando) { this.stopScan() } }))
	}
	ngOnDestroy() { this.subs.unsubscribe(); this.stopScan() }
	
	private getSalut(): string {
		const h = new Date().getHours()
		if (h >= 5 && h < 12) { return "Buenos días" }
		else if (h >= 12 && h < 18) { return "Buenas tardes" }
		else { return "Buenas noches" }
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
				this.toast.showMsg("No se detectó un código QR. Por favor, selecciona un archivo válido.", 3000, "danger")
			}
			return false
		}
	}

	private async checkVideo() {
		if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
			if (this.procesarQR(this.video.nativeElement, true) || !this.escaneando) { return }
			requestAnimationFrame(this.checkVideo.bind(this))
		} else {
			requestAnimationFrame(this.checkVideo.bind(this))
		}
	}

	protected async stopScan() {
		this.escaneando = false
		if (this.nativo) {
			await BarcodeScanner.removeAllListeners()
			await BarcodeScanner.stopScan()
			document.querySelector("body")?.classList.remove("barcode-scanner-active")
			if (this.scanTimeout) { clearTimeout(this.scanTimeout); this.scanTimeout = null }
		} else {
			const stream = this.video.nativeElement.srcObject as MediaStream
			if (stream) {
				const tracks = stream.getTracks()
				tracks.forEach(track => { track.stop() })
			}
			this.video.nativeElement.srcObject = null
		}
	}

	protected async initScan() {
		try {
			if (this.nativo) {
				//Nativo
				const status = await BarcodeScanner.checkPermissions()
				if (!status.camera) {
					this.toast.showMsg("Sin permisos para usar la cámara.", 2500, "danger")
					return
				}
				this.scanTimeout = setTimeout(() => {
					this.toast.showMsg("Se excedió el tiempo de escaneo.", 2500, "danger")
					this.stopScan()
				}, 15000)
				document.querySelector("body")?.classList.add("barcode-scanner-active")
				await BarcodeScanner.addListener("barcodeScanned", async (result: { barcode: { rawValue: string; }; }) => {
					this.toast.showMsg("QR escaneado con éxito.", 2500, "success")
					await this.stopScan()
					this.showQRData(result.barcode.rawValue)
				})
				this.escaneando = true
				await BarcodeScanner.startScan()
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
			this.toast.showMsg(`No se pudo acceder a la cámara: ${e}`, 3000, "danger")
			if (this.escaneando) { this.stopScan() }
		}
	}
	
	public showQRData(datosQR: string): void {
		try {
			const objetoDatosQR = JSON.parse(datosQR)
			this.zone.run(() => {
				this.auth.codigoQRData.next(objetoDatosQR)
				this.auth.tabSeleccionado.next("miclase")
			})
		} catch (e) {
			this.toast.showMsg("El código QR no contiene un JSON válido.", 3000, "danger")
			if (this.escaneando) { this.stopScan() }
		}
	}
	
}
