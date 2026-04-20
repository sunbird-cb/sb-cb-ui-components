import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface SLWConfiguration {
  enabled: boolean;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  titleHi: string;
  descriptionHi: string;
  buttonText: string;
  width: string;
  orgId: string;
  orgName: string;
}

@Component({
  selector: 'app-slw-config-dialog',
  templateUrl: './slw-config-dialog.component.html',
  styleUrls: ['./slw-config-dialog.component.scss']
})
export class SlwConfigDialogComponent implements OnInit {
  slwForm: FormGroup;
  today: Date = new Date();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SlwConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SLWConfiguration
  ) {}

  ngOnInit() {
    this.initForm();

    // Dynamically update validators when enabled changes
    this.slwForm.get('enabled')?.valueChanges.subscribe((enabled: boolean) => {
      if (enabled) {
        this.slwForm.get('startDate')?.setValidators([Validators.required]);
        this.slwForm.get('endDate')?.setValidators([Validators.required]);
      } else {
        this.slwForm.get('startDate')?.clearValidators();
        this.slwForm.get('endDate')?.clearValidators();
        this.slwForm.get('startDate')?.setValue('');
        this.slwForm.get('endDate')?.setValue('');
      }
      this.slwForm.get('startDate')?.updateValueAndValidity();
      this.slwForm.get('endDate')?.updateValueAndValidity();
    });
  }

  initForm() {
    const parseDate = (dateStr: string) => {
      if (!dateStr) return '';
      const [day, month, year] = dateStr.split('-');
      return new Date(+year, +month - 1, +day);
    };

    this.slwForm = this.fb.group({
      enabled: [this.data?.enabled ?? true],
      startDate: [parseDate(this.data?.startDate), [Validators.required]],
      endDate: [parseDate(this.data?.endDate), [Validators.required]],
      title: [this.data?.title || 'State Learning Week', [Validators.required]],
      description: [this.data?.description || '', [Validators.required]],
      titleHi: [this.data?.titleHi || ''],
      descriptionHi: [this.data?.descriptionHi || ''],
      buttonText: [this.data?.buttonText || 'View More', [Validators.required]],
      width: [this.data?.width || '30px'],
      orgId: [this.data?.orgId || ''],
      orgName: [this.data?.orgName || '']
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.slwForm.valid) {
      this.dialogRef.close(this.slwForm.value);
    }
  }

  // Date validation
  validateDateRange() {
    const startDate = new Date(this.slwForm.get('startDate')?.value);
    const endDate = new Date(this.slwForm.get('endDate')?.value);
    
    if (startDate && endDate && startDate >= endDate) {
      this.slwForm.get('endDate')?.setErrors({ 'dateRange': true });
    } else {
      const endDateControl = this.slwForm.get('endDate');
      if (endDateControl?.hasError('dateRange')) {
        endDateControl.setErrors(null);
      }
    }
  }
}