import { Data } from './data';

export interface ToDoItem{
    id?:string;
    prioridade: number;
    nome: string;
    finalizado: boolean;
    dataOcorrencia: string;
    data: Data;
}