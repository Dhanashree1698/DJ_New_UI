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
  selector: "app-template",
  templateUrl: "template.component.html",
  styleUrls: ["template.component.css"]
})
export class TemplateComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  AddTemplateForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
  _TemplateList :any; 
  _FilteredList :any; 
  _TempID: any =0;
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
    this.AddTemplateForm = this.formBuilder.group({
    TemplateName: ["", [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-_\s]+$/)]],
    TempCode:['',[Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    User_Token: localStorage.getItem('User_Token') ,
    CreatedBy: localStorage.getItem('UserID') ,
    id:[0]
    });
    this.getTempList();

    // this.Getpagerights();
  }
 
  // Getpagerights() {

  //   var pagename ="Template";
  //   const apiUrl = this._global.baseAPIUrl + 'Admin/Getpagerights?userid=' + localStorage.getItem('UserID')+' &pagename=' + pagename + '&user_Token=' + localStorage.getItem('User_Token');

  //   // const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplate?user_Token=' + this.FileStorageForm.get('User_Token').value
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
  //   //  this.TemplateList = data;    
     
  //   if (data <=0)
  //   {
  //     localStorage.clear();
  //     this.router.navigate(["/Login"]);
  //   }     
  //   });
  // }

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

  get f(){
    return this.AddTemplateForm.controls;
  }   

  getTempList() {

  const apiUrl=this._global.baseAPIUrl+'Template/GetTemplate?user_Token='+this.AddTemplateForm.get('User_Token').value
  this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
  this._TemplateList = data;
  this._FilteredList = data
  this.prepareTableData( this._TemplateList,  this._FilteredList);
  //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  });
  }
  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
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
    { field: 'TemplateName', header: 'TEMPLATE NAME', index: 3 },
     { field: 'TempCode', header: 'TEMP CODE', index: 2 },

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
        'id': el.id,
       'TempCode': el.TempCode,
      // 'Ref4': el.Ref4,
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

  OnReset() {
    this.Reset = true;
    this.AddTemplateForm.reset({User_Token: localStorage.getItem('User_Token')});
    this.modalRef.hide();  
  }

  onSubmit() {
    this.submitted = true;
    //console.log(this.AddTemplateForm);
    if (this.AddTemplateForm.invalid) {
       alert("Please Fill the Fields");
      return;
    }
    const apiUrl = this._global.baseAPIUrl + 'Template/Update';
    this._onlineExamService.postData(this.AddTemplateForm.value,apiUrl).subscribe((data: {}) => {     
     console.log(data);
    //  this.toastr.show(
    //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">Template Saved</span></div>',
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
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Template Saved...!' });
     this.OnReset()
     this.getTempList();
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    //this.studentForm.patchValue({File: formData});
  }
  deleteTemplate(row: any) {
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
            id: row.id
          });
          const apiUrl = this._global.baseAPIUrl + 'Template/Delete';
          this._onlineExamService.postData(this.AddTemplateForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Template has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.getTempList();
            });
        }
      });
  }
  editTemplate(template: TemplateRef<any>, row: any) {
      var that = this;
      that._SingleDepartment = row;
    //  console.log('data', row);
      this.AddTemplateForm.patchValue({
        id: that._SingleDepartment.id,
        TemplateName: that._SingleDepartment.TemplateName,
        TempCode: that._SingleDepartment.TempCode,
      })

    this.modalRef = this.modalService.show(template);
  }
  addTemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onDownloadExcelFile(_filename: string) {
    // _filename = 'Users_Data';
    // Remove the 'id' column before exporting
    const filteredData = this.formattedData.map(({ id, ...rest }) => rest);
    this.exportToExcel(filteredData, _filename);
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
