import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { MessageService } from 'primeng/api'; 
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-document-type",
  templateUrl: "document-type.component.html",
  styleUrls: ["document-type.component.css"]
})
export class DocumentTypeComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  DocTypeForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
  _DeptList :any;  
  _FilteredList :any; 
  TemplateList:any;
 
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.DocTypeForm = this.formBuilder.group({
      DocName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-_\s]+$/)]],
      TemplateID: ['', Validators.required],
      DocDesc: ['', Validators.required],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0]
    });
    this.getDoctypeList();
    this.getTemplate();
  }

  get f(){
    return this.DocTypeForm.controls;
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._DeptList.filter(function (d) {
      console.log(d);
      for (var key in d) {
        if (key == "DocName" || key == "DocDesc" ) {
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
  getDoctypeList() {
    
    const apiUrl=this._global.baseAPIUrl+'DocMaster/GetDocList?user_Token='+ localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._DeptList = data;
      this._FilteredList = data
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  OnReset() {
    this.Reset = true;
    this.DocTypeForm.reset({User_Token: localStorage.getItem('User_Token')});
    this.modalRef.hide();  
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.DocTypeForm);
    if (this.DocTypeForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    const apiUrl = this._global.baseAPIUrl + 'DocMaster/Update';
    this._onlineExamService.postData(this.DocTypeForm.value,apiUrl).subscribe((data: {}) => {     
     console.log(data);
    //  this.toastr.show(
    //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">Document type saved</span></div>',
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
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Document type saved' });
     this.getDoctypeList();
     this.OnReset()
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    //this.studentForm.patchValue({File: formData});
  }
  deletedocumenttype(id: any) {
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
          this.DocTypeForm.patchValue({
            id: id
          });
          const apiUrl = this._global.baseAPIUrl + 'DocMaster/Delete';
          this._onlineExamService.postData(this.DocTypeForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Document Type has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.getDoctypeList();
            });
        }
      });
  }
  editdocumenttype(template: TemplateRef<any>, row: any) {
      var that = this;
      that._SingleDepartment = row;
      console.log('data', row);
      this.DocTypeForm.patchValue({
        id: that._SingleDepartment.id,
        DocName: that._SingleDepartment.DocName,
        DocDesc: that._SingleDepartment.DocDesc,
        TemplateID: that._SingleDepartment.TemplateID,
      })
      console.log('form', this.DocTypeForm);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    this.modalRef = this.modalService.show(template);
  }
  adddocumenttype(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getTemplate() {  

    const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token='+localStorage.getItem('User_Token')   
    //const apiUrl=this._global.baseAPIUrl+'Template/GetTemplate?user_Token='+ this.MetaDataForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
    this.TemplateList = data;  
  //  console.log("TemplateList",this.TemplateList);
  //  this.FileTaggingForm.get('User_Token').value  
    this.DocTypeForm.controls['TemplateID'].setValue(0);
 //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
//this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
});
}
}
