export interface ISop {
  id                    : number;
  codYear               : number;
  codMonth              : number;
  codWeek               : number;
  name                  : string;
  comments              : string;
  linea                 : ISopDetalle[];

}

export interface ISopDetalle {
  id                    : number;
  line                  : number;
  docEntry              : number;
  lineNum               : number;
  order                 : number;
  docNum                : number;
  docDate               : Date;
  nomTipDocumento       : string;
  cardCode              : string;
  cardName              : string;
  nomOriCliente         : string;
  slpCode               : number;
  slpName               : string;
  itemCode              : string;
  itemName              : string;
  nomLinNegocio         : string;
  nomGpoArticulo        : string;
  salUnitMsr            : string;
  stock                 : number;
  qtyEarring            : number;
  pesoPromedioKg        : number;
  kgEarring             : number;
  price                 : number;
  lineTotEarring        : number;
  fecEntFinal           : Date;
  fecEntProdProceso     : Date;
  total                 : number;
  record                : number;
  idUsuarioCreate       : number;
  idUsuarioUpdate?      : number;
}
