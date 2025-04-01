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
  selector: "app-department",
  templateUrl: "department.component.html",
  styleUrls: ["department.component.css"]
})
export class DepartmentComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  AddDepartmentForm: FormGroup;
  _DepartmentList :any;
  _FilteredList :any;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
 _DeptID: any=0;
 first = 0;
 rows = 10;

  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.AddDepartmentForm = this.formBuilder.group({
      DepartmentName: ['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9\-_\s]+$/)]],
      CabientSize:['',Validators.required],
      Description:[''],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      UserID: localStorage.getItem('UserID') ,
      id:[0]
    });
    this.geDepartmentList();
    this.Getpagerights();
  }

  get f(){
    return this.AddDepartmentForm.controls;
  }
  Getpagerights() {

    var pagename ="Cabinet";
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

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  

  onActivate(event) {
    this.activeRow = event.row;
  }
  geDepartmentList() {
    const apiUrl=this._global.baseAPIUrl+'Department/GetList?user_Token='+ localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._DepartmentList = data;
      this._FilteredList = data
      this.prepareTableData( this._DepartmentList,  this._FilteredList);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
   // alert(this.type);
  
  // if (this.type=="Checker" )
  //{
    let tableHeader: any = [
    { field: 'srNo', header: "Sr No", index: 1 },
    { field: 'Cabient', header: 'Cabinet', index: 3 },
    { field: 'CabientSize', header: 'Cabinet Size', index: 2 },
    { field: 'FolderCount', header: 'Folder Count', index: 2 },
    { field: 'SubFolderCount', header: 'Sub Folder Count', index: 2 },
    { field: 'Description', header: 'Description', index: 2 },
    { field: 'CreatedDate', header: 'Created Date', index: 2 },
    { field: 'CreatedBy', header: 'Created By', index: 2 },

    ];
   
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'DepartmentName': el.DepartmentName,
        'Cabient': el.Cabient,
         'id': el.id,
         'DID': el.DID,
         'CabientSize': el.CabientSize +  ' GB',
         'FolderCount': el.FolderCount,
         'SubFolderCount': el.SubFolderCount,
         'Description': el.Description,
         'CreatedDate': el.CreatedDate,
         'CreatedBy': el.CreatedBy,
    
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
   // this.AddDepartmentForm.reset({User_Token: localStorage.getItem('User_Token')});
    this.modalRef.hide();  
  }

  onSubmit() {
    debugger
    this.submitted = true;
    console.log(this.AddDepartmentForm);
    if (this.AddDepartmentForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    const apiUrl = this._global.baseAPIUrl + 'Department/Update';
    this._onlineExamService.postData(this.AddDepartmentForm.value,apiUrl).subscribe((data: {}) => {     
      if(data==='Record Save Succesfully..')

        {
          this.ShowSuccessMessage(data);
          
        }
        else  if(data==='Record Updated Succesfully..')
  
          {
            this.ShowSuccessMessage(data);
            
          }
  
          else  if(data==='Record Already Exists')
  
            {
              this.ShowErrormessage(data);
             
              
            } this.geDepartmentList();
     this.OnReset();

    });

  }
  
  // ShowErrormessage(data){
  //   this.messageService.add({ severity: 'warn', summary: 'Warnning', detail: data });
  // }
  ShowErrormessage(data: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error ! </span> <span data-notify="message"> ' + data + ' </span></div>',
      "",
      {
        timeOut: 3000,
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
  ShowSuccessMessage(data){
    this.messageService.add({ severity: 'success', summary: 'Success', detail: data });
  }
  // ShowSuccessMessage(data: any) {
  //   this.toastr.show(
  //     '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success! </span> <span data-notify="message"> ' + data + ' </span></div>',
  //     "",
  //     {
  //       timeOut: 3000,
  //       closeButton: true,
  //       enableHtml: true,
  //       tapToDismiss: false,
  //       titleClass: "alert-title",
  //       positionClass: "toast-top-center",
  //       toastClass:
  //         "ngx-toastr alert alert-dismissible alert-success alert-notify"
  //     }
  //   );
  // }
    
  deleteDepartment(id: any) {
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
          this.AddDepartmentForm.patchValue({
            id: id.DID
          });
          const apiUrl = this._global.baseAPIUrl + 'Department/Delete';
          this._onlineExamService.postData(this.AddDepartmentForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Cabinet has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.geDepartmentList();
            });
        }
      });
  }
  editDepartment(template: TemplateRef<any>, row: any) {
      var that = this;
      that._SingleDepartment = row;
     console.log('data', row);
      this.AddDepartmentForm.patchValue({
        id: that._SingleDepartment.DID,
        DepartmentName: that._SingleDepartment.DepartmentName,
        CabientSize: that._SingleDepartment.CabientSize,
        Description: that._SingleDepartment.Description,
      })

    this.modalRef = this.modalService.show(template);
  }
  addDepartment(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.AddDepartmentForm.reset();
  }

  //Changes Added By Dhanashree
  onSizeInput(event: any) {
    const value = event.target.value;
    const validValue = value.replace(/[^0-9]/g, ''); 
    event.target.value = validValue;  
  }
  onDownloadExcelFile(_filename:string)
  {
   // _filename = 'Users_Data';
    this.exportToExcel(this.formattedData,_filename);
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

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }
}
