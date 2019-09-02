import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-item-prioridade',
  templateUrl: './item-prioridade.component.html',
  styleUrls: ['./item-prioridade.component.scss'],
})
export class ItemPrioridadeComponent implements OnInit {

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {}

  setPrioridade(){
    this.popoverCtrl.dismiss();
  }
}
