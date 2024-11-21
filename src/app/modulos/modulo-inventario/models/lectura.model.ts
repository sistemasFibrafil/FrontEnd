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

export class LecturaFindModel {
  idBase      : number;
  baseType    : string;
  linea       : LecturaLineaFindModel[] = [];

  constructor(){
    this.idBase = 0;
    this.linea = [];
  }
}

export class LecturaLineaFindModel {
  idBase      : number;
  lineBase    : number;
  baseType    : string;
  return      : string;

  constructor(){
    this.idBase   = 0;
    this.lineBase = 0;
    this.baseType = '';
    this.return   = '';
  }
}
