import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Usuario } from 'src/app/model/usuario';
import { DataBaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { IonCheckbox, IonInput, IonBadge, IonTitle, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonPopover, IonList, IonAvatar, IonLabel, IonItem } from "@ionic/angular/standalone";

@Component({
	selector: 'duocuc-usuarios',
	templateUrl: './usuarios.component.html',
	styleUrls: ['./usuarios.component.scss'],
	standalone: true,
	imports: [
		IonCheckbox, IonItem, IonLabel, IonAvatar, IonList, IonInput, IonPopover, 
		IonButton, IonIcon, IonCol, IonRow, IonGrid, IonTitle, IonBadge, 
		CommonModule, FormsModule, RouterModule, TranslateModule
	]
})
export class UsuariosComponent implements OnInit, OnDestroy {

	private db = inject(DataBaseService)
	private auth = inject(AuthService)
	private subs: Subscription = new Subscription()
	private users: Usuario[] = []
	private debounceTimer: any
	private rolesSeleccionados: number[] = []
	protected usuariosFiltrados: Usuario[] = []
	protected usuarioBusqueda: string = ""

	protected usuario: any

	protected filtroAdmin: boolean = false
	protected filtroUsuario: boolean = false

	@ViewChild("opcionesFiltro", { static: true }) poppy!: IonPopover

	constructor() { this.cargarUsuarios() }

	ngOnInit() { this.subs.add(this.auth.userAuth$.subscribe((u) => { this.usuario = u })) }
	ngOnDestroy() { this.subs.unsubscribe() }

	async cargarUsuarios() {
		this.db.readUsers().then(users => {
			this.users = users
			this.usuariosFiltrados = [...this.users]
		})
	}

	async deleteUser(u: string) { this.db.deleteUserByAccount(u).then(() => { this.cargarUsuarios() }) }

	async debounceSearch(e: any) {
		clearTimeout(this.debounceTimer)
		this.debounceTimer = setTimeout(() => { this.filtrarUsuarios() }, 500)
	}

	async filtrarUsuarios() {
		const lowerText = this.usuarioBusqueda.toLowerCase()
		this.usuariosFiltrados = this.users.filter(u => (u.nombre + " " + u.apellido).toLowerCase().includes(lowerText) || u.cuenta.toLowerCase().includes(lowerText))
	}

	async aplicarFiltro() {
		const roles = this.rolesSeleccionados.map(rol => Number(rol))
		if (roles.length > 0) {
			this.usuariosFiltrados = this.users.filter(u => roles.includes(u.rol))
		} else {
			this.usuariosFiltrados = this.users
		}

		this.usuariosFiltrados = this.usuariosFiltrados.sort((a, b) => {
			const nombreA = a.nombre.toLowerCase()
			const nombreB = b.nombre.toLowerCase()
			return nombreA.localeCompare(nombreB)
		})
	}

	async abrirFiltros(e: Event) { this.poppy.event = e; this.poppy.present() }

	async aplicarFiltroPopover() {
		this.rolesSeleccionados = []
		if (this.filtroAdmin) this.rolesSeleccionados.push(1)
		if (this.filtroUsuario) this.rolesSeleccionados.push(0)
		this.aplicarFiltro()
	}
}
