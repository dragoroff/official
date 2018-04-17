import { CountryBasic } from './countryBasic.model';

export class Address extends CountryBasic {

    constructor(public cityName: string, public roadName: string, public houseNumber: number) {
        super();
    }
    localInfo(): string {
        return `${this.cityName} - ${this.houseNumber} ${this.roadName}`;
    }
}