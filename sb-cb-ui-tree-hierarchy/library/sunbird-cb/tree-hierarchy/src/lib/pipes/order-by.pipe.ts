import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  approvalTerms = [];
  constructor(){}

  transform(value: any, sortBy?: string): any{
    // return null;
    if(!sortBy) {
      if(value) {
        return value.slice().reverse();
      } else {
        return null
      }
    } else {
      if(Array.isArray(value)) {
          return  value.sort((a, b) => {
            const timestampA = a.additionalProperties && a.additionalProperties.timeStamp ? new Date(Number(a.additionalProperties.timeStamp)).getTime() : 0;
            const timestampB = b.additionalProperties && b.additionalProperties.timeStamp ? new Date(Number(b.additionalProperties.timeStamp)).getTime() : 0;
             
            return  timestampB - timestampA;
            
            });
     
      }
    }
     
  }

}
