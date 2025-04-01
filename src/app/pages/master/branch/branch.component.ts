import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
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
  selector: "app-branch",
  templateUrl: "branch.component.html",
  styleUrls: ["branch.component.css"]
})
export class BranchComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  AddBranchForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
 _BranchList :any;
 _DepartmentList:any;
  BranchForm: FormGroup;
  _FilteredList :any; 
 _BranchID: any =0;
 first = 0;
rows = 10;
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.AddBranchForm = this.formBuilder.group({
      // BranchName: ['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9\-_\s]+$/)]],
     // changes added by dhanashree for space char for BranchName 
      BranchName: ['',[Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      FolderSize:['',Validators.required],
      DepartmentID: [0, Validators.required],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      UserID: localStorage.getItem('UserID') ,
      id:[0]
    });
    this.geBranchList();
    this.getDepartmentList();

   // this.Getpagerights();
  }

  get f(){
    return this.AddBranchForm.controls;
  }

  Getpagerights() {

    var pagename ="Folder";
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
  geBranchList() {
    
    const apiUrl=this._global.baseAPIUrl+'BranchMaster/GetBranchList?user_Token='+ localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._BranchList = data;
      this._FilteredList = data;
      this.prepareTableData( this._BranchList,  this._FilteredList);

    });
  }


  OnReset() {
    this.modalRef.hide(); 

    this.AddBranchForm.controls['BranchName'].setValue('');
    this.AddBranchForm.controls['FolderSize'].setValue('');
    this.AddBranchForm.controls['DepartmentID'].setValue('');
  }

  getDepartmentList() {
    const apiUrl=this._global.baseAPIUrl+'Department/GetList?user_Token='+ localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._DepartmentList = data;

      //console.log("this._DepartmentList",this._DepartmentList);

    });
  }

  onSubmit() {
    debugger;
    this.submitted = true;
    //console.log(this.AddBranchForm);
    if (this.AddBranchForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    const apiUrl = this._global.baseAPIUrl + 'BranchMaster/Update';
    this._onlineExamService.postData(this.AddBranchForm.value,apiUrl).subscribe((data: {}) => {     
   


      if(data==='Record Save Succesfully..')

        {
          this.ShowSuccessMessage(data);
          
        }
        else  if(data==='Record Updated Succesfully..')

          {
            this.ShowSuccessMessage(data);
            
          }

          else  if(data==='Record Already Exists')

            {
              this.ShowErrormessage(data);
              
            }
  

     this.geBranchList();
     this.OnReset()
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    //this.studentForm.patchValue({File: formData});
  }

// Changes by shweta
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

}
// Changes by shweta
ShowSuccessMessage(data: any) {
  this.toastr.show(
    '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success! </span> <span data-notify="message"> ' + data + ' </span></div>',
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
      { field: 'BranchName', header: 'FOLDER', index: 2 },
      { field: 'DepartmentName', header: 'CABINET', index: 3 },
      { field: 'FolderSize', header: 'FOLDER SIZE IN GB', index: 2 },
      { field: 'CreatedDate', header: 'CCREATED DATE', index: 2 },
      { field: 'CreatedBy', header: 'CCREATED BY', index: 2 },
  
    ];
   
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'DepartmentName': el.DepartmentName,
         'BranchName': el.BranchName,
          'id': el.id,
        //  'DepartmentID': el.DepartmentID,
         'FolderSize': el.FolderSize + ' GB',
         'CreatedDate': el.CreatedDate,
         'CreatedBy': el.CreatedBy,
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
  
  
  addBranch(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);

    this.AddBranchForm.patchValue({
      id:0,
      BranchName:'',
      DepartmentID: 0,
      FolderSize: '',
       
    })
  }

 //Dhanashree
 onDownloadExcelFile(_filename:string)
 {
  // _filename = 'Users_Data';
   this.exportToExcel(this.formattedData,_filename);
   // this.downloadFile();
 }

 exportToExcel(data: any[], fileName: string): void {
   //Changes done by dhanashree
   const modifiedData = data.map(item => ({
     'SR NO': item.srNo,
     'CABINET NAME': item.DepartmentName, // Renaming for Excel
     'FOLDER NAME': item.BranchName, // Renaming for Excel
     'FOLDER SIZE IN GB': item.FolderSize + ' GB',
     'CREATED DATE': item.CreatedDate,
     'CREATED BY': item.CreatedBy
 }));
   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modifiedData);
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
// Added Changes By Dhanashree
onSizeInput(event: any) {
  const value = event.target.value;
  const validValue = value.replace(/[^0-9]/g, ''); 
  event.target.value = validValue;  
}



  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }
  deleteBrnach(id: any) {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: " btn dangerbtn",
        confirmButtonText: "Yes, delete it!",
        cancelButtonClass: "btn successbtn",
      })
      .then((result) => {
        if (result.value) {
          this.AddBranchForm.patchValue({
            id: id.id
          });
          const apiUrl = this._global.baseAPIUrl + 'BranchMaster/Delete';
          this._onlineExamService.postData(this.AddBranchForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Folder has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.geBranchList();
            });
        }
      });
  }
  
  editBranch(template: TemplateRef<any>, row: any) {
      var that = this;
      that._SingleDepartment = row;
   //   console.log('data', row);
      this.AddBranchForm.patchValue({
        id: that._SingleDepartment.id,
        BranchName: that._SingleDepartment.BranchName,
        DepartmentID: that._SingleDepartment.DepartmentID,
        FolderSize: that._SingleDepartment.FolderSize,
         
      })
     // console.log('form', this.AddBranchForm);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    this.modalRef = this.modalService.show(template);
  }

}
