import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpEventType, HttpClient } from '@angular/common/http';
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from '@angular/router';
import Dropzone from "dropzone";
Dropzone.autoDiscover = false;
import { saveAs } from 'file-saver';


import swal from "sweetalert2";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-document-missing",
  templateUrl: "document-missing.component.html",
})
export class DocumentmissingComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  DocumentMissingReportForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';     
  _FilteredList :any; 
  _StatusList:any;
  _HeaderList:any;
  
  _ColNameList = ["FileName", "EmpCode","FirstName","SecondName","Location","Band"];
  first = 0;
  rows = 10;

  constructor(
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
  ) {}
  ngOnInit() {
    this.DocumentMissingReportForm = this.formBuilder.group({             
      User_Token:  localStorage.getItem('User_Token') ,  
      CreatedBy: localStorage.getItem('UserID') ,      
    });    
    this.getStatusList();    
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }  
 
  onActivate(event) {
    this.activeRow = event.row;
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
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'Ref3', header: 'VESSEL NAME', index: 2 },
    { field: 'Ref4', header: 'PORT OF LOADING', index: 3 },
    { field: 'Ref5', header: 'Orgin', index: 3 },
    { field: 'Ref6', header: 'DISCHARGE PORT NAME', index: 3 },        
    { field: 'Ref7', header: 'NAME OF SUPPLIER', index: 3 },   
    { field: 'Ref8', header: 'PRODUCT NAME', index: 6 },
    { field: 'Ref9', header: 'BILL OF LADING NO', index: 3 },          
    { field: 'Ref10', header: 'BILL OF LADING DATE', index: 6 },   

  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
       'Ref3': el.Ref3,
       'Ref4': el.Ref4,
       'Ref5': el.Ref5,
       'Ref6': el.Ref6,        
       'Ref7': el.Ref7,
       'Ref8': el.Ref8,
       'Ref9': el.Ref9,         
       'Ref10': el.Ref10,
       'Ref11': el.Ref11,
    });
    // headerList.forEach((el1, i) => {
    //   formattedData[index]['metadata-' + parseInt(i + 1)] = el['Ref'+ parseInt(i+1)]
    // });
  });
  this.headerList = tableHeader;
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
  }
  
  getStatusList() {  
    const apiUrl = this._global.baseAPIUrl + 'IPLSearch/getIPLSearchByFilter';     
    this._onlineExamService.postData(this.DocumentMissingReportForm.value,apiUrl)
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
 //   console.log(csvData) 
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
    return this.DocumentMissingReportForm.valid 
  }

    onDownloadExcelFile() {      
    
      const apiUrl = this._global.baseAPIUrl + 'IPLSearch/GetDocumentMissingReport?userID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token')

      this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
        if (res) {
  
          console.log("res",res);
          saveAs(res,"document_missing_report.xlsx");
  
        }
      });
    }


  
 
}

