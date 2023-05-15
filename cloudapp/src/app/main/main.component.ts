import { Observable  } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService} from '@exlibris/exl-cloudapp-angular-lib';
import { FormGroup, FormControl } from '@angular/forms';
import { JaTakkService } from '../api.service';
import {catchError} from 'rxjs/operators';
import { Item } from '../item';
import { error } from '@angular/compiler/src/util';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  loading = false;
  item: Item;
  formdata: any;
  submitted = false;
  JT_BASE_URL: string = "https://depotbiblioteket.no/r/jatakk/1.0/data/mode=check?"
  JT_URL_ISBN: string = this.JT_BASE_URL + "isbn="
  JT_URL_MMS: string = this.JT_BASE_URL + "mmsid="
  emptybarcode: boolean;



  constructor(
    private restService: CloudAppRestService,
    private http: JaTakkService
  ) { }

  ngOnInit() {
    this.formdata = new FormGroup({
      barcode: new FormControl()
      
    })
  }
  


  
  onClickSubmit(data) {
    if (!data) {
      this.emptybarcode = true;
    }
    else {
      this.emptybarcode = false;
      this.item = new Item();
      this.item.barcode = data.barcode
      this.restService.call('/items?item_barcode=' + this.item.barcode).subscribe(
        itemdata => {
          this.item.itemdata = itemdata;
    
          if (this.item.has_mms === true) {
          
            this.http.lookUpJaTakk(this.JT_URL_MMS + this.item.mms).subscribe((data) => {
              if (data['status'] != 0) {
              
                this.item.copieswanted = data['titles'][0]['copieswanted'];
                this.item.found_at_depot = true;
              }
             
            },
              nberror => {
                this.item.copieswanted = nberror.message;
              }
            )
          }
        
          if (this.item.found_at_depot === false && this.item.hasisbn === true) {

            this.http.lookUpJaTakk(this.JT_URL_ISBN + this.item.isbn).subscribe((data) => {

              if (data['status'] !== 0) {
    
                this.item.found_at_depot = true;
                this.item.copieswanted = data['titles'][0]['copieswanted']
              }
              else {
                console.log("No item found at depot")
              }
            },
              nberror => {
                this.item.copieswanted = nberror.message;
              }
            );
          }
          else if (this.item.found_at_depot === false) {
            this.item.copieswanted = 1;
          }
      
        },
        error => {
          this.item.error = error.message
        }
      
      );
    
    }
  }


  ngOnDestroy(): void {
  }

  
}