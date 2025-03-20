import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { MessageService } from 'primeng/api'; 

import { Router } from "@angular/router";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-entity-mapping",
  templateUrl: "entity-mapping.component.html",
  styleUrls: ["entity-mapping.componenet.css"]
})
export class EntityMappingComponent implements OnInit {
  select_all = false;
  _data: any;
  ordersData = [];
  _UserList: any;
  _UserL: any;
  _List: any;
  entries: number = 10;
  activeRow: any;
  _FilteredList: [];
  _EntityList: any;
  _EntityID: any =0;
  modalRef: BsModalRef;
  EntityMappingForm: FormGroup;
  AddEntityMappingForm: FormGroup;
  submitted = false;
  Reset = false;
  sMsg: string = "";
  _userid: any = 0;
  _DepartmentList:any;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  __checkedList: string = "";
  userEditID: number;
  master_checked: boolean = false;
  master_indeterminate: boolean = false;
  BranchList:any;
  first = 0;
  rows = 10;
  // checkbox_list  = [
  //   { id: 100, BranchName: 'order 1' },
  //   { id: 200, BranchName: 'order 2' },
  //   { id: 300, BranchName: 'order 3' },
  //   { id: 400, BranchName: 'order 4' }
  // ];
  checkbox_list = [];
  itemRows: any;
  get checklistArray() { return this.AddEntityMappingForm.get('checklist') as FormArray; }
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
    this.EntityMappingForm = this.formBuilder.group({
      SubfolderName: ["", Validators.required],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id: [0],
      
      UserIDS: ['', Validators.required],
      UserID: [0, Validators.required],
    });
    this.AddEntityMappingForm = this.formBuilder.group({
      SubfolderName: [""],
      SelectItem: [""],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id: [0],
      UserID: ["", Validators.required],
      checkedList: [""],
      BranchID:[0, Validators.required],
      DeptID:[0, Validators.required],

      checklist: this.formBuilder.array([]),
      selectAll: [false],
    });

    this.Getpagerights();
    // this.geBranchListchecked();
    this.geUserList();
    this.geEntityList(0);
    this.getDepartmentList();
  
    //this.getBranch(0);
  }

  Getpagerights() {

    var pagename ="Sub Folder Mapping";
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
  OnReset() {
    this.Reset = true;
    this.EntityMappingForm.reset({ User_Token:  localStorage.getItem('User_Token') , UserID: 0 , UserIDS:0});
    this.checklistArray.clear();

    this.modalRef.hide();  
    //this.geBranchList();
  }

  getDepartmentList() {
    const apiUrl=this._global.baseAPIUrl+'DepartmentMapping/GetDepartmentByUser?ID='+ localStorage.getItem('UserID')+'&user_Token='+localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._DepartmentList = data;
     // console.log("DepList",data);
    //  this._FilteredList = data
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  GetBranchByDepartment(DepartmentID:any)
  {
//const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl =
    this._global.baseAPIUrl +"BranchMapping/GetBranchByDeptUserWise?ID="+localStorage.getItem('UserID')+"&user_Token="+localStorage.getItem('User_Token')+"&DeptID="+this.AddEntityMappingForm.get("DeptID").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
    this.BranchList = data;
//  this._FilteredList = data;
//this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
});
}

  geEntityList(userid: any) {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl =
      this._global.baseAPIUrl +
      "SubFolderMapping/GetSubFolderDetailsUserWise?ID=" +
      userid +
      "&user_Token=" +
      this.EntityMappingForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this._EntityList = data;
      this._FilteredList = data;
      this.prepareTableData( this._EntityList,  this._FilteredList);
//console.log(this._EntityList);
    //  data
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  geUserList() {
    const apiUrl =
      this._global.baseAPIUrl +
      "Admin/GetList?user_Token=" +
      this.EntityMappingForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._UserL = data;
      this.EntityMappingForm.controls["UserID"].setValue(0);
      this.EntityMappingForm.controls["UserIDS"].setValue(0);
      
      // this.BranchMappingForm.controls['UserIDM'].setValue(0);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }
  
  getEntity(userid: number) {
    const apiUrl =this._global.baseAPIUrl +"SubFolderMapping/GetDetailsByBranch?ID="+userid +"&BranchID="+this.AddEntityMappingForm.get("BranchID").value +"&user_Token="+this.EntityMappingForm.get("User_Token").value;
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    this._onlineExamService.getProducts(apiUrl).subscribe((res) => {
      this.checkbox_list = [];
      this.checkbox_list = res;
      this.checklistArray.clear()
      this.checkbox_list.forEach(item => {
        let fg = this.formBuilder.group({
          id: [item.id],
          SubfolderName: [item.SubfolderName],
          ischecked: [item.ischecked]
          })
          this.checklistArray.push(fg)
      });
    //  console.log('Branch Mapping -> ',res);
      
      // this.itemRows = Array.from(Array(Math.ceil(this.checkbox_list.length/2)).keys())

      //this.productsArray = res;
      //  this.checkbox_list= res;
      //this.checklist =res;
    });
  }

  master_change() {
    //console.log('Checked All');
    
    // this.checklistArray.controls.forEach(control => {
    //   control.patchValue({ischecked: true});
    // });
    let _bool =this.AddEntityMappingForm.controls['selectAll'].value;
    this.checklistArray.controls.forEach(role => {
      role.patchValue({ischecked: _bool})
    });
  }

  filterTable($event) {
    let val = $event.target.value;
    this._FilteredList = this._EntityList.filter(function (d) {
      for (var key in d) {
        if (key == "UserName" || key == "SubfolderName") {
          if (d[key].toLowerCase().indexOf(val) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }
  addEntityMapping(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);  
    this.getEntityForUser(0);
    this.EntityMappingForm.controls["UserID"].setValue(0);
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


  onSubmit() {
    this.submitted = true;

    if (this.AddEntityMappingForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    this.__checkedList ="";
   // console.log('Checklist Array=> ',this.checklistArray.value);
   var _chkstatus =false;
    for (let value of this.checklistArray.value) {
      if (value.ischecked)
      {
        this.__checkedList +=value.id + "#";
        _chkstatus = true;
      }
    }
   // console.log("_chkstatus" , _chkstatus);

    if (_chkstatus == false )
    {
      console.log("_chkstatus" , _chkstatus);    
      alert("Please select at lease one Sub Folder");
      return;
    }
//console.log("UserID", this.AddBranchMappingForm.get('UserID').value);
    this.AddEntityMappingForm.patchValue({
      checkedList: this.__checkedList,
      CreatedBy: 1,
      UserID: this.AddEntityMappingForm.get('UserID').value,
    });
    var objectToSend = {
      id: 0,
      User_Token: this.AddEntityMappingForm.get('User_Token').value,
      UserID: this.AddEntityMappingForm.get('UserID').value,
      checkedList: this.AddEntityMappingForm.get('checkedList').value,
      CreatedBy: this.AddEntityMappingForm.get('CreatedBy').value
    }
  //  console.log('Submitting Form',objectToSend);
    
    const apiUrl = this._global.baseAPIUrl + "SubFolderMapping/Create";
    this._onlineExamService
      .postData(this.AddEntityMappingForm.value, apiUrl)
      // .pipe(first())

      .subscribe((data) => {
        // this.toastr.show(
        //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">Sub Folder Mapping Done</span></div>',
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
        this.messageService.add({ severity: 'success', summary: '', detail: 'Sub Folder Mapping Done' });
        this.OnReset();
        this.EntityMappingForm.controls["UserID"].setValue(0);
      });

    //  }
  }

  list_change() {
    //alert("Hi");

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
  geEntityListByUserID(userid: number) {
    //     alert(this.BranchMappingForm.value.UserID);
    this.geEntityList(userid);
  }
  getEntityForUser(userid: number) {
    this.getEntity(userid)


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

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  onActivate(event) {
    this.activeRow = event.row;
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
      { field: 'UserName', header: 'USER NAME', index: 3 },
      { field: 'DepartmentName', header: 'CABINET', index: 2 },
      { field: 'BranchName', header: 'FOLDER', index: 2 },
      { field: 'SubfolderName', header: 'SUB FOLDER', index:3},
    
  
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
        'UserName': el.UserName,
        'SubfolderName': el.SubfolderName,
        'BranchName': el.BranchName,
          'id': el.id,
          'DepartmentName': el.DepartmentName,
        // 'Ref3': el.Ref3,
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
  
  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }
  editEntityMapping(template: TemplateRef<any>, userid: number) {
    this.addEntityMapping(template)
    this.checklistArray.clear()
    this.AddEntityMappingForm.patchValue({UserID: userid})
    this.geEntityList(userid)
  }
  deleteEntity(EntityID: number) {
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
          this.EntityMappingForm.patchValue({
            id: EntityID,
          });
          const apiUrl = this._global.baseAPIUrl + "SubFolderMapping/Delete";
          this._onlineExamService
            .postData(this.EntityMappingForm.value, apiUrl)
            .subscribe((data) => {
              swal.fire({
                title: "Deleted!",
                text: "Sub Folder Mapping has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.geEntityList(this.EntityMappingForm.get("UserIDS").value);
              
            });
        }
      });


  }

}
