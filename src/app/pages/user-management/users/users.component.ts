import { Globalconstants } from "./../../../Helper/globalconstants";
import { OnlineExamServiceService } from "./../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api'; 
import swal from "sweetalert2";
import * as XLSX from 'xlsx';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-users",
  templateUrl: "users.component.html",
  styleUrls: ["users.component.css"]
})
export class UsersComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  _CSVData:any;
  UserList: any;
  _UserList: any;
  _UserL: any;
  _FilteredList: any;
  _FilteredListFolder:any;
  _RoleList: any;
  _ClientList: any;
  AddUserForm: FormGroup;
  UploadCSVForm: FormGroup;
  AddpasswordReset:FormGroup
  _EntityList: any;
  submitted = false;
  Reset = false;
  forusercheking = false;
  showAlert = false;
  //_UserList: any;
  sMsg: string = "";
  //RoleList: any;
  _SingleUser: any = [];
  _UserID: any;
  User: any;
  first = 0;
  rows = 10;
  firstFolder=0;
  rowsFolder=10;
  records:any;
  _ColNameList:any;
// Boolean to control the visibility of the password
isPasswordVisible: boolean = false;
isConfirmPasswordVisible: boolean= false;
isNewPasswordVisible: boolean = false;
isConfirmNewPasswordVisible: boolean = false;
togglePasswordVisibility() {
  this.isPasswordVisible = !this.isPasswordVisible; 
}
toggleConfirmPasswordVisibility() {
  this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible; 
}
toggleNewPasswordVisibility() {
  this.isNewPasswordVisible = !this.isNewPasswordVisible; 
}

toggleConfirmNewPasswordVisibility() {
  this.isConfirmNewPasswordVisible = !this.isConfirmNewPasswordVisible; 
}
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,

    private messageService: MessageService
  ) { }
  ngOnInit() {
    this.AddUserForm = this.formBuilder.group({
      id: [""],
      // name: new FormControl('', [Validators.required , Validators.pattern('^[a-zA-Z ]*$')]),
      name: ["", [
        Validators.required,
        // this.removeSpaces,
        Validators.pattern(/^[a-zA-Z\-\s]+$/),
        // this.utility.isValidNameField,
      ]],
      userid: ["", Validators.required],
      // UserIDS: ['', Validators.required],
      // UserID: ['', Validators.required],
      pwd: ["", [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/)]],
      confirmPass: ["", Validators.required],
      //Cpwd: ['', Validators.required],
      email: ["", [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ]],
      mobile: ["", Validators.required],
      sysRoleID: ["", Validators.required],
      ClientID: ["", Validators.required],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('userid')
    }, {
      validator: this.ConfirmedValidator('pwd', 'confirmPass')
    });
     this.AddpasswordReset = this.formBuilder.group({
      Users: ["", Validators.required],
      Rpwd: ['',[Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/)]],
      RconfirmPass: ["", Validators.required],   
       User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('userid') 
     }, {
      validator: this.ConfirmedValidator('Rpwd', 'RconfirmPass')
    }); 

    this.GetClientList();
    this.Getpagerights();
    this.geRoleList();
    this.geUserList();
    this.User = "Create User";

  }
  
  geEntityListByUserID(userid: number) {
    debugger;
    this.AddpasswordReset.get('id').setValue(userid);
  }

  ResetPwd(){
    debugger
    this.submitted = true;

    if (this.AddpasswordReset.invalid) {
      return;
    }
    if (this.AddpasswordReset.value.User_Token == null) {
      this.AddpasswordReset.value.User_Token = localStorage.getItem('User_Token');
    }
    if (this.AddpasswordReset.value.id !== "" && this.AddpasswordReset.value.id !== 0) {
      const apiUrl = this._global.baseAPIUrl + "Admin/ResetPassword";
      this._onlineExamService
        .postData(this.AddpasswordReset.value, apiUrl)
        // .pipe(first())
        .subscribe((data) => {
          if (data != null) {
            debugger;
            this.ShowMessage(data);
            // alert("Record Updated Succesfully..");
            this.modalService.hide(1);
            this.OnReset();
            //this.router.navigate(['/student']);
            this.geUserList();
          } else {
            // Open Modal like you have opned in other pages
            //alert("User already exists.");
          }
        });
    } else if(this.AddpasswordReset.value.Rpwd === "" || this.AddpasswordReset.value.RconfirmPass === ""){
      this.ShowErrormessage("Enter Password.")
    }
    else{
      this.ShowErrormessage("Select User.")
    }
  }

  Getpagerights() {

    var pagename = "Add User";
    const apiUrl = this._global.baseAPIUrl + 'Admin/Getpagerights?userid=' + localStorage.getItem('userid') + ' &pagename=' + pagename + '&user_Token=' + localStorage.getItem('User_Token');

    // const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplate?user_Token=' + this.FileStorageForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data) => {
      //  this.TemplateList = data;    

      if (data <= 0) {
        localStorage.clear();
        this.router.navigate(["/Login"]);

      }

    });
  }

  //Newly added code 
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  get f() {
    return this.AddUserForm.controls;
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

  geRoleList() {
    const userToken = this.AddUserForm.get('User_Token').value || localStorage.getItem('User_Token');
    const apiUrl = this._global.baseAPIUrl + "Role/GetList?user_Token=" + userToken;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())ser
    });
  }

  GetClientList() {
   debugger;
    const apiUrl=this._global.baseAPIUrl+'ClientMaster/GetClientMasterRecords?user_Token='+ localStorage.getItem('User_Token')+'&userid='+ localStorage.getItem('UserID') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {     
    this._ClientList = data;
    console.log("clid",data)
    });
    }

    onClientChange(event: Event){
      debugger;
      console.log(event);
      const selectedClient = Number((event.target as HTMLSelectElement).value);
      const selectedClientData = this._ClientList.find(client => client.id === selectedClient);
      
      if (selectedClientData) {
        const noOfUsers = selectedClientData.NoOfUsers;
        const existingUser = selectedClientData.ExistingUser;
    
        if (noOfUsers === existingUser) {
            this.ShowErrormessage("User creation limit exceeded.");
            this.forusercheking = true;
            this.showAlert = true;
            setTimeout(() => {
              this.showAlert = false; 
            }, 7000);
        } else {
          this.forusercheking = false;
        }
    } else {
        console.log("No matching client found for the selected ID");
    }
      
    }

  geUserList() {
    debugger;
    const userToken = this.AddUserForm.get('User_Token').value || localStorage.getItem('User_Token');
    const apiUrl = this._global.baseAPIUrl + "Admin/GetList?user_Token=" + userToken;
    this._onlineExamService.getAllData(apiUrl).subscribe((data:any) => {
      debugger;
      this.UserList = data;
      this._UserL = data;
//      console.log("UserL",this._UserL)
  //    console.log("FormData",this.AddUserForm);
      // this.AddUserForm.controls["UserID"].setValue(0);
      // this.AddUserForm.controls["UserIDS"].setValue(0);
      this._FilteredList = data;
      this.prepareTableData(this.UserList, this._FilteredList);
      
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }
 
  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }
 
  paginateFolder(e) {
    this.firstFolder = e.first;
    this.rowsFolder = e.rows;
  }

  

  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
    // alert(this.type);
    console.log('tbldata',tableData);

    // if (this.type=="Checker" )
    //{
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'name', header: 'USER NAME', index: 3 },
      { field: 'userid', header: 'USER ID', index: 2 },

      { field: 'email', header: 'EMAIL', index: 3 },
      { field: 'mobile', header: 'MOBILE', index: 3 },
      { field: 'roleName', header: 'ROLE', index: 3 },
      { field: 'CreatedAt', header: 'CREATED DATE', index: 3 },
      { field: 'PasswodExpiryDate', header: 'PASSWORD EXPIRY DATE', index: 3 }
      //   ,{ field: 'FolderDetails', header: 'FOLDER DETAILS', index: 3 },
      //  { field: 'LoginHistory', header: 'LOGIN HISTORY', index: 7 }

    ];

    
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'name': el.name,
        'id': el.id,
        'userid': el.userid,
        'email': el.email,
        'mobile': el.mobile,
        'roleName': el.roleName,
        'CreatedAt': el.CreatedAt,
        'PasswodExpiryDate': el.PasswodExpiryDate,
        // 'isActive': el.isActive == 1 ? 'Active' : 'In-Active',
        'ClientID': el.ClientID,
        'status':el.status,
        'ClientName': el.ClientName   //changes added by dhanashree for edit user
      });

    });
    this.headerList = tableHeader;
    //}
console.log(formattedData)
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;

  }


  prepareTableDataLogHistory(tableData, headerList) {
    let formattedData = [];
    // alert(this.type);

    // if (this.type=="Checker" )
    //{
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'UserName', header: "User Name", index: 2 },
      { field: 'EMPCode', header: 'EMP CODE', index: 3 },
      { field: 'ActivityName', header: 'ACTIVITY NAME', index: 4 },
      { field: 'EntryDate', header: 'ENTRY DATE', index: 5 },
      //   ,{ field: 'FolderDetails', header: 'FOLDER DETAILS', index: 3 },
      //  { field: 'LoginHistory', header: 'LOGIN HISTORY', index: 7 }

    ];

    
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'UserName': el.UserName,
        'EMPCode': el.EMPCode,
        'ActivityName': el.ActivityName,
        'EntryDate': el.EntryDate,
      });

    });
    this.headerList = tableHeader;
    //}

    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;

  }


  headerListFolder:any;
  formattedDataFolder: any = [];
  prepareTableDataFolderAccess(tableData, headerList) {
    let formattedDataFolder = [];
    // alert(this.type);

    // if (this.type=="Checker" )
    //{
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'UserName', header: "User Name", index: 2 },
      { field: 'Cabinet', header: 'CABINET', index: 3 },
      { field: 'Folder', header: 'FOLDER', index: 4 },
      { field: 'SubFolder', header: 'SUBFOLDER', index: 5 },
      //   ,{ field: 'FolderDetails', header: 'FOLDER DETAILS', index: 3 },
      //  { field: 'LoginHistory', header: 'LOGIN HISTORY', index: 7 }

    ];

    
    tableData.forEach((el, index) => {
      formattedDataFolder.push({
        'srNo': parseInt(index + 1),
        'UserName': el.UserName,
        'Cabinet': el.Cabinet,
        'Folder': el.Folder,
        'SubFolder': el.SubFolder,
      });

    });
    this.headerListFolder = tableHeader;
    //}

    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedDataFolder));
    this.formattedDataFolder = formattedDataFolder;
    this.loading = false;

  }


  searchTable($event) {
    // console.log($event.target.value);

    let val = $event.target.value;
    if (val == '') {
      this.formattedData = this.immutableFormattedData;
    } else {
      let filteredArr = [];
      const strArr = val.split(',');
      this.formattedData = this.immutableFormattedData.filter(function (d) {
        for (var key in d) {
          strArr.forEach(el => {
            if (d[key] && el !== '' && (d[key] + '').toLowerCase().indexOf(el.toLowerCase()) !== -1) {
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
    debugger
    this.Reset = true;
    this.AddUserForm.reset();
    this.User = "Create User";
  }

  OnClose() {
    this.modalService.hide(1);
  }

  BulkUpload()
  {

  }

  onSubmit() {
    debugger;
    this.submitted = true;

    //alert('hi');

    if (this.AddUserForm.value.sysRoleID <= 0) {
      this.ShowErrormessage("Select Role Name");
      return;
    }

    if (this.AddUserForm.value.ClientID <= 0) {
      this.ShowErrormessage("Select Client Name");
      return;
    }

    if (this.AddUserForm.value.userid.trim() == "") {
      this.ShowErrormessage("Please enter user ID");
      return;
    }
    if (this.AddUserForm.value.name.trim() == "") {
      this.ShowErrormessage("Please enter user");
      return;
    }

    if (this.AddUserForm.value.User_Token == null) {
      this.AddUserForm.value.User_Token = localStorage.getItem('User_Token');
    }
    console.log("Final Payload:", this.AddUserForm.value); 

    if (this.AddUserForm.get('id').value) {
    
      const apiUrl = this._global.baseAPIUrl + "Admin/Update";
      this._onlineExamService
        .postData(this.AddUserForm.value, apiUrl)
        .subscribe((data) => {
          if (data != null) {

            this.ShowMessage("Record Updated Successfully..");
            this.modalService.hide(1);
            this.OnReset();
            this.geUserList();
          } else {
          }
        });
    } else {
      debugger
      const apiUrl = this._global.baseAPIUrl + "Admin/Create";
      console.log("thiis the console",this.AddUserForm.value)
      this._onlineExamService.postData(this.AddUserForm.value, apiUrl).subscribe((data) => {
        debugger;
        console.log("API Response:", data); 
  
        if (data == 1) {
          this.ShowMessage("Record Saved Successfully..");
          this.OnReset();
          this.geUserList();
          this.modalService.hide(1);
        } else {
          this.ShowErrormessage("User already exists.");
        }
      });
    }
    //this.studentForm.patchValue({File: formData});
  }

  editEmployee(template: TemplateRef<any>, value: any) {
debugger
    this.User = "Edit user details";
    const apiUrl =
      this._global.baseAPIUrl +
      "Admin/GetDetails?id=" +
      value.id + "&user_Token=" + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      var that = this;
      that._SingleUser = data;
    //  console.log('data', data);
      this.AddUserForm.patchValue({
        id: that._SingleUser.id,
        name: that._SingleUser.name,
        userid: that._SingleUser.userid,
        pwd: that._SingleUser.pwd,
        confirmPass: that._SingleUser.pwd,
        email: that._SingleUser.email,
        mobile: that._SingleUser.mobile,
        sysRoleID: that._SingleUser.sysRoleID,
        ClientID: that._SingleUser.ClientID,
        ClientName: that._SingleUser.ClientName,
        Remarks: that._SingleUser.remarks
      })
      //  console.log('form', this.AddUserForm);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    this.modalRef = this.modalService.show(template);
  }
  ShowFolderDetails(template: TemplateRef<any>, value: any){
    debugger;
    this.modalRef = this.modalService.show(template,{ class: 'modal-lg custom-modal-width' });
//const apiUrl = this._global.baseAPIUrl + 'Admin/Getpagerights?userid=' + localStorage.getItem('UserID')+' &pagename=' + pagename + '&user_Token=' + localStorage.getItem('User_Token');

//alert('Hi');

    const apiUrl = this._global.baseAPIUrl + 'Admin/GetFolderDetails?user_Token='+localStorage.getItem('User_Token')+'&id='+ value.id;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      debugger;
      this._FilteredListFolder = data;
      this.prepareTableDataFolderAccess(this._FilteredListFolder, this._FilteredListFolder);
      
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

  }

  ShowLogHistory(template: TemplateRef<any>, value: any){
    this.modalRef = this.modalService.show(template);
    const userToken = this.AddUserForm.get('User_Token').value || localStorage.getItem('User_Token');
  //  const apiUrl = this._global.baseAPIUrl + "Admin/LoginHistory?user_Token=" + userToken + localStorage.getItem('UserID');
    const apiUrl = this._global.baseAPIUrl + 'Admin/LoginHistory?user_Token=' + localStorage.getItem('User_Token') +'&userid='+ localStorage.getItem('userid');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.UserList = data;
      this._FilteredList = data;
      this.prepareTableDataLogHistory(this.UserList, this._FilteredList);
      
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
    
  }

  deleteEmployee(id: any) {

debugger
    if (id.roleName == "Admin") {
      this.ShowErrormessage("You can not delete admin role account");
      //console.log("DEL User ID",id);
      return;
    }

    if (id != localStorage.getItem('userid')) {
      swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          type: "warning",
          showCancelButton: true,
          buttonsStyling: false,
          confirmButtonClass: "btn dangerbtn",
          confirmButtonText: "Yes, delete it!",
          cancelButtonClass: "btn successbtn",
        })
        .then((result) => {
          if (result.value) {
            this.AddUserForm.patchValue({
              id: id.id,
              User_Token: localStorage.getItem('User_Token'),
            });

            const apiUrl = this._global.baseAPIUrl + "Admin/Delete";
            this._onlineExamService
              .postData(this.AddUserForm.value, apiUrl)
              .subscribe((data) => {
                swal.fire({
                  title: "Deleted!",
                  text: "User has been deleted.",
                  type: "success",
                  buttonsStyling: false,
                  confirmButtonClass: "btn successbtn",
                });
                this.geUserList();
              });
          }
        });
    }
    else {

      this.ShowErrormessage("Your already log in so you can not delete!");
    }
  }
  //---
  addUser(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.AddUserForm.patchValue({
      name: '',
      userid: '',
      pwd: '',
      confirmPass: '',
      email: '',
      mobile: '',
      sysRoleID: 0,
      ClientID: 0,
      Remarks: '',
      id: '',
    })
    this.User = "Create user";
  }

  UserReset(template: TemplateRef<any>) {
    this.geUserList();
    this.AddpasswordReset.reset();
    this.modalRef = this.modalService.show(template);
  }
  //Inactive user Changes by Dhanashree
  InactiveEmployee(id: any) {

debugger
    if (id.roleName == "Admin") {
      this.ShowErrormessage("You can not Inactive admin role account");
      //console.log("DEL User ID",id);
      return;
    }

    if (id != localStorage.getItem('userid')) {
      swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          type: "warning",
          showCancelButton: true,
          buttonsStyling: false,
          confirmButtonClass: "btn dangerbtn",
          confirmButtonText: "Yes, Inactive it!",
          cancelButtonClass: "btn successbtn",
        })
        .then((result) => {
          if (result.value) {
            this.AddUserForm.patchValue({
              id: id.id,
              User_Token: localStorage.getItem('User_Token'),
            });

            const apiUrl = this._global.baseAPIUrl + "Admin/ActiveInactive";
            this._onlineExamService
              .postData(this.AddUserForm.value, apiUrl)
              .subscribe((data) => {
                swal.fire({
                  title: "InActivated!",
                  text: "User has been InActive.",
                  type: "success",
                  buttonsStyling: false,
                  confirmButtonClass: "btn successbtn",
                });
                id.ISACTIVE = !id.ISACTIVE; // Toggle value
                console.log(`Status changed: ${id.ISACTIVE ? 'Active' : 'Inactive'}`);
                this.geUserList();
              });
          }
        });
    }
    else {

      this.ShowErrormessage("Your already log in so you can not InActive!");
    }
  }

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

    // this.messageService.add({ severity: 'error', summary: 'Error', detail:data });
  }

  ShowMessage(data: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success ! </span> <span data-notify="message"> ' + data + ' </span></div>',
      "",
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass:
          "ngx-toastr alert alert-dismissible alert-success alert-notify"
      }
    );

    // this.messageService.add({ severity: 'success', summary: 'Success', detail:data });
  }
  onDownloadExcelFile(_filename: string) {
    // _filename = 'Users_Data';
    if (_filename == 'User List')
      {
        this.exportToExcel(this.formattedData, _filename);
      }
      else
      {
        this.exportToExcel(this.formattedDataFolder, 'Folder Access Details');
      }

   
    // this.downloadFile();
  }

  closePopup() {
   // this. = "none";
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

  
  UploadCSV(template: TemplateRef<any>){


   this.modalRef = this.modalService.show(template);   
          this.UploadCSVForm.patchValue({     
 
       })


 }

 uploadListener($event: any): void {

  let text = [];
  let files = $event.srcElement.files;

  if (this.isValidCSVFile(files[0])) {
    
    let input = $event.target;
    let reader = new FileReader();
   // console.log(input.files[0]);
    reader.readAsText(input.files[0]);
    $(".selected-file-name").html(input.files[0].name);
    reader.onload = () => {
      let csvData = reader.result;
      let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

      let headersRow = this.getHeaderArray(csvRecordsArray);

      this._CSVData = csvRecordsArray;
     
 
      let validFile = this.getDisplayNames(csvRecordsArray);
      if (validFile == false) {
      //  console.log('Not Valid File', csvRecordsArray);
        this.fileReset();
      } else {
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
     
        this._FilteredList = this.records;

      //  console.log(this.records);
        //console.log("_FilteredList",this._FilteredList);

      //  this.prepareTableDataForCSV(this._FilteredList);         

        (<HTMLInputElement>document.getElementById('csvReader')).value = '';
      //  console.log('Records', this._FilteredList);
      }


    };

    reader.onerror = function () {
     // console.log('error is occurred while reading file!');
    };

  } else {
    // this.toastr.show(
    //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please Select A Valid CSV File And Template</span></div>',
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
    this.messageService.add({ severity: 'error', summary: 'Error', detail:"Please Select A Valid CSV File And Template" });
    this.fileReset();
  }
  this._FilteredList = this.records
}

getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
  let csvArr = [];

  for (let i = 1; i < csvRecordsArray.length; i++) {
    let curruntRecord = (<string>csvRecordsArray[i]).split(',');
    if (curruntRecord.length == headerLength) {
      const single = []
      for (let i = 0; i < this._ColNameList.length; i++) {
        single.push(curruntRecord[i].toString().trim())
      }
      csvArr.push(single)
    }
  }
  return csvArr;
}

isValidCSVFile(file: any) {
  return file.name.endsWith(".csv");
}

getHeaderArray(csvRecordsArr: any) {
  var  headers;
 // headers ="NewCBSAccountNo,ApplicationNo,CBSCUSTIC,Team,HandliedBy,ProductCode,Product,ProductDescription,JCCode,JCName,Zone,CustomerName,DBDate,FinalRemarks,DisbursedMonth";
 headers =['LanNo'];

 // let headerArray = [];
  // for (let j = 0; j < headers.length; j++) {
  //   headerArray.push(headers[j]);
  // }

  return headers;


}

fileReset() {
  //this.csvReader.nativeElement.value = "";  
  this.records = [];
}
_HeaderList:any;

GetHeaderNames() {
  //  this._HeaderList = "";
    this._HeaderList ="LanNo";
  }

  getDisplayNames(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
 
 
    if (headers.length != 1) {
     // alert('Invalid No. of Column Expected :- ' + this._ColNameList.length);
     var msg= 'Invalid No. of Column Expected :- ' + this._ColNameList.length; 
     //this.showmessage(msg);
  

      return false;
    }
   // this._HeaderList ="POD No,Invoice Details,Invoice No,Invoice Date,Vendor Name,Barcode No";
    //'PODNo','AppNo','CartonNo','FileNo','Status'
   this._ColNameList[0] ="LanNo";
 
    return true;
  }

  onUplaodCSV() {

    this.submitted = true;      

if(this._CSVData != null && this._CSVData != undefined)
{

this.UploadCSVForm.patchValue({
  id: localStorage.getItem('userid'),
  CSVData: this._CSVData,     
  User_Token: localStorage.getItem('User_Token')   

});    

const apiUrl = this._global.baseAPIUrl + 'DataUpload/uploadCSV';
this._onlineExamService.postData(this.UploadCSVForm.value, apiUrl)
  // .pipe(first())
  .subscribe(data => {
    
  // alert(data);
    this.showSuccessmessage(data); 
  //  this.BindHeader(this._FilteredList,this._FilteredList);
//  this.getRequestNo();
  });

//  }     
}
else
{
  this.showmessage("please select file"); 

}
}


showSuccessmessage(data:any)
{
// this.toastr.show(
//   '<div class="alert-text"</div> <span class="alert-title" data-notify="title"> </span> <span data-notify="message"> '+ data +' </span></div>',
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

this.messageService.add({ severity: 'success', summary: 'Success', detail:data });
}

downloadFile() {
const filename = 'BulkRequestUpload_CSVFileUpload';     
let csvData = "LanNo";    
//console.log(csvData)
let blob = new Blob(['\ufeff' + csvData], {
  type: 'text/csv;charset=utf-8;'
});
let dwldLink = document.createElement("a");
let url = URL.createObjectURL(blob);
let isSafariBrowser = -1;
// let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
// navigator.userAgent.indexOf('Chrome') == -1; 

//if Safari open in new window to save file with random filename. 
if (isSafariBrowser) {
  dwldLink.setAttribute("target", "_blank");
}
dwldLink.setAttribute("href", url);
dwldLink.setAttribute("download", filename + ".csv");
dwldLink.style.visibility = "hidden";
document.body.appendChild(dwldLink);
dwldLink.click();
document.body.removeChild(dwldLink);

}

showmessage(data:any)
{
// this.toastr.show(
// '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation ! </span> <span data-notify="message"> '+ data +' </span></div>',
// "",
// {
// timeOut: 3000,
// closeButton: true,
// enableHtml: true,
// tapToDismiss: false,
// titleClass: "alert-title",
// positionClass: "toast-top-center",
// toastClass:
// "ngx-toastr alert alert-dismissible alert-success alert-notify"
// }
// );

this.messageService.add({ severity: 'success', summary: 'Success', detail:data });
}
}

