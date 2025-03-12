export interface ILectura {
  id                    : number;
  idBase                : number;
  lineBase              : number;
  numBase               : number;
  baseType              : string;
  baseEntry             : number;
  baseNum               : number;
  baseLine              : number;
  docStatus             : string;
  return                : string;
  docDate               : Date;
  docDueDate            : Date;
  cardCode?             : string;
  cardName?             : string;
  itemCode?             : string;
  dscription?           : string;
  fromWhsCod            : string;
  whsCode?              : string;
  unitMsr               : string;
  quantity              : number;
  openQty               : number;
  qtyRead               : number;
  engQtyRead            : number;
  dedQtyRead            : number;
  peso                  : number;
  idUsuarioCreate       : number;
}

export interface ILecturaByObject {
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
  comments            : string;
  linea               : ILecturaLineaByObject[];
}

export interface ILecturaLineaByObject {
  idLectura           : number;
  idBase              : number;
  lineBase            : number;
  objType             : string;
  docEntry            : number;
  docNum              : number;
  lineNum             : number;
  itemCode?           : string;
  dscription?         : string;
  fromWhsCod          : string;
  whsCode?            : string;
  unitMsr             : string;
  quantity            : number;
  peso                : number;
}

export interface ILecturaCopyToTransferencia {
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
  linea1                : ILecturaCopyToTransferenciaDetalle1[];
  linea2                : ILecturaCopyToTransferenciaDetalle2[];
}

export interface ILecturaCopyToTransferenciaDetalle1 {
  id                    : number;
  idBase                : number;
  lineBase              : number;
  baseType              : string;
  baseEntry             : number;
  baseLine              : number;
  read                  : string;
  return                : string;
  itemCode              : string;
  dscription            : string;
  barcode               : string;
  fromWhsCod            : string;
  whsCode?              : string;
  codTipOperacion?      : string;
  nomTipOperacion?      : string;
  unitMsr               : string;
  quantity              : number;
  openQty               : number;
  bulto                 : number;
  peso                  : number;
}

export interface ILecturaCopyToTransferenciaDetalle2 {
  idBase                : number;
  lineBase              : number;
  baseType              : string;
  baseEntry             : number;
  baseLine              : number;
  read                  : string;
  itemCode              : string;
  dscription            : string;
  fromWhsCod            : string;
  whsCode?              : string;
  codTipOperacion?      : string;
  nomTipOperacion?      : string;
  unitMsr               : string;
  quantity              : number;
  openQty               : number;
  bulto                 : number;
  peso                  : number;
}

