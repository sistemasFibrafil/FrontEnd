
export interface IOrdenVentaSodimac {
  idOrdenVentaSodimac       : number;
  docEntry                  : number;
  docNum                    : number;
  numAtCard                 : string;
  codEstado                 : string;
  nomEstado                 : string;
  docDate                   : Date;
  docDueDate                : Date;
  taxDate                   : Date;
  CardCode                  : string;
  CardName                  : string;
  cntctCode                 : number;
  cntctName                 : string;
  address                   : string;
  item                      : IOrdenVentaSodimacDetalle[];
}

export interface IOrdenVentaSodimacDetalle {
  idOrdenVentaSodimac       : number;
  line                      : number;
  numLocal                  : number;
  nomLocal                  : string;
  codEstado                 : string;
  itemCode                  : string;
  sku                       : string;
  dscription                : string;
  dscriptionLarga           : string;
  ean                       : string;
  lpn?                      : string;
  quantity                  : number;
}

export interface IOrdenVentaSodimacByFiltro {
  idOrdenVentaSodimac       : number;
  docNum                    : number;
  numAtCard                 : string;
  codEstado                 : string;
  nomEstado                 : string;
  docDate                   : Date;
  docDueDate                : Date;
  taxDate                   : Date;
  CardCode                  : string;
  CardName                  : string;
}

export interface IOrdenVentaSodimacConsulta {
  idOrdenVentaSodimac?      : number;
  line?                     : number;

  docNum?                   : number;
  numAtCard?                : string;
  docDate?                  : Date;
  docDueDate?               : Date;
  taxDate?                  : Date;
  cardCode?                 : string;
  cardName?                 : string;

  numLocal                  : number;
  nomLocal                  : string;
  sku                       : string;
  dscription                : string;
  dscriptionLarga           : string;
  ean                       : string;
  lpn?                      : string;
  quantity                  : number;
}
