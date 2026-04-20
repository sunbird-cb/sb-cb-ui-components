import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "sb-uic-add-competency-popup",
  templateUrl: "./add-competency-popup.component.html",
  styleUrls: ["./add-competency-popup.component.scss"],
})
export class AddCompetencyPopupComponent implements OnInit {
  searchTextCtrl!: FormControl;
  orgList: any = [
    {
      id: 1,
      orgName: "Ministry of Law and Justice",
      channel: "Ministry of Law and Justice",
      mapId: "123907",
      orgCode: null,
      parentMapId: null,
      sbOrgId: "013594691479191553298",
      sbRootOrgId: null,
      sbOrgType: "ministry",
      sbOrgSubType: "mdo",
      l1MapId: null,
      l2MapId: null,
      l3MapId: null,
      l1OrgName: null,
      l2OrgName: null,
    },
    {
      id: 3,
      orgName:
        "International Centre for Alternative Dispute Resolution (ICADR)",
      channel:
        "International Centre for Alternative Dispute Resolution (ICADR)",
      mapId: "128176",
      orgCode: null,
      parentMapId: null,
      sbOrgId: "01358833364552164547230",
      sbRootOrgId: null,
      sbOrgType: "mdo",
      sbOrgSubType: "board",
      l1MapId: "123907",
      l2MapId: "124088",
      l3MapId: null,
      l1OrgName: "Ministry of Law and Justice",
      l2OrgName: "Department of Legal Affairs",
    },
    {
      id: 4,
      orgName: "Income Tax Appellate Tribunal (ITAT) Jaipur",
      channel: "Income Tax Appellate Tribunal (ITAT) Jaipur",
      mapId: "128178",
      orgCode: null,
      parentMapId: null,
      sbOrgId: "013585666344037990426",
      sbRootOrgId: null,
      sbOrgType: "mdo",
      sbOrgSubType: "board",
      l1MapId: "123907",
      l2MapId: "124088",
      l3MapId: null,
      l1OrgName: "Ministry of Law and Justice",
      l2OrgName: "Department of Legal Affairs",
    },
    {
      id: 5,
      orgName: "Ministry of Law and Justice",
      channel: "Ministry of Law and Justice",
      mapId: "123907",
      orgCode: null,
      parentMapId: null,
      sbOrgId: "013594691477919155298",
      sbRootOrgId: null,
      sbOrgType: "ministry",
      sbOrgSubType: "mdo",
      l1MapId: null,
      l2MapId: null,
      l3MapId: null,
      l1OrgName: null,
      l2OrgName: null,
    },
    {
      id: 6,
      orgName:
        "International Centre for Alternative Dispute Resolution (ICADR)",
      channel:
        "International Centre for Alternative Dispute Resolution (ICADR)",
      mapId: "128176",
      orgCode: null,
      parentMapId: null,
      sbOrgId: "013588333964554547230",
      sbRootOrgId: null,
      sbOrgType: "mdo",
      sbOrgSubType: "board",
      l1MapId: "123907",
      l2MapId: "124088",
      l3MapId: null,
      l1OrgName: "Ministry of Law and Justice",
      l2OrgName: "Department of Legal Affairs",
    },
    {
      id: 7,
      orgName: "Income Tax Appellate Tribunal (ITAT) Jaipur",
      channel: "Income Tax Appellate Tribunal (ITAT) Jaipur",
      mapId: "128178",
      orgCode: null,
      parentMapId: null,
      sbOrgId: "01358566344037990426",
      sbRootOrgId: null,
      sbOrgType: "mdo",
      sbOrgSubType: "board",
      l1MapId: "123907",
      l2MapId: "124088",
      l3MapId: null,
      l1OrgName: "Ministry of Law and Justice",
      l2OrgName: "Department of Legal Affairs",
    },
  ];
  selectedList: any[] = [];
  sliceCount = 3;
  showMore = false;

  constructor(private modalRef: MatDialogRef<AddCompetencyPopupComponent>) {}

  ngOnInit(): void {
    // tslint:disable-next-line: max-line-length
    const noSpecialChar = new RegExp(
      /^[\u0900-\u097F\u0980-\u09FF\u0C00-\u0C7F\u0B80-\u0BFF\u0C80-\u0CFF\u0D00-\u0D7F\u0A80-\u0AFF\u0B00-\u0B7F\u0A00-\u0A7Fa-zA-Z0-9()$[\]\\.:,!''_/ -]*$/
    ); // NOSONAR
    this.searchTextCtrl = new FormControl(
      "",
      Validators.pattern(noSpecialChar)
    );
    this.searchTextCtrl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {});
  }

  selectedOrgChange(checked: any, arrayItem: any) {
    this.orgList.forEach((item: any) => {
      if (item.sbOrgId === arrayItem.sbOrgId) {
        item.checked = checked
      }
    })
    if (checked) {
      this.selectedList.push(arrayItem)
      this.orgList.forEach((item: any) => {
        if (item.sbOrgId === arrayItem.sbOrgId) {
          item.checked = checked
        }
      })
    } else if (!checked) {
      this.selectedList = this.selectedList.filter((v: any) => v.sbOrgId !== arrayItem.sbOrgId)
    }
  }

  removeSelectedOrg(arrayItem: any) {
    this.selectedList = this.selectedList.filter((v: any) => v.sbOrgId !== arrayItem.sbOrgId)
    this.orgList.forEach((item: any) => {
      if (item.sbOrgId === arrayItem.sbOrgId) {
        item.checked = false
      }
    })
  }

  clearAll() {
    this.orgList.forEach((item: any) => { item.checked = false })
    this.selectedList = []
    this.showMore = false

  }

  showMoreSelectedOrg() {
    this.sliceCount = this.selectedList.length
    this.showMore = true
  }
  showLessSelectedOrg() {
    this.sliceCount = 3
    this.showMore = false
  }

  cancelModal() {
    this.modalRef.close();
  }

  submitCompetency() {
    this.modalRef.close(this.selectedList);
  }

}
