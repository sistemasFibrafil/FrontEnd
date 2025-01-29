export class OrdenVentaSodimacCreateModel {
  id                        : number;
  docEntry                  : number;
  docNum                    : number;
  numOrdenCompra            : string;
  docStatus                 : string;
  docDate                   : Date;
  docDueDate                : Date;
  taxDate                   : Date;
  cardCode                  : string;
  cardName                  : string;
  cntctCode                 : number;
  cntctName                 : string;
  address                   : string;
  idUsuarioCreate           : number;
  item                      : OrdenVentaSodimacDetalleCreateModel[];

  constructor(){
      this.id                    = 0;
      this.docEntry              = 0;
      this.docNum                = 0;
      this.numOrdenCompra        = '';
      this.docStatus             = '';
      this.docDate               = null;
      this.docDueDate            = null;
      this.taxDate               = null;
      this.cardCode              = '';
      this.cardName              = '';
      this.cntctCode             = 0;
      this.cntctName             = '';
      this.address               = '';
      this.idUsuarioCreate       = 0;
      this.item                  = [];
  }
}


export class OrdenVentaSodimacDetalleCreateModel {
  id                        : number;
  line                      : number;
  numLocal                  : number;
  lineStatus                : string;
  itemCode                  : string;
  sku                       : string;
  dscription                : string;
  dscriptionLarga           : string;
  ean                       : string;
  quantity                  : number;

  constructor(){
      this.id                    = 0;
      this.line                  = 0;
      this.numLocal              = 0;
      this.lineStatus            = '';
      this.itemCode              = '';
      this.sku                   = '';
      this.dscription            = '';
      this.dscriptionLarga       = '';
      this.ean                   = '';
      this.quantity              = 0;
  }
}


export class OrdenVentaSodimacLpnUpdateModel {
  id                      : number;
  item                    : OrdenVentaDetalleSodimacLpnUpdateModel[];

  constructor(){
      this.id              = 0;
      this.item            = [];
  }
}


export class OrdenVentaDetalleSodimacLpnUpdateModel {
  id                     : number;
  line                   : number;
  numLocal               : number;

  constructor(){
      this.id            = 0;
      this.line          = 0;
      this.numLocal      = 0;
  }
}
