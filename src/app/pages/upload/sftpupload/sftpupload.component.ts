import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from '@angular/router';
import swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { MessageService } from 'primeng/api'; 
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-sftpupload",
  templateUrl: "sftpupload.component.html",
  styleUrls: ["sftpupload.component.css"]
})
export class SftpUploadComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;
  BranchList: any;
  sMsg: string = '';
  _FilteredList = [];
  TemplateList: any;
  _FileList: any;
  _Records: any;
  sftpuploadForm: FormGroup;

  public message: string;
  _HeaderList: any;
  _ColNameList = [];
  _CSVData: any;
  public records: any[] = [];
  _DepartmentList: any;
  _TempID: any = 0;

  myFiles: string[] = [];
  _FileDetails: string[][] = [];
  first = 0;
  rows = 10;

  @Output() public onUploadFinished = new EventEmitter();
  constructor(
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }
  ngOnInit() {
    this.sftpuploadForm = this.formBuilder.group({
      BranchID: ['',],
      DeptID: [""],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
    });
    this.GetCountOnly();
    this.getDepartmnet();
    this.sftpuploadForm.controls['BranchID'].setValue(0);
 //   this.geBranchList(0);
  }
  getDepartmnet() {
    const apiUrl = this._global.baseAPIUrl + 'Department/GetList?user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._DepartmentList = data;
      this.sftpuploadForm.controls['DeptID'].setValue(0);
    });

  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    console.log($event.target.value);

    let val = $event.target.value;
    let that = this
    this._FilteredList = this.records.filter(function (d) {
      console.log(d);
      for (var key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  OnReset() {
    this.Reset = true;
    this.sftpuploadForm.reset();
    this.sftpuploadForm.controls['User_Token'].setValue(localStorage.getItem('User_Token'));
    this.sftpuploadForm.controls['UserID'].setValue(localStorage.getItem('UserID'));
    this.sftpuploadForm.controls['CreatedBy'].setValue(localStorage.getItem('UserID'));
  }
  GetCountOnly() {
    const apiUrl =
      this._global.baseAPIUrl +
      "FileUpload/GetCountOnly?ID=" +
      localStorage.getItem('UserID') +
      "&user_Token=" +
      this.sftpuploadForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this._FileList = data;
      this._FilteredList = data;
      this.prepareTableData(this._FilteredList, this._FilteredList);
    });
  }
  GetFileCount() {

    var bid = this.sftpuploadForm.get("BranchID").value;
    if (bid == null) {
      bid = 0;
    }
    const apiUrl = this._global.baseAPIUrl + "FileUpload/GetFileCount?ID=" + this.sftpuploadForm.get("DeptID").value + "&user_Token=" + this.sftpuploadForm.get("User_Token").value + "&BranchID=" + bid;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this._FileList = data;
      this._FilteredList = data;
      this.prepareTableData(this._FilteredList, this._FilteredList);
    });
  }

  geBranchListByUserID(userid: number) {
    this.geBranchList(userid);
  }

  geBranchList(userid: any) {
  
    //alert(userid);
  
    const apiUrl =
      this._global.baseAPIUrl +
      "BranchMapping/GetBranchDetailsRegionWise?ID=" +
      userid +
      "&user_Token=" +
      this.sftpuploadForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this.BranchList = data;
      this.sftpuploadForm.controls['BranchID'].setValue(0);
    });
  }
  onSubmit() {
    const apiUrl = this._global.baseAPIUrl + 'FileUpload/SftpFileupload';
    this._onlineExamService.postData(this.sftpuploadForm.value, apiUrl)
      .subscribe(data => {
        // this.toastr.show(
        //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> File Uploaded Succesfully. </span></div>',
        //   "",
        //   {
        //     timeOut: 3000,
        //     closeButton: true,
        //     enableHtml: true,
        //     tapToDismiss: false,
        //     titleClass: "alert-title",
        //     positionClass: "toast-top-center",
        //     toastClass:
        //       "ngx-toastr alert alert-dismissible alert-success alert-notify"
        //   }
        // );
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File Uploaded Succesfully.' });
        var strmsg = data;
        this.downloadFile(data);
      });
  }
  downloadFile(strmsg: any) {
    const filename = 'File upload status';
    let blob = new Blob(['\ufeff' + strmsg], {
      type: 'text/csv;charset=utf-8;'
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }


    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);

  }

  showmessage(data: any) {
    // this.toastr.show(
    //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation ! </span> <span data-notify="message"> ' + data + ' </span></div>',
    //   "",
    //   {
    //     timeOut: 3000,
    //     closeButton: true,
    //     enableHtml: true,
    //     tapToDismiss: false,
    //     titleClass: "alert-title",
    //     positionClass: "toast-top-center",
    //     toastClass:
    //       "ngx-toastr alert alert-dismissible alert-danger alert-notify"
    //   }
    // );

    this.messageService.add({ severity: 'error', summary: 'Error', detail: data });
  }
  validation() {
    if (this.sftpuploadForm.get('TemplateID').value <= 0) {
      this.showmessage("Please Select Template ID");
      return false;
    }
    return true;
  }
  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'TemplateName', header: 'TEMPLATE', index: 2 },
      { field: 'DepartmentName', header: 'CABINET', index: 3 },
      { field: 'BranchName', header: 'FOLDER', index: 3 },
      { field: 'SubfolderName', header: 'SUB FOLDER', index: 3 },
      { field: 'FileCount', header: 'FILE COUNT', index: 3 },
    ];
    console.log("this.formattedData", tableData);
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'DepartmentName': el.DepartmentName,
        'TemplateName': el.TemplateName,
        'BranchName': el.BranchName,
        'SubfolderName': el.SubfolderName,
        'FileCount': el.FileCount
      });

    });
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }

  BindHeader(tableData, headerList) {
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'DepartmentName', header: 'CABINET', index: 3 },
      { field: 'TemplateName', header: 'TEMPLATE', index: 2 },

      { field: 'BranchName', header: 'FOLDER', index: 3 },
      { field: 'SubfolderName', header: 'SUB FOLDER', index: 3 },
      { field: 'FileCount', header: 'FILE COUNT', index: 3 },
    ];
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }
  searchTable($event) {
    let val = $event.target.value;
    if (val == '') {
      this.formattedData = this.immutableFormattedData;
    } else {
      let filteredArr = [];
      const strArr = val.split(',');
      this.formattedData = this.immutableFormattedData.filter(function (d) {
        for (var key in d) {
          strArr.forEach(el => {
            if (d[key] && el !== '' && (d[key] + '').toLowerCase().indexOf(el.toLowerCase()) !== -1) {
              if (filteredArr.filter(el => el.srNo === d.srNo).length === 0) {
                filteredArr.push(d);
              }
            }
          });
        }
      });
      this.formattedData = filteredArr;
    }
  }

  onDownloadExcelFile(_filename: string) {
    this.exportToExcel(this.formattedData, _filename);
  }

  exportToExcel(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'csv', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.ms-excel' });
    const url: string = window.URL.createObjectURL(data);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = fileName + '.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }

}
