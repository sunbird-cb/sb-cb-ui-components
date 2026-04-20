import { SelectionModel } from "@angular/cdk/collections";
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { PageChangeEmitter } from "../../_models/pagination.model";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import * as _ from "lodash";

@Component({
  selector: "sb-uic-list-table",
  templateUrl: "./list-table.component.html",
  styleUrls: ["./list-table.component.scss"]
})
export class ListTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() data: any[] = [];
  @Input() count: number = 0;
  @Input() initialPaginationSize: number = 5;
  @Input() initialPaginationSizeOptions: number[] = [5, 10, 25, 100];
  @Input() tableConfig: any;
  @Input() selected: any;
  @Input() bulkUploadEntriesCount: any;
  @Input() currentPage: number = 1;
  @Input() isDisabled: boolean = false;

  @Output() selectedDataChange: EventEmitter<any> = new EventEmitter();
  @Output() pageChange: EventEmitter<PageChangeEmitter> = new EventEmitter();
  @Output() removeSelectedData: EventEmitter<any> = new EventEmitter();
  @Output() sortChange: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<any>(this.data);
  selection = new SelectionModel<any>(true, []);
  selectedTablerow: any[] = [];

  constructor(private _liveAnnouncer: LiveAnnouncer) {}
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    // Handle data input change
    if (changes["data"]?.currentValue?.length) {
      const mappedUsers = changes["data"].currentValue.map((user: any) => ({
        firstName: user?.firstName || user?.firstname || user?.fullName || "",
        mobile: user?.mobile || user?.phone || "",
        email: user?.email || user?.maskedEmail || "",
        ministry: user?.ministry || user?.rootOrgName || "",
        invited_on: user?.invited_on || "",
        status: user?.status || "",
        userId: user?.userId || user?.id || ""
      }));
      this.data = mappedUsers;
      this.dataSource = new MatTableDataSource<any>(mappedUsers);
      this.dataSource.sort = this.sort;
    }

    if (changes["count"]?.currentValue !== undefined) {
      this.count = changes["count"].currentValue;
    }

    if (changes["selected"]?.currentValue) {
      this.selection.clear();

      if (changes["selected"].currentValue.length > 0) {
        this.dataSource.data.forEach(row => {
          if (changes["selected"].currentValue.some((sel: any) => sel.userId === row.userId)) {
            this.selection.select(row);
          }
        });
      }

      this.selectedTablerow = changes["selected"]?.currentValue || [];
    }

    if (changes["currentPage"]?.currentValue) {
      this.currentPage = changes["currentPage"]?.currentValue;
    }
  }

  ngAfterViewInit() {
    if (this.tableConfig?.canSortColumn) {
      this.dataSource.sort = this.sort;
    }
  }

  setPaginatedUsers(page: number) {
    const startIndex = (page - 1) * this.initialPaginationSize;
    const endIndex = startIndex + this.initialPaginationSize;
    const paginatedUsers = this.data.slice(startIndex, endIndex);
    this.dataSource = new MatTableDataSource<any>(paginatedUsers);
    this.dataSource.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    const isAll = this.isAllSelected();
    if (isAll) {
      const previouslySelected = this.dataSource.data.filter(row => this.selectedTablerow.some(sel => sel.userId === row.userId));
      this.dataSource.data.forEach(row => this.selection.deselect(row));
      this.selectedTablerow = this.selectedTablerow.filter(sel => !this.dataSource.data.some(row => row.userId === sel.userId));
      this.selectedDataChange.emit({
        selectedRows: this.selectedTablerow,
        toggledRows: previouslySelected,
        action: "unselectedAll"
      });
    } else {
      const newlySelected = this.dataSource.data.filter(row => !this.selectedTablerow.some(sel => sel.userId === row.userId));
      this.dataSource.data.forEach(row => this.selection.select(row));
      this.selectedTablerow = [...this.selectedTablerow, ...newlySelected];
      this.selectedDataChange.emit({
        selectedRows: this.selectedTablerow,
        toggledRows: newlySelected,
        action: "selectedAll"
      });
    }
  }

  toggleSelection(row: any): void {
    const rowId = row.userId;
    const isSelected = this.selectedTablerow.some(r => r.userId === rowId);

    if (isSelected) {
      this.selectedTablerow = this.selectedTablerow.filter(r => r.userId !== rowId);
      this.selection.deselect(row);
    } else {
      this.selectedTablerow.push(row);
      this.selection.select(row);
    }

    this.selectedDataChange.emit({
      selectedRows: _.cloneDeep(this.selectedTablerow),
      toggledRow: row,
      action: isSelected ? "unselected" : "selected"
    });
  }

  onPageChange(event: PageChangeEmitter) {
    this.currentPage = event?.currentPage;
    this.pageChange.emit(event);
  }

  removeUserFromSelected(): void {
    if (!this.selectedTablerow.length) {
      return;
    }
    const removedList = [...this.selectedTablerow];
    const remainingList = this.data.filter(user => !this.selectedTablerow.some(selected => selected.userId === user.userId));
    this.data = remainingList;
    this.count = remainingList.length;
    this.selectedTablerow = [];
    this.selection.clear();
    this.dataSource = new MatTableDataSource<any>(remainingList);
    this.dataSource.sort = this.sort;
    if (this.tableConfig?.type === "selectedUsers") {
      this.removeSelectedData.emit({
        remainingList,
        removedList
      });
    }
  }

  onSortChange(sortState: Sort): void {
    if (sortState.direction) {
      if (sortState.active === "ministry") sortState.active = "rootOrgName";
      if (sortState.active === "mobile") sortState.active = "phone";
      if (this.tableConfig?.type === "selectedUsers") {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
        this.sortChange.emit({ [sortState.active]: sortState.direction });
      }
    } else {
      if (this.tableConfig?.type === "selectedUsers") {
        this._liveAnnouncer.announce("Sorting cleared");
      } else {
        this.sortChange.emit({});
      }
    }
  }

  refreshSelected(): void {
    this.selection.clear();
  }
}
