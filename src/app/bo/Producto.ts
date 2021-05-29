export class Producto {
  id: number;
  codigo: string;
  nombre: string;
  description: string;
  categoriaId: number;
  precio: number;
  disponibilidad: number;
  imagen64: string;
  imagen: string;

  constructor(id: number, codigo: string, nombre: string, description: string, categoriaId: number,
              precio: number, disponibilidad: number, imagen64: string, imagen: string) {
    this.id = id;
    this.codigo = codigo;
    this.nombre = nombre;
    this.description = description;
    this.categoriaId = categoriaId;
    this.precio = precio;
    this.disponibilidad = disponibilidad;
    this.imagen64 = imagen64;
    this.imagen = imagen
  }
}
