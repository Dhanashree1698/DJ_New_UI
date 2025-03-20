import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, EventEmitter,Output } from "@angular/core";
//import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';

import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from "ngx-toastr";
import { HttpClient} from '@angular/common/http';
import { saveAs } from 'file-saver';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-BulkDownlaod",
  templateUrl: "BulkDownlaod.component.html",
  styleUrls: ["BulkDownlaod.component.css"]
})
export class BulkDownlaodComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;  
  _FilteredList :any; 
  _TemplateList :any;  
  AdvancedSearchForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';  
  //UploadDocForm: FormGroup;  
  _SingleDepartment:any
  _isDownload: any = localStorage.getItem('Download');
  _isDelete: any = localStorage.getItem('Delete');

  _ColNameList:any;
  _DepartmentList: any;
  _BranchList: any;
  _FileNo: any = "";
  _PageNo: number = 1;

  // FilePath: any = "../assets/temp/dump637295825939278920-6fcb1cf1-fc94-4327-bca2-7fa5010f7b3d.pdf";
  // _Replacestr:any="C:/inetpub/wwwroot/DMSInfo/assets";
  // //_Replacestr:any="D:/WW/07Jully2020/15Jan2020/src/assets";

  _CSVData: any;
  public records: any[] = [];
  _TotalPages: any = 0;
  _SearchByList: any;
  userID = 1;
  _DocTypeList: any;
  _FileList: any;
  _DocName: any;
  myFiles: string[] = [];
  _DocID: any;
  _MDList:any;
  TempField:any;  
  _FileDetails:string [][] = [];
  
  @Output() public onUploadFinished = new EventEmitter();    
  
    constructor(
      private _onlineExamService: OnlineExamServiceService,
      private _global: Globalconstants,
      private formBuilder: FormBuilder,
      public toastr: ToastrService,
    
  
    ) { }
  
    ngOnInit() {
      this.AdvancedSearchForm = this.formBuilder.group({
        FileNo: [''],
        ACC: [''],
        CSVData: [''],
        TemplateID: 1, 
        _ColNameList: this._ColNameList,      
        CreatedBy: localStorage.getItem('UserID'),
        User_Token: localStorage.getItem('User_Token'),       
        SerchBy: [''],        
        SearchByID: 1,
        userID: localStorage.getItem('UserID'),
      
  
      });

  
  //    this.getSearchParameterList();
     this.getTemplate();
      // this._isDownload =localStorage.getItem('Download');
      // this._isDelete =localStorage.getItem('Delete');  
      // this.TempField = localStorage.getItem('Fname');
      
    }    

    
      OnReset() {  
      this.Reset = true;
      this.AdvancedSearchForm.reset();             
      }
  
    
      getSearchParameterList() {
    
        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchParameterList?ID=' + this.AdvancedSearchForm.controls['TemplateID'].value + '&user_Token='+this.AdvancedSearchForm.get('User_Token').value
    
        //  const apiUrl=this._global.baseAPIUrl+'SearchFileStatus/getSearchParameterList?user_Token=123123'
        this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
        this._SearchByList = data;
          
          this.AdvancedSearchForm.controls['SearchByID'].setValue(0);
          //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        });
      }
   
    
      getSearchResult() {

        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchData';
        //this._onlineExamService.postData(this.AdvancedSearchForm.value,apiUrl)    
        //  const apiUrl=this._global.baseAPIUrl+'SearchFileStatus/getSearchData?FileNo='+ __FileNo + '&user_Token=123123'
        this._onlineExamService.getAllDataWithFormValue(this.AdvancedSearchForm.value, apiUrl).subscribe((data: {}) => {
          //this._TagDetailsList = data;  
          this._FileList = data;
          
          this._FilteredList = data;
          console.log("Result", data);
          //let len= this._FileList.length;
          if (this._FileList.length <= 0) {
            this.toastr.show(
              '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> '+ data +' </span></div>',
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
    
        });
        //this.FileTaggingForm.controls['DocID'].setValue(0);
      }

      getTemplate() {
    
        const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token='+this.AdvancedSearchForm.get('User_Token').value
        //const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?user_Token='+this.AdvancedSearchForm.get('User_Token').value
        this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
          this._TemplateList = data;
          this.AdvancedSearchForm.controls['TemplateID'].setValue(0);
          //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
          //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        });
      }


      
    
      geTemplateNameListByTempID() {
        this.getSearchParameterList();
      }
    
      DownloadFileAll(_FileNo: any, _FilePath: any) {

        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadFile?ID=' + localStorage.getItem('UserID') + '&_filePath= '+_FilePath +' &user_Token='+this.AdvancedSearchForm.get('User_Token').value;
        this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
          if (res) {         
   
      //      var __FilePath = _TempFilePath ;    
            console.log("Final FP-- res ", res);   
            saveAs(res, _FileNo + '.pdf');

          }
        });
    
      }
    
      downloadBulkFile() {


        if (this.AdvancedSearchForm.get('FileNo').value !="")
        {
       
        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SearchBulkFile?ID=' + localStorage.getItem('UserID')  + '&_fileName= '+this.AdvancedSearchForm.get('FileNo').value+'&user_Token='+ this.AdvancedSearchForm.get('User_Token').value;
        this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
          if (res) {

          saveAs(res, "Files" + '.zip');             
          }
           console.log("Final FP-- res ", res);  
        });
      }
      else
      {
        this.ShowErrormessage("please enter File no in multi search field");
      }
    
      }

      uploadListener($event: any): void {

        let files = $event.srcElement.files;
        this._CSVData="";

      //  alert(this._CSVData);
        if (1==1) {
          
          let input = $event.target;
          let reader = new FileReader();
          console.log("FileName",input.files[0].name);
          reader.readAsText(input.files[0]);
          $(".selected-file-name").html(input.files[0].name);
          reader.onload = () => {
            let csvData = reader.result;
            let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
         //   console.log("csvRecordsArray", csvRecordsArray);    
           /// this._CSVData = csvRecordsArray;
            
              this._CSVData= "";
              for (let j = 0; j < csvRecordsArray.length; j++) {          
                this._CSVData += csvRecordsArray[j] + ',';
                // headerArray.push(headers[j]);  
               // console.log("CSV Data", this._CSVData);
              }
          
           //   console.log("CSV Data", this._CSVData);

           // this._IndexList = csvRecordsArray;
    
            // alert(headersRow);
            // alert(this._ColNameList);
            //let ColName = 
            // let validFile = this.getDisplayNames(csvRecordsArray);
            // if (validFile == false) {
            //   console.log('Not Valid File', csvRecordsArray);
            //   this.fileReset();
            // } 
            
            // else {
            //   this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
            //   this._FilteredList = this.records
            //   console.log('Records', this._FilteredList);
            // }
    
    
          };
    
          reader.onerror = function () {
            console.log('error is occurred while reading file!');
          };
    
        } else {
          this.toastr.show(
            '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please Select A Valid CSV File And Template</span></div>',
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
          this.fileReset();
        }
      }

      isValidCSVFile(file: any) {
        return file.name.endsWith(".csv");
      }
    
      getHeaderArray(csvRecordsArr: any) {
        let headers = (<string>csvRecordsArr[0]).split(',');
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
          headerArray.push(headers[j]);
        }
        return headerArray;
      }


      downloadFile() {
        const filename = 'BulkdownloadFileFomrat';
        
        let csvData = "FileNo,";    
        //console.log(csvData)
        let blob = new Blob(['\ufeff' + csvData], {
          type: 'text/csv;charset=utf-8;'
        });
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser = -1;
        // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
        // navigator.userAgent.indexOf('Chrome') == -1; 
    
        //if Safari open in new window to save file with random filename. 
        if (isSafariBrowser) {
          dwldLink.setAttribute("target", "_blank");
        }


        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", filename + ".csv");
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      //}
      }  

      downloadBulkFileBYCSV() {
       // this.fileReset();
      //  if (this._CSVData.length)

      var splitted = this._CSVData.split(","); 
//alert(splitted.length);

      if (splitted.length  <=500)
      {

        this.AdvancedSearchForm.patchValue({
          ACC: this._CSVData,
          User_Token: localStorage.getItem('User_Token'),
          userID: localStorage.getItem('UserID')
        });

      //  console.log(this._CSVData);

        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DLoadBulkFiles';   
        //   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SearchBulkFile?ID=' + localStorage.getItem('UserID') + '&_fileName= '+  _CSVData +' &user_Token='+ localStorage.getItem('User_Token');
        //  this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
          this._onlineExamService.BulkDownload(this.AdvancedSearchForm.value, apiUrl).subscribe( res => {
            if (res) {      
            saveAs(res, "Bulk Files" + '.zip');         
            }
            // console.log("Final FP-- res ", res);  
          });       
    
        }
        else
        {
          this.ShowErrormessage("Bulk Download not more than 500 files");

        }
      }


      downloadBulkFileBYCSVOnSFTP() {

        this.AdvancedSearchForm.patchValue({
          ACC: this._CSVData,
        //  CSVData: this._CSVData,
          User_Token: localStorage.getItem('User_Token'),
          userID: localStorage.getItem('UserID')
        });

        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/downloadBulkFileBYCSVOnSFTP';
 
      //  const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SearchBulkFile?ID=' + localStorage.getItem('UserID') + '&_fileName='+ this._CSVData+' &user_Token='+ this.AdvancedSearchForm.get('User_Token').value;
       this._onlineExamService.postData(this.AdvancedSearchForm.value,apiUrl).subscribe((res: {}) => {
          if (res) {

          
          saveAs(res, "Files" + '.zip');  
           
          }
         //  console.log("Final FP-- res ", res);  
        });
    
      }

      fileReset() {
        //this.csvReader.nativeElement.value = "";  
        this.records = [];
      }

      ShowErrormessage(data:any)
{
  this.toastr.show(
    '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation ! </span> <span data-notify="message"> '+ data +' </span></div>',
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

// DownloadFiles(Filepath:any, FileName:any){

//         var _TempFilePath = Filepath ; 
//         console.log("_TempFilePath", Filepath);
//         console.log("_Replacestr", this._Replacestr );
//         _TempFilePath = _TempFilePath.replace(new RegExp(/\\/g),"/");
//         _TempFilePath = _TempFilePath.replace(this._Replacestr,"../assets")
      
//         var __FilePath = _TempFilePath ;    
//         console.log("Final FP", __FilePath);   
//       //  saveAs(this.FilePath, FileName + '.pdf');
//         saveAs(__FilePath, FileName + '.pdf');
        
// }
 
        
}
