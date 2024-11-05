import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MirutaPage } from './miruta.page';

const routes: Routes = [
  {
    path: '',
    component: MirutaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MirutaPageRoutingModule {}
