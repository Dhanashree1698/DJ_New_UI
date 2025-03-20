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
import { MessageService } from 'primeng/api'; 
import swal from "sweetalert2";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-metadata",
  templateUrl: "metadata.component.html",
  styleUrls: ["metadata.component.css"]
})
export class MetadataComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  MetaDataForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';     
  _FilteredList :any; 
  _StatusList:any;
  _ColNameList:any;
  _HeaderList:any;
  TemplateList:any;
  BranchList:any;

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  first = 0;
  rows = 10;

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
    private messageService: MessageService

  ) {}
  ngOnInit() {
    this.MetaDataForm = this.formBuilder.group({
     
      TemplateID: ["", Validators.required],
      BranchID: ["", Validators.required],
      User_Token: localStorage.getItem('User_Token') , 
    });
    this.getTemplate();
    this.geBranchList();

    //this.Getpagerights();
  }


  Getpagerights() {

    var pagename ="Meta Data Report";
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
  filterTable($event) {
 //   console.log($event.target.value);
   // console.log('ColNameList',this._ColNameList);
    
    let val = $event.target.value;
    this._FilteredList = this._StatusList.filter(function (d) {
      for (var key in d) {
        if(
          key == 'FileNo'||
          key == 'Ref2'||
          key == 'Ref3'||
          key == 'Ref4'||
          key == 'Ref5'||
          key == 'Ref6'||
          key == 'Ref7'||
          key == 'Ref8'||
          key == 'Ref9'||
          key == 'Ref10'||
          key == 'Ref11'||
          key == 'Ref12'||
          key == 'Ref13'||
          key == 'Ref14'||
          key == 'Ref15'||
          key == 'Ref16'||
          key == 'Ref17'||
          key == 'Ref18'||
          key == 'Ref19'||
          key == 'Ref20') {
          if (d[key] && d[key].toLowerCase().indexOf(val) !== -1) {
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

  OnReset() {
    this.Reset = true;
    this.MetaDataForm.reset({User_Token: localStorage.getItem('User_Token')});
  }

  geBranchList() {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    const apiUrl =
      this._global.baseAPIUrl +
      "BranchMapping/GetBranchDetailsUserWise?ID=" +
      localStorage.getItem('UserID') +
      "&user_Token=" +
      this.MetaDataForm.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this.BranchList = data;
      this.MetaDataForm.controls['TemplateID'].setValue(0);
      this.MetaDataForm.controls['BranchID'].setValue(0);

      
    //  this._FilteredList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  getTemplate() {  

    const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token='+localStorage.getItem('User_Token')   
    //const apiUrl=this._global.baseAPIUrl+'Template/GetTemplate?user_Token='+ this.MetaDataForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
    this.TemplateList = data;  
  //  console.log("TemplateList",this.TemplateList);
  //  this.FileTaggingForm.get('User_Token').value  
    this.MetaDataForm.controls['TemplateID'].setValue(0);
 //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
//this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
});
}
 


  getMetdataList() {  

    const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByCustomer';          
    this._onlineExamService.postData(this.MetaDataForm.value,apiUrl)
    // .pipe(first())
    .subscribe( data => {
     
      //console.log("MD",data);
      this._StatusList = data;     
      this._FilteredList = data;     
      this.GetHeaderNames();
     // this.downloadFile();
    });
  }
  
  onSearch()
  {
    this.getMetdataList();
    if(this.MetaDataForm.controls['TemplateID'].value == 0){
      this. geTemplateNameListByTempID(0);
    }
  }
  onDownload()
  {
    this.downloadFile();
  } 
  geTemplateNameListByTempID(TID:number)
  {
        this.GetDisplayField(TID);
  }
  
  GetDisplayField(TID:number) {  

   /// alert(TID);
   //TemplateID;

    const apiUrl=this._global.baseAPIUrl+'DataUpload/GetFieldsName?ID='+ TID +'&user_Token='+ localStorage.getItem('User_Token') 
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
    
     this._ColNameList = data;
  //  console.log("_ColNameList", this._ColNameList);
     
   // this.DataUploadForm.controls['TemplateID'].setValue(0);
 //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
//this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
});
}

// GetHeaderNames()
// {
//   let formattedData = [];
//   let rowData = {};
//   this._HeaderList="";
//   for (let j = 0; j < this._ColNameList.length; j++) {  
       
//       this._HeaderList += this._ColNameList[j].DisplayName +((j <= this._ColNameList.length-2)?',':'') ;
//     // headerArray.push(headers[j]);  
//   }
//   this._HeaderList +=','+"PageCount"

//   this._HeaderList +=','+"SubfolderName"

//   this._HeaderList += '\n'
//   this._StatusList.forEach(stat => {
//     for (let j = 0; j < this._ColNameList.length; j++) {  
       
//       this._HeaderList += (j==0?(stat['FileNo']+''):stat['Ref'+(j+1)]) + ((j <= this._ColNameList.length-2)?',':'') ;
//       // headerArray.push(headers[j]);  
      
//     formattedData.push({})
//     }
//     this._HeaderList +=',' +stat.PageCount; 
//     this._HeaderList +=',' +stat.SubfolderName; 
//     this._HeaderList += '\n'
//   });
  
// console.log(this._HeaderList)
// console.log(this._StatusList)
// console.log(this._ColNameList)
// }
formattedData: any = [];
loading: boolean = false;
immutableFormattedData: any;
GetHeaderNames() {
  let formattedData = [];
  this._HeaderList = "";

  // Construct header list
  debugger
  for (let j = 0; j < this._ColNameList.length; j++) {
    this._HeaderList += this._ColNameList[j].DisplayName + (j <= this._ColNameList.length - 2 ? ',' : '');
  }
  this._HeaderList += ',' + "PageCount";
  this._HeaderList += ',' + "SubfolderName";
  this._HeaderList += '\n';

  // Populate data rows
  this._StatusList.forEach((stat, index) => {
    let rowData = {};
    for (let j = 0; j < this._ColNameList.length; j++) {
      let columnName = this._ColNameList[j].DisplayName;
      let value = j == 0 ? stat['FileNo'] : stat['Ref' + (j + 1)];
      rowData[columnName] = value;
      this._HeaderList += value + (j <= this._ColNameList.length - 2 ? ',' : '');
    }

    // Add PageCount and SubfolderName to both the header list and rowData
    this._HeaderList += ',' + stat.PageCount;
    this._HeaderList += ',' + stat.SubfolderName;
    this._HeaderList += '\n';

    // rowData['PageCount'] = stat.PageCount;
    // rowData['SubfolderName'] = stat.SubfolderName;

    // Add rowData to formattedData
    formattedData.push(rowData);
  });

  // Save formattedData to class-level variables if needed
  this.formattedData = formattedData;
  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
  // console.log(this._HeaderList);
  // console.log(this._StatusList);
  // console.log(this._ColNameList);
  // console.log(this.formattedData);
}
paginate(e) {
  this.first = e.first;
  this.rows = e.rows;
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

downloadFile() { 
  if(this._StatusList.length>0) {
    this.GetHeaderNames();
    let csvData = this._HeaderList; 
   // alert(this._HeaderList);
   // console.log("Data",csvData) 
    let blob = new Blob(['\ufeff' + csvData], { 
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
    dwldLink.setAttribute("download", 'MetaData' + ".csv"); 
    dwldLink.style.visibility = "hidden"; 
    document.body.appendChild(dwldLink); 
    dwldLink.click(); 
    document.body.removeChild(dwldLink); 
  } else {
    // this.toastr.show(
    //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">There should be some data before you download!</span></div>',
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
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'There should be some data before you download!' });
 
  }
  
}

isValid() {
  return this.MetaDataForm.valid 
}

// downloadFile(data, filename = 'data') { 
//   this.GetHeaderNames();
//   let csvData = this._HeaderList; 
//   alert(this._HeaderList);
//   console.log("Data",csvData) 
//   let blob = new Blob(['\ufeff' + csvData], { 
//       type: 'text/csv;charset=utf-8;'
//   }); 
//   let dwldLink = document.createElement("a"); 
//   let url = URL.createObjectURL(blob); 
//   let isSafariBrowser =-1;
//   // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
//   // navigator.userAgent.indexOf('Chrome') == -1; 
  
//   //if Safari open in new window to save file with random filename. 
//   if (isSafariBrowser) {  
//       dwldLink.setAttribute("target", "_blank"); 
//   } 
//   dwldLink.setAttribute("href", url); 
//   dwldLink.setAttribute("download", filename + ".csv"); 
//   dwldLink.style.visibility = "hidden"; 
//   document.body.appendChild(dwldLink); 
//   dwldLink.click(); 
//   document.body.removeChild(dwldLink); 
// }

 
}

