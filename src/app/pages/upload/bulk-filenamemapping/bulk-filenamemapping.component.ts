import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: "app-bulk-filenamemapping",
  templateUrl: "bulk-filenamemapping.component.html",
  styleUrls: ["bulk-filenamemapping.component.css"]
})
export class BulkfilenamemappingComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;
  sMsg: string = '';
  _FilteredList = [];
  TemplateList: any;
  _IndexList: any;
  _Records: any;
  DataUploadForm: FormGroup;
  _StatusList: any;
  public message: string;
  _HeaderList: any;
  _ColNameList = [];
  _CSVData: any;
  public records: any[] = [];
  papa: any;
  _TempID: any = 0;
  _HeaderListPending: any;
  myFiles: string[] = [];
  _FileDetails: string[][] = [];
  first = 0;
  rows = 10;

  _ColNamePendingList = ["FileName", "Cabinet", "Folder", "Subfolder", "Templatecode"];

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
    this.DataUploadForm = this.formBuilder.group({
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      id: [0],
      CSVData: [""]
    });
    this.BindHeader(this._FilteredList, this._FilteredList);
     this.Getpagerights();
  }

  Getpagerights() {
    var pagename = "bulkfoldermapping";
    const apiUrl = this._global.baseAPIUrl + 'Admin/Getpagerights?userid=' + localStorage.getItem('UserID') + ' &pagename=' + pagename + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
    });
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    let val = $event.target.value;
    let that = this
    this._FilteredList = this.records.filter(function (d) {
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

  }
  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    
    if (this.DataUploadForm.valid && files.length > 0) {
      var file = files[0];
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event: any) => {
        var csv = event.target.result; // Content of CSV file
        this.papa.parse(csv, {
          skipEmptyLines: true,
          header: true,
          complete: (results) => {
            for (let i = 0; i < results.data.length; i++) {
              let orderDetails = {
                order_id: results.data[i].Address,
                age: results.data[i].Age
              };
              this._Records.push(orderDetails);
            }
              }
        });
      }
    } else {
      // this.toastr.show(
      //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please Select <br> <b>Csv File</b><br><b>Template</b><br> before uploading!</span></div>',
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select Csv File Template before uploading!' });
    }
  }
  uploadListener($event: any): void {
    let text = [];
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      $(".selected-file-name").html(input.files[0].name);
      reader.onload = () => {
        let csvData = reader.result;
        console.log("csvData", csvData);
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        console.log("csvRecordsArray", csvRecordsArray);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        this._CSVData = csvRecordsArray;
        this._IndexList = csvRecordsArray;
        let validFile = this.getDisplayNames(csvRecordsArray);
        if (validFile == false) {
          this.fileReset();
        } else {
          this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
          this._FilteredList = this.records;
      this.prepareTableData(this._FilteredList, this._FilteredList);
          (<HTMLInputElement>document.getElementById('csvReader')).value = '';
             }
      };
      reader.onerror = function () {
      };

    } else {
      // this.toastr.show(
      //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please Select A Valid CSV File And Template</span></div>',
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select A Valid CSV File And Template' });
      this.fileReset();
    }
    this._FilteredList = this.records
  }
  checkDateFormat(date) {
     if (date != "") {
      let dateArr = date.split('-');
      const dateString = dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
      if (isNaN(dateArr[0]) || isNaN(dateArr[1]) || isNaN(dateArr[2])) {
        return false;
      }
      if (isNaN(new Date(dateString).getTime())) {
        return false;
      }
      return true;
    }
    else {
      return true;
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        const single = []
        for (let i = 0; i < this._ColNameList.length; i++) {
          single.push(curruntRecord[i].toString().trim())
        }
        csvArr.push(single)
      }
    }
    return csvArr;
  }
  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }
  getHeaderArray(csvRecordsArr: any) {
    var headers;
       headers = ["FileName", "Cabinet", "Folder", "Subfolder", "Templatecode"];
    return headers;
  }
  fileReset() { 
    this.records = [];
  }
  onSubmit() {
    this.submitted = true;
    if (this._CSVData != null && this._CSVData != undefined) {
      this.DataUploadForm.patchValue({
        id: localStorage.getItem('UserID'),
        CSVData: this._CSVData,
        User_Token: localStorage.getItem('User_Token')
      });
      const apiUrl = this._global.baseAPIUrl + 'DataUpload/BulkFileNameMapping';
      this._onlineExamService.postData(this.DataUploadForm.value, apiUrl)
        .subscribe(data => {
          this.downloadCSVFile(data);
          this.showSuccessmessage(data);
        }); 
    }
    else {
      this.ShowErrormessage("please select file");

    }
  }

  ShowErrormessage(data: any) {
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
    this.messageService.add({ severity: 'error', summary: 'Error', detail:data });
  }
  getDisplayNames(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
        if (headers.length != 5) {
      var msg = 'Invalid No. of Column Expected :- ' + this._ColNameList.length;
          this.ShowErrormessage(msg);
      return false;
    }
       this._ColNameList[0] = "FileName";
    this._ColNameList[1] = "Cabinet";
    this._ColNameList[2] = "Folder";
    this._ColNameList[3] = "Subfolder";
    this._ColNameList[4] = "Templatecode";
    return true;
  }


  GetHeaderNames() {
    this._HeaderList = "";
    this._HeaderList = "FileName,Cabinet,Folder,Subfolder,Templatecode";
  }

  downloadFile() {
    const filename = 'BulkFileNameMapping_CSVFileUpload';
    let csvData = "FileName,Cabinet,Folder,Subfolder,Templatecode";
    let blob = new Blob(['\ufeff' + csvData], {
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
    //       "ngx-toastr alert alert-dismissible alert-success alert-notify"
    //   }
    // );
    this.messageService.add({ severity: 'success', summary: 'Success', detail: data });
  }

  showSuccessmessage(data: any) {
    // this.toastr.show(
    //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title"> </span> <span data-notify="message"> ' + data + ' </span></div>',
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
    this.messageService.add({ severity: 'success', summary: 'Success', detail: data });
  }
  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'FileName', header: "FILE NAME", index: 1 },
      { field: 'Cabinet', header: "CABINET", index: 1 },
      { field: 'Folder', header: 'FOLDER', index: 3 },
      { field: 'Subfolder', header: 'SUBFOLDER', index: 2 },
      { field: 'Templatecode', header: 'TEMPLATE CODE', index: 2 },
    ];
    console.log("this.formattedData", tableData);
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'FileName': el[0],
        'Cabinet': el[1],
        'Folder': el[2],
        'Subfolder': el[3],
        'Templatecode': el[4],
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
      { field: 'FileName', header: "FILE NAME", index: 1 },
      { field: 'Cabinet', header: "CABINET", index: 1 },
      { field: 'Folder', header: 'FOLDER', index: 3 },
      { field: 'Subfolder', header: 'SUBFOLDER', index: 2 },
      { field: 'Templatecode', header: 'TEMPLATE CODE', index: 2 },
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

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }

  downloadCSVFile(strmsg: any) {
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
  BulkFileUpload() {
    const apiUrl = this._global.baseAPIUrl + 'FileUpload/BulkFU';
    this._onlineExamService.postData(this.DataUploadForm.value, apiUrl)
      .subscribe(data => {
        this.downloadBulkFile(data);
      });
  }

  DownloadPendingFiles() {

    const apiUrl = this._global.baseAPIUrl + 'File/DownloadPendingFiles';
    this._onlineExamService.postData(this.DataUploadForm.value, apiUrl)
      .subscribe(data => {
        this._StatusList = data;
        this.downloadPendingFile();
      });
  }

  downloadBulkFile(strmsg: any) {
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

  GetHeaderListPending() {
    this._HeaderListPending = "FileName,Cabinet,Folder,Subfolder,Templatecode";
    this._HeaderListPending += '\n'
    this._StatusList.forEach(stat => {
      for (let j = 0; j < this._ColNamePendingList.length; j++) {
        this._HeaderListPending += (stat[this._ColNamePendingList[j]]) + ((j <= this._ColNamePendingList.length - 2) ? ',' : '');
      }
      this._HeaderListPending += '\n'
    });

  }

  downloadPendingFile() {
    this.GetHeaderListPending()
    let csvData = this._HeaderListPending;
    if (this._StatusList.length > 0) {
      let blob = new Blob(['\ufeff' + csvData], {
        type: 'text/csv;charset=utf-8;'
      });
      let dwldLink = document.createElement("a");
      let url = URL.createObjectURL(blob);
      let isSafariBrowser = -1;
      if (isSafariBrowser) {
        dwldLink.setAttribute("target", "_blank");
      }
      dwldLink.setAttribute("href", url);
      dwldLink.setAttribute("download", "file_mapping_pending" + ".csv");
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
    } else {
      // this.toastr.show(
      //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">There should be some data before you download!</span></div>',
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There should be some data before you download!' });
    }
  }
  onDownloadExcelFile(_filename: string) {
    // _filename = 'Users_Data';
    this.exportToExcel(this.formattedData, _filename);
    // this.downloadFile();
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

}
