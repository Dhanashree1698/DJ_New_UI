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
  selector: "app-EmailLog",
  templateUrl: "EmailLog.component.html",
  styleUrls: ["EmailLog.component.css"]
})
export class EmailLogComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  isReadonly = true;
  _TemplateList :any;
  first:any=0;
  rows:any=0

  StatusReportForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';     
  _FilteredList :any; 
  _StatusList:any;
  _HeaderList:any;
  TemplateList:any;
  BranchList:any;
  _IndexPendingList:any;
  _ColNameList = ["FileNo","Folder", "UserName","ToEmailID" ,"IsSend", "SendOn", "Remark"];


  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();

  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private http: HttpClient,
    private httpService: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    

  ) {}
  ngOnInit() {
    this.StatusReportForm = this.formBuilder.group({
      // TemplateID: [, Validators.required],  
       BranchID: [, Validators.required],  
      // _Flag: [, Validators.required],   
      DATEFROM:[],   
      DATETO:[],
      MailSend:[0] ,       
      User_Token:  localStorage.getItem('User_Token') ,  
      CreatedBy: localStorage.getItem('UserID') ,      
    });

   // this.getTemplate();
    this.geBranchList();
    this.getStatusList();

    this.Getpagerights();
    
  }

  Getpagerights() {

    var pagename ="EmailLog";
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
  filterTable($event) {
    console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._StatusList.filter(function (d) {
      //console.log(d);
      for (var key in d) {
        if (key == "Department" || key == "Customer" || key == "FileNo" ) {
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
      this.StatusReportForm.controls['BranchID'].setValue(0);

      
    //  this._FilteredList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  OnReset() {
    this.Reset = true;
    this.StatusReportForm.reset();
  }

  onSearch()
  {
    this.getStatusList();
  }


  // getStatusList() {  
  //   const apiUrl = this._global.baseAPIUrl + 'Status/GetStatusReport';          
  //   this._onlineExamService.postData(this.StatusReportForm.value,apiUrl)
  //   // .pipe(first())

  //   .subscribe( data => {
  //     alert(data);
  //     this._StatusList = data;          

  // });


  // } 
  
  getStatusList() {  

    const apiUrl = this._global.baseAPIUrl + 'Status/GetEmailLog';          
    this._onlineExamService.postData(this.StatusReportForm.value,apiUrl)
    // .pipe(first())

    .subscribe( data => {

      //console.log("Log",data);      
      this._StatusList = data;          
    //  this._FilteredList = data;    
      
      this._IndexPendingList = data;
      this._FilteredList = data;
      //this._ColNameList = data;
      this.prepareTableData(this._FilteredList, this._IndexPendingList);
      


  });

  } 


  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },      
       { field: 'FileNo', header: 'FileName', index: 2 },  
       { field: 'BranchName', header: 'Folder', index: 2 },  
       { field: 'DepartmentName', header: 'Cabinet', index: 2 },  
       { field: 'TemplateName', header: 'Templete Name', index: 2 },  
       
          { field: 'ToEmailID', header: 'ToEmailID', index: 3 },  
      { field: 'IsSend', header: 'IsSend', index: 4 },
      { field: 'SendOn', header: 'SendOn', index: 4 },
      { field: 'sendtype', header: 'SentType', index: 3 },
  //    { field: 'ProductName', header: 'ProductName', index: 3 },           
      { field: 'Remark', header: 'Remark', index: 5 },                
  
    ];
    // headerList.forEach((el, index) => {
    //   tableHeader.push({
    //     field: 'metadata-' + parseInt(index+1), header: el.DisplayName, index: parseInt(5+index)
    //   })
    // })
//    console.log("tableData",tableData);
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'FileNo': el.FileNo, 
        'TemplateName': el.TemplateName,             
        'ToEmailID': el.ToEmailID,   
        "IsSend": el.IsSend,
        "Remark": el.Remark,
        "SendOn": el.SendOn,
        'BranchName': el.BranchName,
        'DepartmentName':el.DepartmentName
     
      //  'DocID': el.DocID,
        // 'profileImg': el.PhotoPath
      });
      // headerList.forEach((el1, i) => {
      //   formattedData[index]['metadata-' + parseInt(i + 1)] = el['Ref'+ parseInt(i+1)]
      // });
    });
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
    

    console.log(this.formattedData);

  }
  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }
  
  // onSelect({ selected }) {
  //   this.selected.splice(0, this.selected.length);
  //   this.selected.push(selected);
  // }


  // onActivate(event) {
  //   this.activeRow = event.row;
  // }

  // entriesChange($event) {
  //   this.entries = $event.target.value;
  // }
  
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


  onDownload()
  {
    this.downloadFile();
  }

  GetHeaderNames()
  {
    this._HeaderList="";

    console.log("Lst",this._ColNameList);
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
    console.log("Header",this._HeaderList);
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

