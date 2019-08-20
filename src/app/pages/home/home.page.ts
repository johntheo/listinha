import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NovaListaPage } from '../nova-lista/nova-lista.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  listas = [
    {
      "nome" : "Contas",
      "cor": "#2185D0",
      "items": 12
    },
    {
      "nome" : "Viagens",
      "cor": "#21BA45",
      "items": 5
    },
  ]

  constructor(public modalController: ModalController) {}

  abrirLista($event){
    console.log("Abrir Lista",$event);
  }

  async novaLista() {
    const modal = await this.modalController.create({
      component: NovaListaPage
    });
    
    await modal.present();

    //TODO: implementar integração firebase
    const { data } = await modal.onWillDismiss();
    this.listas.push(data.lista)
    
  }


}
