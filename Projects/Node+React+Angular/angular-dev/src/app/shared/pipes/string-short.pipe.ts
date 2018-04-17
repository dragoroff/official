import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appStringShort'
})
export class StringShortPipe implements PipeTransform {
  transform(str: string, strLength: number = 50) {
    let addStr = (str.length >= strLength) ? "..." : "";
    return str.slice(0, strLength)+addStr;
  }
}
