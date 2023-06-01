import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class JaTakkService {
  constructor(private JaTakkClient: HttpClient) {}
  JT_BASE_URL: string = "https://depotbiblioteket.no/r/jatakk/1.0/data/mode=check?"
  JT_URL_ISBN: string = this.JT_BASE_URL + "isbn="
  JT_URL_MMS: string = this.JT_BASE_URL + "mmsid="
  res: Response;
  error: Error;

  public lookUpByMms(mms: string) {
    let url = this.JT_URL_MMS + mms
    let res = this.JaTakkClient.get(url)
    return res
    
  }

  public lookUpByIsbn(isbn: string) {
    let url = this.JT_URL_ISBN + isbn
    let res = this.JaTakkClient.get(url)
    return res

  }
    

}
