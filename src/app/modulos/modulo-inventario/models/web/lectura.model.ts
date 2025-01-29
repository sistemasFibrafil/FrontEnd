export class LecturaCreateModel {
  baseType            : string;
  baseEntry           : number;
  fromWhsCod          : string;
  barcode             : string;
  idUsuarioCreate     : number;

  constructor(){
      this.baseType         = '';
      this.baseEntry        = 0;
      this.fromWhsCod       = '';
      this.barcode          = '';
      this.idUsuarioCreate  = 0;
  }
}

export class LecturaDeleteModel {
  baseType           : number;
  baseEntry          : number;

  constructor(){
      this.baseType          = 0;
      this.baseEntry         = 0;
  }
}
