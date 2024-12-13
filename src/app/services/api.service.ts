import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {

	private http = inject(HttpClient)
	private url = "http://localhost:3000"
	private params = { headers: new HttpHeaders({ "content-type": "application/json" }) }

	getUsers(): Observable<any> { return this.http.get(this.url + "/users/").pipe(retry(1)) }
	getPosts(): Observable<any> { return this.http.get(this.url + "/posts/").pipe(retry(1)) }
	getUser(id: number): Observable<any> { return this.http.get(this.url + "/users/" + id).pipe(retry(1)) }
	getPost(id: number): Observable<any> { return this.http.get(this.url + "/posts/" + id).pipe(retry(1)) }
	deletePost(id: any): Observable<any> { return this.http.delete(this.url + "/posts/" + id, this.params).pipe(retry(1)) }
	createPost(post: any): Observable<any> { return this.http.post(this.url + "/posts/", post, this.params).pipe(retry(1)) }
	updatePost(post: any): Observable<any> { return this.http.put(this.url + "/posts/" + post.id, post, this.params).pipe(retry(1)) }

}
