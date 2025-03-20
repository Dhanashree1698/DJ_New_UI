import { Component, OnInit,TemplateRef } from "@angular/core";
import { Globalconstants } from "../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../Services/online-exam-service.service";

import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import {AuthenticationService} from '../../Services/authentication.service';
import { DxiConstantLineModule } from "devextreme-angular/ui/nested";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login-new',
  templateUrl: './login-new.component.html',
  styleUrls: ['./login-new.component.scss'],
  providers: [BsModalService,MessageService]
})
export class LoginNewComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  _LogData:any;
  fieldTextType:boolean;
  modalRef: BsModalRef;
lbl:any;
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
  animal: string;
  name: string;
  config = {
    class: 'modal-dialog-centered'
  }
  constructor(
        
    private modalService: BsModalService,
        public toastr: ToastrService,
        private formBuilder: FormBuilder,
        private _onlineExamService: OnlineExamServiceService,
        private _global: Globalconstants,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        private http: HttpClient,
        private httpService: HttpClient,
        private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required]),Validators.maxLength(50)],
      password: ['', Validators.required],
    //  recaptcha: ['', Validators.required]
    });

    localStorage.clear();
    this.lbl="estoragesupport@crownims.com";
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  HelpDailog(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template,this.config);
  }
  onSubmit() {
    this.submitted = true;
  
    const apiUrl = this._global.baseAPIUrl + 'UserLogin/Create';
    this.authService.userLogin(this.loginForm.value, apiUrl).subscribe(data => {
      
      if (data.length > 0 && data[0].id !== 0) {        
        var that = this;
        that._LogData = data[0];
  
        // If password is about to expire, show a single message
        if (that._LogData.Days <= 15) {
          const mess = `Your password expires in ${that._LogData.Days} days. Change the password as soon as possible to prevent login problems.`;
          this.Message(mess); // Show message about password expiration
        }
  
        // Store user data in localStorage
        localStorage.setItem('UserID', that._LogData.id);
        localStorage.setItem('currentUser', that._LogData.id);        
        localStorage.setItem('sysRoleID', that._LogData.sysRoleID);
        localStorage.setItem('User_Token', that._LogData.User_Token);
        localStorage.setItem('UserName', this.loginForm.get("username").value);
  
        // Redirect based on username
        if (this.loginForm.get("username").value === "admin" || this.loginForm.get("username").value === "upload") {
          this.router.navigate(['search/quick-search']);
        } else {
          this.router.navigate(['search/quick-search']);
        }
  
      } else {
        // Handle invalid login and display error message
        const errorMessage = data[0].userid;  // The error message returned from the API
        this.ErrorMessage(errorMessage);  // Show the error message
      }
  
    });
  }
  
  
  handleSuccess(data) {

  }

  get f(){
    return this.loginForm.controls;
  }
  ErrorMessage(msg: any) {
    // Show the error message only once
    this.messageService.add({
      severity: 'error',
      summary: '',
      detail: msg,  
      sticky: false
    });
  
    // Optionally, use toastr as well:
    this.toastr.error(msg, 'Login Failed', {
      "closeButton": true,
      "progressBar": true,
      "positionClass": "toast-top-center",
      "toastClass": "ngx-toastr alert alert-danger alert-notify"
    });
  }
  

  Message(msg:any)
  {

    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title"></span> <span data-notify="message"><h4 class="text-white"> '+msg+' <h4></span></div>',
      "",
      {
        timeOut: 7000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass:
          "ngx-toastr alert alert-dismissible alert-danger alert-notify"
      }
    );
  }  
  
}
