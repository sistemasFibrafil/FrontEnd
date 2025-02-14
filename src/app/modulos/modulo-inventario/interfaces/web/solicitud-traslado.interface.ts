export interface ISolicitudTraslado {
  id                  : number;
  objType             : string;
  docEntry            : number;
  docNum              : number;
  docStatus           : string;
  docManClose         : string;
  docDate             : Date;
  docDueDate          : Date;
  taxDate             : Date;
  read?               : string;
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
  linea               : ISolicitudTrasladoDetalle[];
}

export interface ISolicitudTrasladoDetalle {
  id                  : number;
  line                : number;
  objType?            : string;
  docEntry?           : number;
  lineNum?            : number;
  lineStatus          : string;
  itemCode            : string;
  dscription          : string;
  fromWhsCod          : string;
  whsCode             : string;
  unitMsr             : string;
  quantity            : number;
  openQtyRding        : number;
  openQty             : number;
  record?             : number;
}


export interface ILecturaCopySolicitudTrasladoToTransferencia {
  cardCode?             : string;
  cardName?             : string;
  cntctCode             : number;
  address               : string;
  filler                : string;
  toWhsCode?            : string;
  codTipTraslado        : string;
  codMotTraslado        : string;
  codTipSalida          : string;
  slpCode               : number;
  jrnlMemo              : string;
  comments?             : string;
  linea                 : ISolicitudTrasladoDetalleToTransferencia[];
}

export interface ISolicitudTrasladoDetalleToTransferencia {
  id                    : number;
  idBase                : number;
  lineBase              : number;
  baseType              : string;
  baseEntry             : number;
  baseLine              : number;
  return                : string;
  itemCode              : string;
  dscription            : string;
  barcode               : string;
  fromWhsCod            : string;
  whsCode?              : string;
  codTipOperacion?      : string;
  unitMsr               : string;
  quantity              : number;
  openQty               : number;
}
