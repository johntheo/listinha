import { Regra } from './regra';

export interface Data{
    recorrente:boolean;
    dataInicio:string;
    dataFim:string;
    regra:Regra;
}