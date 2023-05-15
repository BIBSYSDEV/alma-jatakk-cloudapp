import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class JaTakkService {
  constructor(private httpClient: HttpClient) {}
  



  public lookUpJaTakk(url: string) {
    let res = this.httpClient.get(url);
    return res;
  }
}
