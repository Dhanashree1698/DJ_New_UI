import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef, AfterViewInit, ViewChild, ChangeDetectorRef, HostListener } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEventType, HttpClient } from '@angular/common/http';

import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { TreeNode } from 'primeng/api';
import { saveAs } from 'file-saver';


export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
  
}
@Component({
  selector: "app-file-storage",
  templateUrl: "file-storage.component.html",
  styleUrls: ["file-storage.component.css"]
})


export class FileStorageComponent implements OnInit, AfterViewInit {


  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;

  elements: any = [];

  searchText: string = '';
  previous: string;

  maxVisibleItems: number = 8;

  dtOptions: DataTables.Settings = {};

  isShowDivIf = false;

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;

  _isDownload: any = localStorage.getItem('Download');
  _isDelete: any = localStorage.getItem('Delete');
  _TemplateList: any;
  _HeaderList: any;
  _DeptList: any;
  _FileList: any;
  _Records: any;
  FileStorageForm: FormGroup;
  submitted = false;
  Reset = false;
  sMsg: string = '';
  _TempID: any = 0;
  _TagDetailsList: any;
  _FileNo: any = "";
  TempField:any =localStorage.getItem('FileNo');
  _FilteredList = []
  _LogList: any;
  _StatusRptList: any;
  _DepartmentList: any;
  _BranchList: any;
  _ColNameList: any;
  _IndexList: any;
  FolderStructureForm: FormGroup;
  _SearchByList: any;
  entriesLog: number = 10;
  entriesMD: number = 10;
  _DocTypeList: any;
  _LogFilteredList: any;
  _MDFilteredList: any;
  _MDList: any;
  TemplateList: any;
  activeRowlog: any;
  activeRowMD: any;
  selectedlog: any[] = [];
  selectedMD: any[] = [];
  _DepartmentID: any;
  _ColList: any;
  _DocName: any;
  myFiles: string[] = [];
  _DocID: any;
  Foder_Structure = [];
  demo = false;
  data: any = [];
  columns: any = [];
  headElements = [];
  _FilteredListInfo: any;
  _FileNoList: any;
  FilePath: any;
  // onActivateInfo:any;
  // entriesInfo:any;
  entriesInfo: number = 10;
  selectedInfo: any[] = [];
  activeRowInfo: any;
  treeFiles: TreeNode[];
  formattedData: any;
  
  tableHeader: any = [
    // { field: 'fileNo', header: this.TempField, index: 1 },
    // { field: 'empName', header: 'EMP NAME', index: 7 },
    // { field: 'dob', header: 'DOB', index: 8 },
    // { field: 'designation', header: 'Designation', index: 9 },
    // { field: 'isActive', header: 'Is Active', index: 10 },
    // { field: 'doj', header: 'DOJ', index: 11 },
    { field: 'userId', header: 'Uplaod By', index: 2 },
    { field: 'entryDate', header: 'Upload On', index: 3 },
    { field: 'fileSize', header: 'File Size', index: 4 },
    { field: 'pageCount', header: 'Page Count', index: 5 },
    { field: 'Version', header: 'Version', index: 6 },
    { field: 'Archive', header: 'Archive', index: 7 }
  ];

  selectedFiles: TreeNode[];
  selectedRows = [];
  selectAllRows: boolean = false;

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  
  constructor(
    private modalService: BsModalService,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private httpService: HttpClient,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef

  ) { }

  @HostListener('input') oninput() {
    //  this.searchItems();
  }


  ngOnInit() {

    //FileNo USERID EntryDate FileSize PageCount Version

  //  this.headElements = ['FileNo', 'USERID', 'EntryDate', 'FileSize', 'PageCount', 'Version', 'Action'];
  
  
    
    /* datatable
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      processing: true,
      scrollX: true
        };

  for ( let i = 1; i <= 15; i++) {
    this.data.push
    ({id: i.toString(),
      FileNo:'name'+i,
      USERID: i,
      EntryDate: 'EntryDate ' +i,
      FileSize: 'FileSize '+i,
      PageCount: 'FileSize '+i
   });
  }
 */
    this.FileStorageForm = this.formBuilder.group({
      FileNo: ['', Validators.required],
      searchText: [],
      TemplateID: [0, Validators.required],
      DeptID: [0, Validators.required],
      BranchID: [0, Validators.required],
      CreatedBy: localStorage.getItem('UserID'),
      User_Token: localStorage.getItem('User_Token'),
      _ColNameList: this._ColNameList,
      Viewer: [''],
      currentPage: 0,
      PageCount: 0,
    //  tickets: new FormArray([]),
      SerchBy: [''],
      DocID: [''],
      SearchByID: [],
      userID: localStorage.getItem('UserID'),
      ACC: [''],
      MFileNo: [''],
      DocuemntType: [''],
      ToEmailID:[''],
      ValidDate:[''] ,
      IsAttachment:['']

    });
    this.getSearchResult();
    this.getActivityList('');
   // this.getMetdataList('');
   // this.getTemplate();
    this.GetFileInfo('');

    this._isDownload =localStorage.getItem('Download');
    this._isDelete =localStorage.getItem('Delete');

    // alert(this._isDelete);
    // alert(this._isDownload);

  }


  searchItems() {

    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.elements =
        this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.elements =
        this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['FileNo',
          'USERID'
        ]);
      this.mdbTable.setDataSource(prev);
    }
  }


  ngAfterViewInit() {
    //  this.mdbTablePagination.setMaxVisibleItemsNumberTo(this.maxVisibleItems);

    // this.mdbTablePagination.calculateFirstItemIndex();
    // this.mdbTablePagination.calculateLastItemIndex();
    // this.cdRef.detectChanges(); 
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable($event) {
    // console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._IndexList.filter(function (d) {
      // console.log(d);
      for (var key in d) {
        if (key == "AccNo" || key == "BranchName" || key == "DepartmentName" || key == "DocType") {
          if (d[key].toLowerCase().indexOf(val) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }


  filterTableLog($event) {
    // console.log($event.target.value);

    let val = $event.target.value;
    this._LogFilteredList = this._LogList.filter(function (d) {
      // console.log(d);
      for (var key in d) {
        if (key == "UserName" || key == "Activity") {
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
  onActivateLog(event) {
    this.activeRowlog = event.row;
  }
  onSelectLog({ selected }) {
    this.selectedlog.splice(0, this.selected.length);
    this.selectedlog.push(...selected);
  }

  entriesChangeLog($event) {
    this.entriesLog = $event.target.value;
  }

  branchClicked(branch) {
    branch.isExpanded = !branch.isExpanded

  }

  accountClicked(branch, account) {
    account.isExpanded = !account.isExpanded
  }

  doctypeClicked(branch, account, doctype) {
    doctype.isExpanded = !doctype.isExpanded
  }

  getSearchResult() {
    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchDataByFolderStructure?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token')
    // const apiUrl="https://demo2993066.mockable.io/getAllData";
    this._onlineExamService.getAllData(apiUrl).subscribe((data: [any]) => {

      this._ColNameList = data;
      this._IndexList = data;
      this._FilteredList = data;

      // this.mdbTable.setDataSource(this._FilteredList);
      // this.elements = this.mdbTable.getDataSource();
      // this.previous = this.mdbTable.getDataSource(); 


      let branchs = [];
      let branchDocCount = 0
      let accountDocCount = 0
      var data1: any;

      data.forEach((row, indx) => {
        let inBranchArray = branchs.some(b => b.BranchName == row.BranchName)
        if (!inBranchArray) {
          let files = []
          let DocTypes = [{ DocType: row.DocType, documentCount: row.DocCount, Files: files, isExpanded: false }]
          let Accounts = [{ AccNo: row.AccNo, documentCount: 1, DocTypes: DocTypes, isExpanded: indx == 0 ? true : false }]
          branchs.push({ BranchName: row.BranchName, Accounts: Accounts, documentCount: 1, isExpanded: indx == 0 ? true : false })
        } else {
          let branch = branchs.find(b => b.BranchName == row.BranchName)
          let inAccountsArray = branch.Accounts.some(b => b.AccNo == row.AccNo)
          if (!inAccountsArray) {
            let files = []
            let DocTypes = [{ DocType: row.DocType, documentCount: row.DocCount, Files: files, isExpanded: false }]
            let Account = { AccNo: row.AccNo, documentCount: 1, DocTypes: DocTypes, isExpanded: false }
            branch.Accounts.push(Account)
            branch.documentCount += 1
          } else {
            let account = branch.Accounts.find(b => b.AccNo == row.AccNo)
            let inDocTypesArray = account.DocTypes.some(b => b.DocType == row.DocType)
            if (!inDocTypesArray) {
              let files = []
              let DocTypes = { DocType: row.DocType, documentCount: row.DocCount, Files: files, isExpanded: false }
              account.DocTypes.push(DocTypes)
              account.documentCount += 1
            } else {

            }
          }
        }
      });
      this.Foder_Structure = branchs;
      this.prepareTreeStructure(branchs)
    });
    //this.FileTaggingForm.controls['DocID'].setValue(0);
  }

  taggingTableHeader: any = [
    { field: 'SRNO', header: 'SRNO', index: 1 },
    { field: 'AccNo', header: this.TempField, index: 1 },
    { field: 'BranchName', header: 'BRANCH', index: 1 },
    { field: 'DepartmentName', header: 'DEPART', index: 1 },
    { field: 'DocType', header: 'DOC TYPE', index: 1 },
    { field: 'DocCount', header: 'PAGE COUNT', index: 1 }
  ]
  
  prepareTreeStructure(branchs: any) {
    let data = [];
    const parsedData = branchs;
    parsedData.forEach(el => {
      let elData = {
        "label": el.BranchName + '(' + el.documentCount + ')',
        "data": el.BranchName,
        "expandedIcon": "fa fa-folder-open",
        "collapsedIcon": "fa fa-folder",
        "children": []
      }

      el.Accounts.forEach(accEl => {
        let accElData = {
          "label": accEl.AccNo + '(' + accEl.documentCount + ')',
          "data": accEl.AccNo,
          "expandedIcon": "fa fa-folder-open",
          "collapsedIcon": "fa fa-folder",
          "children": []
        };
        accEl.DocTypes.forEach(docEl => {
          accElData['children'].push({
            "label": docEl.DocType + '(' + docEl.documentCount + ')',
            "data": docEl.DocType,
            "icon": "pi pi-file"
          })
        })
        elData.children.push(accElData);
      })
      data.push(elData);
    })
    //  console.log("Tree data",data);
    this.treeFiles = data;
  }

  nodeSelect(e) {
    //alert("You have selected " + e.node.data);
    this.GetFileInfo(e.node.data);

  }

  nodeUnselect(e) {
    alert("Node" + e.node.data + "Unselected");
  }

  getSearchResultByFileNo(_FileNo: any) {
    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchDataFSByFileNo?FileNo=' + _FileNo + '&UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token')

    // const apiUrl="https://demo2993066.mockable.io/getAllData";

      this._onlineExamService.getAllData(apiUrl).subscribe((data: [any]) => {
      this._IndexList = data;
      this._FilteredList = data;
    });
    //this.FileTaggingForm.controls['DocID'].setValue(0);
  }

  // GetDisplayField(TID:number) {  

  //   const apiUrl=this._global.baseAPIUrl+'DataUpload/GetFieldsName?ID='+ TID +'&user_Token=123123'
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
  //   this._ColNameList = data;
  // });
  // }

  getMetdataList(Fileno: any) {

    const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + Fileno + '&user_Token=' + this.FileStorageForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      // this._ColNameList = data;
    });
  }

  fileStorageTableData: any;
  GetFileInfo(Fileno: any) {

    const apiUrl = this._global.baseAPIUrl + 'Status/GetFileStorageData?UserID=' + localStorage.getItem('UserID') + '&FileNo=' + Fileno + '&user_Token=' + localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      // this._ColNameList = data;
      this.fileStorageTableData = JSON.parse(JSON.stringify(data));
      this.GetMetadataField(1);
      // this.prepareTableData(data);
      this._FileNoList = data;
      this._FilteredListInfo = data;
      this._FilteredListInfo.push(data);
      //this._FilteredListInfo.push(data);
     // console.log("FileInfo", data);
    });
  }

  metadataList: any;
  GetMetadataField(TID:number) {
    const apiUrl=this._global.baseAPIUrl+'DataUpload/GetFieldsName?ID='+ TID +'&user_Token='+ localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this.metadataList = data;
      this.prepareTableData(this.fileStorageTableData);
    });
  }

  prepareTableData(data) {
    var formattedData = [];
    let metadataTableHeader = [];
    this.metadataList.forEach((el, index) => {
      metadataTableHeader.push({
        field: 'metadata-' + parseInt(index+1), header: el.DisplayName, index: parseInt(7+index)
      })
    })

    
    data.forEach((el, index) => {
      if (el.FileNo) {
        formattedData.push({
          "fileNo": el.FileNo,
          "userId": el.USERID,
          "entryDate": el.EntryDate,
          "fileSize": (el.FileSize) + ' MB',
          "pageCount": el.PageCount,
          "Version": el.Version,
          // "empName": el.Ref2,
          // "dob": el.Ref3,
          // "designation": el.Ref4,
          // "isActive": el.Ref5,
          // "doj": el.Ref6,
          "Archive": el.Archive
        });
      }
      this.metadataList.forEach((el1, i) => {
        formattedData[index]['metadata-' + parseInt(i + 1)] = el['Ref'+ parseInt(i+1)]
      });

    });
    this.tableHeader = [
      // { field: 'fileNo', header: this.TempField, index: 1 },
      // { field: 'empName', header: 'EMP NAME', index: 7 },
      // { field: 'dob', header: 'DOB', index: 8 },
      // { field: 'designation', header: 'Designation', index: 9 },
      // { field: 'isActive', header: 'Is Active', index: 10 },
      // { field: 'doj', header: 'DOJ', index: 11 },
      { field: 'userId', header: 'Uplaod By', index: 2 },
      { field: 'entryDate', header: 'Upload On', index: 3 },
      { field: 'fileSize', header: 'File Size', index: 4 },
      { field: 'pageCount', header: 'Page Count', index: 5 },
      { field: 'Version', header: 'Version', index: 6 },
      { field: 'Archive', header: 'Archive', index: 7 }
    ];
    // let arr1 = this.tableHeader.slice(Math.max(this.tableHeader.length - 5, 0));
    // let arr2 = this.tableHeader.slice(0, 6);
    Array.prototype.push.apply(metadataTableHeader, this.tableHeader);
    this.tableHeader = metadataTableHeader;
    this.formattedData = formattedData;
    //console.log(JSON.stringify(this.formattedData));
  }

  selectRow(e, row) {
    this.selectAllRows = false;
    if (e.checked) {
      this.selectedRows.push(row.fileNo);
    } else {
      var index = this.selectedRows.indexOf(row.fileNo);
      this.selectedRows.splice(index, 1);
    }
  //  console.log("Row Value",this.selectedRows.indexOf(row.fileNo));
   // console.log("this.selectedRows",this.selectedRows);
  }

  selectAllRow(e) {
    if (e.checked) {
      this.selectAllRows = true;
    } else {
      this.selectAllRows = false;
    }

   // alert('Hi');
  //  console.log("E", e);

  }

  onRowSelect(row, e) {
    if(e.target.classList.contains('mat-icon')) {
      return;
    }
    // console.log("RowData", row);
    //var _fileNo=  row.fileNo;
    this.getSearchResultByFileNo(row.fileNo);
    this.getActivityList(row.fileNo);
   
    // this.GetTemplateIDByFileNo(row.fileNo);
   
    //this.FileStorageForm.controls['TemplateID'].setValue(0);

   // this.GetDisplayField(this.FileStorageForm.get('TemplateID').value);
   // this.getMetdataListByID(row.fileNo);
    
   //this.GetTemplateIDByFileNo(row.fileNo);

  }


  DownloadBulkFiles()
  {
    console.log("DownloadBulkFiles", this.selectedRows);

    let _CSVData= "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
      // headerArray.push(headers[j]);  
     // console.log("CSV Data", _CSVData);
    }
   // console.log("CSV Data", _CSVData);
    this.downloadBulkFileBYCSV(_CSVData) ;
  }

  downloadBulkFileBYCSV(_CSVData:any) {
       
    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SearchBulkFile?ID=' + localStorage.getItem('UserID') + '&_fileName= '+  _CSVData +' &user_Token='+ localStorage.getItem('User_Token');
    this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
      if (res) {

      
      saveAs(res, "Files" + '.zip');  
       
      }
       console.log("Final FP-- res ", res);  
    });

  }

  ShareLink(template: TemplateRef<any>, row: any)
  {
    var that = this;
  console.log("Email", this.selectedRows);
    let _CSVData= "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
      // headerArray.push(headers[j]);  
     // console.log("CSV Data", _CSVData);
    }
    this.FileStorageForm.controls['ACC'].setValue(_CSVData);
    this.FileStorageForm.controls['FileNo'].setValue(_CSVData);
  
    // if (_CSVData != null) {
     
    // }

    this.modalRef = this.modalService.show(template);

  }

  SendBulkEmail(template: TemplateRef<any>, row: any)
  {
    var that = this;
  console.log("Email", this.selectedRows);
    let _CSVData= "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
      // headerArray.push(headers[j]);  
     // console.log("CSV Data", _CSVData);
    }
    this.FileStorageForm.controls['ACC'].setValue(_CSVData);
    this.FileStorageForm.controls['FileNo'].setValue(_CSVData);
  
    // if (_CSVData != null) {
     
    // }

    this.modalRef = this.modalService.show(template);

  }

  FilteredListInfo($event) {
    // console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredListInfo = this._FileNoList.filter(function (d) {
      // console.log(d);
      for (var key in d) {
        if (key == "FileNo" || key == "USERID" || key == "Archive" || key == "FileSize") {
          if (d[key].toLowerCase().indexOf(val) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }

  onActivateInfo(event) {
    this.activeRowInfo = event.row;
  }

  onSelectInfo({ selected }) {
    this.selectedInfo.splice(0, this.selected.length);
    this.selectedInfo.push(...selected);
  }

  ViewDocument(template: TemplateRef<any>, row: any) {
    console.log("row",row);
    console.log("this._FileNoList",this._FileNoList);
    console.log("this. this._IndexList", this._IndexList);

    console.log("row.ref1", row.fileNo);
    var skinName = this._FileNoList.find(x=>x.pro == row.fileNo);   
    console.log("skinName", skinName);
   ///this.FilePath = row.RelPath;
    this.modalRef = this.modalService.show(template);


    $(".modal-dialog").css('max-width', '1000px');
  }

  entriesChangeInfo($event) {
    this.entriesInfo = $event.target.value;
  }
  // onActivateInfo(event) {
  //   this.activeRowlog = event.row;
  // }
  // onActivateInfo:any;
  // entriesInfo:any;

  // getStatusList() {

  //   const apiUrl = this._global.baseAPIUrl + 'Status/GetStatusReport';
  //   this._onlineExamService.postData(this.FolderStructureForm.value, apiUrl)
  //     // .pipe(first())

  //     .subscribe(data => {
  //       // alert(data);
  //       this._StatusRptList = data;

  //     });

  // }

  getActivityList(Fileno: any) {

    const apiUrl = this._global.baseAPIUrl + 'Status/GetActivityReportByFileNo?FileNo=' + Fileno + '&user_Token=' + localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._LogList = data;
      this._LogFilteredList = data;
    });
  }

  // logTableHeader: any = [
  //   { field: 'SRNO', header: 'SRNO', index: 1 },
  //   { field: 'UserName', header: 'USERNAME', index: 3 },
  //   { field: 'Activity', header: 'ACTIVITY', index: 4 },
  //   { field: 'LogDate', header: 'LOGDATE', index: 5 }
  // ]

  DownloadFileFromDB(Row: any) {
    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadFileFromDB?ID=' + localStorage.getItem('UserID') + '&FileNo= ' + Row.fileNo + ' &user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
      if (res) {

        //      var __FilePath = _TempFilePath ;    
        // console.log("Final FP-- res ", res);
        saveAs(res, Row.fileNo + '.pdf');

      }
    });




  }

  // downloadFile(_fileName: any) {

  //   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadTagFile?ID=' + this.userID + '&_fileName= '+ _fileName +' &user_Token='+this.FileStorageForm.get('User_Token').value;
  //   this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
  //     if (res) {     

  //     //console.log("Final FP-- res ", res);   
  // saveAs(res, _fileName + '.pdf'); 


  //     }
  //   });

  // }

  // Setfavourite(FileName: any) {

  //   this.FileStorageForm.patchValue({
  //     ACC: FileName     
  //   });

  //   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/Setfavourite';
  //   this._onlineExamService.postData(this.FileStorageForm.value, apiUrl)
  //     .subscribe(data => {
  //       swal.fire({
  //         title: "Favourite!",
  //         text: "Doc Type has been favourite",
  //         type: "success",
  //         buttonsStyling: false,
  //         confirmButtonClass: "btn btn-primary",
  //       });

  //     });

  // }

  DeleteFullFile(Row: any) {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-danger",
        confirmButtonText: "Yes, delete it!",
        cancelButtonClass: "btn btn-secondary",
      })
      .then((result) => {
        if (result.value) {
          this.FileStorageForm.patchValue({
            ACC: Row.fileNo

          });
          const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DeleteFullFile';
          this._onlineExamService.postData(this.FileStorageForm.value, apiUrl)
            .subscribe(data => {
              swal.fire({
                title: "Deleted!",
                text: "File has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });

            });
        }
      });

    this.getSearchResult();
    this.GetFileInfo('');
  }


  DeleteFile(Row: any) {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-danger",
        confirmButtonText: "Yes, delete it!",
        cancelButtonClass: "btn btn-secondary",
      })
      .then((result) => {
        if (result.value) {
          this.FileStorageForm.patchValue({
            ACC: Row.AccNo,
            DocID: Row.DocID
          });
          const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/Delete';
          this._onlineExamService.postData(this.FileStorageForm.value, apiUrl)
            .subscribe(data => {
              swal.fire({
                title: "Deleted!",
                text: "Doc Type has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.getSearchResultByFileNo(Row.AccNo);
            });
        }
      });
  }

  // Model Popup For Docuemnt Inserstion 

  showModal(Row: any): void {

    if (Row != null) {

      // console.log("ShowModel-FileNo", Row.AccNo);

      this._FileNo = Row.AccNo;
      this._DocID = Row.DocID;
      this._DocName = Row.ACC
      this.FileStorageForm.controls['MFileNo'].setValue(this._FileNo);
      this.FileStorageForm.controls['DocuemntType'].setValue(this._DocName);
    }
    // 
    // $("#myModal").modal('show');
  }

  UploadDocModal(template: TemplateRef<any>, row: any) {
    var that = this;
    //  that._SingleDepartment = row;

    this._FileNo = row.AccNo;
    this._DocID = row.DocID;
    this._DocName = row.ACC


    if (row != null) {

      this.FileStorageForm.controls['MFileNo'].setValue(this._FileNo);
      this.FileStorageForm.controls['DocuemntType'].setValue(this._DocName);
    }

    //console.log('form', this.UploadDocForm);
    //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    this.modalRef = this.modalService.show(template);

    this.getSearchResultByFileNo(row.AccNo);
  }

  // downloadFile(_fileName: any) {

  //   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadTagFile?ID=' + localStorage.getItem('UserID') + '&_fileName= ' + _fileName + ' &user_Token=' + localStorage.getItem('User_Token');
  //   this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
  //     if (res) {

  //       //      var __FilePath = _TempFilePath ;    
  //       // console.log("Final FP-- res ", res);
  //       saveAs(res, _fileName + '.pdf');
  //       // saveAs(__FilePath, _fileName + '.pdf');  

  //       // console.log("L----");

  //     }
  //   });

  // }

  downloadFile(row: any) {

    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadTagFile?ID='+localStorage.getItem('UserID')+'&DocID='+row.DocID+'&_fileName='+row.AccNo+'&user_Token='+localStorage.getItem('User_Token');
    this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
      if (res) {
      
          saveAs(res, row.ACC + '.pdf');

      }
    });

  }


  sendModal(): void {
    //do something here
    this.hideModal();
  }
  hideModal(): void {
    document.getElementById('close-modal').click();
    this.getSearchResult();
  }

  getFileDetails(e) {
    //console.log (e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
    //this._IndexList = e.target.files;
  }

  uploadFiles() {

    const frmData = new FormData();

    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }

    // this._FileNo =Row.id;   
    // this._DocID =Row.DocID;    
    // this._DocName = Row.ACC

    frmData.append('DocID', this._DocID);
    frmData.append('AccNo', this._FileNo);
    frmData.append('ACC', this._DocName);
    frmData.append('UserID', localStorage.getItem('UserID'));

    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/Upload';
    this.httpService.post(apiUrl, frmData).subscribe(
      data => {
        // SHOW A MESSAGE RECEIVED FROM THE WEB API.
        //  alert(data);

        this.showmessage(data);
        //  console.log(this.sMsg);
        // this.OnReset();         
      },

    );
    this.OnReset();
  }


  OnReset() {
    this.Reset = true;
    this.FileStorageForm.reset();
    this.FileStorageForm.reset({ User_Token: localStorage.getItem('User_Token') });

  }

  EditRowData(Row: any) {
        
    localStorage.setItem('FileNo', Row.fileNo);
    localStorage.setItem('TemplateID', "1");
    
    //this.localStorage.setItem('_TempID') =_TempID;
    this.router.navigate([]).then(result => {  window.open('/process/EditIndexing', '_blank'); });;
  }

  MetaData(template: TemplateRef<any>, row: any)
  {

  event.stopPropagation();

  let  __FileNo =row.fileNo;
  let  __TempID = 1;

  const apiUrl=this._global.baseAPIUrl+'DataEntry/GetNextFile?id='+__TempID+'&FileNo='+__FileNo+'&user_Token='+ localStorage.getItem('User_Token');

  //const apiUrl=this._global.baseAPIUrl+'DataEntry/GetNextFile?id'+  + '' FileNo='+ __FileNo + '&user_Token=123123'
  this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
     this._IndexList = data;           
     //console.log("Index",data);
  });
  this.modalRef = this.modalService.show(template);
  }
hidepopup()
{
// this.modalService.hide;
this.modalRef.hide();
//this.Reset();
//this.OnReset();
//this.modalRef.hide
}

  // GetTemplateIDByFileNo(Fileno: any) {
  //   const apiUrl = this._global.baseAPIUrl + 'Status/GetTemplateIDByFileNo?FileNo=' + Fileno + '&user_Token=' + localStorage.getItem('User_Token');
  //   //const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplateIDByFileNo?user_Token=' + this.FileStorageForm.get('User_Token').value
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
  //     var _data = data;
  //     this.FileStorageForm.controls['TemplateID'].setValue(_data[0].TemplateID);
  //     this.FileStorageForm.controls['DocID'].setValue(_data[0].DeptID);

  //   });
  // }

  toggleDisplayDivIf() {
    this.isShowDivIf = !this.isShowDivIf;
  }
  
  // MetaData Tab3 Control

  getTemplate() {

    const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');

    // const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplate?user_Token=' + this.FileStorageForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.TemplateList = data;
      this.FileStorageForm.controls['TemplateID'].setValue(0);
      //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  // geTemplateNameListByTempID(TID: number) {
  //   this.GetDisplayField(TID);
  //   this.getMetdataListByID('');
  // }

  GetDisplayField(TID: number) {

    const apiUrl = this._global.baseAPIUrl + 'DataUpload/GetFieldsName?ID=' + TID + '&user_Token=' + localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._ColList = data;

      // this.DataUploadForm.controls['TemplateID'].setValue(0);
      //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  getMetdataListByID(Fileno: any) {

    const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + Fileno + '&user_Token=' + localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._MDList = data;
      this._MDFilteredList = data;


    });

  }

  // metadataTableHeader: any = [
  //   { field: 'SRNO', header: 'SRNO', index: 1 },
  //   { field: 'FileNo', header: 'EMP CODE', index: 2 },
  //   { field: 'UserName', header: 'EMP NAME', index: 3 },
  //   { field: 'Ref3', header: 'DOB', index: 4 },
  //   { field: 'Ref4', header: 'DESIGNATION', index: 5 },
  //   { field: 'Ref5', header: 'IS ACTIVE', index: 6 },
  //   { field: 'Ref6', header: 'DOJ', index: 7 }
  // ]  

  onActivateMD(event) {
    this.activeRowMD = event.row;
  }
  onSelectMD({ selected }) {
    this.selectedMD.splice(0, this.selected.length);
    this.selectedMD.push(...selected);
  }

  entriesChangeMD($event) {
    this.entriesMD = $event.target.value;
  }

  filterTableMD($event) {
    // console.log($event.target.value);
    // console.log('ColNameList', this._ColNameList);

    let val = $event.target.value;
    this._MDFilteredList = this._MDList.filter(function (d) {
      for (var key in d) {
        if (
          key == 'FileNo' ||
          key == 'Ref2' ||
          key == 'Ref3' ||
          key == 'Ref4' ||
          key == 'Ref5' ||
          key == 'Ref6' ||
          key == 'Ref7' ||
          key == 'Ref8' ||
          key == 'Ref9' ||
          key == 'Ref10' ||
          key == 'Ref11' ||
          key == 'Ref12' ||
          key == 'Ref13' ||
          key == 'Ref14' ||
          key == 'Ref15' ||
          key == 'Ref16' ||
          key == 'Ref17' ||
          key == 'Ref18' ||
          key == 'Ref19' ||
          key == 'Ref20') {
          if (d[key] && d[key].toLowerCase().indexOf(val) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }

  /*
    // MD Datatable
    addNewRow() {
      this.mdbTableng.addRow({
        id: this.elements.length.toString(),
        first: 'Wpis ' + this.elements.length,
        last: 'Last ' + this.elements.length,
        handle: 'Handle ' + this.elements.length
      });
      this.emitDataSourceChange();
    }
  
    addNewRowAfter() {
      this.mdbTable.addRowAfter(1, {id: '2', first: 'Nowy', last: 'Row', handle: 'Kopytkowy'});
      this.mdbTable.getDataSource().forEach((el: any, index: any) => {
        el.id = (index + 1).toString();
      });
      this.emitDataSourceChange();
    }
  
    removeLastRow() {
      this.mdbTable.removeLastRow();
      this.emitDataSourceChange();
      this.mdbTable.rowRemoved().subscribe((data: any) => {
        console.log(data);
      });
    }
  
    removeRow() {
      this.mdbTable.removeRow(1);
      this.mdbTable.getDataSource().forEach((el: any, index: any) => {
        el.id = (index + 1).toString();
      });
      this.emitDataSourceChange();
      this.mdbTable.rowRemoved().subscribe((data: any) => {
        console.log(data);
      });
    }
  
    emitDataSourceChange() {
      this.mdbTable.dataSourceChange().subscribe((data: any) => {
        console.log(data);
      });
    }
  
    searchItems() {
      const prev = this.mdbTable.getDataSource();
      console.log(this.searchText);
      if (!this.searchText) {
        this.mdbTable.setDataSource(this.previous);
        this.elements = this.mdbTable.getDataSource();
      }
  
      if (this.searchText) {
        this.elements = this.mdbTable.searchLocalDataBy(this.searchText);
        this.mdbTable.setDataSource(prev);
      }
  
      this.mdbTablePagination.calculateFirstItemIndex();
      this.mdbTablePagination.calculateLastItemIndex();
  
      this.mdbTable.searchDataObservable(this.searchText).subscribe(() => {
        this.mdbTablePagination.calculateFirstItemIndex();
        this.mdbTablePagination.calculateLastItemIndex();
      });
    } */

  onHeaderCheckboxToggle(event) {
     console.log("event",event);
  }
   
  SendEmail(template: TemplateRef<any>, row: any) {
    var that = this;
  
    if (row != null) {

      this.FileStorageForm.controls['ACC'].setValue(row.fileNo);
      this.FileStorageForm.controls['FileNo'].setValue(row.fileNo);
    }

    this.modalRef = this.modalService.show(template);
  }

  onSendEmail() {

    const apiUrl = this._global.baseAPIUrl + 'Mail/SendEmail';
   
    this._onlineExamService.postData(this.FileStorageForm.value, apiUrl)
      .subscribe(data => {
        swal.fire({
          title: "Email!",
          text: "Email send successfully",
          type: "success",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-primary",
        });

      }); 
      this.modalRef.hide();
      this.getSearchResult();   
  }

  onSendEmailByShare() {

    const apiUrl = this._global.baseAPIUrl + 'Mail/SendEmailBulkFiles';
   
    this._onlineExamService.postData(this.FileStorageForm.value, apiUrl)
      .subscribe(data => {
        swal.fire({
          title: "Email!",
          text: "Email send successfully",
          type: "success",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-primary",
        });

      }); 
      this.modalRef.hide();    
      this.getSearchResult();
      //this.OnReset();
  }

  ArchiveFile(row: any) {

    this.FileStorageForm.patchValue({
      ACC: row.fileNo
    });

    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SetArchive';
    this._onlineExamService.postData(this.FileStorageForm.value, apiUrl)
      .subscribe(data => {
        swal.fire({
          title: "Archive!",
          text: "Doc Type has been Archive",
          type: "success",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-primary",
        });

      });
    this.getSearchResult();
    this.GetFileInfo('');
  }

  Setfavourite(FileName: any) {

    this.FileStorageForm.patchValue({
      ACC: FileName
    });

    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/Setfavourite';
    this._onlineExamService.postData(this.FileStorageForm.value, apiUrl)
      .subscribe(data => {
        swal.fire({
          title: "Favourite!",
          text: "Doc Type has been Favourite",
          type: "success",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-primary",
        });

      });

  }


  showmessage(data: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title"></span> <span data-notify="message"> ' + data + ' </span></div>',
      "",
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass:
          "ngx-toastr alert alert-dismissible alert-success alert-notify"
      }
    );


  }

  get f(){
    return this.FileStorageForm.controls;
  }

}
