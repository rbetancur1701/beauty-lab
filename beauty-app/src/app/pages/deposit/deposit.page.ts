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
  slideOpts = {
    initialSlide: 0,
    speed: 600
  };
  paymentAmount = '1.00';
  currency = 'USD';
  currencyIcon = '$';
  room: any;
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
      procedures: [],
      plans: [],
      room: null,
      date: null,
      ok: false
    };
    this.router.navigate(['/tabs/home']);
  }
  payWithPaypal() {
    this.payPal
      .init({
        PayPalEnvironmentProduction: 'Aa5GzqbCccRgVikINEctQx5mZLUZl63wQjne9IY3NuguQK8DUU0OJjq0FGMUVUETrjqyYqQcypNA1QgN',
        PayPalEnvironmentSandbox: 'Ae2Jz-_zB0fS_boKQr7kY9MZwla__TVt_vLAwhEWeCFnYmUV7wpfJOYfUgpGNggGty2QEvclkxqdaYVL'
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
                    this.toastr.success('Successful payment');
                    // Successfully paid

                    // Example sandbox response
                    //
                    // {
                    //   'client': {
                    //     'environment': 'sandbox',
                    //     'product_name': 'PayPal iOS SDK',
                    //     'paypal_sdk_version': '2.16.0',
                    //     'platform': 'iOS'
                    //   },
                    //   'response_type': 'payment',
                    //   'response': {
                    //     'id': 'PAY-1AB23456CD789012EF34GHIJ',
                    //     'state': 'approved',
                    //     'create_time': '2016-10-03T13:33:33Z',
                    //     'intent': 'sale'
                    //   }
                    // }
                  },
                  () => {
                    // Error or render dialog closed without being successful
                  }
                );
              },
              () => {
                this.toastr.error('Error in the configuration the PayPal');
                // Error in configuration
              }
            );
        },
        () => {
          this.toastr.error('Paypal initialization failed');
          // Error in initialization, maybe PayPal isn't supported or something else
        }
      );
  }
  upPayment() {
    const data: Reservation = {
      id_usuario: this.hero.getUser().id,
      fecha_reserva: '',
      fecha_inicio: '',
      fecha_fin: '',
      id_plan: this.hero.dataPurchase.plans[0].id_plan
    };
    this.service.savePayment(data).subscribe((r: any) => {
      console.log(r);
    });
  }
}