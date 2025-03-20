import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { Router } from "@angular/router";
import { MessageService } from 'primeng/api'; 
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-doctype-mapping",
  templateUrl: "doctype-mapping.component.html",
  styleUrls: ["doctype-mapping.component.css"]
})
export class DocTypeMappingComponent implements OnInit {
  select_all = false;
  _data: any;
  ordersData = [];
  _UserList: any;
  _UserL: any;
  entries: number = 10;
  activeRow: any;
  _List: any;
  _FilteredList: [];
  modalRef: BsModalRef;
  DocTypeMappingForm: FormGroup;
  AddDocTypeMappingForm: FormGroup;
  submitted = false;
  Reset = false;
  sMsg: string = "";
  _userid: any = 0;
  _DocList: any;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  __checkedList: string = "";
  userEditID: number;
  master_checked: boolean = false;
  master_indeterminate: boolean = false;
  TemplateList:any;
  // checkbox_list  = [
  //   { id: 100, BranchName: 'order 1' },
  //   { id: 200, BranchName: 'order 2' },
  //   { id: 300, BranchName: 'order 3' },
  //   { id: 400, BranchName: 'order 4' }
  // ];
  checkbox_list = [];
  itemRows: any;
  get checklistArray() { return this.AddDocTypeMappingForm.get('checklist') as FormArray; }
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.DocTypeMappingForm = this.formBuilder.group({
      BranchName: ["", Validators.required],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id: [0],
     
      UserIDS: ['', Validators.required],
      UserID: [0, Validators.required],
    });
    this.AddDocTypeMappingForm = this.formBuilder.group({
      BranchName: [""],
      SelectItem: [""],     
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id: [0],
      UserID: ["", Validators.required],
      checkedList: [""],     
      checklist: this.formBuilder.array([]),
      selectAll: [false],
      TemplateID: [0, Validators.required],
          
    });

    // this.geBranchListchecked();
    this.geUserList();
    this.getDoctypeList(0);
    this.getTemplate();
  
    //this.getBranch(0);
  }
  OnReset() {
    this.Reset = true;
    this.DocTypeMappingForm.reset({ User_Token: localStorage.getItem('User_Token'), UserID: 0 , UserIDS:0});
    this.checklistArray.clear();

    this.modalRef.hide();  
    //this.geBranchList();
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  getDoctypeList(userid: any) {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl =
      this._global.baseAPIUrl + "DocTypeMapping/GetDocTypeDetailsUserWise?ID=" + userid +"&user_Token=" + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this._DocList = data;
      this._FilteredList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }
  geUserList() {
    const apiUrl =
      this._global.baseAPIUrl +
      "Admin/GetList?user_Token=" +
      localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._UserL = data;
      this.DocTypeMappingForm.controls["UserID"].setValue(0);
      this.DocTypeMappingForm.controls["UserIDS"].setValue(0);
      
      // this.BranchMappingForm.controls['UserIDM'].setValue(0);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  geTemplateNameListByTempID(tempID:any)
  {
this.getDocListByTempID(0,tempID);
  }

  getDocListByTempID(userid: number,tempID: number) {
    const apiUrl =
      this._global.baseAPIUrl +"DocTypeMapping/GetDetails?ID=" + userid + "&TemplateID=" + tempID  + "&user_Token="+ localStorage.getItem('User_Token');
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    this._onlineExamService.getProducts(apiUrl).subscribe((res) => {
      this.checkbox_list = [];
      this.checkbox_list = res;
      this.checklistArray.clear()
      this.checkbox_list.forEach(item => {
        let fg = this.formBuilder.group({
          id: [item.id],
          DocName: [item.DocName],
          DocDesc: [item.DocDesc],
          ischecked: [item.ischecked]
          })
          this.checklistArray.push(fg)
      });
    //  console.log('Document Type Mapping -> ',res);
      
      // this.itemRows = Array.from(Array(Math.ceil(this.checkbox_list.length/2)).keys())

      //this.productsArray = res;
      //  this.checkbox_list= res;
      //this.checklist =res;
    });
  }

  getDocList(userid: number) {
    const apiUrl =
      this._global.baseAPIUrl +"DocTypeMapping/GetDetails?ID=" + userid + "&TemplateID=" + this.AddDocTypeMappingForm.get("TemplateID").value  + "&user_Token="+ localStorage.getItem('User_Token');
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    this._onlineExamService.getProducts(apiUrl).subscribe((res) => {
      this.checkbox_list = [];
      this.checkbox_list = res;
      this.checklistArray.clear()
      this.checkbox_list.forEach(item => {
        let fg = this.formBuilder.group({
          id: [item.id],
          DocName: [item.DocName],
          DocDesc: [item.DocDesc],
          ischecked: [item.ischecked]
          })
          this.checklistArray.push(fg)
      });
    //  console.log('Document Type Mapping -> ',res);
      
      // this.itemRows = Array.from(Array(Math.ceil(this.checkbox_list.length/2)).keys())

      //this.productsArray = res;
      //  this.checkbox_list= res;
      //this.checklist =res;
    });
  }

  master_change() {
  //  console.log('Checked All');
    
    // this.checklistArray.controls.forEach(control => {
    //   control.patchValue({ischecked: true});
    // });
    let _bool =this.AddDocTypeMappingForm.controls['selectAll'].value;
    this.checklistArray.controls.forEach(role => {
      role.patchValue({ischecked: _bool})
    });
  }
  deleteDocType(DocID: number) {
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
          this.DocTypeMappingForm.patchValue({
            id: DocID,
          });
          const apiUrl = this._global.baseAPIUrl + "DocTypeMapping/Delete";
          this._onlineExamService
            .postData(this.DocTypeMappingForm.value, apiUrl)
            .subscribe((data) => {
              swal.fire({
                title: "Deleted!",
                text: "Document Type Mapping has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.getDoctypeList(this.DocTypeMappingForm.get("UserIDS").value);
              
            });
        }
      });


  }
  filterTable($event) {
    let val = $event.target.value;
    this._FilteredList = this._DocList.filter(function (d) {
      for (var key in d) {
        if (key == "UserName" || key == "DocName") {
          if (d[key].toLowerCase().indexOf(val) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }
  adddoctypeMapping(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);  
    this.getDocList(0);
    this.DocTypeMappingForm.controls["UserID"].setValue(0);
  }
  onSubmit() {
    this.submitted = true;
    this.__checkedList ="";

    if (this.AddDocTypeMappingForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    var _chkstatus = false;
   // console.log('Checklist Array=> ',this.checklistArray.value);
    for (let value of this.checklistArray.value) {
      if (value.ischecked)
      {
        this.__checkedList +=value.id + "#";
        _chkstatus =true;
      }
    }

    if (_chkstatus == false )
    {
      console.log("_chkstatus" , _chkstatus);    
      alert("Please select at lease one Department");
      return;
    }


  //  console.log(this.__checkedList);
    this.AddDocTypeMappingForm.patchValue({
      checkedList: this.__checkedList,
      CreatedBy: 1,
    });
    var objectToSend = {
      id: 0,
      User_Token: this.AddDocTypeMappingForm.get('User_Token').value,
      UserID: this.AddDocTypeMappingForm.get('UserID').value,
      checkedList: this.AddDocTypeMappingForm.get('checkedList').value,
      CreatedBy: this.AddDocTypeMappingForm.get('CreatedBy').value
    }
  //  console.log('Submitting Form',objectToSend);
    
    const apiUrl = this._global.baseAPIUrl + "DocTypeMapping/Create";
    this._onlineExamService
      .postData(this.AddDocTypeMappingForm.value, apiUrl)
      // .pipe(first())

      .subscribe((data) => {
        // this.toastr.show(
        //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">Document Type Mapping Done</span></div>',
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
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Document Type Mapping Done' });
        this.OnReset();
        this.getDocList(0);
        this.DocTypeMappingForm.controls["UserID"].setValue(0);        
      });

    //  }
  }

  list_change() {
    alert("Hi");

    let checked_count = 0;
    //Get total checked items
    for (let value of Object.values(this.checkbox_list)) {
      if (value.ischecked) checked_count++;
    }

    if (checked_count > 0 && checked_count < this.checkbox_list.length) {
      // If some checkboxes are checked but not all; then set Indeterminate state of the master to true.
      this.master_indeterminate = true;
    } else if (checked_count == this.checkbox_list.length) {
      //If checked count is equal to total items; then check the master checkbox and also set Indeterminate state to false.
      this.master_indeterminate = false;
      this.master_checked = true;
    } else {
      //If none of the checkboxes in the list is checked then uncheck master also set Indeterminate to false.
      this.master_indeterminate = false;
      this.master_checked = false;
    }
  }
  getDocTypeListByUserID(userid: number) {
    //     alert(this.BranchMappingForm.value.UserID);
    this.getDoctypeList(userid);
  }
 
  editdoctypeMapping(template: TemplateRef<any>, userid: number) {
    this.adddoctypeMapping(template)
    this.checklistArray.clear()
    this.AddDocTypeMappingForm.patchValue({UserID: userid})
    this.getDocList(userid)
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i].isSelected)
        this.checkedList.push(this.checklist[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

   getTemplate() {  

    const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token='+localStorage.getItem('User_Token')   
    //const apiUrl=this._global.baseAPIUrl+'Template/GetTemplate?user_Token='+ this.MetaDataForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
    this.TemplateList = data;  
  //  console.log("TemplateList",this.TemplateList);
  //  this.FileTaggingForm.get('User_Token').value  
    this.DocTypeMappingForm.controls['TemplateID'].setValue(0);
 //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
//this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
});
}
}
