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
  selector: "app-entity",
  templateUrl: "entity.component.html",
  styleUrls: ["entity.component.css"]
})
export class EntityComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  AddEntityForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
  _EntityList :any;
  EntityForm: FormGroup;
  _FilteredList :any; 
 _EntityID: any =0;
 BranchList:any;
 _DepartmentList:any;
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
    this.AddEntityForm = this.formBuilder.group({
      // SubfolderName: ['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9\-_\s]+$/)]],
      // changes added by dhanashree for space char for subfolder name
      SubfolderName: ['',[Validators.required, Validators.pattern(/^(?!\s*$).+/)]], 
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      BranchID:[0, Validators.required],
      DeptID:[0, Validators.required],
      id:[0]
    });
  
    this.Getpagerights();
    this.getDepartmentList();
    this.getEntityList();
    //this.geBranchList();
  }

  get f(){
    return this.AddEntityForm.controls;
  }

  Getpagerights() {

    var pagename ="Sub Folder";
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


//   getDeptList() {  
  
//     const apiUrl=this._global.baseAPIUrl+'DocMaster/GetDocList?user_Token='+localStorage.getItem('User_Token');
//     this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
//     this._DepartmentList = data;
//  //  this.AddEntityForm.controls['DocID'].setValue(0);
//    console.log("Dept",this._DepartmentList);
//     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
//     });
//     }

    getDepartmentList() {
      const apiUrl=this._global.baseAPIUrl+'DepartmentMapping/GetDepartmentByUser?ID='+ localStorage.getItem('UserID')+'&user_Token='+localStorage.getItem('User_Token') 
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
        this._DepartmentList = data;
        debugger
       // console.log("DepList",data);
      //  this._FilteredList = data
        //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
      });
    }


    
    GetBranchByDepartment(DepartmentID:any)
    {
  //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
      const apiUrl =
      this._global.baseAPIUrl +"BranchMapping/GetBranchByDeptUserWise?ID="+localStorage.getItem('UserID')+"&user_Token="+localStorage.getItem('User_Token')+"&DeptID="+this.AddEntityForm.get("DeptID").value;
      this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this.BranchList = data;

      console.log("BranchID",data);
//  this._FilteredList = data;
  //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
});
}

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._EntityList.filter(function (d) {
      console.log(d);
      for (var key in d) {
        if (key == "SubfolderName") {
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
    this.selected.push(selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }
  getEntityList() {
    
    const apiUrl=this._global.baseAPIUrl+'SubfolderController/GetSubfolderList?user_Token='+ localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._EntityList = data;
      this._FilteredList = data;
      this.prepareTableData( this._EntityList,  this._FilteredList);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  OnReset() {
    this.Reset = true;
    //this.AddEntityForm.reset();
    this.AddEntityForm.controls['SubfolderName'].reset();
  //  this.AddEntityForm.controls['BranchID'].reset();
    this.AddEntityForm.controls['DeptID'].setValue(0);
    this.modalRef.hide();  

  }

  onSubmit() {
    this.submitted = true;
   // console.log(this.AddEntityForm);
    if (this.AddEntityForm.invalid) {
      alert("Please Fill the Fields");
      return;
    }
    const apiUrl = this._global.baseAPIUrl + 'SubfolderController/Update';
    this._onlineExamService.postData(this.AddEntityForm.value,apiUrl).subscribe((data: {}) => {     
     console.log(data);
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

     this.getEntityList();
     this.OnReset()
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    //this.studentForm.patchValue({File: formData});
  }

  ShowErrormessage(data){
    this.messageService.add({ severity: 'warn', summary: 'Warnning', detail: data });
  }
  ShowSuccessMessage(data){
    this.messageService.add({ severity: 'success', summary: 'Success', detail: data });
  }
    
  addBranch(template: TemplateRef<any>) {
    this.AddEntityForm.controls['BranchID'].setValue(0);
    this.AddEntityForm.controls['SubfolderName'].setValue('');
    this.modalRef = this.modalService.show(template);
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


  
  geBranchList() {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl =
      this._global.baseAPIUrl +
      "BranchMapping/GetBranchDetailsUserWise?ID=" +
      localStorage.getItem('UserID') +
      "&user_Token=" +
      this.AddEntityForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this.BranchList = data;

      this.AddEntityForm.controls['BranchID'].setValue(0);

     // this._FilteredList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
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
      { field: 'DepartmentName', header: 'CABINET', index: 2 },
      { field: 'BranchName', header: 'FOLDER', index: 2 },
  
      { field: 'SubfolderName', header: 'SUB FOLDER', index: 3 },
    
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
        'SubfolderName': el.SubfolderName,
        'id': el.id,
        'BranchName': el.BranchName,
       'DepartmentName': el.DepartmentName,
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

  deleteEntity(id: any) {
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
          this.AddEntityForm.patchValue({
            id: id.id
          });
          const apiUrl = this._global.baseAPIUrl + 'SubfolderController/Delete';
          this._onlineExamService.postData(this.AddEntityForm.value,apiUrl)     
          .subscribe( data => {
              swal.fire({
                title: "Deleted!",
                text: "Sub Folder has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.getEntityList();
            });
        }
      });
  }
  
  editEntity(template: TemplateRef<any>, row: any) {
      var that = this;
      that._SingleDepartment = row;
      console.log('data', row);
      this.AddEntityForm.patchValue({
        id: that._SingleDepartment.id,
        SubfolderName: that._SingleDepartment.SubfolderName,
      })
      console.log('form', this.AddEntityForm);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    this.modalRef = this.modalService.show(template);
  }

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }
}
