export class SolicitudTrasladoCreateModel {
  id                          : number;
  docDate                     : Date;
  docDueDate                  : Date;
  taxDate                     : Date;
  read?                       : string;
  cardCode?                   : string;
  cardName?                   : string;
  cntctCode                   : number;
  address                     : string;
  filler                      : string;
  toWhsCode                   : string;
  codTipTraslado              : string;
  codMotTraslado              : string;
  codTipSalida                : string;
  slpCode                     : number;
  jrnlMemo                    : string;
  comments                    : string;
  idUsuarioCreate             : number;
  linea                       : SolicitudTrasladoDetalleCreateModel[];

  constructor(){
    this.id                   = 0;
    this.docDate              = null;
    this.docDueDate           = null;
    this.taxDate              = null;
    this.read                 = '';
    this.cardCode             = '';
    this.cardName             = '';
    this.cntctCode            = 0;
    this.address              = '';
    this.filler                = '';
    this.toWhsCode            = '';
    this.codTipTraslado       = '';
    this.codMotTraslado       = '';
    this.codTipSalida         = '';
    this.slpCode              = -1;
    this.jrnlMemo             = '';
    this.comments             = '';
    this.idUsuarioCreate      = 0;
    this.linea                = [];
  }
}

export class SolicitudTrasladoDetalleCreateModel {
  id                          : number;
  line                        : number;
  itemCode                    : string;
  dscription                  : string;
  fromWhsCod                  : string;
  whsCode                     : string;
  unitMsr                     : string;
  quantity                    : number;
  openQty                     : number;
  openQtyRding                : number;
  idUsuarioCreate             : number;

  constructor(){
    this.id                   = 0;
    this.line                 = 0;
    this.itemCode             = '';
    this.dscription           = '';
    this.fromWhsCod           = '';
    this.whsCode              = '';
    this.unitMsr              = '';
    this.quantity             = 0;
    this.openQty              = 0;
    this.openQtyRding         = 0;
    this.idUsuarioCreate      = 0;
  }
}


export class SolicitudTrasladoUpdateModel {
  id                          : number;
  docEntry                    : number;
  docDate                     : Date;
  docDueDate                  : Date;
  taxDate                     : Date;
  read?                       : string;
  filler                      : string;
  toWhsCode                   : string;
  codTipTraslado              : string;
  codMotTraslado              : string;
  codTipSalida                : string;
  slpCode                     : number;
  jrnlMemo                    : string;
  comments                    : string;
  idUsuarioUpdate             : number;
  linea                       : SolicitudTrasladoDetalleUpdateModel[];

  constructor(){
    this.id                   = 0;
    this.docEntry             = 0;
    this.docDate              = null;
    this.docDueDate           = null;
    this.taxDate              = null;
    this.read                 = '';
    this.filler               = '';
    this.toWhsCode            = '';
    this.codTipTraslado       = '';
    this.codMotTraslado       = '';
    this.codTipSalida         = '';
    this.slpCode              = -1;
    this.jrnlMemo             = '';
    this.comments             = '';
    this.idUsuarioUpdate      = 0;
    this.linea                = [];
  }
}

export class SolicitudTrasladoDetalleUpdateModel {
  id                          : number;
  line                        : number;
  docEntry                    : number;
  lineNum                     : number;
  lineStatus                  : string;
  itemCode                    : string;
  dscription                  : string;
  fromWhsCod                  : string;
  whsCode                     : string;
  unitMsr                     : string;
  quantity                    : number;
  openQty                     : number;
  openQtyRding                : number;
  idUsuarioCreate?            : number;
  idUsuarioUpdate?            : number;
  idUsuarioClose?             : number;
  record                      : number;

  constructor(){
    this.id                   = 0;
    this.line                 = 0;
    this.docEntry             = 0;
    this.lineNum              = 0;
    this.lineStatus           = '01';
    this.itemCode             = '';
    this.dscription           = '';
    this.fromWhsCod           = '';
    this.whsCode              = '';
    this.unitMsr              = '';
    this.quantity             = 0;
    this.openQty              = 0;
    this.openQtyRding         = 0;
    this.idUsuarioCreate      = 0;
    this.idUsuarioUpdate      = 0;
    this.idUsuarioClose       = 0;
    this.record               = 0;
  }
}


export class SolicitudTrasladoCloseModel {
  id                         : number;
  docEntry                    : number;
  idUsuarioClose              : number;

  constructor(){
    this.id                   = 0;
    this.docEntry             = 0;
    this.idUsuarioClose       = 0;
  }
}


export class ParamCreateTransferenciaModel {
  idBase      : number;
  baseType    : string;
  linea       : ParamCreateTransferenciaLineaModel[] = [];

  constructor(){
    this.idBase   = 0;
    this.baseType = '';
    this.linea    = [];
  }
}

export class ParamCreateTransferenciaLineaModel {
  idBase      : number;
  lineBase    : number;
  baseType    : string;
  read        : string;
  return      : string;

  constructor(){
    this.baseType = '';
    this.idBase   = 0;
    this.lineBase = 0;
    this.read     = '';
    this.return   = '';
  }
}

