import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FrameworkService } from '../../services/framework.service';
import _ from 'lodash';
import { MatSelect } from '@angular/material/select';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

@Component({
  selector: 'sb-cb-tree-org-hierarchy-add-modal',
  templateUrl: './org-hierarchy-add-modal.component.html',
  styleUrls: ['./org-hierarchy-add-modal.component.scss']
})
export class OrgHierarchyAddModalComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  parentSearchControl = new FormControl('');
  selectedOrgsControl = new FormControl<(string | number)[]>([]);
  parentSelectedOrgControl = new FormControl('');
  
  // Example options - replace with your actual data
  orgOptions: any[] = [];
  filteredOptions: any[] = [];

  parentFilteredOptions: any[] = [];
  
  private destroy$ = new Subject<void>();
  frameworkData: any;

  constructor(
    public dialogRef: MatDialogRef<OrgHierarchyAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private frameworkService: FrameworkService,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.getSelectedStateOrg()
    if(this.data && this.data.type === 'update') {
      this.frameworkData = _.cloneDeep(this.frameworkService.completeResponse);
      this.getParentTerms(this.data.previous[this.data.previous.length - 2]);
    }

    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.filterOptions(value);
      });

    this.parentSearchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.filterParentOptions(value);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterOptions(searchValue: string) {
    if (!searchValue) {
      this.filteredOptions = [...this.orgOptions];
      return;
    }
    
    const filterValue = searchValue.toLowerCase();
    this.filteredOptions = this.orgOptions.filter(option => 
      option.orgName.toLowerCase().includes(filterValue)
    );
    
    // Ensure selected items are preserved in the filtered list
    const selectedIds = this.selectedOrgsControl.value || [];
    if (selectedIds.length > 0) {
      // Find any selected items that were filtered out
      const missingSelectedOptions = this.orgOptions.filter((option:any) => 
        selectedIds.includes(option.identifier) && 
        !this.filteredOptions.some(filtered => filtered.identifier === option.identifier)
      );
      // Add missing selected items back to filteredOptions
      if (missingSelectedOptions.length > 0) {
        this.filteredOptions = [...this.filteredOptions, ...missingSelectedOptions];
      }
    }
    this.sortOptionsWithSelectedFirst();
  }

  private sortOptionsWithSelectedFirst() {
    const selectedIds = this.selectedOrgsControl.value || [];
    
    this.filteredOptions.sort((a, b) => {
      const aIsSelected = selectedIds.includes(a.identifier);
      const bIsSelected = selectedIds.includes(b.identifier);
      
      if (aIsSelected && !bIsSelected) {
        return -1; // a comes first (selected items first)
      }
      if (!aIsSelected && bIsSelected) {
        return 1; // b comes first (selected items first)
      }
      
      // If both are selected or both are not selected, sort alphabetically
      return a.orgName.localeCompare(b.orgName);
    });
  }

  clearSearch(event: Event) {
    event.stopPropagation();
    this.searchControl.setValue('');
  }

  filterParentOptions(searchValue: string) {
    const originalOptions = this.frameworkData?.categories?.find((v:any) => 
      v.code === this.data?.previous[this.data.previous.length - 2]?.category
    )?.terms || [];
    
    if (!searchValue) {
      // Reset to all original options when search is empty
      this.parentFilteredOptions = [...originalOptions];
      return;
    }
    
    const filterValue = searchValue.toLowerCase();
    this.parentFilteredOptions = originalOptions.filter((option:any) => 
      option.name.toLowerCase().includes(filterValue)
    );
  }

  toggleSelectAll(event: Event) {
    event.stopPropagation();
    if (this.isAllSelected()) {
      this.selectedOrgsControl.setValue([]);
    } else {
      const allValues:any = this.filteredOptions.map(option => option.identifier);
      this.selectedOrgsControl.setValue(allValues);
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selectedOrgsControl.value?.length || 0;
    const numFiltered = this.filteredOptions.length;
    return numSelected > 0 && numSelected === numFiltered;
  }

  getSelectedOptions() {
    const selectedIds: any = this.selectedOrgsControl.value || [];
    return this.orgOptions.filter((option: any) => selectedIds.includes(option.identifier));
  }

  getParentSelectedOptions() {
    const selectedId = this.parentSelectedOrgControl.value;
    return this.parentFilteredOptions.find((option: any) => option.code === selectedId);
  }

  removeSelected(id: string | number) {
    const currentSelection = this.selectedOrgsControl.value || [];
    this.selectedOrgsControl.setValue(
      currentSelection.filter((value: any) => value !== id)
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.data && this.data.type === 'update' && this.selectedOrgsControl?.value?.find((v: any) => v === this.parentSelectedOrgControl.value)) {
      this.snackbar.open('You cannot select the parent organization as a child organization')
      return
    }
    if (this.data && this.data.type === 'update' && this.selectedOrgsControl?.value?.length === 0 && !this.parentSelectedOrgControl.value) {
      this.snackbar.open('Please select at least one organization or parent organization');
      return;
    }
    if (this.data && this.data.type === 'add' && this.selectedOrgsControl?.value?.length === 0) {
      this.snackbar.open('Please select at least one organization');
      return;
    }
    const selectedOrgs = this.getSelectedOptions();
    const parentSelectedOrg = this.getParentSelectedOptions();
    this.dialogRef.close({
      selectedOrg: selectedOrgs,
      paparentSelectedOrg: parentSelectedOrg,
      currentTerm: this.data?.previous[this.data.previous.length - 1],
      type: this.data.type,
    });
  }

  async getSelectedStateOrg() {
    const orgListData = this.frameworkService.additionalData || []
    if (orgListData && orgListData.length > 0) {
        const framworkData = _.cloneDeep(this.frameworkService.completeResponse)
        let orgIdsAdded: string[] = [];
        if (framworkData && framworkData.categories && framworkData.categories.length > 0) {
          framworkData.categories.forEach((category: any) => {
            if (category.terms && category.terms.length > 0) {
              category.terms.forEach((term: any) => {
                if (term.additionalProperties && term.additionalProperties.orgId) {
                  if (!orgIdsAdded.includes(term.additionalProperties.orgId)) {
                    orgIdsAdded.push(term.additionalProperties.orgId);
                  }
                }
              });
            }
          });
        }
        const filteredOrgList = orgListData.filter((org: any) => 
          !orgIdsAdded.includes(org.identifier)
        )
        this.orgOptions = filteredOrgList || [];
        this.filteredOptions = [...this.orgOptions];
    }
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    return true;
  }

  handleSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    
    // For space, we only want to prevent default behavior when in the search input
    // but allow the event to propagate for selection functionality
    if (event.key === ' ' && event.target instanceof HTMLInputElement) {
      // Don't prevent propagation, just prevent default to allow typing spaces in search
      event.stopPropagation(); 
    }
    return true;
  }

  checkAndClose(selectElement: MatSelect): void {
    if (!this.selectedOrgsControl.value || this.selectedOrgsControl.value.length === 0) {
      this.snackbar.open('Please select at least one organization')
    } else {
      selectElement.close();
    }
  }

  getNameOfOrg(id:any) {
    return this.filteredOptions.find((option: any) => option.identifier === id)?.orgName || '';
  }

  removeOrg(itemToRemove: string): void {
    const currentValues = this.selectedOrgsControl.value || [];
    const updatedValues = currentValues.filter(item => item !== itemToRemove);
    this.selectedOrgsControl.setValue(updatedValues);
  }

  getParentTerms(item:any) {
    this.parentFilteredOptions = this.frameworkData.categories.find((v:any) => v.code === item.category).terms
  }
}
