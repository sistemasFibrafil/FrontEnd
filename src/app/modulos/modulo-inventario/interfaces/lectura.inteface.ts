export interface ILectura {
  id                    : number;
  idBase                : number;
  lineBase              : number;
  numBase               : number;
  baseType              : string;
  baseEntry             : number;
  baseNum               : number;
  baseline              : number;
  docStatus             : string;
  return                : string;
  cardCode?             : string;
  cardName?             : string;
  itemCode?             : string;
  dscription?           : string;
  fromWhsCod            : string;
  whsCode?              : string;
  unitMsr               : string;
  quantity              : number;
  peso                  : number;
  idUsuarioCreate       : number;
}


export interface ILecturaByBaseTypeBaseEntry {
  baseType              : string;
  baseEntry             : number;
  baseNum               : number;
  itemCode?             : string;
  dscription?           : string;
  unitMsr?              : string;
  quantity              : number;
  peso                  : number;
}

export interface ILecturaByBaseTypeAndBaseEntryAndFiltro {
  id                    : number;
  lineBase              : number;
  itemCode              : string;
  barcode               : string;
  quantity              : number;
  peso                  : number;
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
  linea                 : ILecturaCopyToTransferenciaDetalle[];
}

export interface ILecturaCopyToTransferenciaDetalle {
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
