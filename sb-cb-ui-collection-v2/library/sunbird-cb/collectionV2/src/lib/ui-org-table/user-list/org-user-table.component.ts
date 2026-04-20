import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table'
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator'
import { MatSort } from '@angular/material/sort'
import * as _ from 'lodash'

import { ITableData, IColums } from '../interface/interfaces'

@Component({
  selector: 'ws-widget-org-user-table',
  templateUrl: './org-user-table.component.html',
  styleUrls: ['./org-user-table.component.scss'],
})
export class OrgUserTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() tableData!: ITableData | undefined
  @Input() data?: []
  @Input() isUpload?: boolean
  @Input() isCreate?: boolean
  @Input() isDownload?: boolean
  @Input() isConsumptionReport?: boolean
  @Input() userId?: any
  @Input() isTrainingPlan?: boolean
  @Input() trainingTagList?: any[]
  @Input() showEditOnCondition?: boolean
  @Input() isSearchBar = true
  @Input() actionMenuItem?: any
  @Output() clicked?: EventEmitter<any>
  @Output() actionsClick?: EventEmitter<any>
  @Output() eOnRowClick = new EventEmitter<any>()
  @Output() eOnButtonClick = new EventEmitter<any>()
  @Output() searchByEnterKey = new EventEmitter<any>()
  @Output() tagSelectedData = new EventEmitter<any>()

  bodyHeight = document.body.clientHeight - 125
  displayedColumns: IColums[] | undefined
  dataSource!: any
  widgetData: any
  length!: number
  pageSize = 20
  pageSizeOptions = [20, 50, 100]
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }
  selection = new SelectionModel<any>(true, [])
  isSearchText = false

  constructor() {
    this.dataSource = new MatTableDataSource<any>()
    this.actionsClick = new EventEmitter()
    this.clicked = new EventEmitter()
    this.dataSource.paginator = this.paginator
  }

  ngOnInit() {
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
  }

  ngOnChanges(data: SimpleChanges) {
    this.dataSource.data = _.get(data, 'data.currentValue')
    this.length = this.dataSource.data.length
    if (this.paginator) {
      this.paginator.firstPage()
    }
  }

  ngAfterViewInit() {
    if (this.data) {
      this.dataSource.data = this.data
      this.dataSource.paginator = this.paginator
    }
  }

  applyFilter(filterValue: any) {
    if (filterValue) {
      this.isSearchText = true
      let fValue = filterValue.trim()
      fValue = filterValue.toLowerCase()
      this.dataSource.filter = fValue
    } else {
      this.isSearchText = false
      this.dataSource.filter = ''
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
      if (this.tableData.cbpPlanMenu) {
        columns.push('CBP Menu')
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
    this.searchByEnterKey.emit(event.target.value)
  }

  tagSelectedItem(_item: any) {
    this.tagSelectedData.emit(_item)
  }

  checkIfEnabled(_rowData: any, _item: any) {
    if (_rowData.status.toLowerCase() === 'live' && _item.key === 'publishContent') {
      return false
    }
    if (_item.isMdoLeader) {
      return true
    }
    if (_item.isMdoAdmin && _rowData.createdBy === this.userId) {
      return true
    }
    if (_item.isMdoAdmin && _rowData.createdBy !== this.userId && _item.key === 'preivewContent') {
      return true
    }
    return false
  }
}
