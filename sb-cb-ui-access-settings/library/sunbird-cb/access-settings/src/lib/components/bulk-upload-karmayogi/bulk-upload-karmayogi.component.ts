import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AccessControlService } from "../../_services/access-control.service";
import { NsAccessControlConfig } from "../../_models/access-control.model";
import { SnackbarComponent } from "../snackbar/snackbar.component";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
@Component({
  selector: "sb-uic-bulk-upload-karmayogi",
  templateUrl: "./bulk-upload-karmayogi.component.html",
  styleUrls: ["./bulk-upload-karmayogi.component.scss"]
})
export class BulkUploadKarmayogiComponent {
  @Output() appliedUser: EventEmitter<any> = new EventEmitter();
  @Input() isDisabled: boolean = false;

  bulkUploadConfig: NsAccessControlConfig.IBulkUploadKarmayogi;
  file!: File | null;

  currrentFilterType = "success";
  csvContent: any;
  contacts: any = [];
  properties: any = "";
  flag = false;
  fileUploading = false;
  isSuccessUserlist: any = [];
  isErrorUserlist: any = [];
  fileName: string = "";
  currentDate = new Date();

  holdSelectedUsers: any[] = [];
  finalSelectedUsers: any[] = [];
  isCCA = false;

  constructor(private accessControlService: AccessControlService, private snackBar: MatSnackBar) {
    this.bulkUploadConfig = this.accessControlService.accessControlConfig().bulkUploadKarmayogi;
    this.isCCA = this.accessControlService.accessControlConfig()?.userConfig?.org?.isCCA ?? false;
  }

  downloadSample() {
    const sampleFilePath = this.bulkUploadConfig.downloadSampleFile;
    if (sampleFilePath) {
      const link = document.createElement("a");
      link.href = sampleFilePath.path;
      link.download = sampleFilePath.fileName || "sample.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  onDrop(input: HTMLInputElement) {
    this.fileUploading = true;
    const files: any = [input];
    const fileTypes = ["csv"]; // acceptable file types

    if (files && files.length) {
      const extension = files[0].name.split(".").pop().toLowerCase(); // file extension from input file
      const isSuccess = fileTypes.indexOf(extension) > -1; // is extension in acceptable types
      if (files[0].size > MAX_FILE_SIZE) {
        this.fileUploading = false;
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            message: "The file has exceeded the 100 MB upload size limit.",
            type: "error"
          },
          duration: 3000,
          panelClass: "course-error-snackbar"
        });
        return;
      }

      if (isSuccess) {
        this.fileName = files[0].name;
        const fileToRead = files[0];
        const fileReader = new FileReader();
        fileReader.onload = (event: any) => {
          this.onFileLoad(event);
        };
        fileReader.readAsText(fileToRead, "UTF-8");
      } else {
        this.fileUploading = false;
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            message: "Unsupported File Format. Please upload a CSV file.",
            type: "error"
          },
          duration: 3000,
          panelClass: "course-error-snackbar"
        });
        return;
      }
    } else {
      this.fileUploading = false;
      this.snackBar.openFromComponent(SnackbarComponent, {
        data: {
          message: "Unsupported File Format. Please upload a CSV file.",
          type: "error"
        },
        duration: 3000,
        panelClass: "course-error-snackbar"
      });
      return;
    }
  }

  async onFileLoad(fileLoadedEvent: any) {
    this.isSuccessUserlist = [];
    this.isErrorUserlist = [];
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;

    // Flag is for extracting first line
    let flag = false;
    // Main Data
    const objarray: any = [];
    // Properties
    const prop: any = [];
    // Total Length
    let size: any = 0;

    for (const line of this.csvContent.split(/[\r\n]+/)) {
      if (flag) {
        const obj: any = {};
        for (let k = 0; k < size; k += 1) {
          // Dynamic Object Properties
          obj[prop[k]] = line.split(",")[k];
        }
        objarray.push(obj);
      } else {
        // First Line of CSV will be having Properties
        for (let k = 0; k < line.split(",").length; k += 1) {
          size = line.split(",").length;
          // Removing all the spaces to make them usefull, also removing any " characters
          prop.push(line.split(",")[k].replace(/ /g, "").replace(/"/g, ""));
        }
        flag = true;
      }
    }
    this.contacts = objarray;
    if (this.contacts && this.contacts.length > 0) {
      const headerValues = Object.keys(this.contacts[0]);
      if (headerValues.length < 0 || headerValues.length > 2) {
        // NOSONAR
        this.fileUploading = false;
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            message: "Field Mismatch. Please ensure your uploaded file matches the sample template provided.",
            type: "error"
          },
          duration: 3000,
          panelClass: "course-error-snackbar"
        });
        return;
      }
      if (!headerValues.includes("Emailid") || !headerValues.includes("Mobilenumber")) {
        this.fileUploading = false;
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            message: "Field Mismatch. Please ensure your uploaded file matches the sample template provided.",
            type: "error"
          },
          duration: 3000,
          panelClass: "course-error-snackbar"
        });
        return;
      }
    }
    this.properties = [];

    this.properties = prop;
    // console.log(this.properties)
    const emailIds: any = [];
    const mobileNumbers: any = [];
    const bothEmailAndMobile: any = {};
    this.contacts = this.contacts.filter((ele: any) => ele.Emailid || ele.Mobilenumber);
    if (this.contacts.length > 50000) {
      this.snackBar.openFromComponent(SnackbarComponent, {
        data: { message: "More than 50000 users are not allowed", type: "error" },
        duration: 3000,
        panelClass: "course-error-snackbar"
      });
      this.fileUploading = false;
    } else {
      await this.contacts.forEach((element: any) => {
        const emailPattern = new RegExp(`^[\\w\-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`);
        const mobilePattern = new RegExp(/^(6|7|8|9)\d{9}$/);
        const emailTest = element.Emailid ? emailPattern.test(element.Emailid) : true;
        const mobileTest = element.Mobilenumber ? mobilePattern.test(element.Mobilenumber) : true;
        element["email"] = element.Emailid;
        element["mobile"] = element.Mobilenumber;
        if (mobileTest && element.Mobilenumber) {
          mobileNumbers.push(element.Mobilenumber);
        }
        if (emailTest && element.Emailid) {
          emailIds.push(element.Emailid.toLowerCase());
        }
        if (emailTest && mobileTest) {
          element["status"] = "Success";
          element["userStatus"] = true;
          bothEmailAndMobile[element.Emailid.toLowerCase()] = element;
        } else {
          if (emailTest || mobileTest) {
            element["status"] = "Success";
            element["userStatus"] = true;
            if ((!emailTest && element.Mobilenumber !== "") || (!emailTest && element.Mobilenumber === "")) {
              element["status"] = "Error";
              element["userStatus"] = false;
              element["message"] = emailPattern.test(element.Emailid) ? "" : "Invalid Email id";
            }
            if ((!mobileTest && element.Emailid !== "") || (!mobileTest && element.Emailid === "")) {
              element["status"] = "Error";
              element["userStatus"] = false;
              element["message"] = mobilePattern.test(element.Mobilenumber) ? "" : "Invalid Mobile number";
            }
          } else {
            if (!emailTest && !mobileTest) {
              element["status"] = "Error";
              element["userStatus"] = false;
              element["message"] = "Invalid Email id and Mobile number";
            } else {
              element["status"] = "Error";
              element["userStatus"] = false;
              element["message"] = emailPattern.test(element.Emailid) ? "" : "Invalid Email id";
              element["message"] = mobilePattern.test(element.Mobilenumber) ? "" : "Invalid Mobile number";
            }
          }
        }
      });

      // Check for duplicate email IDs
      const duplicateEmails = emailIds.filter((item: any, index: number) => emailIds.indexOf(item) !== index);
      if (duplicateEmails.length > 0) {
        this.fileUploading = false;
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            message: "Duplicate email IDs found in the uploaded file. Please remove duplicates and try again.",
            type: "error"
          },
          duration: 3000,
          panelClass: "course-error-snackbar"
        });
        return;
      }

      // Check for duplicate mobile numbers
      const duplicateMobiles = mobileNumbers.filter((item: any, index: number) => mobileNumbers.indexOf(item) !== index);
      if (duplicateMobiles.length > 0) {
        this.fileUploading = false;
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            message: "Duplicate mobile numbers found in the uploaded file. Please remove duplicates and try again.",
            type: "error"
          },
          duration: 3000,
          panelClass: "course-error-snackbar"
        });
        return;
      }
      
      this.flag = true;
      const emailResponseData = await this.callUserCheckApi(emailIds, "primaryEmail");
      const mobileResponseData = await this.callUserCheckApi(mobileNumbers, "mobile");
      if (emailResponseData && mobileResponseData) {
        this.manageData(emailResponseData, mobileResponseData);
      } else {
        this.fileUploading = false;
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            message: "Something went wrong! Please try again",
            type: "error"
          },
          duration: 3000,
          panelClass: "course-error-snackbar"
        });
      }
    }
  }
  async callUserCheckApi(userData: any, key: any) {
    const request: any = {
      request: {
        filters: {},
        fields: ["userId", "email", "firstName", "lastName", "phone", "rootOrgId", "channel", "roles", "profileDetails", "rootOrgName"]
      }
    };
    if (key === "primaryEmail") {
      request.request.filters = {
        ...request.request.filters,
        email: userData
      };
    } else {
      request.request.filters = {
        ...request.request.filters,
        phone: userData
      };
    }

    if (this.accessControlService.accessControlConfig()?.application === NsAccessControlConfig.Application.MDO) {
      if (!this.isCCA) {
        request.request.filters.rootOrgId = this.accessControlService.accessControlConfig().userConfig.org?.rootOrgId ? [this.accessControlService.accessControlConfig().userConfig.org?.rootOrgId] : [];
      }
    }
    return this.accessControlService
      .validateUser(request)
      .toPromise()
      .then(async (res: any) => {
        if (res.result.response) {
          return await res.result.response;
        }
      })
      .catch((_err: any) => {})
      .finally(() => Promise.resolve());
  }

  manageData(userEmailData: any, userMobileData: any) {
    this.isSuccessUserlist = [];
    this.isErrorUserlist = [];
    const userEmailMap: any = {};
    const userEmailMapUserId: any = {};
    const userMobileMap: any = {};
    if (userEmailData.count) {
      userEmailData.content.forEach(async (e: any) => {
        if (e.profileDetails) {
          userEmailMap[e.profileDetails.personalDetails.primaryEmail.toLowerCase()] = e;
          userEmailMapUserId[e.userId] = e;
        }
      });
    }
    if (userMobileData.count) {
      userMobileData.content.forEach(async (e: any) => {
        if (e.profileDetails) {
          userMobileMap[e.profileDetails.personalDetails.mobile] = e;
        }
      });
    }
    this.contacts.forEach(async (e: any) => {
      if (e.userStatus) {
        if (e.email && e.mobile) {
          const userData = userEmailMap[e.email.toLowerCase()];
          if (userData && userData.profileDetails.personalDetails && userData.profileDetails.personalDetails.mobile) {
            if (String(userData.profileDetails.personalDetails.mobile) === String(e.mobile)) {
              e["userId"] = userData.userId;
              e["ministry"] = userData.rootOrgName;
              e["fullName"] = userData.firstName || userData.firstname;
              e["mobile"] = userData?.phone;
              e["email"] = userData?.email;
            } else {
              e["status"] = "Error";
              e["userStatus"] = false;
              e["message"] = "Given credentials are not matching";
            }
          } else {
            e["status"] = "Error";
            e["userStatus"] = false;
            e["message"] = "Given credentials are not matching";
          }
        } else if (e.email && userEmailMap[e.email.toLowerCase()]) {
          const userData = userEmailMap[e.email.toLowerCase()];
          e["mobile"] = userData?.phone;

          e["userId"] = userData.userId;
          e["ministry"] = userData.rootOrgName;
          e["fullName"] = userData.firstName || userData.firstname;
        } else if (e.mobile && userMobileMap[e.mobile]) {
          const userData = userMobileMap[e.mobile];
          e["email"] = userData?.email;
          e["userId"] = userData.userId;
          e["ministry"] = userData.rootOrgName;
          e["fullName"] = userData.firstName || userData.firstname;
        } else {
          e["status"] = "Error";
          e["userStatus"] = false;
          e["message"] = "Given credentials are not matching";
        }
      }
    });
    this.fileUploading = false;
    this.isSuccessUserlist = this.contacts.filter((ele: any) => ele.userStatus);
    this.isErrorUserlist = this.contacts.filter((ele: any) => !ele.userStatus);

    // this.successUserData.emit(this.isSuccessUserlist);
    this.currrentFilterType = this.isSuccessUserlist.length ? "success" : "error";
    if (this.currrentFilterType === "success") {
      // this.displayedColumns = [
      //   "fullName",
      //   "email",
      //   "ministry",
      //   "status",
      //   "mobile",
      // ];
      // this.dataSource = new MatTableDataSource<IUserElement>(
      //   this.isSuccessUserlist
      // );
      this.holdSelectedUsers = this.isSuccessUserlist;
      this.appliedUser.emit(this.holdSelectedUsers);

      // document.getElementById("user-table-select")?.scrollIntoView({ behavior: "smooth" });
    } else if (this.currrentFilterType === "error") {
      // this.displayedColumns = ["email", "status", "mobile", "message"];
      // this.dataSource = new MatTableDataSource<IUserElement>(
      //   this.isErrorUserlist
      // );
    }
  }

  onFilterChange(type: string) {
    this.currrentFilterType = type;
  }

  downloadErrorFile() {
    this.accessControlService.downloadFile(this.isErrorUserlist, "userErrordata");
  }

  onSelectingUser(event: any): void {
    this.holdSelectedUsers = [...event.selectedRows];
    this.appliedUser.emit(this.holdSelectedUsers);
  }

  // applySelections() {
  //   this.appliedUser.emit(this.holdSelectedUsers);
  // }
}
