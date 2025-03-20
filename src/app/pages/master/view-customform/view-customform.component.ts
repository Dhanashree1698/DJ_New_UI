import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";
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
  selector: "app-view-customform",
  templateUrl: "view-customform.component.html",
  styleUrls: ["view-customform.component.css"]
})
export class ViewCustomFormComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  ViewCustomeForm: FormGroup;
  _SingleDepartment: any;
  
  AddTemplateForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';      
  _FilteredList :any; 
  TemplateList:any;
_IndexList:any;
_TemplateList :any;
_CloneList:any;
_TList:any;
first = 0;
rows = 10;
 
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.ViewCustomeForm = this.formBuilder.group({
      TemplateName: [''],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0],
      TemplateIDFrom:['0'],
      TemplateIDTo:['0'],
      TemplateID:['0'],
    });     

    this.getTempList(0);
    this.getTemplate();
    this.geTList();
    this.geTListPending();

  }

  
  getTemplate() {  

    const apiUrl=this._global.baseAPIUrl+'Template/GetTemplate?user_Token='+ localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data) => {     
    this.TemplateList = data;    
    if(data.length>0){
      this.ViewCustomeForm.controls['TemplateID'].setValue(data[0].id);
    //  this.ViewCustomeForm.controls['TemplateName'].setValue(data[0].TemplateName);
    }
 //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
//this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
});
}

getTempList(TempID: number) {  

const apiUrl=this._global.baseAPIUrl+'CustomForms/GetDetails?ID='+ TempID +'&user_Token='+ localStorage.getItem('User_Token')  
    //const apiUrl=this._global.baseAPIUrl+'CustomForms/GetDetails?user_Token='+this.ViewCustomeForm.get('User_Token').value

//  const apiUrl=this._global.baseAPIUrl+'Template/GetTemplate?user_Token=123123'
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._IndexList = data;
      this._FilteredList = data
      this.prepareTableData( this._IndexList,  this._FilteredList);
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
//console.log(tableData);
// if (this.type=="Checker" )
//{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'TemplateName', header: 'TEMPLATE NAME', index: 3 },
    { field: 'DisplayName', header: 'DISPLAY NAME', index: 2 },
    { field: 'FieldTypeText', header: 'FIELD TYPE TEXT', index: 2 },
    { field: 'MinLenght', header: 'MIN LENGHT', index: 2 },
    { field: 'MaxLenght', header: 'MAX LENGHT', index: 2 },

    // { field: 'Ref3', header: 'Ref3', index: 3 },
    // { field: 'Ref4', header: 'Ref4', index: 3 },
    // { field: 'Ref5', header: 'Ref5', index: 3 },
    // { field: 'Ref6', header: 'Ref6', index: 3 },
//    { field: 'SubfolderName', header: 'SUB FOLDER', index: 3 }
    //,{ field: 'DownloadDate', header: 'DownloadDate', index: 3 },
   // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'TemplateName': el.TemplateName,
      'DisplayName': el.DisplayName,
      'FieldTypeText': el.FieldTypeText,
      'MinLenght': el.MinLenght,
      'MaxLenght': el.MaxLenght, 
       'TemplateID': el.TemplateID,
       'id': el.id,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
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
geTList() {

  //const apiUrl=this._global.baseAPIUrl+'Template/GetTemplate?user_Token='+ this.DataEntryForm.get('User_Token').value;
  const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateList?user_Token='+localStorage.getItem('User_Token')  
  this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
  this._TList = data;
 // this._CloneList = data;
  this.ViewCustomeForm.controls['TemplateIDFrom'].setValue(0);
  });

  }

  geTListPending() {

    const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplatePending?user_Token='+localStorage.getItem('User_Token')  
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
    //this._TemplateList = data;
    this._CloneList = data;
   // this.ViewCustomeForm.controls['TemplateIDFrom'].setValue(0);
    this.ViewCustomeForm.controls['TemplateIDTo'].setValue(0);
    //    console.log("this._TemplateLis", data)
    //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  
    }


addTemplate(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
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

geTemplateNameListByTempID(userid:number) {          

  this.getTempList(userid);      
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
 
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }


  // geBranchList() {
    
  //   const apiUrl=this._global.baseAPIUrl+'CustomForms/GetBranchList?user_Token='+this.ViewCustomeForm.get('User_Token').value
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
  //     this._TemplateList = data;
  //     this._FilteredList = data
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });
  // }

  OnReset() {
    this.Reset = true;
    this.ViewCustomeForm.reset();
    this.modalRef.hide();  
    this.geTList();
    this.geTListPending();
  }
 

  // onSubmit() {
  //   this.submitted = true;
  //   console.log(this.ViewCustomeForm);
  //   if (this.ViewCustomeForm.invalid) {
  //     alert("Please Fill the Fields");
  //     return;
  //   }
  //   const apiUrl = this._global.baseAPIUrl + 'CustomForms/Update';
  //   this._onlineExamService.postData(this.ViewCustomeForm.value,apiUrl).subscribe((data: {}) => {     
  //    console.log(data);
  //    this.toastr.show(
  //     '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">Field Saved</span></div>',
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
  //    this.geBranchList();
  //    this.OnReset()
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });

  //   //this.studentForm.patchValue({File: formData});
  // }

  onSubmit() {
    this.submitted = true;
    //console.log(this.AddTemplateForm);
    // if (this.ViewCustomeForm.invalid) {
    //   alert("Please Fill the Fields");
    //   return;
    // }

    if (this.ViewCustomeForm.get("TemplateIDFrom").value == this.ViewCustomeForm.get("TemplateIDTo").value)
    {
       this.ShowErrormessage("Tempalte ID should not be same.");
       return;
    }

    const apiUrl = this._global.baseAPIUrl + 'Template/CloneTempalte';
    this._onlineExamService.postData(this.ViewCustomeForm.value,apiUrl).subscribe((data: {}) => {     
  //   console.log(data);
    //  this.toastr.show(
    //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">Template Cloned</span></div>',
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
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Template Cloned..!' });
     this.OnReset()
    this.getTemplate();
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    //this.studentForm.patchValue({File: formData});
  }


  deleteTemplate(id: any) {

  //  console.log("ID",id);

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
          this.ViewCustomeForm.patchValue({
            id: id.id
          });
          const apiUrl = this._global.baseAPIUrl + 'CustomForms/Delete';
          this._onlineExamService.postData(this.ViewCustomeForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Field has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.getTempList(this.ViewCustomeForm.get('TemplateID').value);
            });
        }
      });
  }

  RedirectToEdit(car: any)
  {  
    console.log("Car",car);
    localStorage.setItem('_TempID',car.id) ;    
   //this.localStorage.setItem('_TempID') =_TempID;
    //this.router.navigate(['/CustomForm']);
    this.router.navigate(['/master/addfield']);
    //, {queryParams: {_TempID : _TempID}})
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

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }

}
