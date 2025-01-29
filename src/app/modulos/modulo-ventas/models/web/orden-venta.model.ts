
export class OrdenVentaCreateModel {
  idOrdenVenta        : number;
  docDate             : Date;
  docDueDate          : Date;
  taxDate             : Date;

  cardCode            : string;
  licTradNum          : string;
  cardName            : string;
  cntctCode           : number;
  payToCode           : string;
  address             : string;
  shipToCode          : string;
  address2            : string;
  numOrdCom?          : string;
  docCur              : string;
  docRate             : number;
  groupNum            : number;

  codAgencia          : string;
  rucAgencia          : string;
  nomAgencia          : string;
  codDirAgencia       : string;
  dirAgencia          : string;

  codTipFlete         : string;
  valorFlete          : number;
  totalFlete          : number;
  importeSeguro       : number;
  puerto              : string;

  codTipVenta         : string;

  slpCode             : number;
  comments            : string;

  discPrcnt           : number;
  discSum             : number;
  vatSum              : number;
  docTotal            : number;

  idUsuarioCreate     : number;

  linea               : OrdenVentaDetalleCreateModel[];

  constructor(){
    this.idOrdenVenta        = 0;
    this.docDate             = null;
    this.docDueDate          = null;
    this.taxDate             = null;

    this.cardCode            = '';
    this.licTradNum          = '';
    this.cardName            = '';
    this.cntctCode           = 0;
    this.payToCode           = '';
    this.address             = '';
    this.shipToCode          = '';
    this.address2            = '';
    this.numOrdCom           = '';
    this.docCur              = '';
    this.docRate             = 0;
    this.groupNum            = 0;

    this.codAgencia          = '';
    this.rucAgencia          = '';
    this.nomAgencia          = '';
    this.codDirAgencia       = '';
    this.dirAgencia          = '';

    this.codTipFlete         = '';
    this.valorFlete          = 0;
    this.totalFlete          = 0;
    this.importeSeguro       = 0;
    this.puerto              = '';

    this.codTipVenta         = '';

    this.slpCode             = 0;
    this.comments            = '';

    this.discPrcnt           = 0;
    this.discSum             = 0;
    this.vatSum              = 0;
    this.docTotal            = 0;

    this.linea               = [];
  }
}

export class OrdenVentaDetalleCreateModel {
  idOrdenVenta?       : number;
  line                : number;
  itemCode            : string;
  dscription          : string;
  whsCode             : string;
  unitMsr             : string;
  quantity            : number;
  openQty             : number;
  openQtyRd           : number;
  currency            : string;
  priceBefDi          : number;
  discPrcnt           : number;
  price               : number;
  lineTotal           : number;
  taxCode             : string;
  vatPrcnt            : number;
  vatSum              : number;

  constructor(){
    this.idOrdenVenta        = 0;
    this.line                = 0;
    this.itemCode            = '';
    this.dscription          = '';
    this.whsCode             = '';
    this.unitMsr             = '';
    this.quantity            = 0;
    this.openQty             = 0;
    this.openQtyRd          = 0;
    this.currency            = '';
    this.priceBefDi          = 0;
    this.discPrcnt           = 0;
    this.price               = 0;
    this.lineTotal           = 0;
    this.taxCode             = '';
    this.vatPrcnt            = 0;
    this.vatSum              = 0;
  }
}


export class OrdenVentaUpdateModel {
  idOrdenVenta        : number;
  numero              : string;
  docNum              : number;
  docStatus           : string;
  docStatusRd         : string;
  docDate             : Date;
  docDueDate          : Date;
  taxDate             : Date;

  cardCode            : string;
  licTradNum          : string;
  cardName            : string;
  cntctCode           : number;
  payToCode           : string;
  address             : string;
  shipToCode          : string;
  address2            : string;
  numOrdCom?          : string;
  docCur              : string;
  docRate             : number;
  groupNum            : number;

  codAgencia          : string;
  rucAgencia          : string;
  nomAgencia          : string;
  codDirAgencia       : string;
  dirAgencia          : string;

  codTipFlete         : string;
  valorFlete          : number;
  totalFlete          : number;
  importeSeguro       : number;
  puerto              : string;

  codTipVenta         : string;

  slpCode             : number;
  comments            : string;

  discPrcnt           : number;
  discSum             : number;
  vatSum              : number;
  docTotal            : number;

  linea               : OrdenVentaDetalleUpdateModel[];

  constructor(){
    this.idOrdenVenta        = 0;
    this.numero              = '';
    this.docNum              = 0;
    this.docStatus           = '';
    this.docStatusRd        = '';
    this.docDate             = null;
    this.docDueDate          = null;
    this.taxDate             = null;

    this.cardCode            = '';
    this.licTradNum          = '';
    this.cardName            = '';
    this.cntctCode           = 0;
    this.payToCode           = '';
    this.address             = '';
    this.shipToCode          = '';
    this.address2            = '';
    this.numOrdCom           = '';
    this.docCur              = '';
    this.docRate             = 0;
    this.groupNum            = 0;

    this.codAgencia          = '';
    this.rucAgencia          = '';
    this.nomAgencia          = '';
    this.codDirAgencia       = '';
    this.dirAgencia          = '';

    this.codTipFlete         = '';
    this.valorFlete          = 0;
    this.totalFlete          = 0;
    this.importeSeguro       = 0;
    this.puerto              = '';

    this.codTipVenta         = '';

    this.slpCode             = 0;
    this.comments            = '';

    this.discPrcnt           = 0;
    this.discSum             = 0;
    this.vatSum              = 0;
    this.docTotal            = 0;

    this.linea               = [];
  }
}

export class OrdenVentaDetalleUpdateModel {
  idOrdenVenta?       : number;
  line                : number;
  lineStatus          : string;
  lineStatusRd        : string;
  itemCode            : string;
  dscription          : string;
  whsCode             : string;
  unitMsr             : string;
  quantity            : number;
  openQty             : number;
  openQtyRd           : number;
  currency            : string;
  priceBefDi          : number;
  discPrcnt           : number;
  price               : number;
  lineTotal           : number;
  taxCode             : string;
  vatPrcnt            : number;
  vatSum              : number;

  constructor(){
    this.idOrdenVenta        = 0;
    this.line                = 0;
    this.lineStatus          = '';
    this.lineStatusRd        = '';
    this.itemCode            = '';
    this.dscription          = '';
    this.whsCode             = '';
    this.unitMsr             = '';
    this.quantity            = 0;
    this.openQty             = 0;
    this.openQtyRd          = 0;
    this.currency            = '';
    this.priceBefDi          = 0;
    this.discPrcnt           = 0;
    this.price               = 0;
    this.lineTotal           = 0;
    this.taxCode             = '';
    this.vatPrcnt            = 0;
    this.vatSum              = 0;
  }
}
