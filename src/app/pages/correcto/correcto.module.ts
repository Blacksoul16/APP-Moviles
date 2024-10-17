import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CorrectoPageRoutingModule } from './correcto-routing.module';

import { CorrectoPage } from './correcto.page';
import { SharedModule } from 'src/app/componentes/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorrectoPageRoutingModule,
    SharedModule
  ],
  declarations: [CorrectoPage]
})
export class CorrectoPageModule {}
