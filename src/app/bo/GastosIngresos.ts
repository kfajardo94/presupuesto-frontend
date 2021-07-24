export class GastosIngresos {
  id: number;
  descripcion: string;
  valor: number;
  gastoIngreso: string;
  idPresupuesto: number;

  constructor(id: number, descripcion: string, valor: number, gastoIngreso: string, idPresupuesto: number) {
    this.id = id;
    this.descripcion = descripcion;
    this.valor = valor;
    this.gastoIngreso = gastoIngreso;
    this.idPresupuesto = idPresupuesto;
  }
}
