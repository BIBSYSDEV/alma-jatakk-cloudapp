import { Component } from '@angular/core';
import { AppService } from './app.service';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-root',
  template: '<cloudapp-alert></cloudapp-alert><router-outlet></router-outlet>'
})
export class AppComponent {

  constructor(private appService: AppService) { }

}
