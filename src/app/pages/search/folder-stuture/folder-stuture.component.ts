import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef, AfterViewInit, ViewChild, ChangeDetectorRef, HostListener } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEventType, HttpClient, HttpHeaders } from '@angular/common/http';

import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { TreeNode } from 'primeng/api';
import { saveAs } from 'file-saver';
import { number } from "@amcharts/amcharts4/core";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { of, throwError } from "rxjs";
import { TagInputComponent as SourceTagInput } from 'ngx-chips';
import { MessageService } from 'primeng/api'; 
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
  
}

@Component({
  selector: 'app-folder-stuture',
  templateUrl: './folder-stuture.component.html',
  styleUrls: ['./folder-stuture.component.scss']
})
export class FolderStutureComponent implements OnInit {

  
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;

  elements: any = [];

  searchText: string = '';
  previous: string;

  maxVisibleItems: number = 8;

  dtOptions: DataTables.Settings = {};

  isShowDivIf = false;

  entries: number = 20;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;

  _isDownload: any = false;
  _isDelete: any = false;
  _isEmail: any = false;
  _ShareLink: any = false;
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
  TempField:any =localStorage.getItem('Fname');
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
  entriesversion: number = 10;
  activeRowVersion:any;
  _DocTypeList: any;
  _LogFilteredList: any;
  _MDFilteredList: any;
  _MDList: any;
  TemplateList: any;
  activeRowlog: any;
  activeRowMD: any;
  selectedlog: any[] = [];
  selectedMD: any[] = [];
  selectedVersion: any[] = [];
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
  _TempFilePath:any;
  // onActivateInfo:any;
  // entriesInfo:any;
  entriesInfo: number = 10;
  selectedInfo: any[] = [];
  activeRowInfo: any;
  treeFiles: TreeNode[];
  formattedData: any;
  _VersionFilteredList:any;
  _VList:any;
  _isEdit:any;
  fileExt;
  _TempD:any;
  first = 0;
  rows = 10;
  visible:boolean = false;
  documentView:boolean = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: '150px',
      minHeight: '150px',
      maxHeight: '150px',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    // uploadUrl: 'v1/image',
    // upload: (file: File) => {
    //   return;
    // },
    // uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  }
  
  tableHeader: any = [
    // { field: 'fileNo', header: this.TempField, index: 1 },
    // { field: 'empName', header: 'EMP NAME', index: 7 },
    // { field: 'dob', header: 'DOB', index: 8 },
    // { field: 'designation', header: 'Designation', index: 9 },
    // { field: 'isActive', header: 'Is Active', index: 10 },
    // { field: 'doj', header: 'DOJ', index: 11 },
    { field: 'userId', header: 'Uplaod By', index: 2 },
    { field: 'EntryDate', header: 'Upload On', index: 3 },
    // { field: 'fileSize', header: 'File Size', index: 4 },
    { field: 'PageCount', header: 'Pages', index: 4 }
   
   /// { field: 'Archive', header: 'Archive', index: 6 }
  ];

  selectedFiles: TreeNode[];
  selectedRows = [];
  selectAllRows: boolean = false;

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  selectAllTaggingRows: boolean = false;
  emailReciepients = [];
  emailReciepientsShare = [];
  
  
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
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService
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
      TemplateID:[0, Validators.required],
      DeptID: [0, Validators.required],
      BranchID: [0],
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
      htmlContent: [''],
      ValidDate:[''],
      IsAttachment:[''],
      Subject:[''],
      predefined:[''],
      
      

    });

    this.getTemplate();
 //   this.getSearchResult();
    //this.getActivityList('');
   // this.getMetdataList('');
    
   // this.GetFileInfo('');

    this._isDownload =localStorage.getItem('Download');
    this._isDelete =localStorage.getItem('Delete');
    this._isEmail= localStorage.getItem('Email');
    this._ShareLink= localStorage.getItem('Link');
    this._isEdit= localStorage.getItem('Edit');

    // alert(this._isDelete);
    //  alert(this._isDownload);
this.Getpagerights();
  }


  Getpagerights() {

    var pagename ="File Storage";
    const apiUrl = this._global.baseAPIUrl + 'Admin/Getpagerights?userid=' + localStorage.getItem('UserID')+' &pagename=' + pagename + '&user_Token=' + localStorage.getItem('User_Token');

    // const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplate?user_Token=' + this.FileStorageForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data) => {
    //  this.TemplateList = data;    
     
    if (data <=0)
    {
      localStorage.clear();
      this.router.navigate(["/Login"]);

    } 
    
    });
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


//   getTemplate() {  

//     const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token='+localStorage.getItem('User_Token')   
//     //const apiUrl=this._global.baseAPIUrl+'Template/GetTemplate?user_Token='+ this.MetaDataForm.get('User_Token').value
//     this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
//     this.TemplateList = data;  
//   //  console.log("TemplateList",this.TemplateList);
//   //  this.FileTaggingForm.get('User_Token').value  
//     this.FileStorageForm.controls['TemplateID'].setValue(0);
//  //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
// //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
// });
// }


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

    if(val == '') {
      this._FilteredList = this._IndexList;
    } else {
        let filteredArr = [];
        this._IndexList.filter(d => {
        for (var key in d) {
          if (key == "AccNo" || key == "BranchName" || key == "DepartmentName" || key == "DocType") {
            const strArr = val.split(',');
            strArr.forEach(el => {
              if (d[key] && el!== '' && d[key].toLowerCase().indexOf(el.toLowerCase()) !== -1) {
                if (filteredArr.filter(el => el.SRNO === d.SRNO).length === 0) {
                  filteredArr.push(d);
                }
              }
            });
          }
        }
      });
      this._FilteredList = filteredArr;
    }
  }

  immutableFormattedData: any;
  loading: boolean = true;
  filterFolderTable($event) {
    // console.log($event.target.value);

    let val = $event.target.value;
    if(val == '') {
      this.formattedData = this.immutableFormattedData;
    } else {
        let filteredArr = [];
      //   this.immutableFormattedData.filter(d => {
      //   for (var key in d) {
      //     const strArr = val.split(',');
      //     strArr.forEach(el => {
      //       if (d[key] && el!== '' && d[key].toLowerCase().indexOf(el.toLowerCase()) !== -1) {
      //         if (filteredArr.filter(el => el.fileNo === d.fileNo).length === 0) {
      //           filteredArr.push(d);
      //         }
      //       }
      //     });
      //   }
      // });

      this.formattedData = this.immutableFormattedData.filter(function (d) {
        for (var key in d) {
          const strArr = val.split(',');
          strArr.forEach(el => {
            if (d[key] && el!== '' && (d[key]+ '').toLowerCase().indexOf(el.toLowerCase()) !== -1) {
              if (filteredArr.filter(el => el.srNo === d.srNo).length === 0) {
                filteredArr.push(d);
              }
            }
          });
        }
      });

      this.formattedData = filteredArr;
      this.loading = false;
    }
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
    this.selected.push(selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }
  onActivateLog(event) {
    this.activeRowlog = event.row;
  }
  onSelectLog({ selected }) {
    this.selectedlog.splice(0, this.selected.length);
    this.selectedlog.push(selected);
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
    const apiUrl = this._global.baseAPIUrl + 'Status/GetTreeStructure?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token') + '&TemplateID=' + this.FileStorageForm.get('TemplateID').value
    // const apiUrl="https://demo2993066.mockable.io/getAllData";
    this._onlineExamService.getAllData(apiUrl).subscribe((data: [any]) => {
      data.forEach((el, index) => {
        el.SRNO = index + 1;
      })

      
      // this._ColNameList = data;
      // this._IndexList = data;
      // this._FilteredList = data;
 

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
        } 
        else {
          let branch = branchs.find(b => b.BranchName == row.BranchName)
          let inAccountsArray = branch.Accounts.some(b => b.AccNo == row.AccNo)
          if (!inAccountsArray) {
            let files = []
            let DocTypes = [{ DocType: row.DocType, documentCount: row.DocCount, Files: files, isExpanded: false }]
            let Account = { AccNo: row.AccNo, documentCount: 1, DocTypes: DocTypes, isExpanded: false }
            branch.Accounts.push(Account)
            branch.documentCount += 1
          } else {
           // let account = branch.Accounts.find(b => b.AccNo == row.AccNo)
           // let inDocTypesArray = account.DocTypes.some(b => b.DocType == row.DocType)
            // if (!inDocTypesArray) {
            //   let files = []
            //   let DocTypes = { DocType: row.DocType, documentCount: row.DocCount, Files: files, isExpanded: false }
            //   account.DocTypes.push(DocTypes)
            //   account.documentCount += 1
            // } else {

            // }
          }
        }
        
      });
      this.Foder_Structure = branchs;
      // this.prepareTreeStructure(branchs);
      this.prepareTreeStructure(data);
    });
    //this.FileTaggingForm.controls['DocID'].setValue(0);
  }

  taggingTableHeader: any = [
    { field: 'SRNO', header: 'SRNO', index: 1 },
    { field: 'AccNo', header: this.TempField, index: 1 },
    { field: 'DepartmentName', header: 'Cabinet', index: 1 },
    
    
    { field: 'BranchName', header: 'Folder', index: 1 },


    { field: 'DepartmentName', header: 'DEPART', index: 1 },
    { field: 'DocType', header: 'DOC TYPE', index: 1 },
    { field: 'DocCount', header: 'PAGE', index: 1 }
  ]
  
  // prepareTreeStructure(folderStructureData: any) {

  //     let deptName = [];
  //     let branchDocCount = 0
  //     let accountDocCount = 0
  //     var data1: any;

  //     folderStructureData.forEach((row, indx) => {
  //       let inDeptName = deptName.some(b => b.DepartmentName == row.DepartmentName)
  //       if (!inDeptName) {
  //         // let files = []
  //         // let DocTypes = [{ DocType: row.DocType, documentCount: row.DocCount, Files: files, isExpanded: false }]
  //         // let Accounts = [{ AccNo: row.AccNo, documentCount: 1, DocTypes: DocTypes, isExpanded: indx == 0 ? true : false }]
  //         let branches = [{BranchName: row.BranchName, Entity: [{entity: row.SubfolderName}]}]
  //         deptName.push({ DepartmentName: row.DepartmentName, branches: branches, documentCount: 1, isExpanded: indx == 0 ? true : false })
  //       } 
  //       else {
  //         let dept = deptName.find(b => b.DepartmentName == row.DepartmentName)
  //         let inAccountsArray = dept.branches.some(b => b.BranchName == row.BranchName)
  //         if (!inAccountsArray) {
  //           // let files = []
  //           // let DocTypes = [{ DocType: row.DocType, documentCount: row.DocCount, Files: files, isExpanded: false }]
  //           // let Account = { AccNo: row.AccNo, documentCount: 1, DocTypes: DocTypes, isExpanded: false }
  //           // dept.branches
  //           dept.branches.push({BranchName: row.BranchName, Entity: [{entity: row.SubfolderName}]})
  //           dept.documentCount += 1
  //         } else {
  //          // let account = branch.Accounts.find(b => b.AccNo == row.AccNo)
  //          // let inDocTypesArray = account.DocTypes.some(b => b.DocType == row.DocType)
  //           // if (!inDocTypesArray) {
  //           //   let files = []
  //           //   let DocTypes = { DocType: row.DocType, documentCount: row.DocCount, Files: files, isExpanded: false }
  //           //   account.DocTypes.push(DocTypes)
  //           //   account.documentCount += 1
  //           // } else {

  //           // }
  //         }
  //       }
        
  //     });


  //   let data = [];
  //   const parsedData = deptName;
  //   parsedData.forEach(el => {
  //     let elData = {
  //       "label": el.DepartmentName + '(' + el.documentCount + ')',
  //       "data": el.DepartmentName,
  //       "expandedIcon": "fa fa-folder-open",
  //       "collapsedIcon": "fa fa-folder",
  //       "children": []
  //     }

  //     el.branches.forEach(branchEl => {
  //       let branchElData = {
  //         //"label": accEl.AccNo + '(' + accEl.documentCount + ')',
  //         "label": branchEl.BranchName,
  //         "data": branchEl.BranchName,
  //         "expandedIcon": "fa fa-folder-open",
  //         "collapsedIcon": "fa fa-folder",
  //         "children": []
  //       };

  //       branchEl.Entity.forEach(element => {
  //         let entityData = {
  //           //"label": accEl.AccNo + '(' + accEl.documentCount + ')',
  //           "label": element.entity,
  //           "data": element.entity,
  //           "expandedIcon": "fa fa-folder-open",
  //           "collapsedIcon": "fa fa-folder",
  //           "children": []
  //         };
  //         branchElData.children.push(entityData);
  //       });
  //       // accEl.DocTypes.forEach(docEl => {
  //       //   accElData['children'].push({
  //       //   //  "label": docEl.DocType + '(' + docEl.documentCount + ')',
  //       //     "label": docEl.DepartmentName ,                     //

  //       //     "data": docEl.DepartmentName,
  //       //     "icon": "pi pi-file"
  //       //   })
  //       // })
  //       elData.children.push(branchElData);
  //     })
  //     data.push(elData);
  //   })
  //   //  console.log("Tree data",data);
  //   this.treeFiles = data;
  // }


  prepareTreeStructure(folderStructureData: any) {

    let deptName = [];
    let branchDocCount = 0
    let accountDocCount = 0
    var data1: any;

    folderStructureData.forEach((row, indx) => {
      let inDeptName = deptName.some(b => b.DepartmentName == row.DepartmentName)
      if (!inDeptName) {
        // let files = []
        // let DocTypes = [{ DocType: row.DocType, documentCount: row.DocCount, Files: files, isExpanded: false }]
        // let Accounts = [{ AccNo: row.AccNo, documentCount: 1, DocTypes: DocTypes, isExpanded: indx == 0 ? true : false }]
        let branches = [{BranchName: row.BranchName, Entity: [{entity: row.SubfolderName}]}]
        deptName.push({ DepartmentName: row.DepartmentName, branches: branches, documentCount: 1, isExpanded: indx == 0 ? true : false })
      } 
      else {
        let dept = deptName.find(b => b.DepartmentName == row.DepartmentName)
        let inAccountsArray = dept.branches.some(b => b.BranchName == row.BranchName)
        if (!inAccountsArray) {
          // let files = []
          // let DocTypes = [{ DocType: row.DocType, documentCount: row.DocCount, Files: files, isExpanded: false }]
          // let Account = { AccNo: row.AccNo, documentCount: 1, DocTypes: DocTypes, isExpanded: false }
          // dept.branches
          dept.branches.push({BranchName: row.BranchName, Entity: [{entity: row.SubfolderName}]})
          dept.documentCount += 1;
          if(dept.branches.filter(el => el.BranchName === row.BranchName)[0].Entity.filter(el => el.entity == row.SubfolderName).length === 0)
          dept.branches.filter(el => el.BranchName === row.BranchName)[0].Entity.push({entity: row.SubfolderName})
        } else {
          if(dept.branches.filter(el => el.BranchName === row.BranchName)[0].Entity.filter(el => el.entity == row.SubfolderName).length === 0)
          dept.branches.filter(el => el.BranchName === row.BranchName)[0].Entity.push({entity: row.SubfolderName})
         // let account = branch.Accounts.find(b => b.AccNo == row.AccNo)
         // let inDocTypesArray = account.DocTypes.some(b => b.DocType == row.DocType)
          // if (!inDocTypesArray) {
          //   let files = []
          //   let DocTypes = { DocType: row.DocType, documentCount: row.DocCount, Files: files, isExpanded: false }
          //   account.DocTypes.push(DocTypes)
          //   account.documentCount += 1
          // } else {

          // }
        }
      }
      
    });


  let data = [];
  const parsedData = deptName;
  parsedData.forEach(el => {
    let elData = {
      "label": el.DepartmentName + ' (' + el.documentCount + ')',
      "data": el.DepartmentName,
      "expandedIcon": "fa fa-folder-open",
      "collapsedIcon": "fa fa-folder",
      "children": []
    }

    el.branches.forEach(branchEl => {
      let branchElData = {
        //"label": accEl.AccNo + '(' + accEl.documentCount + ')',
        "label": branchEl.BranchName + ' (' + branchEl.Entity.length + ')',
        "data": branchEl.BranchName,
        "expandedIcon": "fa fa-folder-open",
        "collapsedIcon": "fa fa-folder",
        "children": []
      };

      branchEl.Entity.forEach(element => {
        let entityData = {
          //"label": accEl.AccNo + '(' + accEl.documentCount + ')',
          "label": element.entity,
          "data": element.entity,
          "expandedIcon": "fa fa-folder-open",
          "collapsedIcon": "fa fa-folder",
          "children": []
        };
        branchElData.children.push(entityData);
      });
      // accEl.DocTypes.forEach(docEl => {
      //   accElData['children'].push({
      //   //  "label": docEl.DocType + '(' + docEl.documentCount + ')',
      //     "label": docEl.DepartmentName ,                     //

      //     "data": docEl.DepartmentName,
      //     "icon": "pi pi-file"
      //   })
      // })
      elData.children.push(branchElData);
    })
    data.push(elData);
  })
  //  console.log("Tree data",data);
  this.treeFiles = data;
}


  nodeSelect(e) {
    // console.log("You have selected " + e.node.data);
    // console.log("You have selected " + e.originalEvent.currentTarget.querySelector('span:last-child span').textContent);
    const isNodeSelect = true;
    const fileInfo = {
      fileNo: e.originalEvent.currentTarget.querySelector('span:last-child span').textContent.split('(')[0],
      parentFileNo: e.originalEvent.currentTarget.querySelector('span').closest('ul').previousSibling && e.originalEvent.currentTarget.querySelector('span').closest('ul').previousSibling.querySelector('span:last-child span') 
      ? e.originalEvent.currentTarget.querySelector('span').closest('ul').previousSibling.querySelector('span:last-child span').textContent.split('(')[0] : ''
    }
    this.GetFileInfo(fileInfo, isNodeSelect);

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

  GetFileInfo(fileInfo: any, isNodeSelect?) {

    this.selectedRows = [];
    const apiUrl = this._global.baseAPIUrl + 'Status/GetFileStorageData?UserID=' + localStorage.getItem('UserID') + '&FileNo=' + fileInfo.fileNo + '&parentFileNo=' + fileInfo.parentFileNo + '&user_Token=' + localStorage.getItem('User_Token')+ '&TemplateID=' + this.FileStorageForm.get('TemplateID').value
       
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      // this._ColNameList = data;
      this.fileStorageTableData = JSON.parse(JSON.stringify(data));
      this.GetMetadataField();
      // this.prepareTableData(data);
      this._FileNoList = data;
      this._FilteredListInfo = data;
      this._FilteredListInfo.push(data);
   
      //this._FilteredListInfo.push(data);
     // console.log("FileInfo", data);
    //  if(!isNodeSelect) {
    //   this.prepareTreeStructure(this.fileStorageTableData)
    //  }
    });
  }

  GetFullFile(FileNo:any) {

    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetFullFile?ID='+localStorage.getItem('UserID')+'&&_fileName='+ FileNo +'&user_Token='+localStorage.getItem('User_Token');
    this._onlineExamService.getDataById(apiUrl).subscribe(res => {
      if (res) {

        //alert(res.substring(res.lastIndexOf('.'), res.length));
        this.fileExt = res.substring(res.lastIndexOf('.'), res.length);
    // console.log("9090res",res);
        this.FilePath = res;
         /// saveAs(res, row.ACC + '.pdf');
         this._TempFilePath = res;




      }
    });
  }

  metadataList: any;
  GetMetadataField() {
    const apiUrl=this._global.baseAPIUrl+'DataUpload/GetFieldsName?ID='+ this.FileStorageForm.get('TemplateID').value +'&user_Token='+ localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this.metadataList = data;
     // console.log("MD",data);
     // console.log("MD",data[0].DisplayName);
   //  this.TempField = data[0].DisplayName;
      this.prepareTableData(this.fileStorageTableData);
    });
  }

  prepareTableData(data) {
    var formattedData = [];
    let metadataTableHeader = [];
    // this.metadataList.forEach((el, index) => {
    //   metadataTableHeader.push({
    //     field: 'metadata-' + parseInt(index+1), header: el.DisplayName, index: parseInt(7+index)
    //   })
    // })

  //  console.log(data);
    
    data.forEach((el, index) => {

      if (el.FileNo) {
        formattedData.push({
          "fileNo": el.FileNo,
          "USERID": el.USERID,
          "EntryDate": el.EntryDate,
          // "fileSize": (el.FileSize) + ' MB',
          "PageCount": el.PageCount,
          "IsIndexing": el.IsIndexing,
          "BranchName": el.BranchName,
          "DepartmentName": el.DepartmentName,  
          "SubfolderName": el.SubfolderName,   
          "FilePath": el.FilePath, 
          "TemplateID": el.TemplateID, 
        
          
          
          
          // "empName": el.Ref2,
          // "dob": el.Ref3,
          // "designation": el.Ref4,
          // "isActive": el.Ref5,
          // "doj": el.Ref6,

         // "RelPath": el.RelPath
        });
      }
      // this.metadataList.forEach((el1, i) => {
      //   formattedData[index]['metadata-' + parseInt(i + 1)] = el['Ref'+ parseInt(i+1)]
      // });

    });
    this.tableHeader = [
      { field: 'fileNo', header: this.TempField, index: 1 },
      { field: 'DepartmentName', header: 'CABINET', index: 1 },
      { field: 'BranchName', header: 'FOLDER', index: 1 },
      { field: 'SubfolderName', header: 'SUBFOLDER', index: 3 },
      
      // { field: 'empName', header: 'EMP NAME', index: 7 },
      // { field: 'dob', header: 'DOB', index: 8 },
      // { field: 'designation', header: 'Designation', index: 9 },
      // { field: 'isActive', header: 'Is Active', index: 10 },
      // { field: 'doj', header: 'DOJ', index: 11 },
      { field: 'USERID', header: 'CREATE BY', index: 2 },
      { field: 'EntryDate', header: 'CREATE DATE', index: 3 },
      // { field: 'fileSize', header: 'File Size', index: 4 },
      { field: 'PageCount', header: 'PAGE COUNT', index: 5 },
      { field: 'IsIndexing', header: 'IS INDEXING', index: 5 },
     
    //  { field: 'Archive', header: 'Archive', index: 7 }
    ];
    // let arr1 = this.tableHeader.slice(Math.max(this.tableHeader.length - 5, 0));
    // let arr2 = this.tableHeader.slice(0, 6);
    Array.prototype.push.apply(metadataTableHeader, this.tableHeader);
    this.tableHeader = metadataTableHeader;
    this.formattedData = formattedData;
    this.immutableFormattedData = JSON.parse(JSON.stringify(this.formattedData));
    //console.log(JSON.stringify(this.formattedData));
    this.loading=false;
  }

  selectRow(e, row) {
    this.selectAllRows = false;
    e.originalEvent.stopPropagation();
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
    this.selectedRows = [];
    if (e.checked) {
      this.selectAllRows = true;
      this.formattedData.forEach((el, index) => {
        if(index >= this.first && index < this.first + this.rows) {
          this.selectedRows.push(el.fileNo);
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

   // alert('Hi');
  //  console.log("E", e);

  }

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
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

  onclick()
{
  this.visible = !this.visible;
  this.documentView = false;
}
  refresh()
  {

    this.getTemplate();
  }

  // DownloadBulkFiles()
  // {
  //  // console.log("DownloadBulkFiles", this.selectedRows);

  //   let _CSVData= "";
  //   for (let j = 0; j < this.selectedRows.length; j++) {          
  //     _CSVData += this.selectedRows[j] + ',';
  //     // headerArray.push(headers[j]);  
  //    // console.log("CSV Data", _CSVData);
  //   }
  //  // console.log("CSV Data", _CSVData);
  //   this.downloadBulkFileBYCSV(_CSVData) ;
  // }

  // downloadBulkFileBYCSV(_CSVData:any) {
       
  //   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SearchBulkFile?ID=' + localStorage.getItem('UserID') + '&_fileName= '+  _CSVData +' &user_Token='+ localStorage.getItem('User_Token');
  //   this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
  //     if (res) {

      
  //     saveAs(res, "Files" + '.zip');  
       
  //     }
  //      console.log("Final FP-- res ", res);  
  //   });

  // }

  ShareLink(template: TemplateRef<any>)
  {
    if(this.selectedRows.length > 0){
    this.FileStorageForm.patchValue({htmlContent:  ''});
    var that = this;
  //console.log("Email", this.selectedRows);
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
  }else{
    this.messageService.add({ severity: 'error', summary: 'Error', detail:"Please Select at least on row!!" });
  }
  }

  SendBulkEmail(template: TemplateRef<any>)
  {
    if(this.selectedRows.length > 0){
    var that = this;
  //console.log("Email", this.selectedRows);
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
  }else{
    this.messageService.add({ severity: 'error', summary: 'Error', detail:"Please Select at least on row!!" });
  }
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
    this.selectedInfo.push(selected);
  }

  ViewDocument(template: TemplateRef<any>, row: any, indexTemplate: TemplateRef<any>) {
   // console.log("Viewrow",row);
    //console.log("this._FileNoList",this._FileNoList);
    //console.log("this. this._IndexList", this._IndexList);

   // console.log("row.ref1", row);
   this.documentView = !this.documentView;
   this.visible=false;
    this.MetaData(indexTemplate, row);
  //   var skinName = this._FileNoList.find(x=>x.pro == row.fileNo);   
  //   //console.log("skinName", skinName);
  //  // this.FilePath = this._FileNoList.find(x=>x.FileNo == row.fileNo).RelPath;
    
  //   this.modalRef = this.modalService.show(template);


  //   $(".modal-dialog").css('max-width', '1300px');

    this.GetDocumentDetails(row);

    this.GetFullFile(row.fileNo);

    this.loading=false;
  }

  profileImg: any;
  documentDetails: any;
  GetDocumentDetails(row: any) {
    this.profileImg = row.profileImg;
 //  console.log("AccNo****",row);
   //console.log("row.Photopath",row.profileImg);
    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetDocumentDetails?FileNo=' + row.fileNo + '&UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token')

    // const apiUrl="https://demo2993066.mockable.io/getAllData";

    this._onlineExamService.getAllData(apiUrl).subscribe((data: [any]) => {

      // this._IndexList = data;
      // this._FilteredList = data;
      this.documentDetails = data;

     // console.log("Docdetails",data);
    });
  }

  dowloadAllTagging()
  {
   // console.log("Rows33",this.selectedTaggingRows);
  }

  showDocument(doc) {

  //  console.log("Doc", doc);
   /// this.FilePath = doc.RelPath;
    //console.log("Row**",doc);
    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetTagFile?ID='+localStorage.getItem('UserID')+'&DocID='+doc.DocID+'&_fileName='+doc.AccNo+'&user_Token='+localStorage.getItem('User_Token');
    this._onlineExamService.getDataById(apiUrl).subscribe(res => {
      if (res) {

      //  console.log("res",res);
        this.FilePath = res;
         /// saveAs(res, row.ACC + '.pdf');

      }
    });
  }

viewFullFile(row:any)
{
//console.log("Filepath",row);
  this.FilePath=row;

  
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

  logTableHeader: any = [
    { field: 'SRNO', header: 'SRNO', index: 1 },
    { field: 'UserName', header: 'USERNAME', index: 2 },
    { field: 'Activity', header: 'Activity', index: 3 },
    { field: 'FileNo', header: 'FileNo', index: 4 },
    { field: 'LogDate', header: 'LOGDATE', index: 5 }
  ]

  

  DownloadFileFromDB(Row: any) {

  //  console.log("Row**",Row);
    const fileExt = Row.FilePath.substring(Row.FilePath.lastIndexOf('.'), Row.FilePath.length);
    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadFileFromDB?ID=' + localStorage.getItem('UserID') + '&FileNo= ' + Row.fileNo + ' &user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
      if (res) {
        saveAs(res,Row.fileNo + fileExt);

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

    //this.getSearchResult();
    this.GetFileInfo('');
  }


  

  favourite(Row: any) {
    swal
      .fire({
        // title: "Are you sure?",
        // text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-danger",
        confirmButtonText: "Yes, favourite it!",
        cancelButtonClass: "btn btn-secondary",
      })
      .then((result) => {
        if (result.value) {
          this.FileStorageForm.patchValue({
            ACC: Row.fileNo,
         //   DocID: Row.DocID
          });
          const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/favourite';
          this._onlineExamService.postData(this.FileStorageForm.value, apiUrl)
            .subscribe(data => {
              swal.fire({
                title: "favourite!",
                text: "File has been Favourite.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
             // this.getSearchResultByFileNo(Row.AccNo);
            });
        }
      });
      this.GetFileInfo('');
  }


  // favourite(Row: any) {


  //   this.FileStorageForm.patchValue({
  //     ACC: Row.AccNo,
  //     User_Token: localStorage.getItem('User_Token'),
  //     userID: localStorage.getItem('UserID'),
  //     DocID: Row.DocID
  //   });

  //   const that = this;
  //   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/favourite';
  //   this._onlineExamService.postData(this.FileStorageForm.value,apiUrl)     
  //   .subscribe( data => {
  //       swal.fire({
  //         title: "favourite!",
  //         text: "File has been favourite.",
  //         type: "success",
  //         buttonsStyling: false,
  //         confirmButtonClass: "btn btn-primary",
  //       });
  //     //  that.getSearchResult(that.ContentSearchForm.get('TemplateID').value);
  //     });

   
  // //  this.GetFileInfo('');
  // }

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

  //  console.log("Row**",row);
    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadTagFile?ID='+localStorage.getItem('UserID')+'&DocID='+row.DocID+'&_fileName='+row.AccNo+'&user_Token='+localStorage.getItem('User_Token');
    this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
      if (res) {
      
          saveAs(res, row.ACC + '.pdf');

      }
    });

  }


  DownloadVersionFile(row: any) {

  //  console.log("Row**",row);
    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadVersionFile?ID='+localStorage.getItem('UserID')+'&PageCount='+row.PageCount+'&_fileName='+row.FileNo +'&user_Token='+localStorage.getItem('User_Token');
    this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
      if (res) {
      
          saveAs(res, row.FileNo + '.pdf');

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

  // getFileDetails(e) {
  //   //console.log (e.target.files);
  //   for (var i = 0; i < e.target.files.length; i++) {
  //     this.myFiles.push(e.target.files[i]);
  //   }
  //   //this._IndexList = e.target.files;
  // }


  
  getFileDetails(e) {
    //console.log (e.target.files);
    this.myFiles=[];
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    //  console.log("File",this.myFiles);

    }
    let selectedFileNames = '';
    this.myFiles.forEach(el => {
      selectedFileNames += el['name'] + '<br />';
    })
    $(".selected-file-name").html(selectedFileNames);
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
   

    this.getSearchResultByFileNo(this._FileNo);
    this.getActivityList(this._FileNo);
    this.OnReset();

  }


  OnReset() {
    this.Reset = true;
    this.FileStorageForm.reset();
    this.FileStorageForm.reset({ User_Token: localStorage.getItem('User_Token') });

  }

  EditRowData(Row: any) {
        
    localStorage.setItem('FileNo', Row.fileNo);
    localStorage.setItem('TemplateID', this.FileStorageForm.get('TemplateID').value);
    

   // localStorage.setItem('FileNo', Row.AccNo);
    //localStorage.setItem('TemplateID', Row.TemplateID);
    
    //this.localStorage.setItem('_TempID') =_TempID;
    this.router.navigate(['/process/EditIndexing']);

    //this.localStorage.setItem('_TempID') =_TempID;
    //this.router.navigate([]).then(result => {  window.open('/process/EditIndexing', '_blank'); });;
  }

  MetaData(template: TemplateRef<any>, row: any)
  {

  event.stopPropagation();

  let  __FileNo =row.fileNo;
  let  __TempID = row.TemplateID;

  const apiUrl=this._global.baseAPIUrl+'DataEntry/GetNextFile?id='+__TempID+'&FileNo='+__FileNo+'&user_Token='+ localStorage.getItem('User_Token');

  //const apiUrl=this._global.baseAPIUrl+'DataEntry/GetNextFile?id'+  + '' FileNo='+ __FileNo + '&user_Token=123123'
  this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
     this._IndexList = data;           
    // console.log("Index",data);
  });
  // this.modalRef = this.modalService.show(template);
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

    const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID='+localStorage.getItem('UserID')+'&user_Token='+localStorage.getItem('User_Token');

    // const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplate?user_Token=' + this.FileStorageForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.TemplateList = data;    
         
      this._TempD = data[0].TemplateID;
      // this.getSearchResult(data[0].TemplateID);
      this.FileStorageForm.controls['TemplateID'].setValue(this._TempD);  
      this.geTemplateNameListByTempID(this._TempD);

     
    });
  }

  geTemplateNameListByTempID(TID: number) {
    
    this.getSearchResult();
   
    this.GetFileInfo('');
  }

  // GetDisplayField(TID: number) {

  //   const apiUrl = this._global.baseAPIUrl + 'DataUpload/GetFieldsName?ID=' + TID + '&user_Token=' + localStorage.getItem('User_Token')
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
  //     this._ColList = data;

  //     // this.DataUploadForm.controls['TemplateID'].setValue(0);
  //     //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });
  // }

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

  onActivateVersion(event) {
    this.activeRowVersion = event.row;
  }

  onSelectVersion({ selected }) {
    this.selectedVersion.splice(0, this.selected.length);
    this.selectedVersion.push(selected);
  }


  onSelectMD({ selected }) {
    this.selectedMD.splice(0, this.selected.length);
    this.selectedMD.push(selected);
  }

  entriesChangeMD($event) {
    this.entriesMD = $event.target.value;
  }
  entriesChangeVersion($event) {
    this.entriesversion = $event.target.value;
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


    


    VfilterTable($event) {
      console.log($event.target.value);
  
      let val = $event.target.value;
      this._VersionFilteredList = this._VList.filter(function (d) {
        console.log(d);
        for (var key in d) {
          if (key == "FileNo") {
            if (d[key].toLowerCase().indexOf(val) !== -1) {
              return true;
            }
          }
        }
        return false;
      });
    }

  onHeaderCheckboxToggle(event) {
     console.log("event",event);
  }
 
  
  SendEmail(template: TemplateRef<any>, row: any) {
    this.FileStorageForm.patchValue({htmlContent:  ''});
    var that = this;
  
    if (row != null) {

      this.FileStorageForm.controls['ACC'].setValue(row.fileNo);
      this.FileStorageForm.controls['FileNo'].setValue(row.fileNo);
    }

    this.modalRef = this.modalService.show(template);
  }

  // VersionDetails(template: TemplateRef<any>, row: any) {
  //   var that = this;
  
  //   if (row != null) {

  //     this.FileStorageForm.controls['ACC'].setValue(row.fileNo);
  //     this.FileStorageForm.controls['FileNo'].setValue(row.fileNo);
  //   }
  //   console.log("row.fileNo",row.fileNo);
  //   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetVersionDetails?FileNo=' + row.fileNo + '&user_Token=' + localStorage.getItem('User_Token')
  //    // const apiUrl=this._global.baseAPIUrl+'BranchMaster/GetBranchList?user_Token='+ localStorage.getItem('User_Token') 
  //     this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
  //     this._VList = data;
  //     this._VersionFilteredList = data
  //     console.log("row._VList",data);
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });

  //   this.modalRef = this.modalService.show(template);
  // }

  // onSendEmail() {

  //   const apiUrl = this._global.baseAPIUrl + 'Mail/SendEmail';
   
  //   this._onlineExamService.postData(this.FileStorageForm.value, apiUrl)
  //     .subscribe(data => {
  //       swal.fire({
  //         title: "Email!",
  //         text: "Email send successfully",
  //         type: "success",
  //         buttonsStyling: false,
  //         confirmButtonClass: "btn btn-primary",
  //       });

  //     }); 
      
  //     this.OnReset();
  // }


  // onSendEmail() {

  //   if (this.selectedRows.length <=10)
  //   {

  //   const apiUrl = this._global.baseAPIUrl + 'Mail/SendEmail';
  //   // this.emailReciepients.forEach((el, i) => {
  //     let toEmailString = ''; 
  //     this.emailReciepients.forEach(el => toEmailString += el.display + ',');
  //     this.FileStorageForm.value.ToEmailID = toEmailString;
  //     this._onlineExamService.postData(this.FileStorageForm.value, apiUrl)
  //     .subscribe(data => {
  //       swal.fire({
  //         title: "Email!",
  //         text: "Email send successfully",
  //         type: "success",
  //         buttonsStyling: false,
  //         confirmButtonClass: "btn btn-primary",
  //       });

  //     });
  //   // });
  //   this.modalRef.hide();
  //   //  this.getSearchResult();   
  //   }
  //   else
  //   {
  //     this.ShowErrormessage("You can not send more than 10 files on mails.");
  //   }

  // }


    
  onSendEmail() {

    if (this.selectedRows.length <=10)
    {
  const apiUrl = this._global.baseAPIUrl + 'Mail/SendEmail';
  //  const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SendBulkTagFileOnMail?ID='+localStorage.getItem('UserID')+'&DocID='+1+'&_fileName='+ this.ContentSearchForm.controls['FileNo'].value +'&user_Token='+localStorage.getItem('User_Token');
    let toEmailString = ''; 
    this.emailReciepients.forEach(el => toEmailString += el.display + ',');
    this.FileStorageForm.value.ToEmailID = toEmailString;
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
     // this.getSearchResult();   

    }
    else
    {
      this.ShowErrormessage("You can not send more than 10 files on mails.");
    }
  }

  onSendEmailByShare() {

    const apiUrl = this._global.baseAPIUrl + 'Mail/SendEmailBulkFiles';
    // this.emailReciepientsShare.forEach((el, i) => {
      let toEmailString = ''; 
      this.emailReciepientsShare.forEach(el => toEmailString += el.display + ',');
      this.FileStorageForm.value.ToEmailID = toEmailString;
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
    // });
    
     this.modalRef.hide();    
    ///  this.getSearchResult();
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
  //  this.getSearchResult();
   // this.GetFileInfo('');
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
    // this.toastr.show(
    //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title"></span> <span data-notify="message"> ' + data + ' </span></div>',
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
    this.messageService.add({ severity: 'success', summary: 'Success', detail:data });

  }

  get f(){
    return this.FileStorageForm.controls;
  }

  selectAllTaggingRow(e) {
    if (e.checked) {
      this.selectAllTaggingRows = true;
      this._FilteredList.forEach(el => {
        this.selectedTaggingRows.push(el.AccNo +"_" + el.DocID);
      });
    } else {
      this.selectAllTaggingRows = false;
      this.selectedTaggingRows = [];
    }
  }
  selectedTaggingRows = [];
 
  selectTaggingRow(e, row) {
    this.selectAllTaggingRows = false;
    e.originalEvent.stopPropagation();
    if (e.checked) {
      this.selectedTaggingRows.push(row.AccNo +"_" + row.DocID);
    } else {
      var index = this.selectedTaggingRows.indexOf(row.AccNo +"_" + row.DocID);
      this.selectedTaggingRows.splice(index, 1);
    }
 

  }

  dowloadSelectedTagging() {
  //  console.log("Rows--",this.selectedTaggingRows);

  // console.log("selectedTaggingRows**",this.selectedTaggingRows);
   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadBulkTagFile?ID='+localStorage.getItem('UserID')+'&DocID='+1+'&_fileName='+this.selectedTaggingRows+'&user_Token='+localStorage.getItem('User_Token');
   this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
     if (res) {
     
       //  saveAs(res, "TaggedFiles" + '.pdf');

         saveAs(res, "TaggedFiles" + '.zip');  

     }
   });


  }

  GetHeaderNames()
{
  this._HeaderList="";
 // console.log(this.tableHeader); 

  for (let j = 0; j < this.metadataList.length; j++) {  
       
      this._HeaderList += this.metadataList[j].DisplayName +((j <= this.metadataList.length-2)?',':'') ;
    // headerArray.push(headers[j]);  
  }

  for (let j = 1; j < this.tableHeader.length; j++) {  
       
    //  this._HeaderList += this.tableHeader[j].DisplayName +((j <= this.metadataList.length-2)?',':'') ;
    this._HeaderList += ','+ this.tableHeader[j].header ;
    // headerArray.push(headers[j]);  
  }
  
   // console.log(this._MDList);

  this._HeaderList += '\n';
  let that = this;
  this._MDList.forEach(stat => {
   // console.log(stat);
    //console.log(stat.BranchName);
    // if ( that.selectedRows.indexOf(stat['Ref1']) > -1 ) {
      for (let j = 0; j < this.metadataList.length; j++) {
        this._HeaderList += (j==0?(stat['Ref'+(j+1)]+''):stat['Ref'+(j+1)]) + ((j <= this.metadataList.length-2)?',':'') ;
      }
     var counter=0;
   //  console.log(this._HeaderList);

    //  this._HeaderList += stat[(this.tableHeader[counter].field)] + ','; 
    //  this._HeaderList +=stat.DepartmentName + ','; 
    //  this._HeaderList +=stat.BranchName + ','; 
    //  this._HeaderList +=stat.USERID + ','; 
    //  this._HeaderList +=stat.EntryDate + ','; 
    //  this._HeaderList +=stat.PageCount + ','; 
    //  this._HeaderList +=stat.IsIndexing + ','; 
    

      for (let j = this.metadataList.length; j < this.tableHeader.length + this.metadataList.length; j++) {         
        
        //  this._HeaderList += this.tableHeader[j].DisplayName +((j <= this.metadataList.length-2)?',':'') ;
      this._HeaderList += stat[(this.tableHeader[counter].field)] + ','; 
     // console.log(stat);
       ///   console.log("Field Name",this.tableHeader[counter].field);
      
     
        counter++;
        //console.log(stat);
        // headerArray.push(headers[j]);  
      }

    // }
    this._HeaderList += '\n'
  });

  
  

 // console.log("this._HeaderList",this._HeaderList); 

}

  DownloadMetadata() {
    if(this.selectedRows.length > 0){
    let _CSVData = "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
    }

    const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + _CSVData + '&user_Token=' + localStorage.getItem('User_Token')+'&UserID='+localStorage.getItem('UserID')
    //const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + _CSVData + '&user_Token=' + localStorage.getItem('User_Token')
    
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._MDList = data;
      this.GetHeaderNames();
      let csvData = this._HeaderList; 
      // alert(this._HeaderList);
      // console.log("Data",csvData) 
      let blob = new Blob(['\ufeff' + csvData], { 
          type: 'text/csv;charset=utf-8;'
      }); 
      let dwldLink = document.createElement("a"); 
      let url = URL.createObjectURL(blob);
      
      let isSafariBrowser =-1;
      // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
      // navigator.userAgent.indexOf('Chrome') == -1; 
      
      //if Safari open in new window to save file with random filename. 
      if (isSafariBrowser) {  
          dwldLink.setAttribute("target", "_blank"); 
      } 
      dwldLink.setAttribute("href", url); 
      dwldLink.setAttribute("download", 'Metadata' + ".csv"); 
      dwldLink.style.visibility = "hidden"; 
      document.body.appendChild(dwldLink); 
      dwldLink.click(); 
      document.body.removeChild(dwldLink);
    });
  }else{
    this.messageService.add({ severity: 'error', summary: 'Error', detail:"Please Select at least on row!!" });
  }
  }

  // openPdfFile() {
  //   var link = document.createElement('a');
  //   link.href = 'https://conceptdms.in/dmsinfo/assets/Upload/31-12-2020/c9810_42b9ef6c-c065-451d-a3a7-c6f899afba53.pdf';
  //   link.download = 'https://conceptdms.in/dmsinfo/assets/Upload/31-12-2020/c9810_42b9ef6c-c065-451d-a3a7-c6f899afba53.pdf';
  //   link.dispatchEvent(new MouseEvent('click'));
  // }


  downloadBulkFileBYCSV(_CSVData:any) {


    this.FileStorageForm.patchValue({
      ACC: _CSVData,
      User_Token: localStorage.getItem('User_Token'),
      userID: localStorage.getItem('UserID')
    });

   // BulkDownload
    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DLoadBulkFiles';   
 //   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SearchBulkFile?ID=' + localStorage.getItem('UserID') + '&_fileName= '+  _CSVData +' &user_Token='+ localStorage.getItem('User_Token');
  //  this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
    this._onlineExamService.BulkDownload(this.FileStorageForm.value, apiUrl).subscribe( res => {
      if (res) {      
      saveAs(res, "Bulk Files" + '.zip');         
      }
      // console.log("Final FP-- res ", res);  
    });

  }

  DownloadBulkFiles() {

    if (this.selectedRows.length <=25)
    {
    
    let _CSVData= "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
      // headerArray.push(headers[j]);  
     // console.log("CSV Data", _CSVData);
    }
   // console.log("CSV Data", _CSVData);
    this.downloadBulkFileBYCSV(_CSVData) ;
  }
  else {
  
    this.ShowErrormessage("You can not select more than 25 files to download");
  }
  
  }
  
  ShowErrormessage(data:any)
  {
    // this.toastr.show(
    //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation ! </span> <span data-notify="message"> '+ data +' </span></div>',
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

  onItemAdded(event) {
    console.log(event);
  }

  // @HostListener('document:paste', ['$event']) blockPaste(e: KeyboardEvent) {
  //   e.preventDefault();
  // }

  // @HostListener('document:copy', ['$event']) blockCopy(e: KeyboardEvent) {
  //   e.preventDefault();
  // }

  // @HostListener('document:cut', ['$event']) blockCut(e: KeyboardEvent) {
  //   e.preventDefault();
  // }


@ViewChild('tagInput')
tagInput: SourceTagInput;
public validators = [ this.must_be_email.bind(this) ];
public errorMessages = {
    'must_be_email': 'Please be sure to use a valid email format'
};
public onAddedFunc = this.beforeAdd.bind(this);
private addFirstAttemptFailed = false;

private must_be_email(control: FormControl) {        

    if (this.addFirstAttemptFailed && !this.validateEmail(control.value)) {
        return { "must_be_email": true };
    }
    return null;
}
beforeAdd(tag: string) {

  if (!this.validateEmail(tag)) {
    if (!this.addFirstAttemptFailed) {
      this.addFirstAttemptFailed = true;
      this.tagInput.setInputValue(tag);
    }

    return throwError(this.errorMessages['must_be_email']);
    //return of('').pipe(tap(() => setTimeout(() => this.tagInput.setInputValue(tag))));
    
  }
  this.addFirstAttemptFailed = false;
  return of(tag);
}

private validateEmail(text: string) {
  var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
  return (text && EMAIL_REGEXP.test(text));
}


}
