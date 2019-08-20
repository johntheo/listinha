import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NovaListaPage } from './nova-lista.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  entryComponents: [NovaListaPage],
  declarations: [NovaListaPage]
})
export class NovaListaPageModule {}
