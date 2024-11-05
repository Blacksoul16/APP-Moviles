import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MirutaPageRoutingModule } from './miruta-routing.module';

import { MirutaPage } from './miruta.page';
import { SharedModule } from 'src/app/componentes/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MirutaPageRoutingModule,
    SharedModule
  ],
  declarations: [MirutaPage]
})
export class MirutaPageModule {}
