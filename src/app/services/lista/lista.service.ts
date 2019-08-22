import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, QueryDocumentSnapshot } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lista } from 'src/app/interfaces/lista';

@Injectable({
  providedIn: 'root'
})
export class ListaService {
  private listasCollectiion: AngularFirestoreCollection<Lista>;
  private listas: Observable<Lista[]>;
  private lastSeen: QueryDocumentSnapshot<Lista>;
  private LIMIT: number = 10;
  public db: AngularFirestore;

  constructor(db: AngularFirestore) { 
    this.db = db;
    this.listasCollectiion = db.collection<Lista>('listas',ref => ref.orderBy('data_criacao').limit(this.LIMIT));

    this.listas = this.listasCollectiion.snapshotChanges().pipe(
      map(actions => {
        //ULTIMO LISTA
        this.lastSeen = actions[this.LIMIT - 1].payload.doc;

        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getListas(){
    return this.listas;
  }

  getMoreListas(){
    var novasListasCollection = this.db.collection<Lista>('listas', ref => ref.orderBy('data_criacao').startAfter(this.lastSeen).limit(this.LIMIT));

    var novasListas = novasListasCollection.snapshotChanges().pipe(
      map(actions => {
        if (actions.length > 0) {
          //ULTIMO LISTA
          this.lastSeen = actions[actions.length-1].payload.doc;
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }
        else{
          return null;
        }
      })
    );

    return novasListas;
  }

  getLista(id: string) {
    return this.listasCollectiion.doc<Lista>(id).valueChanges();
  }

  updateLista(evento: Lista, id: string) {
    return this.listasCollectiion.doc(id).update(evento);
  }

  addLista(evento: Lista) {
    return this.listasCollectiion.add(evento);
  }

  removeLista(id: string) {
    return this.listasCollectiion.doc(id).delete();
  }
}
