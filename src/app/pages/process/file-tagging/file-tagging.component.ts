import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MessageService } from 'primeng/api'; 
import swal from "sweetalert2";
// import { Listboxclass } from '../../../Helper/Listboxclass';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-file-tagging",
  templateUrl: "file-tagging.component.html",
  styleUrls: ["file-tagging.component.css"]
})
export class FileTaggingComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  Tentries: number = 10;
  Tselected: any[] = [];
  Ttemp = [];
  TactiveRow: any;
  TSelectionType = SelectionType;
  modalRef: BsModalRef;
  TempField : any;  
  _TemplateList :any;
  _HeaderList:any;
  _DeptList:any;
  _FileList:any;
  _Records :any; 
  FileTaggingForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
  _TempID: any =0;
  _TagDetailsList:any;
  _FileNo:any="";
  _PageNo:number=1;
  FilePath:any="../assets/1.pdf";
  _TotalPages:any=0;
  _Repalce:any="C:/Inetpub/vhosts/dms.conceptlab.in/httpdocs/DMSInfo";
  FileStatus:any="New";
  //  _Repalce:any="D:/WW/07Jully2020/15Jan2020/src/assets";
//_Repalce:any="D:/WW/14-Jully-2020/UI/src/assets";
  _FilteredList:any;
  _FilteredTaggingList:any;
  _TagPendingList:any;
  
    constructor(
      private modalService: BsModalService,
      private _onlineExamService: OnlineExamServiceService,
      private _global: Globalconstants,      
      private formBuilder: FormBuilder,
      public toastr: ToastrService,
      private messageService: MessageService
    ) { }
  
    ngOnInit() {
      document.body.classList.add('file-tagging');
      this.FileTaggingForm = this.formBuilder.group({         
        FileNo: ['', Validators.required],
        DocID: ['', Validators.required],             
        Viewer:[''],
        currentPage:0,
        goto:0,
        User_Token: localStorage.getItem('User_Token') ,
        CreatedBy: localStorage.getItem('UserID') ,
        PageCount:0,      
         
      });

       this.TempField ="EMP Code"; //localStorage.getItem('Fname');
      this._PageNo=1;
      //this.getDeptList();
      this.GetTaggingPending();
     // this.getDoctypeListByTempID(1);
     // this.GetTaggingPending();
  
    }

    ngOnDestroy() {
      document.body.classList.remove('file-tagging');
    } 

      getDoctypeListByTempID(tempID: any) {
    
        //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
        const apiUrl = this._global.baseAPIUrl + 'DocTypeMapping/getDoctypeListByTempID?ID=' + localStorage.getItem('UserID') + '&TemplateID='+ tempID +'&user_Token='+ localStorage.getItem('User_Token')
       // console.log("apiUrl",apiUrl);
      
        this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
          this._DeptList = data;
          this.FileTaggingForm.controls['DocID'].setValue(0);
        //  console.log("_DeptList",this._DeptList);

          //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        });
      }

      Goto()
      {
          this._PageNo=this.FileTaggingForm.get('goto').value ;
      }

      Next()
      {
        this._PageNo=(this._PageNo+1);

      }
      Previous()
      {
        this._PageNo=(this._PageNo-1);

      }
     

      getDeptList() {
    
        //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
        const apiUrl = this._global.baseAPIUrl + 'DocTypeMapping/GetDocTypeDetailsUserWise?ID=' + localStorage.getItem('UserID') + '&user_Token='+ localStorage.getItem('User_Token')
        this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
          this._DeptList = data;
          this.FileTaggingForm.controls['DocID'].setValue(0);
    
          //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        });
      }
            
  
      GetNextFile() 
      {
      this._PageNo=1;
      let  __FileNo = this.FileTaggingForm.controls['FileNo'].value;
  
      if (__FileNo ==undefined)
      {
      __FileNo ="";
      }
  
      const apiUrl=this._global.baseAPIUrl+'TaggingDetails/GetNextFile?FileNo='+ __FileNo + '&user_Token='+this.FileTaggingForm.get('User_Token').value;
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      //this._TagDetailsList = data;  
      this._FileList = data;
      //let len= this._FileList.length;
      if (this._FileList.length > 0)
      {  
      this.FileTaggingForm.controls['FileNo'].setValue(this._FileList[0].nFileName);      
     //this.FilePath = this._FileList[0].FilePath;
     this._TotalPages = this._FileList[0].PageCount;   
      this.getDoctypeListByTempID(1); 

      this.GetFullFile(__FileNo);

     // var _TempFilePath = this._FileList[0].FilePath 
     /// _TempFilePath = _TempFilePath.replace(new RegExp(/\\/g),"/");   
    //_TempFilePath = _TempFilePath.replace(this._Repalce,"../DMSInfo");   
  
    ///var _RPath = this._Repalce.replace(new RegExp(/\\/g),"/");
    //_TempFilePath = _TempFilePath.replace(this._Replacestr,"http://localhost/DMSInfo")   
  //  _TempFilePath = _TempFilePath.replace(_RPath,"https://dms.conceptlab.in/DMSInfo");

    //  _TempFilePath = _TempFilePath.replace(this._Repalce,"https://dms.conceptlab.in/DMSInfo"); 

   // this.FilePath = this._FileList[0].FilePath ;
   
      this.GetTagData();
      }
  
      });
      //this.FileTaggingForm.controls['DocID'].setValue(0);
      }
  
      GetFullFile(FileNo:any) {

        //  console.log("Doc", doc);
         /// this.FilePath = doc.RelPath;
          //console.log("Row**",doc);
          const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetFullFile?ID='+localStorage.getItem('UserID')+'&&_fileName='+ FileNo +'&user_Token='+localStorage.getItem('User_Token');
          this._onlineExamService.getDataById(apiUrl).subscribe(res => {
            if (res) {
      
           // console.log("res",res);
              this.FilePath = res;
               /// saveAs(res, row.ACC + '.pdf');
      
            }
          });
        }

      GetTagData() 
      {
  
      let  _Fileno = this.FileTaggingForm.controls['FileNo'].value;
  
      const apiUrl=this._global.baseAPIUrl+'TaggingDetails/GetTaggedDetails?FileNo='+ _Fileno + '&user_Token='+this.FileTaggingForm.get('User_Token').value;
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      //this._TagDetailsList = data;
      // alert(data);
      this._TagDetailsList = data;
      this._FilteredList =data;


      });
      //this.FileTaggingForm.controls['DocID'].setValue(0);
      }
  
      OnReset()
      {     
      this.Reset = true;
      this.FileTaggingForm.reset();      
      //this.FileTaggingForm.controls['DocID'].setValue(0);   
      this.FileStatus="New";
      // this.FileTaggingForm.controls['User_Token'].setValue(localStorage.getItem('User_Token')); 
      // this.FileTaggingForm.controls['UserID'].setValue(localStorage.getItem('UserID'));    
      // this.FileTaggingForm.controls['CreatedBy'].setValue(localStorage.getItem('UserID'));  
      }
  
      onSubmit() {
  

      //  alert(this._PageNo);

      if (this.FileTaggingForm.invalid) {
      //alert("Please Fill the Fields");
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please Fill the Fields' });
      return;
      }   
      
      if (this.FileTaggingForm.get('DocID').value <= 0) {
       // alert("Please select document type");
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please select document type' });
        return;
        }   
  
     // console.log("1");
      this.FileTaggingForm.patchValue({
      currentPage: this._PageNo ,
      
      PageCount:this._TotalPages,
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      
      });
      //console.log("2");
      this.submitted = true;   
      const apiUrl = this._global.baseAPIUrl + 'TaggingDetails/Create';
      this._onlineExamService.postData(this.FileTaggingForm.value,apiUrl)
      // .pipe(first())
      .subscribe( data => {
      this.submitted = false;
      if (data=="File Tagged Succesfully" && this.FileStatus=="New")
      {
        // this.toastr.show(
        //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> '+ data +' </span></div>',
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
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data});
        this.modalRef.hide();
        this.GetTaggingPending();
      this.OnReset();    

      }
      else if (this._PageNo < this._TotalPages )
      {
      this._PageNo = ((this._PageNo) + 1);   
      this.GetTagData();     
      }
      else if (this._PageNo < this._TotalPages )
      {
     // alert("Please complete In Complete Tag");
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please complete In Complete Tag' });
      }
  
      //this.OnReset();        
  
      });
      // }   
  
      }


  

      entriesChange($event) {
        this.entries = $event.target.value;
      }
      filterTable($event) {
      //  console.log($event.target.value);
    
        let val = $event.target.value;
        this._FilteredList = this._FilteredTaggingList.filter(function (d) {
        //  console.log(d);
          for (var key in d) {
            //alert(key);
            if (key == "DocName" || key == "PageIndex") {
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

      TentriesChange($event) {
        this.Tentries = $event.target.value;
      }
      TfilterTable($event) {
      //  console.log($event.target.value);
    
        let val = $event.target.value;
        this._FilteredTaggingList = this._TagPendingList.filter(function (d) {
        //  console.log(d);
          for (var key in d) {
            alert(key);
            if (key == "FileNo" || key == "TemplateName" || key == "BranchName") {
              if (d[key].toLowerCase().indexOf(val) !== -1) {
                return true;
              }
            }
          }
          return false;
        });
      }
      TonSelect({ selected }) {
        this.Tselected.splice(0, this.Tselected.length);
        this.Tselected.push(...selected);
      }
      TonActivate(event) {
        this.TactiveRow = event.row;
      }

      GetTaggingPending() {
    
        const apiUrl = this._global.baseAPIUrl + 'TaggingDetails/GetPendingData?UserID=' + localStorage.getItem('UserID') + '&user_Token='+ localStorage.getItem('User_Token');
        this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
        this._TagPendingList = data;
        this._FilteredTaggingList = data
       // console.log(this._FilteredList)
          //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        });
      }

      hidepopup()
{
 // this.modalService.hide;
  this.modalRef.hide();
  //this.modalRef.hide
}
      

      AddIndexing(template: TemplateRef<any>, row: any) {
        var that = this;
        this.FileTaggingForm.patchValue({
          FileNo: row.FileNo
        })
        this.FileStatus="New";
      ///  this.FilePath = row.FilePath;
        this._TotalPages = row.PageCount;   
        this._PageNo=1;
        this.getDoctypeListByTempID(row.TemplateID);
       // console.log('FilePath', row);
       // console.log('form', this.AddBranchForm);
        //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        this.GetTagData();
      this.modalRef = this.modalService.show(template);
      this.GetFullFile(row.FileNo);
      //this.onChekpageLoad();
    }

    ReTagging(template: TemplateRef<any>) {
     
this.FileStatus ="Re";
   ///   this.FilePath = row.FilePath;
      //this._TotalPages = row.PageCount;   
     // this._PageNo=1;
      //this.getDoctypeListByTempID(row.TemplateID);
     // console.log('FilePath', row);
     // console.log('form', this.AddBranchForm);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
      //this.GetTagData();
    this.modalRef = this.modalService.show(template);
    
    //this.onChekpageLoad();
  }
  
  }
