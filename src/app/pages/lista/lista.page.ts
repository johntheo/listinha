import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';
import { ToDoItem } from 'src/app/interfaces/item';
import { Lista } from 'src/app/interfaces/lista';
import { Observer, Observable } from 'rxjs';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {

  id: string;
  listaRef: AngularFirestoreDocument;
  itemsPendentesRef: AngularFirestoreCollection;
  itemsFinalizadosRef: AngularFirestoreCollection;

  lista:Observable<Lista>;
  itemsPendentes:Observable<ToDoItem[]>;
  itemsFinalizados:Observable<ToDoItem[]>;

  item:ToDoItem = {
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
    this.itemsPendentes = this.firestoreService.list<ToDoItem>(this.itemsPendentesRef)
    
    this.itemsFinalizadosRef = this.afs.collection(`listas/${this.id}/items`, ref => ref.where('finalizado', '==', true));
    this.itemsFinalizados = this.firestoreService.list<ToDoItem>(this.itemsFinalizadosRef)

  }

  toggleItem(item:ToDoItem){
    item.finalizado = !item.finalizado;
    let itemRef = this.afs.doc(`listas/${this.id}/items/${item.id}`);
    this.firestoreService.update(itemRef,item);
  }

  adicionarItem(){
    //console.log(this.item);
    this.firestoreService.add(this.itemsPendentesRef,this.item).then(() => this.limparItem())
  }

  limparItem() {
    this.item = {
      prioridade: 1,
      nome: '',
      finalizado: false
    }
  }
}
