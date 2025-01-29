export interface ISolicitudCompra {
  id                  : number;
  number              : string;
  docEntry            : number;
  docNum              : number;
  docStatus           : string;
  docManClose         : string;
  docDate             : Date;
  docDueDate          : Date;
  taxDate             : Date;
  cardCode?           : string;
  cardName?           : string;
  cntctCode?          : number;
  address             : string;
  filler              : string;
  toWhsCode           : string;
  codTipTraslado      : string;
  codMotTraslado      : string;
  codTipSalida        : string;
  slpCode             : number;
  jrnlMemo            : string;
  comments            : string;
  linea               : ISolicitudCompraDetalle[];
}

export interface ISolicitudCompraDetalle {
  id                  : number;
  line                : number;
  docEntry?           : number;
  lineNum?            : number;
  lineStatus          : string;
  itemCode            : string;
  dscription          : string;
  fromWhsCod          : string;
  whsCode             : string;
  unitMsr             : string;
  quantity            : number;
  openQty             : number;
  openQtyRding        : number;
  record?             : number;
}
