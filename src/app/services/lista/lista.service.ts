import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, QueryDocumentSnapshot } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lista } from 'src/app/interfaces/lista';

@Injectable({
  providedIn: 'root'
})
export class ListaService {
  private listasCollection: AngularFirestoreCollection<Lista>;
  private listas: Observable<Lista[]>;
  private lastSeen: QueryDocumentSnapshot<Lista>;
  private LIMIT: number = 10;
  public db: AngularFirestore;

  constructor(db: AngularFirestore) {
    this.db = db;
    this.listasCollection = db.collection<Lista>('listas', ref => ref.orderBy('data_criacao').limit(this.LIMIT));

    this.listas = this.listasCollection.snapshotChanges().pipe(
      map(actions => {
        if (actions.length > 0) {
          //ULTIMO LISTA
          this.lastSeen = actions[actions.length > this.LIMIT ? this.LIMIT - 1 : actions.length - 1].payload.doc;

          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }
      })
    );
  }

  getListas() {
    return this.listas;
  }

  getMoreListas() {
    var novasListasCollection = this.db.collection<Lista>('listas', ref => ref.orderBy('data_criacao').startAfter(this.lastSeen).limit(this.LIMIT));

    var novasListas = novasListasCollection.snapshotChanges().pipe(
      map(actions => {
        if (actions.length > 0) {
          //ULTIMO LISTA
          this.lastSeen = actions[actions.length - 1].payload.doc;
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }
        else {
          return null;
        }
      })
    );

    return novasListas;
  }

  getLista(id: string) {
    return this.listasCollection.doc<Lista>(id).valueChanges();
  }

  updateLista(evento: Lista, id: string) {
    return this.listasCollection.doc(id).update(evento);
  }

  addLista(evento: Lista) {
    return this.listasCollection.add(evento);
  }

  removeLista(id: string) {
    return this.listasCollection.doc(id).delete();
  }
  
  getItems(id: string){
    let itemsCollection = this.db.collection<Lista>(`listas/${id}/items`, ref => ref.orderBy('data_criacao'));
    return itemsCollection.snapshotChanges().pipe(
      map(actions => {
        if (actions.length > 0) {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }
      })
    );
  }
}
