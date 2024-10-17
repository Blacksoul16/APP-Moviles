import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncorrectoPageRoutingModule } from './incorrecto-routing.module';

import { IncorrectoPage } from './incorrecto.page';
import { SharedModule } from 'src/app/componentes/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncorrectoPageRoutingModule,
    SharedModule
  ],
  declarations: [IncorrectoPage]
})
export class IncorrectoPageModule {}
