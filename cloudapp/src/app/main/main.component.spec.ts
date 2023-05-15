import { waitForAsync, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MainComponent } from './main.component';
import { CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import {JaTakkService} from '../api.service'
import { Item } from '../item';
import { of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {BARCODE, RES, NBRES} from './cloudapp.tests'

describe('MainComponent', () => {
    let component: MainComponent;
    let fixture: ComponentFixture<MainComponent>;
    let almaSpy: jasmine.Spy;
    let compiled: any;
    let nbSpy: jasmine.Spy;
    let frm: DebugElement;


    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [MainComponent],
            providers: [
                CloudAppRestService,
                JaTakkService,
                HttpClient,
                HttpHandler,
            
            ]
        })
            .compileComponents();
    }));
    
    
    
    beforeEach(
        () => {
            fixture = TestBed.createComponent(MainComponent);
            component = fixture.componentInstance;
            compiled = fixture.debugElement.nativeElement;
            component.formdata = new FormGroup({"value": new FormControl('')})
            component.formdata.value = BARCODE
            frm = fixture.debugElement.query(By.css('.search-form'));

         
        
        })
    
    
    it('should create', () => {
        expect(component).toBeTruthy();
    })

    it('Should have an input for the barcode field', () => {
            const el = fixture.debugElement.query(By.css('.fortextbox'));
            expect(el).toBeTruthy();
        }
        )
        
    it('Should have a submit button', () => {
        const btnEl = fixture.debugElement.query(By.css('.forsubmit'));
        expect(btnEl).toBeTruthy();
        }
        )
    
    it('Should display a warning if the barcode field is empty', () =>{
        let inputBox = fixture.debugElement.query(By.css('.fortextbox')).nativeElement;
        inputBox.Value = null
        component.formdata.value = null
        frm.triggerEventHandler('ngSubmit', null)
        fixture.detectChanges();
        let nobarcodemessage = fixture.debugElement.query(By.css('.barcodeempty'))
        expect(nobarcodemessage.nativeElement).toBeTruthy();
        component.formdata.value = BARCODE;
        frm.triggerEventHandler('ngSubmit', BARCODE)
        fixture.detectChanges();
        expect(nobarcodemessage).toBeFalsy();
    })
    it('Should not display the results section before a search', () => {
        const results = fixture.debugElement.query(By.css('.results'));
        expect(results).toBeFalsy();


    })

    it('Should call onCliCkSubmit when the form is submitted', () => {
        let inputBox = fixture.debugElement.query(By.css('.fortextbox')).nativeElement;
        inputBox.value = BARCODE;
        const submitSpy = spyOn(component, 'onClickSubmit')  
        frm.triggerEventHandler('ngSubmit', BARCODE)
        expect(submitSpy).toHaveBeenCalled();
    }
    );

    beforeEach(() => {
        almaSpy = almaRestSpy(fixture);
        nbSpy = jaTakkSpy(fixture);
        frm.triggerEventHandler('ngSubmit', null)

    })
    it('Should create an item when an ngSubmit is called', () => {
        expect(component.item).toBeTruthy(); }
    );

    it('Should call the ALMA Rest API to retrieve item data', () => {
        expect(almaSpy).toHaveBeenCalled();
        expect(component.item.itemdata).toBeTruthy();
    })

    it('Should call the JaTakk Rest API', () => {
        expect(nbSpy).toHaveBeenCalled();
        
    });

    it('Should get the number of copies wanted from the JaTakk Rest API', () => {
        expect(component.item.copieswanted).toBe(1);
    }
        )

    it('Should display the results', () => {
        fixture.detectChanges()
       const results = fixture.debugElement.query(By.css('.results')).nativeElement;
        expect(results).toBeTruthy();
        
    });

    const almaRestSpy = (fixture: ComponentFixture<any>) => {
    let mockRestService = fixture.debugElement.injector.get(CloudAppRestService);
    return spyOn<any>(mockRestService, 'call').and.callFake((request:any) =>{
        return of(RES)
    });
}

    const jaTakkSpy = (fixture: ComponentFixture<any>) =>{
        let mockJatakkService = fixture.debugElement.injector.get(JaTakkService);
        return spyOn<any>(mockJatakkService, 'lookUpJaTakk').and.callFake((url: String)=>{
            return of (NBRES)
        })
    }

    
})

    
    
    




