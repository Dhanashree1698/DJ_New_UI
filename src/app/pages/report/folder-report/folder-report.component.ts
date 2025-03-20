import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Globalconstants } from 'src/app/Helper/globalconstants';
import { OnlineExamServiceService } from 'src/app/Services/online-exam-service.service';
import { MessageService } from 'primeng/api'; 
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: 'app-folder-report',
  templateUrl: './folder-report.component.html',
  styleUrls: ['./folder-report.component.scss']
})
export class FolderReportComponent implements OnInit {
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
  _ColNameList = ["userid","name", "created_date"];


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
    private messageService: MessageService

  ) {}
  ngOnInit(): void {
    this.StatusReportForm = this.formBuilder.group({
      // TemplateID: [, Validators.required],  
       BranchID: [, Validators.required],  
      // _Flag: [, Validators.required],   
      DATEFROM:[],   
      DATETO:[],         
      User_Token:  localStorage.getItem('User_Token') ,  
      CreatedBy: localStorage.getItem('UserID') ,      
    });
    this.getStatusList()
  }

  onSearch()
  {
    this.getStatusList();
  }

  getStatusList() {  

    const apiUrl = this._global.baseAPIUrl + 'Status/userReport';          
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
       { field: 'Filename', header: 'File Name', index: 2 },  
       { field: 'file_count', header: 'File Count', index: 2 },  
       { field: 'file_size', header: 'File Size', index: 2 },  
       { field: 'cabinet', header: 'Cabinet', index: 2 },  
       { field: 'created_by', header: 'Created By', index: 2 },  
       { field: 'created_date', header: 'Created Date', index: 2 },  
       
          { field: 'created_date', header: 'CREATED DATE', index: 3 },                
  
    ];
  
//    console.log("tableData",tableData);
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'file_name': el.file_name, 
        'file_count': el.file_count,             
        'cabinet': el.cabinet,             
        'created_by': el.created_by,
        'created_date': el.created_date
     
      
      });
     
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
    return this.StatusReportForm.valid 
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


}
