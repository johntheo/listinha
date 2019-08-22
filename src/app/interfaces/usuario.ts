export interface Usuario {
    uid: string;
    nome: string;
    email: string;
    listas: string[];
    data_criacao: Date;
    ultimo_login: Date;
}
