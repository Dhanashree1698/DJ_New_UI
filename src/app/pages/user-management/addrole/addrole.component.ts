import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpClient } from '@angular/common/http';
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
  selector: "app-addrole",
  templateUrl: "addrole.component.html",
  styleUrls: ["addrole.component.css"]
})
export class AddRoleComponent implements OnInit {
  
AddRoleForm: FormGroup; 
submitted = false;
Reset = false;     
sMsg: string = '';   
UserList:any;
_PageList: any;
PageViewList : any;
_RightList:any;
_RoleList :any;  
_UserList:any; 
myFiles: string[] = [];  
_PageIDAndChk:any;
_pageRights:any;
Role:any;
isSubmit : false

  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private http: HttpClient,
    private httpService: HttpClient  
  ) {}

  get rf() { return this.AddRoleForm; }
  get roles() { return this.AddRoleForm.get('Roles') as FormArray; }
  get _PageRight() { return this.AddRoleForm.get('_PageRight') as FormArray; }

  ngOnInit() {
    this.AddRoleForm = this.formBuilder.group({     
      roleName: ['', Validators.required],
      remarks: ['', Validators.required],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      Roles: this.formBuilder.array([]),
      SelectAll: [false],
      SelectAllRights: [false],
      _PageIDAndChk:"",
      pageRights:"",
      _PageRight: this.formBuilder.array([]),
    });



    let _RoleID= localStorage.getItem('_RoleID') ; 

    if (Number(_RoleID) > 0)
    {
    this.getPageList(Number(_RoleID) );
    this.getRightList(Number(_RoleID) );
    this.AddRoleForm.controls['roleName'].setValue(localStorage.getItem('_RoleName'));
    this.AddRoleForm.controls['remarks'].setValue(localStorage.getItem('_RoleRemark'));  
    this.Role ="Edit Role";
    }
    else 
    {
    this.getPageList(0);
    this.getRightList(0); 
    this.Role ="Create Role";

    }

    this.Getpagerights();
  }


  Getpagerights() {

    var pagename ="Add Role";
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
  
  getPageList(TID:number) {  
    const apiUrl=this._global.baseAPIUrl+'Role/GetPageList?ID='+ TID +'&user_Token='+this.AddRoleForm.get('User_Token').value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {  

    //console.log("Page List",data);
    this._PageList = data;
    this._PageList.forEach(item => {
    if(item.parent_id == 0) {
    item.subItem = []
    let fg = this.formBuilder.group({
    page_name: [item.page_name],
    isChecked: [item.isChecked],
    subItems: this.formBuilder.array([]),
    id: [item.id],
    parent_id: [item.parent_id]
    })
    this.roles.push(fg)
    }
    }) 

    this._PageList.forEach(item => {
    if(item.parent_id && item.parent_id != 0) {
    let found = this.roles.controls.find(ctrl=> ctrl.get('id').value == item.parent_id)
    if(found) { 
    let fg = this.formBuilder.group({
    page_name: [item.page_name],
    isChecked: [item.isChecked],
    subItems: [[]],
    id: [item.id],
    parent_id: [item.parent_id]
    })
    let subItems = found.get('subItems') as FormArray
    subItems.push(fg)
    }
    }
    })
    });
    }

    getRightList(TID:number) {  
    const apiUrl=this._global.baseAPIUrl+'Role/GetRightList?ID='+ TID +'&user_Token='+this.AddRoleForm.get('User_Token').value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {  
    this._RightList = data;  
    //  _PageRight

    this._RightList.forEach(item => {
    // if(item.parent_id == 0) {
    let fg = this.formBuilder.group({
    page_right: [item.page_right],
    isChecked: [item.isChecked], 
    id: [item.id],          
    })
    this._PageRight.push(fg)
    // }
    })      

    });
    }
    onSubmit() {
      this.submitted = true;
    
      // Check if role name is entered
      if (this.AddRoleForm.value.roleName.trim() === "") {
        this.ShowErrormessage("Please enter Role Name");
        return;
      }
    
      var _Flag = 0;
      this._PageIDAndChk = "";
    
      // Loop through each Role to check if it's checked or not, including subItems
      for (let i = 0; i < this.AddRoleForm.value.Roles.length; i++) {
        this._PageIDAndChk += this.AddRoleForm.value.Roles[i].id + ',' + this.AddRoleForm.value.Roles[i].isChecked + '#';
    
        if (this.AddRoleForm.value.Roles[i].subItems.length > 0) {
          for (let j = 0; j < this.AddRoleForm.value.Roles[i].subItems.length; j++) {
            this._PageIDAndChk += this.AddRoleForm.value.Roles[i].subItems[j].id + ',' + this.AddRoleForm.value.Roles[i].subItems[j].isChecked + '#';
    
            if (this.AddRoleForm.value.Roles[i].subItems[j].isChecked) {
              _Flag = 1;
            }
          }
        }
      }
    
      // Check if page rights are selected
      let __pageRights = "";
      for (let i = 0; i < this.AddRoleForm.value._PageRight.length; i++) {
        if (this.AddRoleForm.value._PageRight[i].isChecked) {
          __pageRights += String(this.AddRoleForm.value._PageRight[i].id) + ',';
        }
      }
    
      // Check if at least one role or sub-item is selected
      if (_Flag === 0) {
        this.ShowErrormessage("Please select page rights");
        return;
      }
    
      // Check if any rights are selected
      if (__pageRights.length === 0) {
        this.ShowErrormessage("Please select rights");
        return;
      }
    
      // Add additional data for submission
      this.AddRoleForm.patchValue({
        CreatedBy: 1,
        User_Token: localStorage.getItem('User_Token'),
        _PageIDAndChk: this._PageIDAndChk,
        pageRights: __pageRights
      });
    
      // Define API URL
      const apiUrl = this._global.baseAPIUrl + 'Role/Create';
      const rights = this.AddRoleForm.value._PageRight;
    
      // Submit the form data
      this._onlineExamService.postData(this.AddRoleForm.value, apiUrl)
        .subscribe(data => {
          this.MessageBox(data);
          this.OnReset();
          
          // Notify other components that the role has changed
          setTimeout(() => {
            this._onlineExamService.roleChanged();
          }, 50);
    
          // Update local storage with rights
          rights.forEach(element => {
            localStorage.setItem(element.page_right, element.isChecked);
          });
    
          // Navigate to roles page
          this.router.navigate(['/usermanagement/roles']);
        });
    
      // Clear local storage items
      localStorage.removeItem('_RoleID');
      localStorage.removeItem('roleName');
      localStorage.removeItem('remarks');
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
      
        this.messageService.add({ severity: 'error', summary: '', detail:data});
      }
    
      ShowMessage(data:any)
      {
        // this.toastr.show(
        //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success ! </span> <span data-notify="message"> '+ data +' </span></div>',
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
        this.messageService.add({ severity: 'success', summary: '', detail: data});
      
      }
    
    // OnSelectAll()
    // {                
    // // alert(this.RoleForm.controls['SelectAll'].value); 

    // let _bool =this.AddRoleForm.controls['SelectAll'].value; // role.get('SelectAll').value == true;
    // this.roles.controls.forEach(role => {
    // role.patchValue({isChecked: _bool})
    // // role.get('subItems').controls.forEach(elm => {
    // //   elm.patchValue({isChecked: _bool})
    // // });
    // });
    // }

    // OnSelectRightAll()
    // { 
    // let _bool =this.AddRoleForm.controls['SelectAllRights'].value; // role.get('SelectAll').value == true;
    // this._PageRight.controls.forEach(role => {
    // role.patchValue({isChecked: _bool})
    // // role.get('subItems').controls.forEach(elm => {
    // //   elm.patchValue({isChecked: _bool})
    // // });
    // });
    // }

    onCheckChild(role) {
      setTimeout(()=> {
        let oneFalseFound = role
        .get("subItems")
        .controls.every((r) => r.get("isChecked").value == true);
      oneFalseFound
        ? role.patchValue({ isChecked: true })
        : role.patchValue({ isChecked: false });
      }, 100);
    }
  
    onCheckParent(role: any) {
      let _bool = role.get("isChecked").value;
      if (_bool) {
        role.get("subItems").controls.forEach((elm) => {
          elm.patchValue({ isChecked: false });
        });
      } else {
        role.get("subItems").controls.forEach((elm) => {
          elm.patchValue({ isChecked: true });
        });
      }
    }
  
    OnSelectAll() {
      // alert(this.RoleForm.controls['SelectAll'].value);
  
      let _bool = this.AddRoleForm.controls["SelectAll"].value; // role.get('SelectAll').value == true;
      this.roles.controls.forEach((role) => {
        role.patchValue({ isChecked: _bool });
        let subItems = role.get("subItems") as FormArray;
        subItems.controls.forEach((elm) => {
          elm.patchValue({ isChecked: _bool });
        });
      });
    }
  
    OnSelectRightAll() {
      let _bool = this.AddRoleForm.controls["SelectAllRights"].value; // role.get('SelectAll').value == true;
      this._PageRight.controls.forEach((role) => {
        role.patchValue({ isChecked: _bool });
        // role.get('subItems').controls.forEach(elm => {
        //   elm.patchValue({isChecked: _bool})
        // });
      });
    }


    OnReset() {  
    // this.Reset = true;
    // this.AddRoleForm.reset();    
    
    this.AddRoleForm.controls['roleName'].setValue("");
    this.AddRoleForm.controls['remarks'].setValue("");  

    let _bool = false; // role.get('SelectAll').value == true;
    this.roles.controls.forEach((role) => {
      role.patchValue({ isChecked: _bool });
      let subItems = role.get("subItems") as FormArray;
      subItems.controls.forEach((elm) => {
        elm.patchValue({ isChecked: _bool });
      });
    });


    //let _bool = this.AddRoleForm.controls["SelectAllRights"].value; // role.get('SelectAll').value == true;
    this._PageRight.controls.forEach((role) => {
      role.patchValue({ isChecked: false });
      // role.get('subItems').controls.forEach(elm => {
      //   elm.patchValue({isChecked: _bool})
      // });
    });


    }

    OnBack()
    {
    localStorage.removeItem('_RoleID') ;   
    localStorage.removeItem('roleName') ;   
    localStorage.removeItem('remarks') ;    
    //this.localStorage.setItem('_TempID') =_TempID;
    
    this.router.navigate(['/usermanagement/roles']);

    }
    
    
    MessageBox(msg:any)
{

  // this.toastr.show(
  //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> '+ msg +' </span></div>',
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

  this.messageService.add({ severity: 'success', summary: '', detail:msg });
}
}
