import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
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
  selector: 'app-client-master',
  templateUrl: './client-master.component.html',
  styleUrls: ['./client-master.component.scss']
})
export class ClientMasterComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  FolderList:any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  AddTemplateForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
  _TemplateList :any; 
  _FilteredList :any; 
  _CabientList:any;
  //  _TempID: any =0;
  //bsValue = new Date();
  //bsRangeValue: Date[];
  //maxDate = new Date();
  first = 0;
rows = 10;
//Project Validity changes by dhanashree
minDate: string = new Date().toISOString().split('T')[0];


  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
    
  ) {
;
  }
  ngOnInit() {
    debugger
        this.AddTemplateForm = this.formBuilder.group({
      
      // ClientName: ['',[Validators.required, Validators.pattern(/^[a-zA-Z\-\s]+$/)]],
            // changes added by dhanashree for space char for ClientName 
      ClientName: ['',[Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      // Cabinet: [0, Validators.required],
      // Folder: [0, Validators.required],
      StorageSpace:['',Validators.required],
      NoofUsers:['',Validators.required],
   //   validity:['',Validators.required],
      User_Token: localStorage.getItem('User_Token') ,
      UserID: localStorage.getItem('UserID') ,
      id:[0],
      OCRdump:[0, Validators.required],
      Projectvalidity: ['', Validators.required] ,

    });
    
    this.GetClientData();
    // this.getCabient();
    //this.Getpagerights();
    
  }
 
  get f(){
    return this.AddTemplateForm.controls;
  }

  Getpagerights() {

    var pagename ="DSConfig";
    const apiUrl = this._global.baseAPIUrl + 'Admin/Getpagerights?userid=' + localStorage.getItem('UserID')+' &pagename=' + pagename + '&user_Token=' + localStorage.getItem('User_Token');

    // const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplate?user_Token=' + this.FileStorageForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data) => {
    //  this.TemplateList = data;    
     
    if (data <=0)
    {
      // localStorage.clear();
      // this.router.navigate(["/Login"]);
    }     
    });
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
 
  onActivate(event) {
    this.activeRow = event.row;
  }

  getCabient() {
    const apiUrl=this._global.baseAPIUrl+'DepartmentMapping/GetDepartmentByUser?ID='+ localStorage.getItem('UserID')+'&user_Token='+localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._CabientList = data;
   
    });
  }

//   getFolderByCabient(DepartmentID:any)
//   {
//     const apiUrl =
//     this._global.baseAPIUrl +"BranchMapping/GetFolderDataBydeptandUserWise?ID="+localStorage.getItem('UserID')+"&user_Token="+localStorage.getItem('User_Token')+"&DeptID="+DepartmentID;
//     this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
//     this.FolderList = data;

// });

//   }


  GetClientData() {
debugger
  const apiUrl=this._global.baseAPIUrl+'ClientMaster/GetClientMasterRecords?user_Token='+ localStorage.getItem('User_Token')+'&userid='+ localStorage.getItem('UserID') 
  this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
  this._TemplateList = data;
  this._FilteredList = data
  debugger
  this.prepareTableData( this._TemplateList,  this._FilteredList);

  });
  }

  formattedData: any = [];
headerList: any;
immutableFormattedData: any;
loading: boolean = true;
prepareTableData(tableData, headerList) {
  debugger
  let formattedData = [];

  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },      
    { field: 'ClientName', header: 'CLIENT NAME', index: 2 },  
    // { field: 'CabinetName', header: 'CABINET', index: 2 },  
      //  { field: 'FolderName', header: 'FOLDER', index: 3 },  
   { field: 'StorageSpace', header: 'STORAGE SPACE', index: 4 },
   { field: 'NoOfUsers', header: 'NO OF USERS', index: 4 },  
          
   { field: 'OCRDump', header: 'OCR', index: 5 },         
   { field: 'ProjectValidity', header: 'PROJECT VALIDITY', index: 5 },         
      
  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'ClientName': el.ClientName,
      // 'CabinetName': el.CabinetName,
      // 'FolderName': el.FolderName,
       'StorageSpace': el.StorageSpace,
        'NoOfUsers': el.NoOfUsers,
        // 'Cabinet': el.Cabinet,
        // 'Folder': el.Folder,
         'OCRDump': el.OCRDump,
        'ProjectValidity': el.ProjectValidity,

    });
 
  });
  this.headerList = tableHeader;
//}

  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
  this.formattedData = formattedData;
  this.loading = false;

}

searchTable($event) {
  // console.log($event.target.value);

  let val = $event.target.value;
  if(val == '') {
    this.formattedData = this.immutableFormattedData;
  } else {
    let filteredArr = [];
    const strArr = val.split(',');
    this.formattedData = this.immutableFormattedData.filter(function (d) {
      for (var key in d) {
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
  }
}

  OnReset() {
    this.Reset = true;
  //  this.AddTemplateForm.reset({User_Token: localStorage.getItem('User_Token')});
    this.modalRef.hide();  
  }

 


  onSubmit() {
    debugger
    this.submitted = true;
    //console.log(this.AddTemplateForm);
    if (this.AddTemplateForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    const apiUrl = this._global.baseAPIUrl + 'ClientMaster/SaveClientMaster';
    this._onlineExamService.postData(this.AddTemplateForm.value,apiUrl).subscribe((data) => {     
     console.log(data);
    //  this.toastr.show(
    //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">'+ data +'</span></div>',
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
    this.messageService.add({ severity: 'success', summary: '', detail:data });
     
     this.OnReset()
     this.GetClientData();
     this.modalRef.hide();  
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

  }
  deleteTemplate(id: any) {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: "btn dangerbtn",
        confirmButtonText: "Yes, delete it!",
        cancelButtonClass: "btn btn-secondary",
      })
      .then((result) => {
        if (result.value) {
          this.AddTemplateForm.patchValue({
            id: id.id
          });
          const apiUrl = this._global.baseAPIUrl + 'ClientMaster/DeleteClientMasterRecord';
          this._onlineExamService.postData(this.AddTemplateForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Client has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.GetClientData();
            });
        }
      });
  }
 
  ClosePopup()
  {
    this.modalRef.hide();  
  }
 
  editClient(template: TemplateRef<any>, row: any) {
      var that = this;
      that._SingleDepartment = row;
//      console.log('data', row);
       this.AddTemplateForm.patchValue({
        id: that._SingleDepartment.id,
        ClientName: that._SingleDepartment.ClientName,
        // Cabinet: that._SingleDepartment.Cabinet,
   //     Folder: that._SingleDepartment.PageNo,
        StorageSpace:that._SingleDepartment.StorageSpace,
        NoofUsers:that._SingleDepartment.NoOfUsers,
        OCRdump:that._SingleDepartment.OCRDump,
        Projectvalidity:that._SingleDepartment.ProjectValidity,

      })
    // this.getFolderByCabient(that._SingleDepartment.Cabinet);
    // this.AddTemplateForm.controls['Folder'].setValue(that._SingleDepartment.Folder);

//this.AddTemplateForm.
     // console.log('form', this.AddTemplateForm);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    this.modalRef = this.modalService.show(template);
  }
  addTemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);

    this.AddTemplateForm.patchValue({
      //id: that._SingleDepartment.id,
      ClientName:'',
      // Cabinet:0,
      // Folder:0,
      StorageSpace:'',
      NoofUsers:'',
      OCRdump:'',
      Projectvalidity:'',

    })
 // this.getFolderByCabient(that._SingleDepartment.Cabinet);
  //this.AddTemplateForm.controls['Folder'].setValue(that._SingleDepartment.Folder);


  }
  onDownload(filename:string)
  {
    this.onDownloadExcelFile(filename);
  }
  onDownloadExcelFile(_filename:string)
  {
   // _filename = 'Users_Data';
    this.exportToExcel(this.formattedData,_filename);
    // this.downloadFile();
  }

  // Added Changes By Dhanashree

  onSizeInput(event: any) {
    const value = event.target.value;
    const validValue = value.replace(/[^0-9]/g, ''); 
    event.target.value = validValue; 
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
