import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'nova-lista',
  templateUrl: './nova-lista.page.html',
  styleUrls: ['./nova-lista.page.scss'],
})
export class NovaListaPage implements OnInit {
  lista = {
    nome: '',
    cor: ''
  };

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  criar(form) {
    console.log(form.value)
  }

}
