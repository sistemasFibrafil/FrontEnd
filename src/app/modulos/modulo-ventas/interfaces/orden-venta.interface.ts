export interface IOrdenVenta {
  idOrdenVenta        : number;
  docNum              : number;
  docStatus           : string;
  nomEstado           : string;
  docStatusRd         : string;
  docDate             : Date;
  docDueDate          : Date;
  taxDate             : Date;

  cardCode            : string;
  licTradNum          : string;
  cardName            : string;
  cntctCode?          : number;
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
  nomdAgencia         : string;
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

  linea               : IOrdenVentaDetalle[];
}

export interface IOrdenVentaDetalle {
  idOrdenVenta        : number;
  line                : number;
  lineStatus          : string;
  lineStatusRd        : string;
  itemCode            : string;
  dscription          : string;
  whsCode             : string;
  unitMsr             : string;
  onHand              : number;
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
}

