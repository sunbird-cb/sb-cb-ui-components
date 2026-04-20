import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges, SimpleChanges, AfterViewChecked, ChangeDetectorRef } from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table'
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator'
import { MatSort } from '@angular/material/sort'
import * as _ from 'lodash'
import { ITableData, IColums } from '../interface/interfaces'

@Component({
  selector: 'ws-widget-org-user-table-v2',
  templateUrl: './org-user-table-v2.component.html',
  styleUrls: ['./org-user-table-v2.component.scss'],
})
export class OrgUserTableV2Component implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {
  @Input() tableData!: ITableData | undefined
  @Input() data?: []
  @Input() isUpload?: boolean
  @Input() isCreate?: boolean
  @Input() isDownload?: boolean
  @Input() isConsumptionReport?: boolean
  @Input() userId?: any
  @Output() clicked?: EventEmitter<any>
  @Output() actionsClick?: EventEmitter<any>
  @Output() eOnRowClick = new EventEmitter<any>()
  @Output() eOnButtonClick = new EventEmitter<any>()
  @Output() searchByEnterKey = new EventEmitter<any>()
  @Output() pageChangeClick = new EventEmitter<any>()
  @Input() showEditOnCondition?: boolean
  @Input() isSearchBar = true
  @Input() paginationv1?: boolean | true
  @Input() paginationv2?: boolean | false
  // @Output('page') pageChangeClick: EventEmitter<PageEvent> = new EventEmitter();

  bodyHeight = document.body.clientHeight - 125
  displayedColumns: IColums[] | undefined
  dataSource!: any
  widgetData: any
  pageLength?: number
  pageSize = 20
  pageSizeOptions = [20, 50, 100]
  searchValue: string = ''
  moreThanTwoChar = false
  @Input()totalRecords?: any
  @Input()tabChangeIndex?: any
  // @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator
    // this.setDataSourceAttributes()
  }
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }
  selection = new SelectionModel<any>(true, [])

  // setDataSourceAttributes() {
  //  this.dataSource.paginator = this.paginator
  // }

  constructor(
    private changeDetector: ChangeDetectorRef
    ) {
    this.dataSource = new MatTableDataSource<any>()
    this.actionsClick = new EventEmitter()
    this.clicked = new EventEmitter()
    // this.dataSource.paginator = this.paginator
  }

  ngOnInit() {
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
    this.dataSource.data = this.data
    this.dataSource = new MatTableDataSource(this.data)
    this.pageLength = this.totalRecords
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && changes.data.currentValue) {
      this.dataSource.data = _.get(changes, 'data.currentValue')
    }
    // this.pageLength = this.totalRecord
  }

  ngAfterViewInit() {
    if (this.data) {
      this.dataSource.data = this.data
    }
  }

  ngAfterViewChecked() {
    if (this.totalRecords !== undefined && this.totalRecords !== '') {
      if (this.dataSource && this.dataSource.paginator && this.dataSource.paginator.length !== this.totalRecords) {
        this.dataSource.paginator.length = this.totalRecords
      }
      this.pageLength = this.totalRecords
      this.changeDetector.detectChanges()
    }

  }

  applyFilter(filterValue: any) {
    if (filterValue?.length === 0) {
      this.onSearchEnter('')
    }
    if (filterValue?.length > 2) {
      this.moreThanTwoChar = true
    } else {
      this.moreThanTwoChar = false
    }
  }

  buttonClick(action: string, row: any) {
    if (this.tableData) {
      const isDisabled = _.get(_.find(this.tableData.actions, ac => ac.name === action), 'disabled') || false
      if (!isDisabled && this.actionsClick) {
        this.actionsClick.emit({ action, row })
      }
    }
  }

  getFinalColumns() {
    if (this.tableData !== undefined) {
      const columns = _.map(this.tableData.columns, c => c.key)
      if (this.tableData.needCheckBox) {
        columns.splice(0, 0, 'select')
      }
      if (this.tableData.needHash) {
        columns.splice(0, 0, 'SR')
      }
      if (this.tableData.actions && this.tableData.actions.length > 0) {
        columns.push('Actions')
      }
      if (this.tableData.needUserMenus) {
        columns.push('Menu')
      }
      return columns
    }
    return ''
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  filterList(list: any[], key: string) {
    return list.map(lst => lst[key])
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: any) => this.selection.select(row))
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`
  }

  onRowClick(e: any) {
    this.eOnRowClick.emit(e)
  }

  onButtonClick(type: string, event: any) {
    this.eOnButtonClick.emit({ type, event })
  }

  onSearchEnter(event: any) {
    if (event === '') {
      this.searchByEnterKey.emit('')
    } else if (event?.length > 2) {
      this.searchByEnterKey.emit(event)
    }
    if (event?.target?.value === '') {
      this.searchByEnterKey.emit('')
    } else if (event?.target?.value?.length > 2){
      this.searchByEnterKey.emit(event?.target?.value)
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize
    this.pageChangeClick.emit(event)
  }
}
