import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GastosIngresos} from '../../bo/GastosIngresos';
import {Presupuesto} from '../../bo/Presupuesto';
import {FormControl, FormGroup} from '@angular/forms';
import {Services} from '../../services/Services';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  lista: GastosIngresos[];
  formPresupuesto = new FormGroup({});
  formGastoIngreso = new FormGroup({});
  presupuesto: Presupuesto;
  gastosIngresos: GastosIngresos;
  format = '';
  deshabilitarEliminar = false;

  constructor(private service: Services,
              private decimalPipe: DecimalPipe) {
    this.deshabilitarEliminar = false;
    this.lista = [];
    this.format = '1.2-2';
    this.presupuesto = new Presupuesto(0, '', 0);
    this.gastosIngresos = new GastosIngresos(0, '', 0, '', 0);
    this.formPresupuesto = new FormGroup({
      descripcion: new FormControl(''),
      capital: new FormControl({value: 'Q' + decimalPipe.transform(0, this.format), disabled: true})
    });
    this.formGastoIngreso = new FormGroup({
      descripcion: new FormControl(''),
      valor: new FormControl(''),
      gastoIngreso: new FormControl('G'),
    });
    this.service.getAllItemsFromEntity('presupuesto').subscribe( res => {
      if (res.length > 0){
        this.presupuesto = res[0];
        this.formPresupuesto = new FormGroup({
          descripcion: new FormControl(res[0].descripcion),
          capital: new FormControl({value: 'Q' +  this.decimalPipe.transform(res[0].capital, this.format), disabled: false})
        });

        this.service.getItemsFromEntityByMethod('gastosIngresos', 'getByIdPresupuesto', this.presupuesto.id).subscribe( res1 => {
          this.lista = res1;
          }, error1 => {
            console.error(error1);
          }
        );

      }
    }, error1 => {
      console.error(error1);
    });
  }

  ngOnInit(): void {
  }

  crear(): void {

    this.presupuesto.descripcion = this.formPresupuesto.controls.descripcion.value.trim();
    this.presupuesto.capital = 0;
    this.service.saveEntity('presupuesto', this.presupuesto).subscribe( res => {
      this.presupuesto = res;
      this.formPresupuesto = new FormGroup({
        descripcion: new FormControl(res.descripcion),
        capital: new FormControl({value: 'Q' + this.decimalPipe.transform(res.capital, this.format), disabled: true})
      });
    }, error1 => {
      console.error(error1);
    });

  }

  agregar(): void {

    this.gastosIngresos.idPresupuesto = this.presupuesto.id;
    this.gastosIngresos.descripcion = this.formGastoIngreso.controls.descripcion.value.trim();
    this.gastosIngresos.valor = this.formGastoIngreso.controls.valor.value;
    this.gastosIngresos.gastoIngreso = this.formGastoIngreso.controls.gastoIngreso.value;
    this.service.saveEntity('gastosIngresos', this.gastosIngresos).subscribe( res => {
    }, error1 => {
      console.error(error1);
    });

    if (this.gastosIngresos.gastoIngreso === 'I') {
      this.presupuesto.capital = Number(this.presupuesto.capital) + Number(this.formGastoIngreso.controls.valor.value);
    } else {
      this.presupuesto.capital = Number(this.presupuesto.capital) - Number(this.formGastoIngreso.controls.valor.value);
    }
    this.service.saveEntity('presupuesto', this.presupuesto).subscribe( res => {
      this.presupuesto = res;
      this.formPresupuesto = new FormGroup({
        descripcion: new FormControl(res.descripcion),
        capital: new FormControl({value: 'Q' + this.decimalPipe.transform(res.capital, this.format), disabled: true})
      });

      this.lista = [];
      this.service.getItemsFromEntityByMethod('gastosIngresos', 'getByIdPresupuesto', this.presupuesto.id).subscribe( res1 => {
          this.lista = res1;
        }, error1 => {
          console.error(error1);
        }
      );

    }, error1 => {
      console.error(error1);
    });

    this.formGastoIngreso = new FormGroup({
      descripcion: new FormControl(''),
      valor: new FormControl(''),
      gastoIngreso: new FormControl('G'),
    });

  }

  async eliminar(obj: any): Promise<any> {
    this.deshabilitarEliminar = true;
    this.lista = [];
    let total = 0;
    await this.service.deleteAndGetEntitySincrono('gastosIngresos', obj.id, this.presupuesto.id).then( res => {
      this.lista = res;
      for (const gI of this.lista) {
        if (gI.gastoIngreso === 'I') {
          total = total + Number(gI.valor);
        } else {
          total = total - Number(gI.valor);
        }
      }
      this.deshabilitarEliminar = false;
    }).catch(error2 => {
      this.deshabilitarEliminar = false;
      console.error(error2);
    });

    await this.service.getItemsFromEntityByMethodSincrono('gastosIngresos', 'getByIdPresupuesto', this.presupuesto.id).then( res2 => {

      this.presupuesto.capital = total;

      this.service.saveEntity('presupuesto', this.presupuesto).subscribe( res1 => {
          this.presupuesto = res1;
          this.formPresupuesto = new FormGroup({
            descripcion: new FormControl(res1.descripcion),
            capital: new FormControl({value: this.decimalPipe.transform(res1.capital, this.format), disabled: true})
          });

        }, error => {
          console.error(error);
        }
      );

    }).catch(error1 => {
      console.error(error1);
    });

  }

}
