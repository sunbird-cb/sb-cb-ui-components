import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural'
})
export class PluralPipe implements PipeTransform { // This pipe transforms a number into a singular or plural form based on the value.
  transform(value: number, singular: string, plural: string = `${singular}s`): string {
    return value <= 1 ? singular : plural;
  }
}
