import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NovaListaPage } from '../nova-lista/nova-lista.page';
import { ListaService } from 'src/app/services/lista/lista.service';
import { Observable } from 'rxjs';
import { Lista } from '../../interfaces/lista';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  listas: Lista[];

  constructor(public modalController: ModalController, public listaService: ListaService) { }

  ngOnInit(){
    this.listaService.getListas().subscribe(res => {
      this.listas = res;
    })
  }
  abrirLista($event) {
    console.log("Abrir Lista", $event);
  }

  async novaLista() {
    const modal = await this.modalController.create({
      component: NovaListaPage
    });

    await modal.present();

    //TODO: implementar integração firebase
    const { data } = await modal.onWillDismiss();
    if (data.lista) {
      this.listaService.addLista(data.lista);
    }

  }


}
