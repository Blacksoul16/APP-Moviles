import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { Capacitor } from '@capacitor/core';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule, 
		IonicModule.forRoot(), 
		AppRoutingModule, 
		FormsModule, 
		TranslateModule.forRoot({ loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] }}), 
		HttpClientModule,
		IonicStorageModule.forRoot()
	],
	providers: [
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		provideAnimationsAsync(),
		{ provide: APP_INITIALIZER, useFactory: initFactory, deps: [InitAppService], multi: true },
		InitAppService,
		DataBaseService,
		AuthService,
		Storage
	],
	bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, "../assets/i18n/", ".json")
}

import { defineCustomElements as jeepSqlite} from 'jeep-sqlite/loader';
import { InitAppService } from './servicios/initapp.service';
import { DataBaseService } from './servicios/db.service';
import { AuthService } from './servicios/auth.service';
import { IonicStorageModule } from '@ionic/storage-angular';

const platform = Capacitor.getPlatform()
if (platform === "web") {
	jeepSqlite(window)
	window.addEventListener("DOMContentLoaded", async () => {
		const jeepEl = document.createElement("jeep-sqlite")
		document.body.appendChild(jeepEl)
		jeepEl.autoSave = true
	})
}

export function initFactory(init: InitAppService) {
	return () => init.initApp()
}