import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';
import { ToDoItem } from 'src/app/interfaces/item';
import { Lista } from 'src/app/interfaces/lista';
import { Observer, Observable } from 'rxjs';

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
  itemsPendentes: Observable<ToDoItem[]>;
  itemsFinalizados: Observable<ToDoItem[]>;

  item: ToDoItem = {
    prioridade: 1,
    nome: '',
    finalizado: false
  }

  constructor(private route: ActivatedRoute, private afs: AngularFirestore, private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.listaRef = this.afs.doc(`listas/${this.id}`);
    this.lista = this.firestoreService.get<Lista>(this.listaRef);

    this.itemsPendentesRef = this.afs.collection(`listas/${this.id}/items`, ref => ref.where('finalizado', '==', false));
    this.itemsPendentes = this.firestoreService.list<ToDoItem>(this.itemsPendentesRef);

    this.itemsFinalizadosRef = this.afs.collection(`listas/${this.id}/items`, ref => ref.where('finalizado', '==', true));
    this.itemsFinalizados = this.firestoreService.list<ToDoItem>(this.itemsFinalizadosRef);

    //Atualiza Contador da lista
    this.firestoreService.list<ToDoItem>(this.itemsPendentesRef).subscribe(res => {
      if (res) {
        return this.firestoreService.update(this.listaRef, { items: res.length });
      } else {
        return this.firestoreService.update(this.listaRef, { items: 0 })
      }
    });
  }

  toggleItem(item: ToDoItem) {
    item.finalizado = !item.finalizado;
    let itemRef = this.afs.doc(`listas/${this.id}/items/${item.id}`);
    this.firestoreService.update(itemRef, item);
  }

  adicionarItem() {
    //console.log(this.item);
    this.firestoreService.add(this.itemsPendentesRef, this.item).then(() => this.limparItem());
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

  popoverSchedule() {

  }

  atualizarContadorLista() {
    return this.itemsPendentes.subscribe(res => {
      if (res) {
        return this.firestoreService.update(this.listaRef, { items: res.length });
      } else {
        return this.firestoreService.update(this.listaRef, { items: 0 })
      }
    })
  }
}
