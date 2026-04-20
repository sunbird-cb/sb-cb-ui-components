import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  private enrollData: any;

  setEnrollData(data: any) {
    this.enrollData = data;
  }
  getEnrollData() {
    return this.enrollData;
  }
  clearEnrollData() {
    this.enrollData = null;
  }
  constructor() { }
}
