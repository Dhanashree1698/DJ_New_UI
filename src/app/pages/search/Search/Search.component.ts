import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef,EventEmitter,Output } from "@angular/core";
//import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';

import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import { saveAs } from 'file-saver';
//import { Console } from "console";

declare var $: any;

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-Search.component",
  templateUrl: "Search.component.html",
  styleUrls: ["Search.component.css"]
})
export class SearchComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;  
  _FilteredList :any; 
  _TemplateList :any;  
  TemplateList:any;
  SearchForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';  
  //UploadDocForm: FormGroup;  
  _SingleDepartment:any
  _ColNameList:any;
  BranchList: any;
  _BranchList: any;
  _FileNo: any = "";
  _PageNo: number = 1;
  FilePath:any="../assets/1.pdf";  
  _TempFilePath:any;
  _isDownload: any = localStorage.getItem('Download');
  _isDelete: any = localStorage.getItem('Delete');
  _TotalPages: any = 0;
  _SearchByList: any;
  userID = 1;
  TempField:any =localStorage.getItem('FileNo');
  _isEmail: any = false;
  _ShareLink: any = false;
  _isEdit: any = false;
  _DocTypeList: any;
  _FileList: any;
  _DocName: any;
  myFiles: string[] = [];
  _DocID: any;
  _MDList:any;
  _IndexList:any;
  _TempD:any;

  _FileDetails:string [][] = [];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  
  get filters() { return this.SearchForm.get('filters') as FormArray; }

  @Output() public onUploadFinished = new EventEmitter();
      
    constructor(
      private modalService: BsModalService,
      private _onlineExamService: OnlineExamServiceService,
      private _global: Globalconstants,
      private formBuilder: FormBuilder,
      private http: HttpClient,
      private httpService: HttpClient,
      public toastr: ToastrService,
      private route: ActivatedRoute,
      private router: Router,
    
  
    ) { }
  
    ngOnInit() {
      document.body.classList.add('CS');
      this.SearchForm = this.formBuilder.group({
      FileNo: ['', Validators.required],
      TemplateID: [0, Validators.required],                
      _ColNameList: this._ColNameList,
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      Viewer: [''],
      currentPage: [0],      
      PageCount: [0],
      //tickets: new FormArray([]),
      SerchBy: [''],
      DocID: ['0'],
      SearchByID: [],
      userID: localStorage.getItem('UserID') ,
      ACC: [''],
      BranchID:['0'],
      MFileNo: [''],
      DocuemntType: [''],
      AccNo: [''],     
      ToEmailID:[''],
      ValidDate:[''],
      IsAttachment:[''],
      filters: this.formBuilder.array([]),
  
      });
      this.getTemplate();
      this._PageNo = 1;
     // this.getSearchResult(1);
      this.getSearchParameterList(1);
     
      this.geBranchList();


  this._isDownload =localStorage.getItem('Download');
  this._isDelete =localStorage.getItem('Delete');
  this._isEmail= localStorage.getItem('Email');
  this._ShareLink= localStorage.getItem('Link');
  this._isEdit= localStorage.getItem('Edit');   
    }
    

    geBranchList() {
      const apiUrl =
        this._global.baseAPIUrl +
        "BranchMapping/GetBranchDetailsUserWise?ID=" +
        localStorage.getItem('UserID') +
        "&user_Token=" +
        this.SearchForm.get("User_Token").value;
      this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
        this.BranchList = data;
        this._FilteredList = data;
      });
    }
    onAddFilterRow() {
      let fg = this.formBuilder.group({
        Condition: ['0'],
        SearchByID: ['0'],
        Operation: ['0'],
        FileNo: [''],
        FieldType: [''],
        DateRange: [''],
        DateRangePicker: ['']
      })
      this.filters.push(fg)
    }
    onRemoveRow(indx) {
      this.filters.removeAt(indx)
    }
    onSearchBySelected(i){
      let selectedVal = this.filters.at(i).value.SearchByID
      let selectedDataType = this._SearchByList.find(s=>s.SID == selectedVal)
    this.filters.at(i).patchValue({"FieldType": selectedDataType.FieldType})
    }

    onDateOperationChange(i) {
      this.filters.at(i).patchValue({"DateRange": this.filters.at(i).value.Operation});
    }

    
    onFilterSubmited() {
      const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/OnDynamicFilterData';
   
      this._onlineExamService.postData(this.SearchForm.value, apiUrl)
        .subscribe(data => {

      this._FileList = data;
      this._FilteredList = data;
      this.GetDisplayField(this.SearchForm.get('TemplateID').value);
  
        }); 

    }
    
    OnLoad()
    {
      this.getSearchResult(this._isEdit);
    }
    
    entriesChange($event) {
      this.entries = $event.target.value;
    }
    filterTable($event) {
    
      let val = $event.target.value;
      this._FilteredList = this._FileList.filter(function (d) {
      //  console.log(d);
        for (var key in d) {
          if (key == "AccNo" || key == "BranchName" || key == "DocType" ) {
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
      OnReset() {  
      this.Reset = true;
      this.SearchForm.reset();  

      }
    
      getSearchParameterList(TID:any) {
    
        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchParameterList?ID=' + TID + '&user_Token='+ localStorage.getItem('User_Token')
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
          this._SearchByList = data;
          
        this.SearchForm.controls['SearchByID'].setValue(0);
            });
      }

      getDoctypeListByTempID(TID:any) {
        const apiUrl = this._global.baseAPIUrl + 'DocTypeMapping/getDoctypeListByTempID?ID=' + localStorage.getItem('UserID') + '&TemplateID='+ TID +'&user_Token='+this.SearchForm.get('User_Token').value
   this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
          this._DocTypeList = data;
         this.SearchForm.controls['DocID'].setValue("0");
          });
      }
      geTemplateNameListByTempID(TID: number) {       
        this.getSearchParameterList(TID);
        this.getDoctypeListByTempID(TID);
        this.getSearchResult(TID);
      
      }

      GetFilterSearch(tid:any)
      {
        this.GetFilterData(this.SearchForm.get('TemplateID').value);
      }

      getTemplate() {
        const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
          this.TemplateList = data;
       
          this.SearchForm.controls['TemplateID'].setValue(data[0].TemplateID);
        console.log("TempID",data[0].TemplateID);
        this._TempD = data[0].TemplateID;
        this.geTemplateNameListByTempID(this._TempD);

        });
      }
   
      getSearchResult(tempID:any) {
  const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchDataByFolderStructure?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token') + '&TemplateID=' + tempID  
    this._onlineExamService.getAllData(apiUrl).subscribe((data: [any]) => {
          this._FileList = data;
          this._FilteredList = data;
          this.GetDisplayField(tempID);

        });
      }
      
    GetDisplayField(TID:number) {
      const apiUrl=this._global.baseAPIUrl+'DataUpload/GetFieldsName?ID='+TID+'&user_Token='+ localStorage.getItem('User_Token') 
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
        this._ColNameList = data;
        this.prepareTableData(this._FilteredList, this._ColNameList);
      });
    }

    
    formattedData: any;
    headerList: any;
    immutableFormattedData: any;
    loading: boolean = true;
    prepareTableData(tableData, headerList) {
      let formattedData = [];
      let tableHeader: any = [
        { field: 'srNo', header: "SR NO", index: 1 },
        { field: 'branch', header: 'CUSTOMER', index: 2 },
        { field: 'pageCount', header: 'PAGE COUNT', index:36 }
      ];
      headerList.forEach((el, index) => {
        tableHeader.push({
          field: 'metadata-' + parseInt(index+1), header: el.DisplayName, index: parseInt(7+index)
        })
      })
      tableData.forEach((el, index) => {
        formattedData.push({
          'srNo': parseInt(index + 1),
          'accId': el.Ref1,
          'branch': el.BranchName,
          'TemplateName': el.TemplateName,
          'pageCount': el.DocCount,
          'AccNo': el.AccNo,
          'TemplateID': el.TemplateID,
          'ACC': el.ACC,
        });
        headerList.forEach((el1, i) => {
          formattedData[index]['metadata-' + parseInt(i + 1)] = el['Ref'+ parseInt(i+1)]
        });
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
      DownloadFileAll(_FileNo: any) { 
        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadFileFromDB?ID=' + localStorage.getItem('UserID') + '&FileNo= ' + _FileNo + ' &user_Token=' + localStorage.getItem('User_Token');
        this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
          if (res) {
            saveAs(res, _FileNo + '.pdf');
    
          }
        });
        
      }


      downloadFile(row: any) {

        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadTagFile?ID='+localStorage.getItem('UserID')+'&DocID='+row.DocID+'&_fileName='+row.AccNo+'&user_Token='+localStorage.getItem('User_Token');
        this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
          if (res) {
          
              saveAs(res, row.ACC + '.pdf');

          }
        });
    
      }
        
      Setfavourite(FileName: any) {

        this.SearchForm.patchValue({
          ACC: FileName,
          User_Token: localStorage.getItem('User_Token'),
          userID: localStorage.getItem('UserID')
        });
    
        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/Setfavourite';
        this._onlineExamService.postData(this.SearchForm.value, apiUrl)
        .subscribe( data => {
          swal.fire({
            title: "Favourite!",
            text: "Doc Type has been favourite",
            type: "success",
            buttonsStyling: false,
            confirmButtonClass: "btn btn-primary",
          });
          
        });
    
      }
    
      DeleteFile(Row: any) {
        swal
          .fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: "btn btn-danger",
            confirmButtonText: "Yes, delete it!",
            cancelButtonClass: "btn btn-secondary",
          })
          .then((result) => {
            if (result.value) {
              this.SearchForm.patchValue({
                ACC: Row.AccNo,
                User_Token: localStorage.getItem('User_Token'),
                userID: localStorage.getItem('UserID'),
                DocID: Row.DocID
              });

              const that = this;
              const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/Delete';
              this._onlineExamService.postData(this.SearchForm.value,apiUrl)     
              .subscribe( data => {
                  swal.fire({
                    title: "Deleted!",
                    text: "Doc Type has been deleted.",
                    type: "success",
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-primary",
                  });
                  that.getSearchResult(that.SearchForm.get('TemplateID').value);
                });

            }
          });
       
      }

      // Model Popup For Docuemnt Inserstion 
    
      showModal(Row: any): void {
    
        if (Row != null) {
          this._FileNo = Row.AccNo;
          this._DocID = Row.DocID;
          this._DocName = Row.ACC
          this.SearchForm.controls['MFileNo'].setValue(this._FileNo);
          this.SearchForm.controls['DocuemntType'].setValue(this._DocName);
        }
        // 
       $("#myModal").modal('show');
    
    
      }
      sendModal(): void {
        //do something here
        this.hideModal();
      }
      hideModal(): void {
        document.getElementById('close-modal').click();
        //this.getSearchResult();
      }

      getFileDetails(e) {
        //console.log (e.target.files);
        for (var i = 0; i < e.target.files.length; i++) {
          this.myFiles.push(e.target.files[i]);
        //  console.log("File",this.myFiles);

        }
        let selectedFileNames = '';
        this.myFiles.forEach(el => {
          selectedFileNames += el['name'] + '<br />';
        })
        $(".selected-file-name").html(selectedFileNames);
        //this._IndexList = e.target.files;
      }
    
      
    
    
      EditRowData(Row: any) {
        
        localStorage.setItem('FileNo', Row.AccNo);
        localStorage.setItem('TemplateID', Row.TemplateID);
        this.router.navigate(['/process/EditIndexing']);
      }


      MetaData(template: TemplateRef<any>, row: any)
      {
      let  __FileNo =row.AccNo;
      let  __TempID = row.TemplateID;

      const apiUrl=this._global.baseAPIUrl+'DataEntry/GetNextFile?id='+__TempID+'&FileNo='+__FileNo+'&user_Token='+ localStorage.getItem('User_Token');
  this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
  
         this._IndexList = data;          
      });
      }
    hidepopup()
    {
      this.modalRef.hide();
    }
    ViewDocument(template: TemplateRef<any>, row: any, indexTemplate: TemplateRef<any>) {
      this.MetaData(indexTemplate, row);
      this.modalRef = this.modalService.show(template);
      $(".modal-dialog").css('max-width', '1330px');
      this.GetDocumentDetails(row);
      this.GetFullFile(row.AccNo);
    }

    GetFullFile(FileNo:any) {

      const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetFullFile?ID='+localStorage.getItem('UserID')+'&&_fileName='+ FileNo +'&user_Token='+localStorage.getItem('User_Token');
      this._onlineExamService.getDataById(apiUrl).subscribe(res => {
        if (res) {
          this.FilePath = res;
           this._TempFilePath = res;
  
        }
      });
    }
    

    profileImg: any;
    documentDetails: any;
    GetDocumentDetails(row: any) {      
      this.profileImg = row.profileImg;
      const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetDocumentDetails?FileNo=' + row.AccNo + '&UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token')
      this._onlineExamService.getAllData(apiUrl).subscribe((data: [any]) => {
        this.documentDetails = data;
      });
    }

    showDocument(doc) {

      const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetTagFile?ID='+localStorage.getItem('UserID')+'&DocID='+doc.DocID+'&_fileName='+doc.AccNo+'&user_Token='+localStorage.getItem('User_Token');
      this._onlineExamService.getDataById(apiUrl).subscribe(res => {
        if (res) {
          this.FilePath = res;
        }
      });
    }

    ngOnDestroy() {
      document.body.classList.remove('CS');
    }

    selectAllRows = false;
    selectAllRow(e) {
      this.selectedRows = [];
      this.selectedRowsForMetadata = [];
      if (e.checked) {
        this.selectAllRows = true;
        this.formattedData.forEach(el => {
          this.selectedRows.push(el.AccNo);
          this.selectedRowsForMetadata.push(el.AccNo);
        })
      } else {
        this.selectAllRows = false;
    }
  }

  selectedRows = [];
  selectedRowsForMetadata = [];
  selectRow(e, row) {
    this.selectAllRows = false;
    e.originalEvent.stopPropagation();
    if (e.checked) {
     // this.selectedRows.push(row.AccNo +"_" + row.DocID);
     this.selectedRows.push(row.AccNo);
      this.selectedRowsForMetadata.push(row.AccNo);
    } else {
    //  var index = this.selectedRows.indexOf(row.AccNo +"_" + row.DocID);
    var index = this.selectedRows.indexOf(row.AccNo);
      this.selectedRows.splice(index, 1);
      var indexMetadata = this.selectedRows.indexOf(row.AccNo);
      this.selectedRows.splice(indexMetadata, 1);
    }
  }

  DownloadBulkFiles() {
     let _CSVData= "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
      
    }
   
    this.downloadBulkFileBYCSV(_CSVData) ;
  }

  downloadBulkFileBYCSV(_CSVData:any) {
       
    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SearchBulkFile?ID=' + localStorage.getItem('UserID') + '&_fileName= '+  _CSVData +' &user_Token='+ localStorage.getItem('User_Token');
    this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
      if (res) {

      
      saveAs(res, "Files" + '.zip');  
       
      }
    });

  }
  _HeaderList: any;
  GetHeaderNames()
{
  this._HeaderList="";
  for (let j = 0; j < this._ColNameList.length; j++) {  
       
      this._HeaderList += this._ColNameList[j].DisplayName +((j <= this._ColNameList.length-2)?',':'') ; 
  }
  this._HeaderList += '\n';
  let that = this;
  this._MDList.forEach(stat => {
      for (let j = 0; j < this._ColNameList.length; j++) {
        this._HeaderList += (j==0?(stat['Ref'+(j+1)]+''):stat['Ref'+(j+1)]) + ((j <= this._ColNameList.length-2)?',':'') ;
      }
    this._HeaderList += '\n'
  });
  

}


GetFilterData(tempID:any) {
 const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchDataByFilter?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token') + '&TemplateID='+this.SearchForm.get('TemplateID').value+'&BranchID='+this.SearchForm.get('BranchID').value+'&SearchParamterID='+this.SearchForm.get('SearchByID').value+'&SearchValues='+this.SearchForm.get('FileNo').value  
  this._onlineExamService.getAllData(apiUrl).subscribe((data: [any]) => {
       this._FileList = data;
       this._FilteredList = data;
       this.GetDisplayField(tempID);
     });
   }

  DownloadMetadata() {
    let _CSVData = "";
    for (let j = 0; j < this.selectedRowsForMetadata.length; j++) {          
      _CSVData += this.selectedRowsForMetadata[j] + ',';
    }
        const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + _CSVData + '&user_Token=' + localStorage.getItem('User_Token')+'&UserID='+localStorage.getItem('UserID')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._MDList = data;
      this.GetHeaderNames();
      let csvData = this._HeaderList; 
       let blob = new Blob(['\ufeff' + csvData], { 
          type: 'text/csv;charset=utf-8;'
      }); 
      let dwldLink = document.createElement("a"); 
      let url = URL.createObjectURL(blob);
      
      let isSafariBrowser =-1;
       if (isSafariBrowser) {  
          dwldLink.setAttribute("target", "_blank"); 
      } 
      dwldLink.setAttribute("href", url); 
      dwldLink.setAttribute("download", 'Metadata' + ".csv"); 
      dwldLink.style.visibility = "hidden"; 
      document.body.appendChild(dwldLink); 
      dwldLink.click(); 
      document.body.removeChild(dwldLink);
    });

  }
  ShareLink(template: TemplateRef<any>)
  {
    var that = this;
    let _CSVData= "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
    }
    this.SearchForm.controls['ACC'].setValue(_CSVData);
    this.SearchForm.controls['FileNo'].setValue(_CSVData);
    this.modalRef = this.modalService.show(template);

  }

  onSendEmailByShare() {

    const apiUrl = this._global.baseAPIUrl + 'Mail/SendEmailBulkFiles';
   
    this._onlineExamService.postData(this.SearchForm.value, apiUrl)
      .subscribe(data => {
        swal.fire({
          title: "Email!",
          text: "Email send successfully",
          type: "success",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-primary",
        });

      }); 
      this.modalRef.hide();
 
     
  }
  SendBulkEmail(template: TemplateRef<any>)
  {
    var that = this;
    let _CSVData= "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
    }
    this.SearchForm.controls['ACC'].setValue(_CSVData);
    this.SearchForm.controls['FileNo'].setValue(_CSVData);
    this.modalRef = this.modalService.show(template);
  }
  onSendEmail() {
  const apiUrl = this._global.baseAPIUrl + 'Mail/SendEmail';
   this._onlineExamService.postData(this.SearchForm.value, apiUrl)
      .subscribe(data => {
        swal.fire({
          title: "Email!",
          text: "Email send successfully",
          type: "success",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-primary",
        });

      }); 
      this.modalRef.hide(); 
  }
  
      
}
