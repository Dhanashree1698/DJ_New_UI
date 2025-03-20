
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "src/app/Services/common.service";
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api'; 
import swal from "sweetalert2";
import * as XLSX from 'xlsx';

import { Component, OnInit, TemplateRef,EventEmitter,Output, HostListener, ViewChild } from "@angular/core";
import { id } from "@swimlane/ngx-charts";
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  modalRef: BsModalRef;
  AddNotificationForm: FormGroup;
  _FilteredList: any;
  _BranchList: any;
  first = 0;
  rows = 10;
  visible = true;
  TemplateList :any ; 
  _DocDateList: any;
  _EmailIDList:any;
  submitted = false;
  onclick()
  {
    this.visible = !this.visible
  }
  constructor(
    private modalService: BsModalService,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    private router: Router,
      private _commonService: CommonService,
      private messageService: MessageService

  ) { }

  ngOnInit() {

    this.AddNotificationForm = this.formBuilder.group({
      DocDate: [0, Validators.required],
      TemplateID: [0, Validators.required], 
      emailCheckbox: ['', Validators.required],  
      EmailID: [0, Validators.required], 
      FieldID: [0, Validators.required],
      email: [''],  
      notificationType: [0],  
      Frequency15:[''],
      Frequency30:[''],
      Frequency60:[''],    
      OtherEmailID:[''],
      ID:[''],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
     
      userID: localStorage.getItem('UserID') ,

    });

    this.Getpagerights();
    this.getTemplate();
    this.GetNotificationdata();
        this.AddNotificationForm.controls['FieldID'].setValue(0);

    this.AddNotificationForm.controls['EmailID'].setValue(0);
   // this. getSearchParameterList(2);

  }

 
  Getpagerights() {

    var pagename ="Notification";
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

  GetNotificationdata() {

    const apiUrl = this._global.baseAPIUrl + 'NotificationMaster/GetNotificationList?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
 //   const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token='+localStorage.getItem('User_Token') 
     
    // const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplate?user_Token=' + this.FileStorageForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
     
      this._FilteredList = data
      this.prepareTableData(data,  this._FilteredList);

    }); 
     
  }

  getTemplate() {

    //const apiUrl = this._global.baseAPIUrl + 'NotificationMaster/GetNotificationList?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
    const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token='+localStorage.getItem('User_Token') 
     
    // const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplate?user_Token=' + this.FileStorageForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.TemplateList = data;
      this.AddNotificationForm.controls['TemplateID'].setValue(0);
     // console.log("TempList111",data);
   
    }); 
     
  }

  Getindexfield(TID:any) {
    
    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/Getindexfield?TempID=' + TID + '&user_Token='+ localStorage.getItem('User_Token')

    //  const apiUrl=this._global.baseAPIUrl+'SearchFileStatus/getSearchParameterList?user_Token=123123'
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._DocDateList = data;  
      this._EmailIDList = data;      
    // this.AddNotificationForm.controls['FieldID'].setValue(0);

    // this.AddNotificationForm.controls['emailid'].setValue(0);


    
    //console.log("emailid", data)
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
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'TemplateName', header: 'Template Name', index: 3 },
      { field: 'userid', header: 'User Name', index: 2 },
      { field: 'FieldName', header: 'Field Name', index: 3 },
      { field: 'EmailName', header: 'Email Name', index: 2 },
      { field: 'OtherEmailID', header: 'Other Email', index: 3 },
      { field: 'Frequency15', header: 'Frequency15', index: 2 },
      { field: 'Frequency30', header: 'Frequency30', index: 2 },
      { field: 'Frequency60', header: 'Frequency60', index: 2 },
      { field: 'notificationType', header: 'Notification Type', index: 2 },
    ];
   
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'TemplateName': el.TemplateName,
         'userid': el.userid,
         'FieldName': el.FieldName,
         'EmailName': el.EmailName,
         'OtherEmailID': el.OtherEmailID,
         'Frequency15': el.Frequency15,
         'Frequency30': el.Frequency30,
         'Frequency60': el.Frequency60,
         'ID': el.ID,
         'EmailID': el.EmailID,
         'FieldID': el.FieldID,
         'TemplateID': el.TemplateID,
         'notificationType': el.notificationType,

   
       
      
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
 

  addBranch(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);

    this.AddNotificationForm.patchValue({
    //   id:0,
    //   BranchName:'',
    //   DepartmentID: 0,
       
    })
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
  OnReset() {
    //  this.Reset = true;
      //this.AddBranchForm.reset();
      this.modalRef.hide();  
  
    }

  onSubmit() {
    this.submitted = true;
    //console.log(this.AddBranchForm);
    if (this.AddNotificationForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    const apiUrl = this._global.baseAPIUrl + 'NotificationMaster/Create';
    this._onlineExamService.postData(this.AddNotificationForm.value,apiUrl).subscribe((data: {}) => {     
    console.log(data);
    //  this.toastr.show(
    //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">Folder Saved</span></div>',
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
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Folder Saved' });
     this.OnReset();
     this.GetNotificationdata();
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    //this.studentForm.patchValue({File: formData});
  }

  editBranch(template: TemplateRef<any>, row: any) {
    var that = this;
   //  that._SingleDepartment = row;
  console.log('data', row);

  this.Getindexfield(row.TemplateID);

    this.AddNotificationForm.patchValue({
      ID: row.ID,
      TemplateID: row.TemplateID,
      EmailID: row.EmailID,
      FieldID: row.FieldID,
      email: row.email,
      notificationType: row.notificationType,
      Frequency15: row.Frequency15,
      Frequency30: row.Frequency30,
      Frequency60: row.Frequency60,
      OtherEmailID: row.OtherEmailID,


      // DocDate: [0, Validators.required],
      // TemplateID: [0, Validators.required], 
      // emailCheckbox: ['', Validators.required],  
      // emailid: [0, Validators.required], 
      // FieldID: [0, Validators.required],
      // email: [''],  
      // notificationType: [0],  
      // Frequency15:[''],
      // Frequency30:[''],
      // Frequency60:[''],    
      // OtherEmailID:[''],

       
    })
   // console.log('form', this.AddBranchForm);
    //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  this.modalRef = this.modalService.show(template);
}

deleteNotification(id: any) {
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
        this.AddNotificationForm.patchValue({
          ID: id.ID
        });
        const apiUrl = this._global.baseAPIUrl + 'NotificationMaster/Delete';
        this._onlineExamService.postData(this.AddNotificationForm.value,apiUrl)     
        .subscribe( data => {
            swal.fire({
              title: "Deleted!",
              text: "Folder has been deleted.",
              type: "success",
              buttonsStyling: false,
              confirmButtonClass: "btn btn-primary",
            });
            this.GetNotificationdata();
          });
      }
    });
}

}
