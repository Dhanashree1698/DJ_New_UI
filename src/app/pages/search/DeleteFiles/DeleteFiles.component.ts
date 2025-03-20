import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, EventEmitter,Output } from "@angular/core";
//import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';

import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from "ngx-toastr";
import { HttpClient} from '@angular/common/http';
import { saveAs } from 'file-saver';
import { MessageService } from 'primeng/api'; 
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-DeleteFiles",
  templateUrl: "DeleteFiles.component.html",
  styleUrls: ["DeleteFiles.component.css"]
})
export class DeleteFilesComponent implements OnInit {
 
  activeRow: any;
  SelectionType = SelectionType; 
  _TemplateList :any;  
  DeleteFilesForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';   
  _SingleDepartment:any;  
  _FileNo: any = ""; 
  _CSVData: any;
  public records: any[] = []; 

  @Output() public onUploadFinished = new EventEmitter();    
  
    constructor(
      private _onlineExamService: OnlineExamServiceService,
      private _global: Globalconstants,
      private formBuilder: FormBuilder,
      public toastr: ToastrService,
      private route: ActivatedRoute,
      private router: Router,
      private messageService: MessageService
    ) { }
  
    ngOnInit() {
      this.DeleteFilesForm = this.formBuilder.group({
        FileNo: [''],
        CreatedBy: localStorage.getItem('UserID'),
        User_Token: localStorage.getItem('User_Token'),
        userID: localStorage.getItem('UserID'),    
        DeleteID: [0, Validators.required],  
        TemplateID: [0, Validators.required],  
      });

     this.getTemplate();
   
      this.Getpagerights();
    }    

    
      OnReset() {  
      this.Reset = true;
      this.DeleteFilesForm.reset();             
      }
      

      Getpagerights() {

        var pagename ="Delete Files";
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
   
      getTemplate() {
    
        const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token='+this.DeleteFilesForm.get('User_Token').value
        //const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?user_Token='+this.DeleteFilesForm.get('User_Token').value
        this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
          this._TemplateList = data;
          this.DeleteFilesForm.controls['TemplateID'].setValue(0);
          //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
          //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        });
      }    
    
      geTemplateNameListByTempID() {
      
      }
     
     
      uploadListener($event: any): void {

        let files = $event.srcElement.files;
    
        if (this.isValidCSVFile(files[0]) && this.DeleteFilesForm.get('TemplateID').value > 0) {
          
          let input = $event.target;
          let reader = new FileReader();
          console.log(input.files[0]);
          reader.readAsText(input.files[0]);
    
          reader.onload = () => {
            let csvData = reader.result;
            let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
            console.log("csvRecordsArray", csvRecordsArray);    
           /// this._CSVData = csvRecordsArray;
            
              this._CSVData= "";
              for (let j = 0; j < csvRecordsArray.length; j++) {          
                this._CSVData += csvRecordsArray[j] + ',';
                // headerArray.push(headers[j]);  
                console.log("CSV Data", this._CSVData);
              }
              
          };
    
          reader.onerror = function () {
            console.log('error is occurred while reading file!');
          };
    
        } else {
          // this.toastr.show(
          //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please Select A Valid CSV File And Template</span></div>',
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
          this.messageService.add({ severity: 'error', summary: 'Error', detail:'Please Select A Valid CSV File And Template' });
          this.fileReset();
        }
      }

      isValidCSVFile(file: any) {
        return file.name.endsWith(".csv");
      }
     


      downloadFile() {
        const filename = 'DeelteFileFormat';
        
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

      DeleteFiles() {

        this.DeleteFilesForm.patchValue({
          FileNo: this._CSVData,      
         
        });
    
        const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DeleteBulkFiles';
        this._onlineExamService.postData(this.DeleteFilesForm.value, apiUrl)
        .subscribe( data => {
          
          console.log("Data",data);
        //  this.showmessage(data);
          
        alert(data);

        });
       
    
      }

      showmessage(data:any)
      {
        this.messageService.add({ severity: 'success', summary: 'Success', detail:data });
    
    
      }

      fileReset() {
        //this.csvReader.nativeElement.value = "";  
        this.records = [];
      }
 
 
        
}
