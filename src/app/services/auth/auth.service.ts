
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from "@angular/router";
import { auth } from 'firebase/app';
import { Usuario } from 'src/app/interfaces/usuario';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FirestoreService } from '../firebase/firestore.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: any = null;
  private firestoreService: FirestoreService;


  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private service: FirestoreService) {

    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });
    this.firestoreService = service;
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) { return 'Visitante' }
    else if (this.currentUserAnonymous) { return 'Anonimo' }
    else { return this.authState['displayName'] || 'Usuario sem nome' }
  }

  //// Social Auth ////

  githubLogin() {
    const provider = new auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  twitterLogin() {
    const provider = new auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user
        this.updateUserData()
      })
      .catch(error => console.log(error));
  }


  //// Anonymous Auth ////

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then((data) => {
        this.authState = data.user
        this.updateUserData()
      })
      .catch(error => console.log(error));
  }

  //// Email/Password Auth ////

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
        this.updateUserData()
      })
      .catch(error => console.log(error));
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
        this.updateUserData()
      })
      .catch(error => console.log(error));
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    var auth = new auth;

    return auth.sendPasswordResetEmail(email)
      .then(() => console.log("email enviado"))
      .catch((error) => console.log(error))
  }


  //// Sign Out ////

  signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/'])
  }


  //// Helpers ////

  private updateUserData() {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`usuarios/${this.currentUserId}`);
    let userData: Usuario = {
      uid: this.currentUserId,
      email: this.authState.email,
      nome: this.currentUserDisplayName,
      listas: []
    }
    return this.firestoreService.upsert(userRef, userData);
  }
}