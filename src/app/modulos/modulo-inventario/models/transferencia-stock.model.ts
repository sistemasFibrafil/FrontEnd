export class TransferenciaStockCreateModel {
  id                          : number;
  docDate                     : Date;
  docDueDate                  : Date;
  taxDate                     : Date;
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
  linea                       : TransferenciaStockDetalleCreateModel[];

  constructor(){
    this.id                   = 0;
    this.docDate              = null;
    this.docDueDate           = null;
    this.taxDate              = null;
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

export class TransferenciaStockDetalleCreateModel {
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


export class TransferenciaStockUpdateModel {
  id                          : number;
  docEntry                    : number;
  docDate                     : Date;
  docDueDate                  : Date;
  taxDate                     : Date;
  filler                      : string;
  toWhsCode                   : string;
  codTipTraslado              : string;
  codMotTraslado              : string;
  codTipSalida                : string;
  slpCode                     : number;
  jrnlMemo                    : string;
  comments                    : string;
  idUsuarioUpdate             : number;
  linea                       : TransferenciaStockDetalleUpdateModel[];

  constructor(){
    this.id                   = 0;
    this.docEntry             = 0;
    this.docDate              = null;
    this.docDueDate           = null;
    this.taxDate              = null;
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

export class TransferenciaStockDetalleUpdateModel {
  id                          : number;
  line                        : number;
  docEntry                    : number;
  lineNum                     : number;
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
  record                      : number;

  constructor(){
    this.id                   = 0;
    this.line                 = 0;
    this.docEntry             = 0;
    this.lineNum              = 0;
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
    this.record               = 0;
  }
}


export class TransferenciaStockCloseModel {
  id                         : number;
  docEntry                    : number;
  idUsuarioClose              : number;

  constructor(){
    this.id                   = 0;
    this.docEntry             = 0;
    this.idUsuarioClose       = 0;
  }
}
