import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MessageService } from 'primeng/api'; 
import swal from "sweetalert2";
import { Location } from '@angular/common';
// import { Listboxclass } from '../../../Helper/Listboxclass';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-EditIndexing",
  templateUrl: "EditIndexing.component.html",
  styleUrls : ["EditIndexing.component.css"]
})
export class EditIndexingComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  isReadonly = true;
  _TemplateList :any;
  _DepartmentList : any;
  _BranchList:any;
  _HeaderList:any;
  _ColNameList:any;
  _IndexList:any;
  TemplateList:any;
  EditIndexingForm: FormGroup;
  submitted = false;
  TempField:any;
  Reset = false;
  sMsg: string = '';
  _TempID: any =0;
  _FileNo:any="";
  _PageNo:number=1;
  FilePath:any="../DMSInfo/assets/1.pdf";
  _Replacestr:any="C:/Inetpub/vhosts/dms.conceptlab.in/httpdocs/DMSInfo";
// _Replacestr:any="D:/WW/14-Jully-2020/UI/src/assets";
  
  _TotalPages:any=0;
  _FileList:any;
  _FilteredList :any; 
  _IndexPendingList:any;
  bsValue = new Date();
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private location: Location,
    private messageService: MessageService
  ){}
  ngOnInit(){
  
    document.body.classList.add('data-entry');
    this.EditIndexingForm = this.formBuilder.group({
      FileNo: ['', Validators.required],
      TemplateID: [0, Validators.required],
      DeptID: [1],
      BranchID: [0, Validators.required],      
      _ColNameList: this.formBuilder.group({}),
      Viewer:1,
      currentPage:0,
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      PageCount:0,
      submit_data:[''],     
      di:[''], 
      FVals:[''], 
      TemplateName:[''],    
      BranchName:[''],  
      
    });

    this._PageNo=1;
    this.TempField = localStorage.getItem('Fname');
    //this.OnReset();

   // this.GetIndexListPending();
    this.getTempList();
    this.getBranchList();
   // this.getDepartmnet();
    this.isReadonly = false;
    this.AddEditIndexing();   
  }
  
  get f() { return this.EditIndexingForm.controls; }
  get t() { return this.f.tickets as FormArray; }

//   onChangeTickets(e) {
//     const numberOfTickets = e.target.value || 0;
//     if (this.t.length < numberOfTickets) {
//         for (let i = this.t.length; i < numberOfTickets; i++) {
//             this.t.push(this.formBuilder.group({
//                 name: ['', Validators.required],
//                 email: ['', [Validators.required, Validators.email]]
//             }));
//         }
//     } else {
//         for (let i = this.t.length; i >= numberOfTickets; i--) {
//             this.t.removeAt(i);
//         }
//     }
// }

    // getBranchList() {

    // const apiUrl=this._global.baseAPIUrl+'BranchMaster/GetBranchList?user_Token='+ this.EditIndexingForm.get('User_Token').value;
    // this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
    // this._BranchList = data;
    // this.EditIndexingForm.controls['BranchID'].setValue(0);

    // //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    // });

    // }
    
    getBranchList() {
    
      //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
      const apiUrl = this._global.baseAPIUrl + 'BranchMapping/GetBranchDetailsUserWise?ID=' + localStorage.getItem('UserID') + '&user_Token='+ localStorage.getItem('User_Token');
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
       // this._BranchList = data;

       this._BranchList = data;
       this.EditIndexingForm.controls['BranchID'].setValue(0);

      });
    }

    getDepartmnet() {

    const apiUrl=this._global.baseAPIUrl+'Department/GetList?user_Token='+ localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
    this._DepartmentList = data;
    this.EditIndexingForm.controls['DeptID'].setValue(0);

    });

    }

    getTempList() {

    //const apiUrl=this._global.baseAPIUrl+'Template/GetTemplate?user_Token='+ this.EditIndexingForm.get('User_Token').value;
    const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token='+ localStorage.getItem('User_Token');  
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
    this._TemplateList = data;
    this.EditIndexingForm.controls['TemplateID'].setValue(localStorage.getItem('TemplateID'))

    });

    }

    GetFileNo() {

    let  __FileNo = this.EditIndexingForm.controls['FileNo'].value;
     // let  __TempID = this.EditIndexingForm.controls['TemplateID'].value;  
      const apiUrl=this._global.baseAPIUrl+'DataEntry/GetFileInfo?FileNo='+__FileNo+'&user_Token='+ localStorage.getItem('User_Token');
  
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
              
    //    this.FilePath = data[0].FilePath;
    
        //  this.FilePath = data[0].BranchID;
        //this.FilePath = data[0].DEPTID;
      //  this.EditIndexingForm.controls['DeptID'].setValue(data[0].DeptID);
        this.EditIndexingForm.controls['BranchID'].setValue(data[0].BranchID);
        //console.log("FilePath", data[0].FilePath);

        //this.FilePath = data[0].FilePath;
        this._TotalPages = data[0].PageCount;   
        this._PageNo=1;
  
        this.GetFullFile(__FileNo);

     //   console.log("BranchID", data[0].BranchID);
       // console.log("DEPTID", data[0].DeptID);

      });
  
      }

    GetNextFile()
    {
      //FileNo: localStorage.getItem('FileNo'),
    //  TemplateID:localStorage.getItem('TemplateID')  
    let  __FileNo = localStorage.getItem('FileNo');
    let  __TempID = this.EditIndexingForm.controls['TemplateID'].value;

    const apiUrl=this._global.baseAPIUrl+'DataEntry/GetNextFile?id='+__TempID+'&FileNo='+__FileNo+'&user_Token='+ localStorage.getItem('User_Token');

    //const apiUrl=this._global.baseAPIUrl+'DataEntry/GetNextFile?id'+  + '' FileNo='+ __FileNo + '&user_Token=123123'
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
    //this._TagDetailsList = data;
    //  console.log("Next Record",data);
    // this._ColNameList = data;
    this.TempField = data[0].DisplayName;
    this.onEdit(data);
    this.GetFullFile(__FileNo);
    // if (data !="")
    // {
       
    // }
    // else
    // {
    //   this.toastr.show(
    //     '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> No record Found </span></div>',
    //     "",
    //     {
    //       timeOut: 3000,
    //       closeButton: true,
    //       enableHtml: true,
    //       tapToDismiss: false,
    //       titleClass: "alert-title",
    //       positionClass: "toast-top-center",
    //       toastClass:
    //         "ngx-toastr alert alert-dismissible alert-success alert-notify"
    //     }
    //   );


    // }

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

    GetFieldList()
    {

    let  __TempID = this.EditIndexingForm.controls['TemplateID'].value;
    let  __FileNo = this.EditIndexingForm.controls['FileNo'].value;

    const apiUrl=this._global.baseAPIUrl+'DataEntry/GetFieldsName?id='+ __TempID +'&FileNo='+ __FileNo +'&user_Token='+ this.EditIndexingForm.get('User_Token').value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
    //this._TagDetailsList = data;
    // alert(data);
    this._ColNameList = data;
    let dynamic_form = {}
   // console.log('Got Data From Backend', data);
    data.forEach(ele =>{
   // console.log('Element', ele);
    let validation_array = [Validators.minLength(dynamic_form[ele.MinLenght]), Validators.maxLength(ele.MaxLenght)]
    if(ele.IsMandatory == '1') validation_array.push(Validators.required)
    var select_val = []
    if(ele.FieldType == '4') {
    select_val = ele.MasterValues.split(',')
    dynamic_form[ele.IndexField] = new FormControl('0',validation_array)
    } else {
    dynamic_form[ele.IndexField] = new FormControl('',validation_array)
    }
    ele.selectValues = select_val
    });

    let group = this.formBuilder.group(dynamic_form)
    //console.log('Dynamic Form', group);
    this.EditIndexingForm.controls['_ColNameList'] = group
    // this.DataUploadForm.patchValue({
    //   '_ColNameList' : group
    // })Object.keys(DataUploadForm.controls['_ColNameList']);.controls['_ColNameList']
    // console.log(this.DataUploadForm.controls['_ColNameList'].get(path))

    });
    //this.FileTaggingForm.controls['DocID'].setValue(0);
    }

    OnReset()
    {
    this.Reset = true;
    this.EditIndexingForm.reset();
    this.isReadonly = false; 
    localStorage.removeItem('BranchID');
    //localStorage.removeItem('DocID');
   // localStorage.removeItem('TemplateID');
    localStorage.removeItem('FileNo');
    //this.EditIndexingForm.controls['DeptID'].setValue(0);
    this.EditIndexingForm.controls['BranchID'].setValue(0);   

  }

  validateFields() {
    let isValidDateFormat = true;
    let textFieldRequiredValidation = true;
    let NumericFieldValidation = true;
    let textFieldLetterValidation = true;

    this._ColNameList.forEach((el, index) => {
      if(el.FieldType === '3') { // Date Format check
        if(!this.checkDateFormat(this.EditIndexingForm.get('_ColNameList').value[el.DisplayName])) {
          isValidDateFormat = false;
          this.toastr.show(
            '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message"><b>' + el.DisplayName + '</b> : Please select date in dd-mm-yyyy format</span></div>',
            "",
            {
              timeOut: 5000,
              closeButton: true,
              enableHtml: true,
              tapToDismiss: false,
              titleClass: "alert-title",
              positionClass: "toast-top-center",
              toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify"
            }
          );
        }
      }
      if(el.FieldType === '1' && el.IsMandatory === '1') { // Text field required validation check
        if(this.EditIndexingForm.get('_ColNameList').value[el.DisplayName] === '') {
          textFieldRequiredValidation = false;
          this.toastr.show(
            '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message"><b>' + el.DisplayName + '</b> : This field is required</span></div>',
            "",
            {
              timeOut: 5000,
              closeButton: true,
              enableHtml: true,
              tapToDismiss: false,
              titleClass: "alert-title",
              positionClass: "toast-top-center",
              toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify"
            }
          );
        }
      }

      if(el.FieldType === '1') { // Text field letter validation check
        if(!(/^[a-z][a-z\s]*$/.test(this.EditIndexingForm.get('_ColNameList').value[el.DisplayName]))) {
          textFieldLetterValidation = false;
          this.toastr.show(
            '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message"><b>' + el.DisplayName + '</b> : Only letters are allowed</span></div>',
            "",
            {
              timeOut: 5000,
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

      if(el.FieldType === '2') { // Numeric field validation check
          if(isNaN(this.EditIndexingForm.get('_ColNameList').value[el.DisplayName])) {
            NumericFieldValidation = false;
            this.toastr.show(
              '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message"><b>' + el.DisplayName + '</b> : Please enter numbers only </span></div>',
              "",
              {
                timeOut: 5000,
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
    });
    if(isValidDateFormat && textFieldRequiredValidation && NumericFieldValidation && textFieldLetterValidation) {
      return true;
    } else {
      return false;
    }
  }

  checkDateFormat(date) {
    if(date == 'Invalid Date') {
      return false;
    }
    return true;
  }

    onSubmit() {
    this.submitted = true;
    if(!this.validateFields()) {
      return;
    }
   // console.log('Form', this.EditIndexingForm);
    var submit_data = this.EditIndexingForm.value
    submit_data.FieldValues = []
    var obj = {}
    // Object.keys(this.EditIndexingForm.get('_ColNameList').value).forEach(key => {      
    // obj[key] = this.EditIndexingForm.get('_ColNameList').value[key]

    // })

    Object.keys(this.EditIndexingForm.get('_ColNameList').value).forEach(key => {  
      if(this.EditIndexingForm.get('_ColNameList').value[key] instanceof Date) {
        const dateObj = this.EditIndexingForm.get('_ColNameList').value[key];
        const dd = dateObj.getDate() > 9 ? '' + dateObj.getDate() : '0' + dateObj.getDate();
        const mm = dateObj.getMonth() + 1 > 9 ? '' + parseInt(dateObj.getMonth() + 1) : '0' + parseInt(dateObj.getMonth() + 1);
        const yyyy = dateObj.getFullYear();
        obj[key] = dd + '-' + mm + '-' + yyyy;
        this.EditIndexingForm.get('_ColNameList').value[key] = dd + '-' + mm + '-' + yyyy;
      } else {   
        obj[key] = this.EditIndexingForm.get('_ColNameList').value[key]
      }
    })



    submit_data.FieldValues.push(obj)
    //console.log('Form Value', submit_data);
    this.EditIndexingForm.patchValue({
    currentPage: this._PageNo ,
    
    PageCount:this._TotalPages,
    User_Token: localStorage.getItem('User_Token') ,
    CreatedBy: localStorage.getItem('UserID') ,
    di:submit_data,   
    FVals:submit_data.FieldValues,         
    });

    // submit_data._ColNameList.forEach(obj_elm => {
    //   submit_data.FieldValues.push(obj_elm)
    // });
    //console.log('Form Value', submit_data);

    const apiUrl = this._global.baseAPIUrl + 'DataEntry/Create';
    this._onlineExamService.postData(this.EditIndexingForm.value,apiUrl)
    // .pipe(first())
    .subscribe( data => {
         
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
      this.messageService.add({ severity: 'success', summary: 'Success', detail: data });
    this.OnReset();      
    });
    // }

    }

    onEdit(formData) {

    let dynamic_form = {}
    formData.forEach(ele =>{
    //console.log('Element', ele);
    dynamic_form[ele.IndexField] = ele.ColValues
    });
    //console.log('Dynamic Form In Edit', dynamic_form);
    this.EditIndexingForm.patchValue({

    Viewer: formData.Path,
    _ColNameList: dynamic_form,
    })
    }

    onChangeTemplate()
    {
    this.GetFieldList();
    }

    onChekpageLoad()
    {
       this.onChangeTemplate();
    //  this.EditIndexingForm.controls['FileNo'].setValue(localStorage.getItem('FileNo'));
      this.GetNextFile();
      this.GetFileNo();
      
    }

    AddEditIndexing() {


      this.EditIndexingForm.patchValue({
        FileNo: localStorage.getItem('FileNo'),
        TemplateID:localStorage.getItem('TemplateID')      
      })
     

     // console.log('form', this.AddBranchForm);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //  this.modalRef = this.modalService.show(template);
    this.onChekpageLoad();
  }


  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
   // console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._IndexPendingList.filter(function (d) {
   //   console.log(d);
      for (var key in d) {
        if (key == "BranchName" ||  key == "FileNo" ||  key == "TemplateName") {
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

  ngOnDestroy() {
    document.body.classList.remove('data-entry')
  }

  backToPrevious() {
    this.location.back();
  }
}
