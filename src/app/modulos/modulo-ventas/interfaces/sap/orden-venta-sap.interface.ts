export interface IOrdenVentaSap {
  docEntry      : number;
  docNum        : number;
}


export interface IOrdenVentaItem {
  docEntry      : number;
  docNum        : number;
  objType       : number;
  lineNum       : number;
  itemCode      : string;
  itemName      : string;
  unidadMedida  : string;
  quantity      : number;
  peso          : number;
}

export interface IOrdenVentaSeguimientoByFecha {
  nomTipDocumento           : string;
  numeroDocumento           : number;
  docDate                   : Date;
  taxDate                   : Date;
  docDueDate                : Date;
  codStatus                 : string;
  nomStatus                 : string;
  cardCode                  : string;
  cardName                  : string;
  docTotal                  : number;
  docTotalFC                : number;
  docTotalSy                : number;
}


export interface IOrdenVentaSeguimientoDetalladoByFecha {
  docEntry                  : number;
  lineNum                   : number;
  nomTipDocumento           : string;
  numeroDocumento           : number;
  numeroPedido              : number;
  numeroFactura             : number;
  docDate                   : Date;
  taxDate                   : Date;
  docDueDate                : Date;
  codStatus                 : string;
  nomStatus                 : string;
  cardCode                  : string;
  cardName                  : string;
  origenCliente             : string;
  slpCode                   : number;
  slpName                   : string;
  itemCode                  : string;
  itemName                  : string;
  nomLinNegocio             : string;
  nomGrupoArticulo          : string;
  whsCode                   : string;
  whsName                   : string;
  salUnitMsr                : string;
  stock                     : number;
  pendiente                 : number;
  solicitado                : number;
  disponible                : number;
  stockProduccion           : number;
  pendienteProduccion       : number;
  solicitadoProduccion      : number;
  disponibleProduccion      : number;
  quantity                  : number;
  rolloPedido               : number;
  kgPedido                  : number;
  toneladaPedida            : number;
  openQty                   : number;
  rolloPendiente            : number;
  pesoPromedioKg            : number;
  kgPendiente               : number;
  toneladaPendiente         : number;
  delivrdQty                : number;
  price                     : number;
  lineTotEarring            : number;
  totalSumSy                : number;
}


export interface IOrdenVentaPendienteByFecha {
  docEntry                  : number;
  nomTipDocumento           : string;
  numeroPedido              : number;
  numeroFactura?            : number;
  docDate                   : Date;
  taxDate                   : Date;
  docDueDate                : Date;
  cardCode                  : string;
  cardName                  : string;
  slpName                   : string;
  itemCode                  : string;
  itemName                  : string;
  whsCode                   : string;
  whsName                   : string;
  stock                     : number;
  pendiente                 : number;
  solicitado                : number;
  disponible                : number;
  stockProduccion           : number;
  pendienteProduccion       : number;
  solicitadoProduccion      : number;
  disponibleProduccion      : number;
  quantity                  : number;
  rolloPedido               : number;
  kgPedido                  : number;
  toneladaPedida            : number;
  openQty                   : number;
  rolloPendiente            : number;
  kgPendiente               : number;
  toneladaPendiente         : number;
  delivrdQty                : number;
  price                     : number;
  totalSumSy                : number;
}

export interface IOrdenVentaSapPendienteByFiltro {
  docEntry                  : number;
  docNum                    : number;
  numOrdenCompra            : string;
  docDate                   : Date;
  docDueDate                : Date;
  taxDate                   : Date;
  cardCode                  : string;
  cardName                  : string;
  cntctCode                 : number;
  cntctName                 : string;
  address2                  : string;
}
