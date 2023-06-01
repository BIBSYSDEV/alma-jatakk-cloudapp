import { Observable, of} from 'rxjs';
import { finalize, take, tap, map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService} from '@exlibris/exl-cloudapp-angular-lib';
import { FormGroup, FormControl } from '@angular/forms';
import { JaTakkService } from '../jatakk.service';
import {catchError} from 'rxjs/operators';
import { error } from '@angular/compiler/src/util';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  loading = false;
  formdata: any;
  submitted = false;

  emptybarcode: boolean;
  itemdata: any;
  errorMessage: string;
  mms: string;
  isbn: string;
  statusAtNb: number;
  copiesWanted: number;
  barcode: string;


  constructor(
    private almaService: CloudAppRestService,
    private jaTakkService: JaTakkService
  ) { }

  ngOnInit() {
    this.formdata = new FormGroup({
      barcode: new FormControl()
      
    })
  }
  

  async onClickSubmit(data) {
    if (!data) {
      this.barcode = null
    }
    else {  
      this.barcode = data.barcode
      // Lookup barcode in Alma
      this.itemdata = await this._lookupByBarcode(data.barcode).catch(error =>{this.errorMessage = error.message});
     
      // Parse MMS and ISBN from response and lookup at Repository Library
      if (!this.errorMessage) {
        this._get_identifiers();
        this._lookUpAtNb();
      }
  
    }
  }

  private _lookupByBarcode(bc: string): Promise<Response>{
    
    const BARCODE_PATH = '/items?item_barcode=';
    this.errorMessage = null;
    this.emptybarcode = false;
    this.itemdata = false 
    let url = BARCODE_PATH + bc
    return new Promise ((resolve, reject) =>{
      this.almaService.call(url).subscribe(data => { 
        resolve(data); 
      },
        error => {
          reject(error);
        })
    })
  }

  private _lookUpMms(): Promise<any> {
    return new Promise ((resolve, reject) => {
      this.jaTakkService.lookUpByMms(this.mms).subscribe(data => resolve(data),
      error =>{
        reject(error)
      })
    })    
  }

  private _lookUpIsbn(): Promise <any> {
      return new Promise ((resolve, reject) => {
      this.jaTakkService.lookUpByIsbn(this.isbn).subscribe(data => resolve(data),
      error =>{
        reject(error)
      })
    })    
  }

  private async _lookUpAtNb() {
    this.copiesWanted = null;
    this.statusAtNb = null;
    let res = null;
    // Try first with the mms ID, then with ISBN which is less precise
    if (this.mms) {
      let res = await this._lookUpMms().catch(error => {
        console.log(error.message);
        this.errorMessage = error.message
      })
    
      
    }
      else if (this.isbn) {
      let res = await this._lookUpIsbn().catch(error =>{console.log(error.message);
      this.errorMessage = error.message
    })
    
    }  
    
    if (res){
      this.statusAtNb = res.status
      this._setCopiesWanted(res)

    }

    else {
      this.copiesWanted = 1 // Assume the Repository Library wants a copy if not found
    }

  }

  private _setCopiesWanted(res: Response) {
    if (this.statusAtNb === 0){
      this.copiesWanted = 1 // Assume the Repository Library wants a copy if we received a 0 status from JaTakk
    }
    else {
     // Extract the number of copies wanted from the results
      this.copiesWanted = res['titles'][0]['copieswanted']
      
    }
    
  }
  private _retrive_mms() {
    const MMS_PREFIX = "(EXLNZ-47BIBSYS_NETWORK)"
    // Extraxt the MMS from the "Other system number" field. 
        let bibdata = this.itemdata.bib_data;
        let network_numbers = bibdata.network_number;
        network_numbers.forEach((num: string) => {
            if (num.startsWith(MMS_PREFIX)) {
                let splitnum = num.split(")");
              this.mms = splitnum[1]

            }
        });
  }
  
  private _retrive_isbn() {
    let bibdata = this.itemdata.bib_data  
    if (bibdata.isbn !== null && bibdata.isbn !== 'undefined') {
        this.isbn = bibdata.isbn;
      }
  }
  
  private _get_identifiers(){
    this.mms = null;
    this.isbn = null;
    this._retrive_mms()
    this._retrive_isbn()
     
  }
  
  ngOnDestroy(): void {
  }

  
}