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
  selector: "app-templateconfig",
  templateUrl: "templateconfig.component.html",
  styleUrls: ["templateconfig.component.css"]
})
export class TemplateconfigComponent implements OnInit {
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

  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.AddTemplateForm = this.formBuilder.group({
      TemplateName: ['', Validators.required],
      Description: [''],
      IsActive: [''],           
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0]
    });
    this.geTempList();
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._TemplateList.filter(function (d) {
      console.log(d);
      for (var key in d) {
        if (key == "TemplateName") {
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

   

  geTempList() {

  const apiUrl=this._global.baseAPIUrl+'Templateconfig/GetTemplate?user_Token='+this.AddTemplateForm.get('User_Token').value
  this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
  this._TemplateList = data;
  this._FilteredList = data
  //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  });
  }

  OnReset() {
    this.Reset = true;
    this.AddTemplateForm.reset({User_Token: localStorage.getItem('User_Token')});
    this.modalRef.hide();  
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.AddTemplateForm);
    if (this.AddTemplateForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    const apiUrl = this._global.baseAPIUrl + 'Templateconfig/Update';
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
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Template Saved' });
     this.OnReset()
     this.geTempList();
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    //this.studentForm.patchValue({File: formData});
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
            id: id
          });
          const apiUrl = this._global.baseAPIUrl + 'Templateconfig/Delete';
          this._onlineExamService.postData(this.AddTemplateForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Template has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.geTempList();
            });
        }
      });
  }
  editTemplate(template: TemplateRef<any>, row: any) {
      var that = this;
      that._SingleDepartment = row;
      console.log('data', row);
      this.AddTemplateForm.patchValue({
        id: that._SingleDepartment.id,
        TemplateName: that._SingleDepartment.TemplateName,
      })
      console.log('form', this.AddTemplateForm);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    this.modalRef = this.modalService.show(template);
  }
  addTemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
