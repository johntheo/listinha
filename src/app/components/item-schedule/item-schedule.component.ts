import { Component, OnInit } from '@angular/core';
import { Data } from 'src/app/interfaces/data';

@Component({
  selector: 'app-item-schedule',
  templateUrl: './item-schedule.component.html',
  styleUrls: ['./item-schedule.component.scss'],
})
export class ItemScheduleComponent implements OnInit {
  
  data:Data = {
    recorrente: false,
    dataInicio: null,
    dataFim: null,
    regra: null
  }
  constructor() { }

  ngOnInit() {}

}
