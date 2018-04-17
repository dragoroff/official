import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CountryBasic} from '../shared/models/countryBasic.model';

@Component({
  selector: 'app-country-info',
  templateUrl: './country-info.component.html',
  styleUrls: ['./country-info.component.css']
})
export class CountryInfoComponent implements OnInit {

  @Input("country") currentCountry:CountryBasic;
  @Output() onSelectCountry:EventEmitter<CountryBasic>=new EventEmitter<CountryBasic>();
      constructor() { }
      updateCountrySelection():void{
          this.onSelectCountry.emit(this.currentCountry);
      }

    ngOnInit() {
    }
  
}
