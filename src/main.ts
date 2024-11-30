import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { Storage } from '@ionic/storage-angular';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

bootstrapApplication(AppComponent, {
	providers: [
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{ provide: APP_INITIALIZER, useFactory: initFactory, deps: [InitappService], multi: true },
		provideIonicAngular(),
		provideRouter(routes, withPreloading(PreloadAllModules)),
		Storage,
		TranslateService,
		TranslateStore,
		importProvidersFrom(HttpClientModule),
		importProvidersFrom(TranslateModule.forRoot({loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient]}})),
		importProvidersFrom([BrowserAnimationsModule]),
		InitappService,
		AuthService,
		DataBaseService,
		provideAnimations(),
	],
});

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, "assets/i18n/", ".json")
}

import { defineCustomElements as jeepSqlite} from 'jeep-sqlite/loader';
import { Capacitor } from '@capacitor/core';
import { InitappService } from './app/services/initapp.service';
import { AuthService } from './app/services/auth.service';
import { DataBaseService } from './app/services/database.service';

const platform = Capacitor.getPlatform()
if (platform === "web") {
	jeepSqlite(window)
	window.addEventListener("DOMContentLoaded", async () => {
		const jeepEl = document.createElement("jeep-sqlite")
		document.body.appendChild(jeepEl)
		jeepEl.autoSave = true
	})
}

export function initFactory(init: InitappService) {
	return () => init.initApp()
}