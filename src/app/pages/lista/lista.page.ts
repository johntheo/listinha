import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ToDoItem } from 'src/app/interfaces/item';
import { Lista } from 'src/app/interfaces/lista';
import { LoadingController, PopoverController, PickerController, IonDatetime } from '@ionic/angular';
import { ItemScheduleComponent } from 'src/app/components/item-schedule/item-schedule.component';
import { ItemPrioridadeComponent } from 'src/app/components/item-prioridade/item-prioridade.component';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';

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
  itemsPendentes: ToDoItem[];
  itemsFinalizados: ToDoItem[];

  porcentagem: number = 0;

  item: ToDoItem = {
    prioridade: 0,
    nome: '',
    finalizado: false,
    data: null,
    dataOcorrencia: ''
  }

  prioridadeCores = [
    "",
    "success",
    "warning",
    "danger"
  ]
  @ViewChild('datePicker', { static: false }) datePicker: IonDatetime;

  customPickerOptions: any;

  constructor(private route: ActivatedRoute, private afs: AngularFirestore, private firestoreService: FirestoreService, private loadingCtrl: LoadingController, private popoverCtrl: PopoverController) { }

  async ngOnInit() {

    this.customPickerOptions = {
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        color: 'success',
        handler: () => { this.item.dataOcorrencia = '' }
      },{
        text: 'Salvar',
        color: 'success',
        handler: (data) => {
          console.log(data);
          let year: string = data.year.text;
          let month: string = data.month.value < 10 ? '0' + data.month.value.toString() : data.month.value.toString();
          let day: string = data.day.text;
          // let hour: string = data.hour.text;
          // let minute: string = data.minute.text;
          this.item.dataOcorrencia = year + '-' + month + '-' + day + 'T' + '00:00' + ':00-0300';

        }
      }]
    };

    const loading = await this.loadingPresent();

    this.id = this.route.snapshot.paramMap.get('id');

    await this.loadListas();

    //Atualiza Contador da lista
    await this.updateContadorLista();

    await loading.dismiss();
  }

  private async loadingPresent() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      duration: 5000,
      message: 'Carregando items...',
      translucent: true,
    });
    await loading.present();
    return loading;
  }

  private async loadListas() {
    this.listaRef = this.afs.doc(`listas/${this.id}`);
    this.lista = await this.firestoreService.get<Lista>(this.listaRef);
    this.itemsPendentesRef = this.afs.collection(`listas/${this.id}/items`, ref => ref.where('finalizado', '==', false).orderBy('prioridade', 'desc'));
    await this.firestoreService.list<ToDoItem>(this.itemsPendentesRef).subscribe(res => {
      this.itemsPendentes = res;
    });
    this.itemsFinalizadosRef = this.afs.collection(`listas/${this.id}/items`, ref => ref.where('finalizado', '==', true).orderBy('prioridade', 'desc'));
    await this.firestoreService.list<ToDoItem>(this.itemsFinalizadosRef).subscribe(res => {
      this.itemsFinalizados = res;
    });
  }

  private async updateContadorLista() {
    await this.firestoreService.list<ToDoItem>(this.afs.collection(`listas/${this.id}/items`)).subscribe(res => {
      if (res) {
        let pendentes = res.filter(el => el.finalizado == false).length;
        let finalizados = res.filter(el => el.finalizado == true).length;
        this.porcentagem = finalizados / (finalizados + pendentes);
        return this.firestoreService.update(this.listaRef, { porcentagem: this.porcentagem });
      }
      else {
        this.porcentagem = 0;
        return this.firestoreService.update(this.listaRef, { porcentagem: 0 });
      }
    });
  }

  toggleItem(item: ToDoItem) {
    item.finalizado = !item.finalizado;
    let itemRef = this.afs.doc(`listas/${this.id}/items/${item.id}`);
    this.firestoreService.update(itemRef, item);
  }

  adicionarItem() {
    if (this.item.nome) {
      this.firestoreService.add(this.itemsPendentesRef, this.item).then(() => this.limparItem());
    }
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
      finalizado: false,
      data: null,
      dataOcorrencia: ''
    }
  }

  async popoverSchedule(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: ItemScheduleComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });

    popover.onWillDismiss().then((res) => {
      if (res.data) {
        this.item.data = res.data.regra;
      }
    });
    return await popover.present();

  }

  async popoverPrioridade(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: ItemPrioridadeComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });

    popover.onWillDismiss().then((res) => {
      if (res.data) {
        this.item.prioridade = res.data.prioridade
      }
    });
    return await popover.present();

  }

}
