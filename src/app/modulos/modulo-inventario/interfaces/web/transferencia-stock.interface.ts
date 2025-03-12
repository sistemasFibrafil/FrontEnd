export interface ITransferenciaStock {
  id                      : number;
  objType                 : string;
  docEntry                : number;
  docNum                  : number;
  docStatus               : string;
  tipDocumento            : string;
  serDocumento            : string;
  numDocumento            : string;
  docDate                 : Date;
  docDueDate              : Date;
  taxDate                 : Date;
  cardCode?               : string;
  cardName?               : string;
  cntctCode?              : number;
  address                 : string;
  filler                  : string;
  toWhsCode               : string;

  codTipTransporte        : string;
  codTipDocTransportista  : string;
  numTipoDocTransportista : string;
  nomTransportista        : string;
  numPlaVehTransportista  : string;

  codTipDocConductor      : string;
  numTipoDocConductor     : string;
  nomConductor            : string;
  apeConductor            : string;
  nomComConductor         : string;
  numLicConductor         : string;

  codTipTraslado          : string;
  codMotTraslado          : string;
  codTipSalida            : string;

  slpCode                 : number;
  numBulto                : number;
  totKilo                 : number;
  jrnlMemo                : string;
  comments                : string;
  codStatusSunat          : string;
  nomdStatusSunat         : string;
  desSunat                : string;
  notSunat                : string;
  qtyRding                : number;

  linea                   : ITransferenciaStockDetalle[];
}

export interface ITransferenciaStockDetalle {
  id                  : number;
  line                : number;
  idBase              : number;
  lineBase            : number;
  objType?            : string;
  docEntry?           : number;
  lineNum?            : number;
  baseType?           : string;
  baseEntry?          : number;
  baseLine?           : number;
  read                : string;
  lineStatus          : string;
  itemCode            : string;
  dscription          : string;
  fromWhsCod          : string;
  whsCode             : string;
  codTipOperacion     : string;
  unitMsr             : string;
  quantity            : number;
  openQty             : number;
}
