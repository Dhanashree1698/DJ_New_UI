import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api'; 
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-dataupload",
  templateUrl: "dataupload.component.html",
  styleUrls: ["dataupload.component.css"]
})
export class DataUploadComponent implements OnInit {
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
  _HeaderListPending: any;
  isFileInvalid = true;
  public message: string;
  _HeaderList: any;
  _ColNameList = [];
  _StatusList: any;
  _CSVData: any;
  public records: any[] = [];
  papa: any;
  _TempID: any = 0;

  myFiles: string[] = [];
  _FileDetails: string[][] = [];
  isValidationError: any;
  _ColNamePendingList = ["FileName"];

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
      TemplateName: ['', Validators.required],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      id: [0],
      UplaodBy: [],
      TemplateID: [0, Validators.required],
      CSVData: [""]
    });
    this.geTTempList();
    this.Getpagerights();
  }
  Getpagerights() {
    var pagename = "CSV Upload";
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
    this.Reset = true;
    this.DataUploadForm.reset();
    this.DataUploadForm.controls['User_Token'].setValue(localStorage.getItem('User_Token'));
    this.DataUploadForm.controls['UserID'].setValue(localStorage.getItem('UserID'));
    this.DataUploadForm.controls['CreatedBy'].setValue(localStorage.getItem('UserID'));
    this.DataUploadForm.controls['TemplateID'].setValue(0);
  }
  geTTempList() {
    const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + this.DataUploadForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.TemplateList = data;
      this.DataUploadForm.controls['TemplateID'].setValue(0);
    });

  }
  GetDisplayField(TID: number) {
    const apiUrl = this._global.baseAPIUrl + 'DataUpload/GetFieldsName?ID=' + TID + '&user_Token=' + this.DataUploadForm.get('User_Token').value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data) => {
      this._ColNameList = data;
      this.GetHeaderNames();
    });
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
    if (this.isValidCSVFile(files[0]) && this.DataUploadForm.get('TemplateID').value > 0) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      $(".selected-file-name").html(input.files[0].name);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        this._CSVData = csvRecordsArray;
        this._IndexList = csvRecordsArray;
        let validFile = this.getDisplayNames(csvRecordsArray);
        if (validFile == false) {
          this.isFileInvalid = true;
          this.fileReset();
        } else {
          this.isFileInvalid = false;
          this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
          this._FilteredList = this.records;
          (<HTMLInputElement>document.getElementById('csvReader')).value = '';
        }
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
        return true;
      }
      if (isNaN(new Date(dateString).getTime())) {
        return true;
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
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }
  fileReset() {
    this.records = [];
  }

  onSubmit() {
    this.submitted = true;
    if (this.validation() == false) {
      return;
    }
    let _UplaodBy = 0;
    if (this.DataUploadForm.get("UplaodBy").value) {
      _UplaodBy = 1;
    }
    this.DataUploadForm.patchValue({
      id: localStorage.getItem('UserID'),
      CSVData: this._CSVData,
      User_Token: localStorage.getItem('User_Token'),
      UplaodBy: _UplaodBy
    });
    const apiUrl = this._global.baseAPIUrl + 'DataUpload/Create';
    this._onlineExamService.postData(this.DataUploadForm.value, apiUrl)
      .subscribe(data => {
        // this.toastr.show(
        //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> ' + data + ' </span></div>',
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
      });
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
    this.messageService.add({ severity: 'error', summary: 'Error', detail: data });
  }
  geTemplateNameListByTempID(TID: number) {
    this.GetDisplayField(TID);
  }

  getDisplayNames(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    if (headers.length != this._ColNameList.length) {
      var msg = 'Invalid No. of Column Expected :- ' + this._ColNameList.length;
      this.ShowErrormessage(msg);
      return false
    }
    for (let j = 0; j < headers.length; j++) {
      if (headers[j].toLowerCase() != this._ColNameList[j].DisplayName.toLowerCase()) {
        var msg = 'In Valid Column Name :-- ' + headers[j] + ' --Expected: ' + this._ColNameList[j].DisplayName;
        this.showmessage(msg);
        return false;
      }
    }
    return true;
  }
  GetHeaderNames() {
    this._HeaderList = "";
    for (let j = 0; j < this._ColNameList.length; j++) {
      this._HeaderList += this._ColNameList[j].DisplayName + ',';
    }
  }
  downloadFile() {
    if (this.validation() == true) {
      const filename = this.TemplateList.find(el => el.TemplateID == this.DataUploadForm.controls.TemplateID.value).TemplateName;
      let csvData = this._HeaderList;
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

  validation() {
    if (this.DataUploadForm.get('TemplateID').value <= 0) {
      this.ShowErrormessage("Please Select Template ID");
      return false;
    }
    return true;
  }

  getCellClass = ({ row, column, value }): any => {
    const field = this._ColNameList.filter((el, index) => el.DisplayName === column.name)[0];
    const fieldIndex = this._ColNameList.findIndex(el => el.DisplayName === column.name);
    let cssClass = '';
    switch (field.FieldType) {
      case ('1'): // Text field
        if (field.IsMandatory == 1 && row[fieldIndex] === '') { // Required field check
          cssClass += ' error text-required';
        }
        else if (field.IsMandatory == 0 && row[fieldIndex] === '') { // Required field check
          break;
        }
        else if (!(/^[a-zA-Z\s]*$/.test(row[fieldIndex]))) { // Letter validation check
          cssClass += ' error letter-only';
        }
        break;
      case ('2'):
        if (field.IsMandatory == 1 && row[fieldIndex] === '') { // Required field check
          cssClass += ' error text-required';
        }
        else if (field.IsMandatory == 0 && row[fieldIndex] === '') { // Required field check
          break;
        }
        else if (isNaN(row[fieldIndex])) {
          cssClass = ' error numeric-only';
        }
        break;
        if (field.IsMandatory == 1 && isNaN(row[fieldIndex])) {
          cssClass = ' error numeric-only';
        }
        break;
      case ('3'):
        if (!this.checkDateFormat(row[fieldIndex])) {
          cssClass = ' error date-only';
        }
        break;
      case ('5'):
        if (fieldIndex == 0) {
          if (row[fieldIndex] === '') { // Required field check
            cssClass += ' error text-required';
          }
        }
        else if (field.IsMandatory == 0 && row[fieldIndex] === '') { // Required field check
          break;
        }
        else if (!(/^[\w\s]+$/.test(row[fieldIndex]))) { // Alpha-Numeric validation check
          if (fieldIndex != 8) {
          }
        }
        break;
    }
    return cssClass;
  }
  getTooltipDate(tooltipRef, rowIndex, colIndex) {
    if (!tooltipRef) {
      return;
    }
    let tooltipData = '';
    if (tooltipRef.parentElement.parentElement.classList.contains('text-required')) {
      tooltipData = 'This field is required';
    } else if (tooltipRef.parentElement.parentElement.classList.contains('letter-only')) {
      tooltipData = 'Only letters are allowed';
    } else if (tooltipRef.parentElement.parentElement.classList.contains('numeric-only')) {
      tooltipData = 'Only numeric fields are allowed';
    } else if (tooltipRef.parentElement.parentElement.classList.contains('date-only')) {
      tooltipData = 'Date required in dd-mm-yyyy format';
    } else if (tooltipRef.parentElement.parentElement.classList.contains('alpha-numeric-only')) {
      tooltipData = 'Only letters and digits are allowed';
    }
    if (tooltipData !== '') {
      this.isValidationError = true;
    }
    return tooltipData;
  }
  hasDataError() {
    if (this.isFileInvalid || document.querySelectorAll('.datatable-body-cell.error').length > 0) {
      return true;
    }
    return false;
  }
  DownloadPendingFiles() {
    const apiUrl = this._global.baseAPIUrl + 'File/DownloadIndexingData';
    this._onlineExamService.postData(this.DataUploadForm.value, apiUrl)
      .subscribe(data => {
        this._StatusList = data;
        this.downloadPendingFile();
      });
  }
  GetHeaderListPending() {
    this._HeaderListPending = "FileName";
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
      dwldLink.setAttribute("download", "Indexing_pending" + ".csv");
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail:'There should be some data before you download!'});
    }
  }

}
