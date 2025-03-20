import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpEventType, HttpClient } from '@angular/common/http';
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from '@angular/router';
import noUiSlider from "nouislider";
import Dropzone from "dropzone";
Dropzone.autoDiscover = false;
import Quill from "quill";
import Selectr from "mobius1-selectr";

import swal from "sweetalert2";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-status",
  templateUrl: "status.component.html",
  styleUrls: ["status.component.css"]
})
export class StatusComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType; 
  StatusReportForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';     
  _FilteredList :any; 
  _StatusList:any;
  _HeaderList:any;
  TemplateList:any;
  BranchList:any; 
  _ColNameList = ["Department","BranchName" ,"SubfolderName" ,"FileNo", "PageCount", "IsIndexing","EntryDate","EntryBy","FileSize"];
  
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  first = 0;
  rows = 10;

  constructor(
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,

  ) {}
  ngOnInit() {
    this.StatusReportForm = this.formBuilder.group({
      TemplateID: [, Validators.required],  
      BranchID: [, Validators.required],  
      _Flag: [0, Validators.required],
      DATEFROM:[],   
      DATETO:[],        
      User_Token:  localStorage.getItem('User_Token') ,  
      CreatedBy: localStorage.getItem('UserID') ,      
    });

    //this.Getpagerights();
    //this.getTemplate();
    this.geBranchList();
 
    
  }

  Getpagerights() {

    var pagename ="Status Report";
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
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl =
      this._global.baseAPIUrl +
      "BranchMapping/GetBranchDetailsUserWise?ID=" +
      localStorage.getItem('UserID') +
      "&user_Token=" +
      this.StatusReportForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this.BranchList = data;
      this._FilteredList= data;
     // console.log(data);
      this.StatusReportForm.controls['TemplateID'].setValue(0);
      this.StatusReportForm.controls['BranchID'].setValue(0);
     // this.prepareTableData( this.BranchList,  this._FilteredList);
     this.BindHeader(this._FilteredList,this._FilteredList);
    //  this._FilteredList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
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
    { field: 'Department', header: 'CABINET', index: 3 },
    { field: 'BranchName', header: 'FOLDER', index: 3 },
    { field: 'SubfolderName', header: 'SUB FOLDER', index: 2 },
    { field: 'FileNo', header: 'FILE NAME', index: 3 },
    { field: 'PageCount', header: 'PAGE COUNT', index: 3 },
    { field: 'IsIndexing', header: 'IS INDEXING', index: 3 },
    { field: 'TemplateName', header: 'TEMPLATE', index: 3 },
    { field: 'TempCode', header: 'TEMPLATE CODE', index: 3 },
    { field: 'FileSize', header: 'FILE SIZE (KB)', index: 3 },
    { field: 'EntryBy', header: 'UPLOAD BY', index: 3 },
    // { field: 'Status', header: 'STATUS', index: 3 },
    { field: 'upload_date', header: 'UPLOAD DATE', index: 3 }
    
    //,{ field: 'DownloadDate', header: 'DownloadDate', index: 3 },
   // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

  ];
 //console.log("Tablelog",tableData);
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'Department': el.Department,
      'BranchName': el.BranchName,
      'id': el.id,
      'SubfolderName': el.SubfolderName,
      'FileNo': el.FileNo,
      'PageCount': el.PageCount,
      'IsIndexing': el.IsIndexing,
       'FileSize': el.FileSize,
      'upload_date': el.EntryDate,
      'EntryBy': el.EntryBy,
      'TemplateName': el.TemplateName,
      'TempCode' : el.TempCode
          
    });
 
  });
  this.headerList = tableHeader;
//}

  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
  this.formattedData = formattedData;
  console.log(this.formattedData)
  this.loading = false;

}

BindHeader(tableData, headerList) {
  let formattedData = [];
 // alert(this.type);

// if (this.type=="Checker" )
//{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'Department', header: 'CABINET', index: 3 },
    { field: 'BranchName', header: 'FOLDER', index: 3 },
    { field: 'SubfolderName', header: 'SUB FOLDER ', index: 2 },
    { field: 'FileNo', header: 'FILE NAME', index: 3 },
    { field: 'PageCount', header: 'PAGE COUNT', index: 3 },
    { field: 'IsIndexing', header: 'IS INDEXING', index: 3 },
    { field: 'TemplateName', header: 'TEMPLATE', index: 3 },
    { field: 'TempCode', header: 'TEMPLATE CODE', index: 3 },
    { field: 'FileSize', header: 'FILE SIZE (KB)', index: 3 },
    // { field: 'Status', header: 'STATUS', index: 3 },
    { field: 'EntryBy', header: 'UPLOAD BY', index: 3 },
    { field: 'upload_date', header: 'UPLOAD DATE', index: 3 }
    //,{ field: 'DownloadDate', header: 'DownloadDate', index: 3 },
   // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

  ];
//  //console.log("Tablelog",tableData);
//   tableData.forEach((el, index) => {
//     formattedData.push({
//       'srNo': parseInt(index + 1),
//       'Department': el.Department,
//       'BranchName': el.BranchName,
//       'id': el.id,
//       'SubfolderName': el.SubfolderName,
//       'FileNo': el.FileNo,
//       'PageCount': el.PageCount,
//       'IsIndexing': el.IsIndexing,
//       'Status': el.Status,
//       'EntryDate': el.EntryDate,

//       //BranchName
    
//     });
 
//   });
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


  OnReset() {
    this.Reset = true;
    this.StatusReportForm.reset();
  }

  onSearch()
  {
    this.getStatusList();
  }

  getTemplate() {  

    const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token='+localStorage.getItem('User_Token')   
    //const apiUrl=this._global.baseAPIUrl+'Template/GetTemplate?user_Token='+ this.MetaDataForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
    this.TemplateList = data;  
  //  console.log("TemplateList",this.TemplateList);
  //  this.FileTaggingForm.get('User_Token').value  
    this.StatusReportForm.controls['TemplateID'].setValue(0);
    this.StatusReportForm.controls['_Flag'].setValue(0);
 //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
//this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
});
}

  getStatusList() {  

    const apiUrl = this._global.baseAPIUrl + 'Status/GetStatusReport';          
    this._onlineExamService.postData(this.StatusReportForm.value,apiUrl)
    // .pipe(first())

    .subscribe( data => {
      this._StatusList = data;          
      this._FilteredList = data;  
      this.prepareTableData( this._StatusList,  this._FilteredList);

  });

  } 

  onDownload()
  {
    this.downloadFile();
  }

  GetHeaderNames()
  {
    this._HeaderList="";
    for (let j = 0; j < this._ColNameList.length; j++) {  
         
        this._HeaderList += this._ColNameList[j] +((j <= this._ColNameList.length-2)?',':'') ;
      // headerArray.push(headers[j]);  
    }
    this._HeaderList += '\n'
    this._StatusList.forEach(stat => {
      for (let j = 0; j < this._ColNameList.length; j++) {  
        this._HeaderList += (stat[this._ColNameList[j]]) + ((j <= this._ColNameList.length-2)?',':'') ;
        // headerArray.push(headers[j]);  
      }
      this._HeaderList += '\n'
    });
    
  
  }
  
  downloadFile() { 
    this.GetHeaderNames()
    let csvData = this._HeaderList;     
    console.log(csvData) 
    if(this._StatusList.length>0) {
    let blob = new Blob(['\ufeff' +  csvData], { 
        type: 'text/csv;charset=utf-8;'
    }); 
    let dwldLink = document.createElement("a"); 
    let url = URL.createObjectURL(blob); 
    let isSafariBrowser =-1;
    // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
    // navigator.userAgent.indexOf('Chrome') == -1; 
    
    //if Safari open in new window to save file with random filename. 
    if (isSafariBrowser) {  
        dwldLink.setAttribute("target", "_blank"); 
    } 
    dwldLink.setAttribute("href", url); 
    dwldLink.setAttribute("download",  "StatusReport" + ".csv"); 
    dwldLink.style.visibility = "hidden"; 
    document.body.appendChild(dwldLink); 
    dwldLink.click(); 
    document.body.removeChild(dwldLink); 
  } else {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">There should be some data before you download!</span></div>',
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
  }
 
  isValid() {
    return this.StatusReportForm.valid 
  }
 
}

