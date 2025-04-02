import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from '@angular/router';
import swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { MessageService } from 'primeng/api'; 
// import { Listboxclass } from '../../../Helper/Listboxclass';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-data-entry",
  templateUrl: "data-entry.component.html",
  styleUrls: ["data-entry.component.css"]
})
export class DataEntryComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  isReadonly = true;
  _TemplateList: any;
  _DepartmentList: any;
  _BranchList: any;
  _HeaderList: any;
  _ColNameList: any;
  _IndexList: any;
  TempField: any;
  TemplateList: any;
  DataEntryForm: FormGroup;
  submitted = false;
  BranchList: any;
  Reset = false;
  sMsg: string = '';
  _TempID: any = 0;
  _FileNo: any = "";
  _MDList: any;
  first = 0;
  rows = 10;
  _PageNo: number = 1;
  FilePath: any = "../assets/1.pdf";

  // _Replacestr:any="D:/WW/14-Jully-2020/UI/src/assets";

  _TotalPages: any = 0;
  _FileList: any;
  _FilteredList: any;
  _IndexPendingList: any;
  bsValue = new Date();
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }
  ngOnInit() {
    document.body.classList.add('data-entry');
    this.DataEntryForm = this.formBuilder.group({
      FileNo: ['', Validators.required],
      TemplateID: [0, Validators.required],
      DeptID: [1],
      Cabinet:['',Validators.required],
      BranchID: [0, Validators.required],
      _ColNameList: this.formBuilder.group({}),
      Viewer: 1,
      currentPage: 0,
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      PageCount: 0,
      submit_data: [''],
      di: [''],
      FVals: [''],
      RejectReason: [''],
      FileList: [''],
      TemplateName: [''],
      BranchName: [''],
      SubfolderName:[''],
      Status: ['Maker Pending'],

    });

    this.Getpagerights();
    this.TempField = localStorage.getItem('Fname');
    this._PageNo = 1;
    //console.log("IndexListPending");
    this.GetIndexListPending();
    //console.log("IndexListPending11");
    this.geTempList();
    this.getBranchList();
    this.onChangeTemplate();
    // this.getDepartmnet();
    this.isReadonly = false;
  }


  get f() { return this.DataEntryForm.controls; }
  get t() { return this.f.tickets as FormArray; }

  onChangeTickets(e) {
    const numberOfTickets = e.target.value || 0;
    if (this.t.length < numberOfTickets) {
      for (let i = this.t.length; i < numberOfTickets; i++) {
        this.t.push(this.formBuilder.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]]
        }));
      }
    } else {
      for (let i = this.t.length; i >= numberOfTickets; i--) {
        this.t.removeAt(i);
      }
    }
  }

  Getpagerights() {

    var pagename = "Maker";
    const apiUrl = this._global.baseAPIUrl + 'Admin/Getpagerights?userid=' + localStorage.getItem('UserID') + ' &pagename=' + pagename + '&user_Token=' + localStorage.getItem('User_Token');

    // const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplate?user_Token=' + this.FileStorageForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data) => {
      //  this.TemplateList = data;    

      if (data <= 0) {
        localStorage.clear();
        this.router.navigate(["/Login"]);

      }

    });
  }


  GetIndexListPending() {
debugger
    const apiUrl = this._global.baseAPIUrl + 'DataEntry/GetPendingData?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._IndexPendingList = data;
      this._FilteredList = data;

      this.prepareTableData(this._FilteredList, this._IndexPendingList);
    });
  }

  getBranchList() {


    const apiUrl = this._global.baseAPIUrl + 'BranchMapping/GetBranchDetailsUserWise?ID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {

      this._BranchList = data;
      this.DataEntryForm.controls['BranchID'].setValue(0);

    });
  }

  geTempList() {


    const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._TemplateList = data;
      this.DataEntryForm.controls['TemplateID'].setValue(0);
    });

  }

  GetNextFile() {
    let __FileNo = this.DataEntryForm.controls['FileNo'].value;
    let __TempID = this.DataEntryForm.controls['TemplateID'].value;
    const apiUrl = this._global.baseAPIUrl + 'DataEntry/GetNextFile?id=' + __TempID + '&FileNo=' + __FileNo + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      if (data != "") {
        this.onEdit(data);
      }
      else {
        // this.toastr.show(
        //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> No record Found </span></div>',
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
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail:'No Record Found' });
      }
    });
  }

  GetFieldList() {
    debugger;
    let __TempID = this.DataEntryForm.controls['TemplateID'].value;
    let __FileNo = this.DataEntryForm.controls['FileNo'].value;
    const apiUrl = this._global.baseAPIUrl + 'DataEntry/GetFieldsName?id=' + __TempID + '&FileNo=' + __FileNo + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this._ColNameList = data;
      let dynamic_form = {}
      data.forEach(ele => {
        let validation_array = [Validators.minLength(dynamic_form[ele.MinLenght]), Validators.maxLength(ele.MaxLenght)]
        if (ele.IsMandatory == '1') validation_array.push(Validators.required)
        var select_val = []
        if (ele.FieldType == '4') {
          select_val = ele.MasterValues.split(',')
          dynamic_form[ele.IndexField] = new FormControl('0', validation_array)
        } else {
          dynamic_form[ele.IndexField] = new FormControl('', validation_array)
        }
        ele.selectValues = select_val
      });
      let group = this.formBuilder.group(dynamic_form)
      this.DataEntryForm.controls['_ColNameList'] = group
      this.onEdit(data);
    });

  }

  OnReset() {
    this.Reset = true;
    this.DataEntryForm.reset();
    this.isReadonly = false;
  }
  validateFields() {
    let isValidDateFormat = true;
    let textFieldRequiredValidation = true;
    let NumericFieldValidation = true;
    let textFieldLetterValidation = true;
    let alphaNumericValidation = true;
    this._ColNameList.forEach((el, index) => {
      if (el.FieldType === '3') { // Date Format check
        if (!this.checkDateFormat(this.DataEntryForm.get('_ColNameList').value[el.DisplayName])) {
          isValidDateFormat = false;
          this.toastr.show(
            '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message"><b>' + el.DisplayName + '</b> : Please select date in dd-mm-yyyy format</span></div>',
            "",
            {
              timeOut: 5000,
              closeButton: true,
              enableHtml: true,
              tapToDismiss: false,
              titleClass: "alert-title",
              positionClass: "toast-top-center",
              toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify"
            }
          );
        }
      }
      if (el.FieldType === '1' && el.IsMandatory === '1') { // Text field required validation check
        if (this.DataEntryForm.get('_ColNameList').value[el.DisplayName] === '') {
          textFieldRequiredValidation = false;
          this.toastr.show(
            '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message"><b>' + el.DisplayName + '</b> : This field is required</span></div>',
            "",
            {
              timeOut: 5000,
              closeButton: true,
              enableHtml: true,
              tapToDismiss: false,
              titleClass: "alert-title",
              positionClass: "toast-top-center",
              toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify"
            }
          );
        }
      }

      if (el.FieldType === '1') { // Text field letter validation check
        if (!(/^[a-zA-Z][a-zA-Z\s]*$/.test(this.DataEntryForm.get('_ColNameList').value[el.DisplayName]))) {
          textFieldLetterValidation = false;
          this.toastr.show(
            '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message"><b>' + el.DisplayName + '</b> : Only letters are allowed</span></div>',
            "",
            {
              timeOut: 5000,
              closeButton: true,
              enableHtml: true,
              tapToDismiss: false,
              titleClass: "alert-title",
              positionClass: "toast-top-center",
              toastClass:
                "ngx-toastr alert alert-dismissible alert-danger alert-notify"
            }
          );
        }
      }

      if (el.FieldType === '2') { // Numeric field validation check
        if (isNaN(this.DataEntryForm.get('_ColNameList').value[el.DisplayName])) {
          NumericFieldValidation = false;
          this.toastr.show(
            '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message"><b>' + el.DisplayName + '</b> : Please enter numbers only </span></div>',
            "",
            {
              timeOut: 5000,
              closeButton: true,
              enableHtml: true,
              tapToDismiss: false,
              titleClass: "alert-title",
              positionClass: "toast-top-center",
              toastClass:
                "ngx-toastr alert alert-dismissible alert-danger alert-notify"
            }
          );
        }
      }

      if (el.FieldType === '5') { // Alpha-numeric validation check
        const fieldVal = this.DataEntryForm.get('_ColNameList').value[el.DisplayName];
        if (index > 0 && fieldVal !== '' && !(/^[\w\-\s]+$/.test(fieldVal))) {
          alphaNumericValidation = false;
          this.toastr.show(
            '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message"><b>' + el.DisplayName + '</b> : Only letters and digits are allowed</span></div>',
            "",
            {
              timeOut: 5000,
              closeButton: true,
              enableHtml: true,
              tapToDismiss: false,
              titleClass: "alert-title",
              positionClass: "toast-top-center",
              toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify"
            }
          );
        }
      }

    });
    if (isValidDateFormat && textFieldRequiredValidation && NumericFieldValidation && textFieldLetterValidation && alphaNumericValidation) {
      return true;
    } else {
      return false;
    }
  }

  checkDateFormat(date) {
    if (date == 'Invalid Date') {
      return false;
    }
    return true;
  }

  onSubmit() {
    this.submitted = true;

    if (!this.validateFields()) {
      return;
    }
    var submit_data = this.DataEntryForm.value
    submit_data.FieldValues = []
    var obj = {}
    Object.keys(this.DataEntryForm.get('_ColNameList').value).forEach(key => {
      if (this.DataEntryForm.get('_ColNameList').value[key] instanceof Date) {
        const dateObj = this.DataEntryForm.get('_ColNameList').value[key];
        const dd = dateObj.getDate() > 9 ? '' + dateObj.getDate() : '0' + dateObj.getDate();
        const mm = dateObj.getMonth() + 1 > 9 ? '' + parseInt(dateObj.getMonth() + 1) : '0' + parseInt(dateObj.getMonth() + 1);
        const yyyy = dateObj.getFullYear();
        obj[key] = dd + '-' + mm + '-' + yyyy;
        this.DataEntryForm.get('_ColNameList').value[key] = dd + '-' + mm + '-' + yyyy;
      } else {
        obj[key] = this.DataEntryForm.get('_ColNameList').value[key]
      }
    })
    submit_data.FieldValues.push(obj)
    this.DataEntryForm.patchValue({
      currentPage: this._PageNo,

      PageCount: this._TotalPages,
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      di: submit_data,
      FVals: submit_data.FieldValues,
    });
    const that = this;
    const apiUrl = this._global.baseAPIUrl + 'DataEntry/Create';
    this._onlineExamService.postData(this.DataEntryForm.value, apiUrl)
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
        this.modalRef.hide();
        that.GetIndexListPending();
      });// }

  }

  hidepopup() {
    this.modalRef.hide();
  }

  onEdit(formData) {
    var _TempFilePath = formData[0].FilePath
    _TempFilePath = _TempFilePath.replace(new RegExp(/\\/g), "/");
    let dynamic_form = {}
    formData.forEach(ele => {
      dynamic_form[ele.IndexField] = ele.ColValues
    });
    this.DataEntryForm.patchValue({
      Viewer: formData.Path,
      _ColNameList: dynamic_form,
    })
  }

  onChangeTemplate() {
    this.GetFieldList();
  }

  onChekpageLoad() {
    this.onChangeTemplate();
  }

  AddIndexing(template: TemplateRef<any>, row: any) {
    debugger;
    var that = this;
    this.DataEntryForm.patchValue({
      FileNo: row.FileNo,
      TemplateID: row.TemplateID,
      BranchID: row.BranchID,
      SubfolderName:row.SubfolderName,
      Cabinet:row.Cabinet
    })
    this._TotalPages = row.PageCount;
    this._PageNo = 1;
    this.modalRef = this.modalService.show(template);
    this.onChekpageLoad();
    this.onChangeTemplate();
    this.GetFullFile(row.FileNo);
  }

  GetFullFile(FileNo: any) {
    debugger;
    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetFullFile?ID=' + localStorage.getItem('UserID') + '&&_fileName=' + FileNo + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getDataById(apiUrl).subscribe(res => {
      if (res) {
        console.log("FilePath", res);
        this.FilePath = res;
      }
    });
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    let val = $event.target.value;
    this._FilteredList = this._IndexPendingList.filter(function (d) {
      for (var key in d) {
        if (key == "BranchName" || key == "FileNo" || key == "TemplateName") {
          if (d[key].toLowerCase().indexOf(val) !== -1) {
            return true;
          }
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

  ngOnDestroy() {
    document.body.classList.remove('data-entry')
  }


  DownloadMetadata() {
    let _CSVData = "";
    const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + _CSVData + '&user_Token=' + localStorage.getItem('User_Token') + '&UserID=' + localStorage.getItem('UserID')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.GetHeaderNames();
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
      dwldLink.setAttribute("download", 'PendingData' + ".csv");
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
    });
  }
  GetHeaderNames() {
    this._HeaderList = "";
    for (let j = 0; j < this._ColNameList.length; j++) {
      this._HeaderList += this._ColNameList[j].DisplayName + ((j <= this._ColNameList.length - 2) ? ',' : '');
    }
    this._HeaderList += '\n';
    let that = this;
    this._MDList.forEach(stat => {
      for (let j = 0; j < this._ColNameList.length; j++) {
        this._HeaderList += (j == 0 ? (stat['Ref' + (j + 1)] + '') : stat['Ref' + (j + 1)]) + ((j <= this._ColNameList.length - 2) ? ',' : '');
      }
      this._HeaderList += '\n'
    });
  }
  OnReject() {
    var that = this;
    if (this.DataEntryForm.get('RejectReason').value == "") {
     // this.ErrorMessage("Enter rejecet reason");
      this.toastr.show(
           '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation !</span> <span data-notify="message"><h4 class="text-white"> ' + "Enter rejecet reason" + ' <h4></span></div>',
           "",
           {
             timeOut: 7000,
            closeButton: true,
             enableHtml: true,
            tapToDismiss: false,
            titleClass: "alert-title",
            positionClass: "toast-top-center",
            toastClass:
              "ngx-toastr alert alert-dismissible alert-danger alert-notify"
          }
         );
      return;
    }
    this.DataEntryForm.patchValue({
      Status: 'Reject'
    })
    const apiUrl = this._global.baseAPIUrl + 'DataEntry/RejectFile';
    this._onlineExamService.postData(this.DataEntryForm.value, apiUrl)
      .subscribe(data => {
        this.Message("File rejected succesfully.");
        this.modalRef.hide();
        that.GetIndexListPending();
      });
  }
  selectedEntries = [];
  allSelected = false;
  Message(msg: any) {
    // this.toastr.show(
    //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title"></span> <span data-notify="message"><h4 class="text-white"> ' + msg + ' <h4></span></div>',
    //   "",
    //   {
    //     timeOut: 7000,
    //     closeButton: true,
    //     enableHtml: true,
    //     tapToDismiss: false,
    //     titleClass: "alert-title",
    //     positionClass: "toast-top-center",
    //     toastClass:
    //       "ngx-toastr alert alert-dismissible alert-success alert-notify"
    //   }
    // );
    this.messageService.add({ severity: 'success', summary: 'Success', detail:msg });
  }
  hideTextSelectionTool(toolbar: string): string {
    // Hides the "Enable Text Selection" button by removing the button from the toolbar
    return toolbar.replace('textSelectToolGroupButton', '');
  }
  ErrorMessage(msg: any) {
    // this.toastr.show(
    //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation !</span> <span data-notify="message"><h4 class="text-white"> ' + msg + ' <h4></span></div>',
    //   "",
    //   {
    //     timeOut: 7000,
    //     closeButton: true,
    //     enableHtml: true,
    //     tapToDismiss: false,
    //     titleClass: "alert-title",
    //     positionClass: "toast-top-center",
    //     toastClass:
    //       "ngx-toastr alert alert-dismissible alert-danger alert-notify"
    //   }
    // );
    this.messageService.add({ severity: 'error', summary: 'Error', detail:msg });
  }

  AutoMaker() {
    if (this._FilteredList.length > 0 && this.selectedRows.length > 0) {
      let _CSVData = "";
      for (let j = 0; j < this.selectedRows.length; j++) {
        _CSVData += this.selectedRows[j] + ',';
      }
      this.DataEntryForm.patchValue({
        FileList: _CSVData
      })

      const apiUrl = this._global.baseAPIUrl + 'DataEntry/Automaker';
      this._onlineExamService.postData(this.DataEntryForm.value, apiUrl)
        .subscribe(data => {
          this.Message("Auto maker succesfully.");
          this.GetIndexListPending();
          this.selectedRows = [];
        });
    } else {
      this.ErrorMessage('Please Select at least on row!!');
      return;
    }

  }

  selectedRows = [];

  selectRow(e, row) {
    this.selectAllRows = false;
    e.originalEvent.stopPropagation();
    if (e.checked) {
      this.selectedRows.push(row.FileNo);

    } else {
      this.selectAllRows = false;
      var index = this.selectedRows.indexOf(row.FileNo);
      this.selectedRows.splice(index, 1);

    }
  }

  selectAllRows = false;
  selectAllRow(e) {

    this.selectedRows = [];

    if (e.checked) {
      this.selectAllRows = true;
      this.formattedData.forEach((el, index) => {

        if (index >= this.first && index < this.first + this.rows) {
          this.selectedRows.push(el.FileNo);
          el.selected = true;
        }
      })
    } else {
      this.selectAllRows = false;
      this.selectedRows = [];
      this.formattedData.filter(el => el.selected).forEach(element => {
        element.selected = false;
      });
    }
  }

  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'FileNo', header: 'FILE NO', index: 2 },
      {field:'Cabinet',header:'CABINET',index:4},
      { field: 'BranchName', header: 'FOLDER', index: 3 },
      {field:'SubfolderName',header:'SUB FOLDER',index:4},
      { field: 'TemplateName', header: 'TEMPLATE NAME', index: 5 },
      { field: 'Status', header: 'STATUS', index: 6 },
      // { field: 'IsIndexing', header: 'IS INDEXING', index: 7 },



    ];

    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'FileNo': el.FileNo,
        'BranchName': el.BranchName,
        'TemplateName': el.TemplateName,
        'Status': el.Status,
        'TemplateID': el.TemplateID,
         'BranchID': el.BranchID,
       'PageCount': el.PageCount,
        'IsIndexing': el.IsIndexing,
        'Cabinet':el.Cabinet,
        'SubfolderName':el.SubfolderName

      });

    });
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
