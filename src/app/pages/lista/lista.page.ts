import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';
import { ToDoItem } from 'src/app/interfaces/item';
import { Lista } from 'src/app/interfaces/lista';
import { Observer, Observable } from 'rxjs';
import { LoadingController, PopoverController } from '@ionic/angular';
import { ItemScheduleComponent } from 'src/app/components/item-schedule/item-schedule.component';
import { ItemPrioridadeComponent } from 'src/app/components/item-prioridade/item-prioridade.component';

@Component({
  selector: 'lista-page',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {
  status: string = "pendentes";

  id: string;
  listaRef: AngularFirestoreDocument;
  itemsPendentesRef: AngularFirestoreCollection;
  itemsFinalizadosRef: AngularFirestoreCollection;

  lista: Observable<Lista>;
  itemsPendentes: ToDoItem[];
  itemsFinalizados: ToDoItem[];

  porcentagem: number = 0;

  item: ToDoItem = {
    prioridade: 1,
    nome: '',
    finalizado: false
  }

  constructor(private route: ActivatedRoute, private afs: AngularFirestore, private firestoreService: FirestoreService, private loadingCtrl: LoadingController, private popoverCtrl: PopoverController) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      duration: 5000,
      message: 'Carregando items...',
      translucent: true,
    });
    await loading.present();

    this.id = this.route.snapshot.paramMap.get('id');

    this.listaRef = this.afs.doc(`listas/${this.id}`);
    this.lista = await this.firestoreService.get<Lista>(this.listaRef);

    this.itemsPendentesRef = this.afs.collection(`listas/${this.id}/items`, ref => ref.where('finalizado', '==', false));
    await this.firestoreService.list<ToDoItem>(this.itemsPendentesRef).subscribe(res => {
      this.itemsPendentes = res;
    });

    this.itemsFinalizadosRef = this.afs.collection(`listas/${this.id}/items`, ref => ref.where('finalizado', '==', true));
    await this.firestoreService.list<ToDoItem>(this.itemsFinalizadosRef).subscribe(res => {
      this.itemsFinalizados = res;
    });

    //Atualiza Contador da lista
    await this.firestoreService.list<ToDoItem>(this.afs.collection(`listas/${this.id}/items`)).subscribe(res => {
      if (res) {
        let pendentes = res.filter(el => el.finalizado == false).length;
        let finalizados = res.filter(el => el.finalizado == true).length;
        this.porcentagem = finalizados / (finalizados + pendentes);

        return this.firestoreService.update(this.listaRef, { porcentagem: this.porcentagem });
      } else {
        this.porcentagem = 0;

        return this.firestoreService.update(this.listaRef, { porcentagem: 0 })
      }
    });

    await loading.dismiss();
  }

  toggleItem(item: ToDoItem) {
    item.finalizado = !item.finalizado;
    let itemRef = this.afs.doc(`listas/${this.id}/items/${item.id}`);
    this.firestoreService.update(itemRef, item);
  }

  adicionarItem() {
    if (this.item.nome) {
      this.firestoreService.add(this.itemsPendentesRef, this.item).then(() => this.limparItem());
    }
  }

  deletarItem(item: ToDoItem) {
    let itemRef = this.afs.doc(`listas/${this.id}/items/${item.id}`);
    this.firestoreService.delete(itemRef);
    //TODO: Toast
  }

  onSwipe(item: ToDoItem, event) {
    if (event.detail.side == "start") {
      this.deletarItem(item);
    } else if (event.detail.side == "end") {
      this.toggleItem(item);
    }
  }

  limparItem() {
    this.item = {
      prioridade: 1,
      nome: '',
      finalizado: false
    }
  }

  async popoverSchedule(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: ItemScheduleComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();

  }

  async popoverPrioridade(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: ItemPrioridadeComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();

  }

}
