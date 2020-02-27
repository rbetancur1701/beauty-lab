import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HeroService } from '../../services/hero.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { ToastService } from '../../services/toast.service';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-procedures',
  templateUrl: './procedures-detail.page.html',
  styleUrls: ['./procedures-detail.page.scss'],
})
export class ProceduresDetailPage implements OnInit {
  date: string;
  type: 'string';
  data: any;
  public procedures: any;
  public rooms: any[];
  public room: any;

  public paymentAmount = '500';
  public currency = 'USD';
  public currencyIcon = '$';


  constructor(
    public modalCtrl: ModalController,
    private http: HttpClient,
    private hero: HeroService,
    private payPal: PayPal,
    public toastr: ToastService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + this.hero.getToken()
    })
  };

  ngOnInit() {
    this.getProcedure();
    this.styleCalendar();
  }
  getProcedure() {
    this.procedures = JSON.parse(localStorage.getItem('procedures'));
    this.hero.dataPurchase.procedures.push(this.procedures);
    this.getRoom(1);
  }

  getRoom(id) {
    this.getService(id)
    .subscribe((model: any) => {
      this.rooms = model.data;
      this.room = this.rooms[0];
    });
  }

  getService(id) {
    const url = `${this.hero.getUrl()}/room/` + id;
    return this.http.get(url, this.httpOptions);
  }
  backStep() {
    this.hero.dataPurchase = {
      procedures: [],
      plans: [],
      room: null,
      date: null,
      ok: false
    };
    this.navCtrl.back();
  }
  nextStep() {
    if (this.data === undefined) {
      this.toastr.error('Select a date');
    } else {
      this.hero.dataPurchase.date = this.data._d;
      this.router.navigate(['s-room']);
    }
  }
  styleCalendar() {
    const styleElem = document.head.appendChild(
      document.createElement('style')
    );

    // tslint:disable-next-line: max-line-length
    styleElem.innerHTML = `
                          .month-packer-item > button {
                            color: aliceblue !important;
                          }
                          .this-month > button {
                            border: 1px solid #fff !important;
                          }
                          .switch-btn{
                            color: aliceblue !important;
                          }
                          .transparent{
                            color: aliceblue !important;
                          }
                          button.on-selected{
                            background-color: #ff00e9 !important;
                          }
                          .days-btn {
                            background-color: #fae6fe !important;
                          }
                          button.today > p{
                            color: #000 !important;
                            font-weight: 100 !important;
                          }`;
  }
  // payWithPaypal() {
  //   console.log('Pay!!!!!!');
  //   this.payPal.init({
  //     PayPalEnvironmentProduction: 'ARWrJ5pdmpzKphRRLPijQKobEXbgnqV19iWT_kSSGR8HyRnTxcNAYLFxvN4CwtsDEI6aVqUpOt1QW3BE',
  //     PayPalEnvironmentSandbox: 'sb-c6oa43982474@business.example.com'
  //   }).then(() => {
  //     // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
  //     this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
  //     })).then(() => {
  //       const payment = new PayPalPayment(
  //         this.paymentAmount, this.currency, this.procedures.nombre, 'sale beauty lab ' + this.procedures.nombre);
  //       this.payPal.renderSinglePaymentUI(payment).then((res) => {
  //         console.log('respuesta : ',res);
  //         this.toastr.success('Successful payment');
  //       }, () => {
  //         this.toastr.error('Error or render dialog closed without being successful');
  //       });
  //     }, () => {
  //      this.toastr.error('Error in the configuration the PayPal');
  //     });
  //   }, () => {
  //     this.toastr.error('Paypal initialization failed');
  //   });
  // }


}