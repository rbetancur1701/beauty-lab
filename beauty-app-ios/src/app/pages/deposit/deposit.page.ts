import { Component, OnInit } from '@angular/core';
import {
  PayPal,
  PayPalPayment,
  PayPalConfiguration
} from '@ionic-native/paypal/ngx';
import { ToastService } from '../../services/toast.service';
import { HeroService } from '../../services/hero.service';
import { Router } from '@angular/router';
import { Reservation } from '../../interfaces/reservation';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.page.html',
  styleUrls: ['./deposit.page.scss']
})
export class DepositPage implements OnInit {
  constructor(
    private service: ReservationService,
    private payPal: PayPal,
    public toastr: ToastService,
    public hero: HeroService,
    private router: Router
  ) {}
  planAc = true;
  roomAc = true;
  procAc = true;
  finish = false;
  res: string;
  slideOpts = {
    initialSlide: 0,
    speed: 600
  };
  paymentAmount = '500.00';
  currency = 'USD';
  currencyIcon = '$';
  room: any;
  public plans: any;
  ngOnInit() {
    if (
      this.hero.dataPurchase.procedures.length > 0 ||
      this.hero.dataPurchase.plans.length > 0
    ) {
      this.room = this.hero.dataPurchase.room;
    } else {
      this.router.navigate(['/tabs/home']);
    }
  }
  cancel() {
    this.hero.dataPurchase = {
      fecha_reserva: null,
      fecha_inicio: null,
      fecha_fin: null,
      procedures: [],
      plans: [],
      room: null,
      ok: false
    };
    this.hero.action = '';
    this.router.navigate(['/tabs/home']);
  }
  getPlan() {
    this.plans = JSON.parse(localStorage.getItem('plans'));
    this.hero.dataPurchase.plans.push(this.plans);
  }
  payWithPaypal() {
    if (this.hero.auth) {
      this.payPal
      .init({
        PayPalEnvironmentProduction:
          'Aa5GzqbCccRgVikINEctQx5mZLUZl63wQjne9IY3NuguQK8DUU0OJjq0FGMUVUETrjqyYqQcypNA1QgN',
        PayPalEnvironmentSandbox:
          'Ae2Jz-_zB0fS_boKQr7kY9MZwla__TVt_vLAwhEWeCFnYmUV7wpfJOYfUgpGNggGty2QEvclkxqdaYVL'
      })
      .then(
        () => {
          // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
          this.payPal
            .prepareToRender(
              'PayPalEnvironmentProduction',
              new PayPalConfiguration({
                // Only needed if you get an 'Internal Service Error' after PayPal login!
                // payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
              })
            )
            .then(
              () => {
                const payment = new PayPalPayment(
                  this.paymentAmount,
                  this.currency,
                  'Description',
                  'sale'
                );
                this.payPal.renderSinglePaymentUI(payment).then(
                  res => {
                    if (res.response.state === 'approved') {
                      this.toastr.success('Successful payment!');
                      this.finish = true;
                      this.upPayment();
                    } else {
                      this.toastr.light(
                        'Your payment has not been approved, try again or later',
                        '',
                        4000
                      );
                    }
                  },
                  () => {
                    this.toastr.light(
                      'Your payment has not been approved, try again or later',
                      '',
                      3000
                    );
                  }
                );
              },
              () => {
                this.toastr.error('Error in configuration', '', 3000);
              }
            );
        },
        () => {
          this.toastr.error('Paypal initialization failed');
        }
      );
    } else {
      this.router.navigate(['/login'])
    }
  }
  upPayment() {
    const data: Reservation = {
      id_usuario: this.hero.getUser().id,
      fecha_reserva: this.hero.dataPurchase.fecha_reserva,
      fecha_inicio: this.hero.dataPurchase.fecha_inicio,
      fecha_fin: this.hero.dataPurchase.fecha_fin,
      id_procedimiento: null,
      id_plan: null
    };
    if (this.hero.action === '/procedures-detail') {
      data.id_procedimiento = this.hero.dataPurchase.procedures[0].id_procedimiento;
    } else {
      data.id_plan = this.hero.dataPurchase.plans[0].id_plan;
    }
    this.service.savePayment(data).subscribe((r: any) => {
      if (r.ok === true) {
        this.res = r.message;
        this.hero.action = '';
        this.hero.dataPurchase = {
          procedures: [],
          plans: [],
          room: null,
          date: null,
          ok: false
        };
      } else {
        this.res = r.error;
      }
    });
  }
  backStep() {
    this.router.navigate(['/s-room']);
  }
  addCar() {
    this.hero.shoppingcart.push(this.hero.dataPurchase);
    localStorage.setItem('shoppingcart', JSON.stringify(this.hero.shoppingcart));
    this.hero.calculateTotal();
    this.toastr.successBl('Service added to shopping cart!');
    this.cancel();
  }
}
