import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';
import { Lista } from '../../interfaces/lista';
import { NovaListaPage } from '../nova-lista/nova-lista.page';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  listas: Observable<Lista[]>;
  listaRef: AngularFirestoreCollection;

  constructor(public modalController: ModalController, 
    public firestoreService: FirestoreService, 
    private router: Router, 
    private auth: AuthService, 
    private afs: AngularFirestore,
    private loadingController: LoadingController) { }

  async ngOnInit() {
    
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      duration: 5000,
      message: 'Carregando listas...',
      translucent: true,
    });
    await loading.present();
    
    this.listaRef = this.afs.collection<Lista>('listas', ref => ref.orderBy('createdAt'));
    this.listas = await this.firestoreService.list(this.listaRef);

    await loading.dismiss();
  }
  abrirLista(id) {
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
      this.firestoreService.add(this.listaRef,data.lista);
    }

  }

  async loader(){
    return 
  }


}
