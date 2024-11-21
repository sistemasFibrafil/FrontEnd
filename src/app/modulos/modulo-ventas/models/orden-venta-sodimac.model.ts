export class OrdenVentaSodimacCreateModel {
  idOrdenVentaSodimac       : number;
  docEntry                  : number;
  docNum                    : number;
  numAtCard                 : string;
  codEstado                 : string;
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
      this.idOrdenVentaSodimac   = 0;
      this.docEntry              = 0;
      this.docNum                = 0;
      this.numAtCard             = '';
      this.codEstado             = '';
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
  idOrdenVentaSodimac       : number;
  line                      : number;
  numLocal                  : number;
  codEstado                 : string;
  itemCode                  : string;
  sku                       : string;
  dscription                : string;
  dscriptionLarga           : string;
  ean                       : string;
  quantity                  : number;

  constructor(){
      this.idOrdenVentaSodimac   = 0;
      this.line                  = 0;
      this.numLocal              = 0;
      this.codEstado             = '';
      this.itemCode              = '';
      this.sku                   = '';
      this.dscription            = '';
      this.dscriptionLarga       = '';
      this.ean                   = '';
      this.quantity              = 0;
  }
}


export class OrdenVentaSodimacLpnUpdateModel {
  idOrdenVentaSodimac     : number;
  item                    : OrdenVentaDetalleSodimacLpnUpdateModel[];

  constructor(){
      this.idOrdenVentaSodimac   = 0;
      this.item                  = [];
  }
}


export class OrdenVentaDetalleSodimacLpnUpdateModel {
  idOrdenVentaSodimac    : number;
  line                   : number;
  numLocal               : number;

  constructor(){
      this.idOrdenVentaSodimac   = 0;
      this.line                  = 0;
      this.numLocal              = 0;
  }
}
