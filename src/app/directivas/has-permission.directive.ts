import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../servicios/auth.service';

@Directive({
	selector: '[duocucHasPermission]',
	standalone: true
})
export class HasPermissionDirective {

	@Input("duocucHasPermission") set permission(permission: string) {
		if (this.auth.hasPermission(permission)) {
			this.viewContainer.createEmbeddedView(this.templateRef)
		} else {
			this.viewContainer.clear()
		}
	}

	constructor(private auth: AuthService, private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) { }

}
