import { Injectable } from '@angular/core';
import { Action, AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshotDoesNotExist, DocumentSnapshotExists } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';



@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private afs: AngularFirestore) { }

  /// Firebase Server Timestamp
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  set<T>(documentRef: AngularFirestoreDocument, data: T): Promise<void> {
    const timestamp = this.timestamp;
    return documentRef.set({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp,
    });
  }

  update<T>(documentRef: AngularFirestoreDocument, data: T): Promise<void> {
    return documentRef.update({
      ...data,
      updatedAt: this.timestamp,
    });
  }

  delete<T>(documentRef: AngularFirestoreDocument): Promise<void> {
    return documentRef.delete();
  }

  add<T>(collectionRef: AngularFirestoreCollection, data: T): Promise<firebase.firestore.DocumentReference> {
    const timestamp = this.timestamp;
    return collectionRef.add({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp,
    });
  }

  upsert<T>(documentRef: AngularFirestoreDocument, data: T): Promise<void> {
    const doc = documentRef
      .snapshotChanges()
      .pipe(take(1))
      .toPromise();
  
    return doc.then((snap: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
      return snap.payload.exists ? this.update(documentRef, data) : this.set(documentRef, data);
    });
  }

  list<T>(collectionRef:AngularFirestoreCollection):Observable<any[]>{
    return collectionRef.snapshotChanges().pipe(
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

  get<T>(documentRef:AngularFirestoreDocument):Observable<any>{
    return documentRef.valueChanges();
  }
}
