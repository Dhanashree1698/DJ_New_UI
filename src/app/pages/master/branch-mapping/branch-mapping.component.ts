import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
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
  selector: "app-branch-mapping",
  templateUrl: "branch-mapping.component.html",
  styleUrls: ["branch-mapping.componenet.css"]
})
export class BranchMappingComponent implements OnInit {
  select_all = false;
  _data: any;
  ordersData = [];
  _UserList: any;
  _UserL: any;
  _List: any;
  entries: number = 10;
  activeRow: any;
  _FilteredList: [];
  _BranchList: any;
  _BranchID: any =0;
  modalRef: BsModalRef;
  BranchMappingForm: FormGroup;
  AddBranchMappingForm: FormGroup;
  submitted = false;
  Reset = false;
  sMsg: string = "";
  _userid: any = 0;
  first = 0;
  rows = 10;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  __checkedList: string = "";
  _DepartmentList:any;
  userEditID: number;
  master_checked: boolean = false;
  master_indeterminate: boolean = false;
  // checkbox_list  = [
  //   { id: 100, BranchName: 'order 1' },
  //   { id: 200, BranchName: 'order 2' },
  //   { id: 300, BranchName: 'order 3' },
  //   { id: 400, BranchName: 'order 4' }
  // ];
  checkbox_list = [];
  itemRows: any;
  get checklistArray() { return this.AddBranchMappingForm.get('checklist') as FormArray; }
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.BranchMappingForm = this.formBuilder.group({
      BranchName: ["", Validators.required],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id: [0],
      UserIDS: [0, Validators.required],
      UserID: [0, Validators.required],
    });
    this.AddBranchMappingForm = this.formBuilder.group({
      BranchName: [""],
      SelectItem: [""],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id: [0],
      UserID: [0, Validators.required],
      checkedList: [""],
      DeptID: [0],
      checklist: this.formBuilder.array([]),
      selectAll: [false],
    });

    // this.geBranchListchecked();
    this.geUserList();
    this.getDepartmentList();
    this.geBranchList(0);
  //this.Getpagerights();
    //this.getBranch(0);
  }

  Getpagerights() {

    var pagename ="Folder Mapping";
    const apiUrl = this._global.baseAPIUrl + 'Admin/Getpagerights?userid=' + localStorage.getItem('UserID')+' &pagename=' + pagename + '&user_Token=' + localStorage.getItem('User_Token');

    // const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplate?user_Token=' + this.FileStorageForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
    //  this.TemplateList = data;    
     
    // if (data <=0)
    // {
    //   localStorage.clear();
    //   this.router.navigate(["/Login"]);
    // }     
    });
  }

  OnReset() {
    this.Reset = true;
    this.BranchMappingForm.reset({ User_Token:  localStorage.getItem('User_Token') , UserID: 0 , UserIDS:0});
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
  //GetBranchByDepartment


  GetBranchByDepartment(DepartmentID:any)
  {
//const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl =
    this._global.baseAPIUrl +"BranchMapping/GetBranchByDeptUserWise?ID="+this.AddBranchMappingForm.get("UserID").value+"&user_Token="+localStorage.getItem('User_Token')+"&DeptID="+this.AddBranchMappingForm.get("DeptID").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
    //this.BranchList = data;

    console.log("Chk",data);
    this.checkbox_list = [];
    this.checkbox_list = data;
    this.checklistArray.clear()
    this.checkbox_list.forEach(item => {
      let fg = this.formBuilder.group({
        id: [item.id],
        BranchName: [item.BranchName],
        ischecked: [item.ischecked]
        })
        this.checklistArray.push(fg)
    });

//  this._FilteredList = data;
//this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
});
}

  geBranchList(userid: any) {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl =
      this._global.baseAPIUrl +"BranchMapping/GetBranchDetailsUserWise?ID="+
      userid +
      "&user_Token=" +
      this.BranchMappingForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {

      //console.log("data123",data);

      this._BranchList = data;
      this._FilteredList = data;

      this.prepareTableData( this._BranchList,  this._FilteredList);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  geUserList() {
    const apiUrl =
      this._global.baseAPIUrl +
      "Admin/GetList?user_Token=" +
      this.BranchMappingForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._UserL = data;
      this.BranchMappingForm.controls["UserID"].setValue(0);
      this.BranchMappingForm.controls["UserIDS"].setValue(0);
      
      // this.BranchMappingForm.controls['UserIDM'].setValue(0);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }
  
  getBranch(userid: number) {
    const apiUrl =this._global.baseAPIUrl +"BranchMapping/GetDetails?ID=" +userid+"&user_Token="+this.BranchMappingForm.get("User_Token").value;;
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    this._onlineExamService.getProducts(apiUrl).subscribe((res) => {
      this.checkbox_list = [];
      this.checkbox_list = res;
      this.checklistArray.clear()
      this.checkbox_list.forEach(item => {
        let fg = this.formBuilder.group({
          id: [item.id],
          BranchName: [item.BranchName],
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
    let _bool =this.AddBranchMappingForm.controls['selectAll'].value;
    this.checklistArray.controls.forEach(role => {
      role.patchValue({ischecked: _bool})
    });
  }
  
  filterTable($event) {
    let val = $event.target.value;
    this._FilteredList = this._BranchList.filter(function (d) {
      for (var key in d) {
        if (key == "UserName" || key == "BranchName") {
          if (d[key].toLowerCase().indexOf(val) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }
  addBranchMapping(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);  
    this.getBranchForUser(0);
    this.AddBranchMappingForm.controls["DeptID"].setValue(0);
    this.AddBranchMappingForm.controls["UserID"].setValue(0);
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

    if (this.AddBranchMappingForm.invalid) {
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
  //    console.log("_chkstatus" , _chkstatus);    
      alert("Please select at lease one branch");
      return;
    }
//console.log("UserID", this.AddBranchMappingForm.get('UserID').value);
    this.AddBranchMappingForm.patchValue({
      checkedList: this.__checkedList,
      CreatedBy: this.AddBranchMappingForm.get('UserID').value,
      UserID: this.AddBranchMappingForm.get('UserID').value,
    });
    var objectToSend = {
      id: 0,
      User_Token: this.AddBranchMappingForm.get('User_Token').value,
      UserID: this.AddBranchMappingForm.get('UserID').value,
      checkedList: this.AddBranchMappingForm.get('checkedList').value,
      CreatedBy: this.AddBranchMappingForm.get('CreatedBy').value
    }
  //  console.log('Submitting Form',objectToSend);
    
    const apiUrl = this._global.baseAPIUrl + "BranchMapping/Create";
    this._onlineExamService
      .postData(this.AddBranchMappingForm.value, apiUrl)
      // .pipe(first())

      .subscribe((data) => {
        // this.toastr.show(
        //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message">Branch Mapping Done</span></div>',
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
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Branch Mapping Done' });
        this.OnReset();
        this.BranchMappingForm.controls["UserID"].setValue(0);
        this.geBranchList(0);
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
  geBranchListByUserID(userid: number) {
    //     alert(this.BranchMappingForm.value.UserID);
    this.geBranchList(userid);
  }
  getBranchForUser(userid: number) {
    this.getBranch(userid)


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
  
   //console.log("LL",tableData);
  // if (this.type=="Checker" )
  //{
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'UserName', header: 'USER NAME', index: 3 },
      { field: 'DepartmentName', header: 'CABINET', index: 2 },
      { field: 'BranchName', header: 'FOLDER', index: 2 },
    
  
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
         'BranchName': el.BranchName,
         'DepartmentName': el.DepartmentName,
         'id': el.id,
         'UserID': el.UserID,
         'DeptID': el.DeptID,
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

  deleteBranch(car: any) {
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
          this.BranchMappingForm.patchValue({
            id: car.id,
          });
          const apiUrl = this._global.baseAPIUrl + "BranchMapping/Delete";
          this._onlineExamService
            .postData(this.BranchMappingForm.value, apiUrl)
            .subscribe((data) => {
              swal.fire({
                title: "Deleted!",
                text: "Folder Mapping has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.geBranchList(this.BranchMappingForm.get("UserIDS").value);
              
            });
        }
      });

  }

  editBranchMapping(template: TemplateRef<any>, row:any) {

      
    this.addBranchMapping(template)
    this.checklistArray.clear()
  //  this.AddBranchMappingForm.patchValue({UserID: row.userid})
    this.AddBranchMappingForm.controls["DeptID"].setValue(row.DeptID);
    this.AddBranchMappingForm.controls["UserID"].setValue(row.UserID);
    this.GetBranchByDepartment(row.DeptID);
    this.getBranch(row.userid)

  }

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }


}
