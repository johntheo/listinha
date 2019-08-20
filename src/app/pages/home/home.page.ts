import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NovaListaPage } from '../nova-lista/nova-lista.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public modalController: ModalController) {}

  abrirLista($event){
    console.log("Abrir Lista",$event);
  }

  async novaLista() {
    const modal = await this.modalController.create({
      component: NovaListaPage
    });
    return await modal.present();
  }

}
