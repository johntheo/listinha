import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NovaListaPage } from '../nova-lista/nova-lista.page';
import { ListaService } from 'src/app/services/lista/lista.service';
import { Observable } from 'rxjs';
import { Lista } from '../../interfaces/lista';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  listas: Lista[];

  constructor(public modalController: ModalController, public listaService: ListaService, private router:Router) { }

  ngOnInit(){
    this.listaService.getListas().subscribe(res => {
      this.listas = res;
    })
  }
  abrirLista(id) {
    console.log("Abrir Lista", id);
    this.router.navigate([`/lista/${id}`]);
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
