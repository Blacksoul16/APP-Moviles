import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ApiService {

	httpOptions = {
		headers: new HttpHeaders({
			"content-type": "application/json"
			// "access-control-allow-origin": "*"
		})
	}

	apiURL = "http://localhost:3000"

	constructor(private http: HttpClient) {}

	getUser(id: number): Observable<any> { return this.http.get(this.apiURL + "/users/" + id).pipe(retry(1)) }
	getUsers(): Observable<any> { return this.http.get(this.apiURL + "/users/").pipe(retry(1)) }
	
	getPosts(): Observable<any> { return this.http.get(this.apiURL + "/posts/").pipe(retry(1)) }
	getPost(id: number): Observable<any> { return this.http.get(this.apiURL + "/posts/" + id).pipe(retry(1)) }
	createPost(post: any): Observable<any> { return this.http.post(this.apiURL + "/posts/", post, this.httpOptions).pipe(retry(1)) }
	updatePost(post: any): Observable<any> { return this.http.put(this.apiURL + "/posts/" + post.id, post, this.httpOptions).pipe(retry(1)) }
	deletePost(postID: any): Observable<any> { return this.http.delete(this.apiURL + "/posts/" + postID, this.httpOptions).pipe(retry(1)) }


}