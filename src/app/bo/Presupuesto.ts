export class Presupuesto {
  id: number;
  descripcion: string;
  capital: number;

  constructor(id: number, descripcion: string, capital: number) {
    this.id = id;
    this.descripcion = descripcion;
    this.capital = capital;
  }
}
