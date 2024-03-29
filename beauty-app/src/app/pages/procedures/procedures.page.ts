import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HeroService } from './../../services/hero.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-procedures',
  templateUrl: './procedures.page.html',
  styleUrls: ['./procedures.page.scss'],
})
export class ProceduresPage implements OnInit {

  public procedures: any[];

  constructor(
    private http: HttpClient,
    public hero: HeroService,
    private router: Router
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + this.hero.getToken()
    })
  };

  ngOnInit() {
    this.getProcedures();
  }

  getProcedures() {
    this.getService()
    .subscribe((model: any) => {
      this.procedures = model.data;
    });
  }


  getService() {
    const url = `${this.hero.getUrl()}/procedures`;
    return this.http.get(url, this.httpOptions);
  }

  getDetail( procedures ) {
    console.log(procedures);
    localStorage.setItem('procedures', JSON.stringify(procedures));
    this.router.navigate(['/procedures-detail']);
  }

}
