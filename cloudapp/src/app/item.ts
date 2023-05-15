export class Item {
  private _barcode: string;
  private _isbn: string;
  private _copieswanted: any = 0;
  private _itemdata: any;
  private _hasisbn: boolean = false;
  private _mms: string;
  private _has_mms: boolean = false;
  private _found_at_depot: boolean = false;
  private _error: string = null;


  public get barcode() {
    return this._barcode;
  }
  public set barcode(value: string) {
    this._barcode = value;
  }
  public get isbn() {
    return this._isbn;
  }
  public set isbn(value) {
    this._isbn = value;
    this._hasisbn = true;
  }

  public get hasisbn() {
    return this._hasisbn;
  }

  public get copieswanted() {
    return this._copieswanted;
  }
  public set copieswanted(value: any) {
    this._copieswanted = value;
  }
  public get itemdata() {
    return this._itemdata;
  }
  public set itemdata(value: any) {
    this._itemdata = value;
    
    this._retrive_mms();
    this._retrive_isbn();
  }

  public get mms(){
    return this._mms;
  }

  public set mms(value: string){
    this._mms = value;
    this.has_mms = true;
  }

  public get has_mms(){
    return this._has_mms;
  }
  
  public set has_mms(value: boolean) {
    this._has_mms = value;
  }
  
  public get found_at_depot() {
    return this._found_at_depot;
  }

  public set found_at_depot(value: boolean) {
    this._found_at_depot = value;

  }
  
  public get error(){
    return this._error
  }

  public set error(value: string) {
    this._error = value
  }
    private _retrive_mms() {
        let bibdata = this._itemdata.bib_data;
        let network_numbers = bibdata.network_number;
        network_numbers.forEach((num: string) => {
            if (num.startsWith("(EXLNZ-47BIBSYS_NETWORK)")) {
                let splitnum = num.split(")");
                this.mms = splitnum[1];

            }
        });
    }

  private _retrive_isbn() {
      let bibdata = this._itemdata.bib_data;
      if (bibdata.isbn !== null && bibdata.isbn !== 'undefined') {
        this.isbn = bibdata.isbn;
      }
    }
}
