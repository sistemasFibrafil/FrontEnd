export class SedeModel {
  codSede           : number;
  nomSede           : string;
  idUsuario         : number;
  linea             : SedeActionModel[]

  constructor(){
    this.codSede    = 0;
    this.nomSede    = '';
    this.idUsuario  = 0;
    this.linea      = [];
  }
}

export class SedeActionModel {
  codSede           : number;
  nomSede           : string;
  idUsuario         : number;
  record            : number;

  constructor(){
    this.codSede    = 0;
    this.nomSede    = '';
    this.idUsuario  = 0;
    this.record     = 0;
  }
}
