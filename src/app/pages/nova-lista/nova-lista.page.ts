import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Lista } from 'src/app/interfaces/lista';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'nova-lista',
  templateUrl: './nova-lista.page.html',
  styleUrls: ['./nova-lista.page.scss'],
})
export class NovaListaPage implements OnInit {
  lista: Lista = {
    nome: '',
    cor: '',
    porcentagem: 0,
    editores: [],
    leitores: [],
    proprietario: ''
  };

  cores = [
    { nome: "red", valor: "#DB2828" },
    { nome: "orange", valor: " #F2711C" },
    { nome: "yellow", valor: " #FBBD08" },
    { nome: "olive", valor: " #B5CC18" },
    { nome: "green", valor: " #21BA45" },
    { nome: "teal", valor: " #00B5AD" },
    { nome: "blue", valor: " #2185D0" },
    { nome: "violet", valor: " #6435C9" },
    { nome: "purple", valor: " #A333C8" },
    { nome: "pink", valor: " #E03997" },
  ]

  constructor(public modalCtrl: ModalController, private auth:AuthService) {
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  criar(form) {
    this.lista.proprietario = this.auth.currentUserId;
    this.modalCtrl.dismiss({
      'lista': this.lista
    });
  }

}
