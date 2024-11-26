import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/model/usuario';

@Component({
	selector: 'duocuc-foro',
	templateUrl: './foro.component.html',
	styleUrls: ['./foro.component.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule, RouterModule, TranslateModule]
})
export class ForoComponent  implements OnInit {

	public usuario: Usuario | null
	protected selectOptions = {
		message: "La publicación se hará bajo el usuario que selecciones."
	}

	selectedUserID: number | any
	selectedPost: string | any

	users: any
	posts: any
	
	post: any = {
		userID: null,
		id: null,
		title: "",
		body: "",
		name: ""
	}

	constructor(private translate: TranslateService, private api: ApiService, private toast: ToastService, private auth: AuthService) {
		this.usuario = this.auth.usuarioAutenticado.value
	}

	ngOnInit() {
		this.translate.use(localStorage.getItem("selectedLang") || "es")
		this.selectedUserID = null
		this.setPost(this.usuario?.cuenta, null, "", "", "")
		this.getUsers()
		this.getPosts()
	}

	changeUser($e: number) { this.setPost($e, null, "", "", "") }

	wipePost() { this.setPost(this.usuario?.cuenta, null, "", "", "") }
	
	setPost(userID: number | any, postID: number | any, title: string, body: string, name: string) {
		this.post.userID = userID
		this.post.id = postID
		this.post.title = title
		this.post.body = body
		this.post.name = name

		const uid = userID === null ? "Sin seleccionar" : userID
		const pid = postID === null ? "Nueva ID" : postID
		this.selectedPost = `${uid}`
		// this.selectedPost = `(UserID: ${uid} | PostID: ${pid})`
	}

	// En este caso, "d" es "data".
	async getUsers() { this.api.getUsers().subscribe(d => this.users = d) }
	async getPosts() {
		this.api.getPosts().subscribe((posts) => {
			this.api.getUsers().subscribe((users) => {
				posts.forEach((post: { name: any, userId: any }) => {
					post.name = users.find((u: { id: any; }) => u.id == post.userId).name
				})
				posts.reverse()
				this.posts = posts
			})
		})
	}

	async savePost() {
		if (this.post.userID === null) {
			this.toast.showMsg("Antes de hacer una publicación debes seleccionar un usuario.", 2500, "danger", "top")
			return
		} else if (this.post.title.trim() === "") {
			this.toast.showMsg("Antes de hacer una publicación debes llenar el título.", 2500, "danger", "top")
			return
		} else if (this.post.body.trim() === "") {
			this.toast.showMsg("Antes de hacer una poublicación debes llenar el cuerpo.", 2500, "danger", "top")
			return
		} else if (this.post.id === null) {
			this.createPost()
		} else {
			this.updatePost()
		}
	}

	async createPost() {
		const postRegistry = {
			"userId": this.post.userID,
			// "id": v4(),
			"title": this.post.title,
			"body": this.post.body
		}
		this.api.createPost(postRegistry).subscribe({
			next: (data) => {
				this.toast.showMsg(`Se creó la publicación: "${data.title}" (ID: ${data.id}).`, 2500, "success")
				this.wipePost()
				this.getPosts()
			},
			error: (error) => this.toast.showMsg(`No se pudo crear la publicación: ${error}`, 3000, "danger")
		})
	}

	async updatePost() {
		const postRegistry = {
			"userId": this.post.userID,
			"id": this.post.id,
			"title": this.post.title,
			"body": this.post.body
		}
		
		this.api.updatePost(postRegistry).subscribe({
			next: (data) => {
				this.toast.showMsg(`Se actualizó la publicación: "${data.title}" (ID: ${data.id}).`, 2500, "success")
				this.wipePost()
				this.getPosts()
				
			},
			error: (error) => this.toast.showMsg(`No se pudo actualizar la publicación.`, 3000, "danger")
		})
	}

	async editPost($e: any) {
		const post = $e
		this.setPost(post.userId, post.id, post.title, post.body, post.name)
		document.getElementById("top")!.scrollIntoView({block: "end", behavior: "smooth"})
	}

	async deletePost($e: any) {
		const postID = $e.id

		this.api.deletePost(postID).subscribe({
			next: (data) => {
				this.toast.showMsg(`Se eliminó la publicación con id ${postID}.`, 2500, "success")
				this.wipePost()
				this.getPosts()
			},
			error: (error) => this.toast.showMsg(`No se pudo eliminar la publicación: ${error}.`, 3000, "danger")
		})
	}

	getPostItemID(i: any, item: any) { return item.id }

}
