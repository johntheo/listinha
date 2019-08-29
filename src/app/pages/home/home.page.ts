import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NovaListaPage } from '../nova-lista/nova-lista.page';
import { ListaService } from 'src/app/services/lista/lista.service';
import { Observable } from 'rxjs';
import { Lista } from '../../interfaces/lista';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  listas: Lista[];
  listaRef: AngularFirestoreCollection;

  constructor(public modalController: ModalController, public listaService: FirestoreService, private router: Router, private auth: AuthService, private afs: AngularFirestore) {
    this.listaRef = this.afs.collection<Lista>('listas', ref => ref.orderBy('createdAt'));
  }

  ngOnInit() {
    this.listaService.list(this.listaRef).subscribe(res => {
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
      this.listaService.add(this.listaRef,data.lista);
    }

  }


}
