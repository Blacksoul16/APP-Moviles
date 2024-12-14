import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader'
import { InitappService } from './app/services/initapp.service';
import { AuthService } from './app/services/auth.service';
import { DataBaseService } from './app/services/database.service';
import { Storage } from '@ionic/storage-angular';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
	providers: [
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{ provide: APP_INITIALIZER, useFactory: initFactory, deps: [InitappService], multi: true },
		provideIonicAngular(),
		provideRouter(routes, withPreloading(PreloadAllModules)),
		importProvidersFrom(TranslateModule.forRoot({loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient]}})),
		importProvidersFrom(HttpClientModule),
		importProvidersFrom([BrowserAnimationsModule]),
		Storage,
		InitappService,
		AuthService,
		DataBaseService,
		provideAnimations()
	],
});

export function HttpLoaderFactory(http: HttpClient) { return new TranslateHttpLoader(http, "assets/i18n/", ".json") }
export function initFactory(init: InitappService) { return () => init.initApp() }

const platform = Capacitor.getPlatform()
if (platform === "web") {
	jeepSqlite(window)
	window.addEventListener("DOMContentLoaded", async () => {
		const jeepEl = document.createElement("jeep-sqlite")
		document.body.appendChild(jeepEl)
		jeepEl.autoSave = true
	})
}
