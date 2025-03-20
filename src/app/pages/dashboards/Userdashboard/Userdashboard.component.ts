import { Component, OnInit, NgZone, TemplateRef, ViewChild } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import swal from "sweetalert2";
//import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
//import { Label } from 'ng2-charts';

// Themes begin
am4core.useTheme(dataviz);
am4core.useTheme(am4themes_animated);
// Themes end


import { AxisRenderer } from '@amcharts/amcharts4/charts';
import { any } from "@amcharts/amcharts4/.internal/core/utils/Array";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { TagInputComponent as SourceTagInput } from 'ngx-chips';
import { of, throwError } from "rxjs";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-dashboard",
  templateUrl: "Userdashboard.component.html",
  styleUrls: ["Userdashboard.component.css"]
})

export class UserdashboardComponent implements OnInit {
  public datasets: any;
  public data: any;
  public salesChart;

  public clicked: boolean = true;
  public clicked1: boolean = false;
  public chartFirst: any;
  public chartFirstFU: any;
  public chartActivity: any;
  public updateActivityChartInterval;

  first = 0;
  rows = 10;
  _FilteredList:any;
  _IndexPendingList:any;
  activeRow: any;
  UserID:any;
  UserDashboardForm: FormGroup;   
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
  _StatusList :any; 
  _LogList :any; 
  DatauploadCount:0;
  TaggingCount:0;
  FileUploadCount:0;
  UserCount:0;
  _ActivityList :any;
  activityChartData:any;
  firstChartData:any;
  firstChartDataFU:any;
  _UserL:any;  
  _UploadList:any;
  _ActivityLog:any;
  activitylogChartData:any;
  chartActivityLog:any;
  Checker:any;
  Deleted:any;
  View:any;
  DeleteLastWeek:any;
  DeleteTillDate:any;
  DOCFIles:any;
  EmailNotSent:number=10;
  EmailSent:number=25;
  Favourite:any;
  FileSize:number=45;
  Folder:any;
  JPGFIles:any;
  LoginLastWeek:any;
  LoginTillDate:any;
  Maker:any;
  Email:any;
  Metadata:any;
  OCRFilesInProcess:any;
  OCRFilesConverted:any;
  PageCount:any;
  PDFFIles:any;
  Reject:any;
  Searched:any;
  TotalFiles:any;
  TotalSize:number=200;
  User:any;
  WithData:any;
  Viewed:any;
  WithoutData:any;
  XLSFIles:any;
  displayStyle: string;
  type: any;
  Download:any;
  MakerUploaded:any;
  FolderCnt:any;
  CabinetCnt:any;
  SubFolderCnt:any;
  fileExt: any;
  FilePath: any;
  private _TempFilePath: any;
  private _IndexList: {};
  docViewModalRef: BsModalRef;
  modalRef: BsModalRef;
  isFileNoLink: boolean;
  emailReciepients = [];
  emailReciepientsShare = [];
  selectedRows = [];
  selectAllRows: boolean = false;
  _isEmail: string;
  _ShareLink: string;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  Foldername:any ="Total Folder";
  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: '150px',
      minHeight: '150px',
      maxHeight: '150px',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    // uploadUrl: 'v1/image',
    // upload: (file: File) => {
    //   return;
    // },
    // uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  }
  public onAddedFunc = this.beforeAdd.bind(this);
  downloadForm: FormGroup;
  constructor(
     private formBuilder: FormBuilder,
     private _onlineExamService: OnlineExamServiceService,
     private _global: Globalconstants,
     private modalService: BsModalService,
     public toastr: ToastrService,
    private zone: NgZone
  ) { }

  ngOnInit() {
      this._isEmail= localStorage.getItem('Email');
      this._ShareLink= localStorage.getItem('Link');
     this.UserDashboardForm = this.formBuilder.group({
       BranchName: ['', Validators.required],
      User_Token:localStorage.getItem('User_Token'),
      UserID:[0, Validators.required],
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0]
     });
   //  this.geBranchList();

   //this.BindUserLog();
   this.StatusList();
   this.downloadForm = this.formBuilder.group({
    FileNo: [''],
    searchText: [],
    TemplateID:[0],
    DeptID: [0],
    BranchID: [0],
    CreatedBy: localStorage.getItem('UserID'),
    User_Token: localStorage.getItem('User_Token'),
    Viewer: [''],
    currentPage: 0,
    PageCount: 0,
  //  tickets: new FormArray([]),
    SerchBy: [''],
    DocID: [''],
    SearchByID: [],
    userID: localStorage.getItem('UserID'),
    ACC: [''],
    MFileNo: [''],
    DocuemntType: [''],
    ToEmailID:[''],
    htmlContent: [''],
    ValidDate:[''],
    IsAttachment:[''],
    Subject:[''],
    predefined:['']

  });
  }



  ngOnDestroy() {
    clearInterval(this.updateActivityChartInterval);
    this.zone.runOutsideAngular(() => {
      if (this.chartFirst) {
        this.chartFirst.dispose();
        this.chartFirstFU.dispose();
        this.chartActivityLog.dispose();
        this.chartActivity.dispose();
      }
    });

  }

  
  
//   FolderStruture(strfolder:any)
//   {

//   //  this.FolderCnt= ele.Cnt;
//     // CabinetCnt:any;
//      //SubFolderCnt:any;

//     if (strfolder == "Folder")
//     {
// this.Folder =  this.FolderCnt;
// this.Foldername ="Folder";

//     }
//     else if (strfolder == "Cabinet")
//     {
//       this.Folder =  this.CabinetCnt;
//       this.Foldername ="Cabinet";
//     }
//     else if (strfolder == "SubFolder")
//     { 
//       this.Folder =  this.SubFolderCnt;   
//       this.Foldername ="Sub Folder";   
//     }

// //alert(strfolder);

//   }




StatusList() {
  const apiUrl=this._global.baseAPIUrl+'Status/GetStatusCount?userID=0&user_Token='+localStorage.getItem('User_Token')
  this._onlineExamService.getAllData(apiUrl).subscribe((data:any) => {     

//console.log("Chart",data);

    data.forEach(ele =>{
     // console.log(ele.Activity); // 1, "string", false

      if (ele.Activity =="Checker")
      {
     this.Checker= ele.Cnt;
      }
      else if (ele.Activity =="Download")
      {
       // alert( ele.Download);
     this.Download = ele.Download;
 
      }
      else if (ele.Activity =="MakerUploaded")
        {
       this.MakerUploaded= ele.Cnt;
        }

      else if (ele.Activity =="Deleted")
      {
     this.Deleted= ele.Cnt;
      }
      else if (ele.Activity =="DeleteLastWeek")
      {
     this.DeleteLastWeek= ele.Cnt;
      }
      else if (ele.Activity =="Deleted")
      {
     this.Deleted= ele.Cnt;
      }
     
      else if (ele.Activity =="DOC FIles")
      {
     this.DOCFIles= ele.Cnt;
      }   

      else if (ele.Activity =="EmailNotSent")
      {
     this.EmailNotSent= ele.Cnt;
      }
      else if (ele.Activity =="Email")
      {
     this.Email= ele.Cnt;
      }
      
    
      else if (ele.Activity =="Favourite")
      {
     this.Favourite= ele.Cnt;
      }
    
      else if (ele.Activity =="Folder")
      {
     this.Folder= ele.Cnt;
     this.FolderCnt= ele.Cnt;
    // CabinetCnt:any;
     //SubFolderCnt:any;

      }
      else if (ele.Activity =="Cabinet")
      {
     this.CabinetCnt= ele.Cnt;
    // this.FolderCnt= ele.Cnt;
    // CabinetCnt:any;
     //SubFolderCnt:any;

      }
      else if (ele.Activity =="SubFolder")
      {
     this.SubFolderCnt= ele.Cnt;
    // this.FolderCnt= ele.Cnt;
    // CabinetCnt:any;
     //SubFolderCnt:any;

      }

      else if (ele.Activity =="JPG FIles")
      {
     this.JPGFIles= ele.Cnt;
      }
      else if (ele.Activity =="PDF FIles")
      {
     this.PDFFIles= ele.Cnt;
      }
     

      if (ele.Activity =="Maker")
      {
     this.Maker= ele.Cnt;
      }
      else if (ele.Activity =="Metadata")
      {
     this.Metadata= ele.Cnt;
      }

      
 
      else if (ele.Activity =="Reject")
      {
     this.Reject= ele.Cnt;
      }
      else if (ele.Activity =="Searched")
      {
     this.Searched= ele.Cnt;
      }

      else if (ele.Activity =="TotalFiles")
      {
     this.TotalFiles= ele.Cnt;
      }
    
      else if (ele.Activity =="User")
      {
     this.User= ele.Cnt;
      }
      else if (ele.Activity =="Viewed")
      {
        this.Viewed= ele.Cnt;
     //   alert(ele.Cnt);

     this.View= ele.Cnt;
      }
    
     else if (ele.Activity =="XLS FIles")
      {
     this.XLSFIles= ele.Cnt;
      }
  

    });
    this.loadChartsData();



     
//       if (data[0].Activity =="Checker")
//         {
//        this.Checker= data[0].Cnt;
//         }
//         if (data[1].Activity =="Deleted")
//         {
//        this.Deleted= data[1].Cnt;
//         }
//         if (data[2].Activity =="DeleteLastWeek")
//         {
//        this.DeleteLastWeek= data[2].Cnt;
//         }
//         if (data[3].Activity =="Deleted")
//         {
//        this.Deleted= data[3].Cnt;
//         }
//         if (data[4].Activity =="DeleteTillDate")
//         {
//        this.DeleteTillDate= data[4].Cnt;
//         }
//         if (data[5].Activity =="DOC FIles")
//         {
//        this.DOCFIles= data[5].Cnt;
//         }
    

//         if (data[6].Activity =="EmailNotSent")
//         {
//        this.EmailNotSent= data[6].Cnt;
//         }
//         if (data[7].Activity =="EmailSent")
//         {
//        this.EmailSent= data[7].Cnt;
//         }
//         if (data[8].Activity =="Favourite")
//         {
//        this.Favourite= data[8].Cnt;
//         }
//         if (data[9].Activity =="FileSize")
//         {
//        this.FileSize= data[9].Cnt;
//         }
//         if (data[10].Activity =="Folder")
//         {
//        this.Folder= data[10].Cnt;
//         }
//         if (data[11].Activity =="JPG FIles")
//         {
//        this.JPGFIles= data[11].Cnt;
//         }

//         if (data[12].Activity =="LoginLastWeek")
//         {
//        this.LoginLastWeek= data[12].Cnt;
//         }
//         if (data[13].Activity =="LoginTillDate")
//         {
//        this.LoginTillDate= data[13].Cnt;
//         }

//         if (data[14].Activity =="Maker")
//         {
//        this.Maker= data[14].Cnt;
//         }
//         if (data[15].Activity =="Metadata")
//         {
//        this.Metadata= data[15].Cnt;
//         }

//         if (data[16].Activity =="OCR Files Converted")
//         {
//        this.OCRFilesConverted= data[16].Cnt;
//         }
//         if (data[17].Activity =="OCR Files In Process")
//         {
//        this.OCRFilesInProcess= data[17].Cnt;
//         }

//         if (data[18].Activity =="PageCount")
//         {
//        this.PageCount= data[18].Cnt;
//         }
//         if (data[19].Activity =="PDF FIles")
//         {
//        this.PDFFIles= data[19].Cnt;
//         }

//         if (data[20].Activity =="Reject")
//         {
//        this.Reject= data[20].Cnt;
//         }
//         if (data[21].Activity =="Searched")
//         {
//        this.Searched= data[21].Cnt;
//         }

//         if (data[22].Activity =="TotalFiles")
//         {
//        this.TotalFiles= data[22].Cnt;
//         }
//         if (data[23].Activity =="TotalSize")
//         {
//        this.TotalSize= data[23].Cnt;
//         }

//         if (data[24].Activity =="User")
//         {
//        this.User= data[24].Cnt;
//         }
//         if (data[25].Activity =="Viewed")
//         {
//        this.Viewed= data[25].Cnt;
//         }
//         if (data[26].Activity =="WithData")
//         {
//        this.WithData= data[26].Cnt;
//         }

//         if (data[25].Activity =="WithoutData")
//         {
//        this.WithoutData= data[25].Cnt;
//         }
//         if (data[26].Activity =="XLS FIles")
//         {
//        this.XLSFIles= data[26].Cnt;
//         }
    
//         //""
//       // this.DatauploadCount = data[0].DataUpload;
//     //this.DatauploadCount = data[0].Activity;
//     // this.FileUploadCount = data[0].FileUpload;
//     // this.TaggingCount = data[0].Tagging;
//     // this.UserCount = data[0].Users;
//     }
  });
}
 
// CheckAccessRight() {

//   var RoleID =1;
//   var PageName ='Dashboard';

//     const apiUrl = this._global.baseAPIUrl + 'Status/CheckAccessRight?RoleID=' + RoleID +'&PageName='+ PageName +' &user_Token='+ this.DashboardForm.get('User_Token').value       
//     //const apiUrl=this._global.baseAPIUrl+'Status/CheckAccessRight?user_Token='+this.DashboardForm.get('User_Token').value
//     this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {    
 
//       if(data !="")         
//       {
      
//       }
//     });
//   }

loadChartsData() {
    // Activity pie chart
    var activityChart = am4core.create("activityChart", am4charts.PieChart);
    
    // Add and configure Series
    var pieSeries = activityChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "country";

    // Let's cut a hole in our Pie chart the size of 30% the radius
    activityChart.innerRadius = am4core.percent(70);;
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.hidden = true;
    pieSeries.tooltip.disabled = true;
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.strokeWidth =1;
    // pieSeries.slices.template.strokeOpacity = 0;
    pieSeries.legendSettings.valueText = '{value}'
    pieSeries.labels.template.maxWidth = 130;
    pieSeries.labels.template.wrap = true;
    pieSeries.labels.template.disabled = true;
    // Add a legend
    activityChart.legend = new am4charts.Legend();
    activityChart.legend.position = "right";
    activityChart.legend.valign = "middle";
    activityChart.legend.itemContainers.template.events.on("hit", (ev: any) => {
      this.downloadData(ev.target.dataItem.dataContext.properties.category);
    });
    activityChart.data = [{
      "country": "View",
      "value": this.View,
      "color": am4core.color("#FFA7BE")
    }, {
      "country": "Download",
      "value": this.Download,
      "color": am4core.color("#69DDFF")
    }, {
      "country": "Email",
      "value": this.Email,
      "color": am4core.color("#A9FFF7")
    }, {
      "country": "Upload",
      "value": this.DatauploadCount,
      "color": am4core.color("#B8E1FF")
    }, {
      "country": "Deleted",
      "value": this.Deleted,
      "color": am4core.color("#FFD1E3")
    }, {
      "country": "Searched",
      "value": this.Searched,
      "color": am4core.color("#F4EED2")
    }];

    /* filesChart chart instance */
    var filesChart = am4core.create("filesChart", am4charts.XYChart);

    /* Create axes */
    var categoryAxis = filesChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.labels.template.fill = am4core.color("#005984");
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    //categoryAxis.renderer.minGridDistance = 0;
    //categoryAxis.renderer.minGridDistance = 30;

    var valueAxis = filesChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fill = am4core.color("#005984");
    /* Create series */
    var series = filesChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "category";
    //series =
    series.columns.template.strokeWidth = 1;
   // series.columns.template.fixedWidthGrid="0,0";
    series.columns.template.tooltipText =  "{category}: {value}";
    /* Add data */
    filesChart.data = [{
      "category": "PDF",
      "value": this.PDFFIles,
      "color": '#005984'
    }, {
      "category": "JPG",
      "value": this.JPGFIles,
      "color": '#F6A01A'
    }, {
      "category": "XLS",
      "value": this.XLSFIles,
      "color": '#005984'
    }, {
      "category": "DOC",
      "value": this.DOCFIles,
      "color": '#F6A01A'
    }];

    series.columns.template.events.on("hit", (ev: any) => {
    //  console.log("clicked on ", ev.target.dataItem.dataContext.category);
      this.downloadData(ev.target.dataItem.dataContext.category);
    }, this);
  }
  
  downloadData(type) {
 
 //   alert(type);
   // console.log(type);
    this.type = type;
    this.DownloadFiles(this.type);
    this.displayStyle = "block";
  }

  closePopup() {
    this.displayStyle = "none";
    this.isFileNoLink = false;
  }

  closeDocViewPopup() {
    this.docViewModalRef.hide();
  }

  closeSendEmailPopup() {
    this.modalRef.hide();
  }

  closeShareLinkPopup(template: TemplateRef<any>) {
    this.modalRef.hide();
  }


  formattedData: any = [];
headerList: any;
immutableFormattedData: any;
loading: boolean = true;
prepareTableData(tableData, headerList) {

 // alert(this.type);

  let formattedData = [];
 // alert(this.type);



 
//LoginFailed

  if (this.type=="PDF" || this.type=="JPG" ||this.type=="tif" || this.type=="XLS" || this.type=="Doc")
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },

    { field: 'DepartmentName', header: 'CABINET', index: 2 },
    { field: 'BranchName', header: 'FOLDER', index: 3 },
    { field: 'SubfolderName', header: 'SUB FOLDER', index: 2 },
    { field: 'TemplateName', header: 'TEMPLATE', index: 3 }, 
    { field: 'FileNo', header: 'FILE NO', index: 2 },
   
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
      'DepartmentName': el.DepartmentName,
      'BranchName': el.BranchName,
      'SubfolderName': el.SubfolderName,
      'TemplateName': el.TemplateName,

      'FileNo': el.FileNo,
    
      // 'Ref3': el.Ref3,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
}

// else if (this.type=="Download" )
// {
//   let tableHeader: any = [
//     { field: 'srNo', header: "SR NO", index: 1 },{ field: 'UserName', header: 'UserName', index: 2 },
//     { field: 'ActivityName', header: 'Activity Name', index: 3 },{ field: 'DownloadDate', header: 'DownloadDate', index: 3 },
//    // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

//   ];
 
//   tableData.forEach((el, index) => {
//     formattedData.push({
//       'srNo': parseInt(index + 1),
//       'UserName': el.UserName,'ActivityName': el.ActivityName,'DownloadDate': el.DownloadDate
//       //,'DownloadDate': el.SendDate,'IsSend': el.IsSend,   
    
//     });
 
//   });
//   this.headerList = tableHeader;
// }
else if (this.type=="Upload" )
{
  this.isFileNoLink = true;
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },{ field: 'FileNo', header: 'FileNo', index: 2 },
  //  { field: 'ActivityName', header: 'Activity Name', index: 3 },{ field: 'DownloadDate', header: 'DownloadDate', index: 3 },
   // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'FileNo': el.FileNo
      //,'ActivityName': el.ActivityName,'DownloadDate': el.DownloadDate
      //,'DownloadDate': el.SendDate,'IsSend': el.IsSend,   
    
    });
 
  });
  this.headerList = tableHeader;
}

else if (this.type=="Folder" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },{ field: 'DepartmentName', header: 'CABINET', index: 2 },
    { field: 'BranchName', header: 'FOLDER', index: 3 },
    { field: 'SubfolderName', header: 'SUB FOLDER', index: 3 }
    //,{ field: 'DownloadDate', header: 'DownloadDate', index: 3 },
   // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'DepartmentName': el.DepartmentName,
      'BranchName': el.BranchName
      ,'SubfolderName': el.SubfolderName
      
      //,'DownloadDate': el.DownloadDate
      //,'DownloadDate': el.SendDate,'IsSend': el.IsSend,   
    
    });
 
  });
  this.headerList = tableHeader;
}



// else if (this.type=="Metadata" )
// {
//   let tableHeader: any = [
//     { field: 'srNo', header: "SR NO", index: 1 },{ field: 'Ref1', header: 'Ref1', index: 2 },
//     { field: 'Ref2', header: 'Ref2', index: 3 },
//     { field: 'Ref3', header: 'Ref3', index: 3 },
//     { field: 'Ref4', header: 'Ref4', index: 3 },
//     { field: 'Ref5', header: 'Ref5', index: 3 },
//     { field: 'Ref6', header: 'Ref6', index: 3 },
// //    { field: 'SubfolderName', header: 'SUB FOLDER', index: 3 }
//     //,{ field: 'DownloadDate', header: 'DownloadDate', index: 3 },
//    // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

//   ];
 
//   tableData.forEach((el, index) => {
//     formattedData.push({
//       'srNo': parseInt(index + 1),
//       'Ref1': el.Ref1,
//       'Ref2': el.Ref2,
//       'Ref3': el.Ref3,
//       'Ref4': el.Ref4,
//       'Ref5': el.Ref5,
//       'Ref6': el.Ref6
//   //    ,'SubfolderName': el.SubfolderName
      
//       //,'DownloadDate': el.DownloadDate
//       //,'DownloadDate': el.SendDate,'IsSend': el.IsSend,   
    
//     });
 
//   });
//   this.headerList = tableHeader;
// }

else if (this.type=="View" || this.type=="Viewed" )
{
  this.isFileNoLink = true;
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'Cabinet', header: 'CABINET', index: 2 },
    { field: 'FOLDER', header: 'FOLDER', index: 3 },
    { field: 'SubfolderName', header: 'SUB FOLDER', index: 2 },
    { field: 'TemplateName', header: 'TEMPLATE', index: 3 }, 
    { field: 'FileNo', header: 'FILE NO', index: 2 },
    { field: 'Status', header: 'STATUS', index: 2 },
    { field: 'EntryDate', header: 'VIEW DATE', index: 2 },
   
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
      'Cabinet': el.Cabinet,
      'FOLDER': el.Folder,
      'SubfolderName': el.SubfolderName,
      'TemplateName': el.TemplateName,

      'FileNo': el.FileNo,
      'Status': el.Status,
    
      'EntryDate': el.EntryDate,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
}

else if (this.type=="Download"  )
{
  this.isFileNoLink = true;
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'Cabinet', header: 'CABINET', index: 2 },
    { field: 'FOLDER', header: 'FOLDER', index: 3 },
    { field: 'SubfolderName', header: 'SUB FOLDER', index: 2 },
    { field: 'TemplateName', header: 'TEMPLATE', index: 3 }, 
    { field: 'FileNo', header: 'FILE NO', index: 2 },
    { field: 'Status', header: 'STATUS', index: 2 },
    { field: 'EntryDate', header: 'DOWNLOAD DATE', index: 2 },
   
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
      'Cabinet': el.Cabinet,
      'FOLDER': el.Folder,
      'SubfolderName': el.SubfolderName,
      'TemplateName': el.TemplateName,

      'FileNo': el.FileNo,
      'Status': el.Status,
    
      'EntryDate': el.EntryDate,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
}
else if (this.type=="Metadata" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },{ field: 'TemplateName', header: 'TEMPLATE', index: 2 },
    // { field: 'Ref2', header: 'REF2', index: 3 },
    // { field: 'Ref3', header: 'REF3', index: 3 },
    // { field: 'Ref4', header: 'REF4', index: 3 },
    // { field: 'Ref5', header: 'REF5', index: 3 },
    // { field: 'Ref6', header: 'REF6', index: 3 },
//    { field: 'SubfolderName', header: 'SUB FOLDER', index: 3 }
    //,{ field: 'DownloadDate', header: 'DownloadDate', index: 3 },
   // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'TemplateName': el.TemplateName,
      // 'Ref2': el.Ref2,
      // 'Ref3': el.Ref3,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
  //    ,'SubfolderName': el.SubfolderName
      
      //,'DownloadDate': el.DownloadDate
      //,'DownloadDate': el.SendDate,'IsSend': el.IsSend,   
    
    });
 
  });
  this.headerList = tableHeader;
}

else if (this.type=="Metadata" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },{ field: 'Ref1', header: 'Ref1', index: 2 },
    { field: 'Ref2', header: 'Ref2', index: 3 },
    { field: 'Ref3', header: 'Ref3', index: 3 },
    { field: 'Ref4', header: 'Ref4', index: 3 },
    { field: 'Ref5', header: 'Ref5', index: 3 },
    { field: 'Ref6', header: 'Ref6', index: 3 },
//    { field: 'SubfolderName', header: 'SUB FOLDER', index: 3 }
    //,{ field: 'DownloadDate', header: 'DownloadDate', index: 3 },
   // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'Ref1': el.Ref1,
      'Ref2': el.Ref2,
      'Ref3': el.Ref3,
      'Ref4': el.Ref4,
      'Ref5': el.Ref5,
      'Ref6': el.Ref6
  //    ,'SubfolderName': el.SubfolderName
      
      //,'DownloadDate': el.DownloadDate
      //,'DownloadDate': el.SendDate,'IsSend': el.IsSend,   
    
    });
 
  });
  this.headerList = tableHeader;
}


//Maker Uploaded
else if (this.type=="Maker Uploaded" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },{ field: 'FileNo', header: 'FILE NO', index: 2 },
    { field: 'Status', header: 'STATUS', index: 3 },
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
      'FileNo': el.FileNo,
      'Status': el.Status,
      // 'Ref3': el.Ref3,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
}

else if (this.type=="Checker Approved" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },{ field: 'FileNo', header: 'FILE NO', index: 2 },
    { field: 'Status', header: 'STATUS', index: 3 },
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
      'FileNo': el.FileNo,
      'Status': el.Status,
      // 'Ref3': el.Ref3,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
}
//Checker Pending

else if (this.type=="Checker Pending" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },{ field: 'FileNo', header: 'FILE NO', index: 2 },
    { field: 'Status', header: 'STATUS', index: 3 },
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
      'FileNo': el.FileNo,
      'Status': el.Status,
      // 'Ref3': el.Ref3,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
}



else if (this.type=="Maker" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'FileNo', header: 'FILE NO', index: 2 },
    { field: 'Status', header: 'STATUS', index: 3 },
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
      'FileNo': el.FileNo,
       'Status': el.Status,
      // 'Ref3': el.Ref3,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
}
else if (this.type=="Checker" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'FileNo', header: 'FILE NO', index: 2 },
     { field: 'Status', header: 'STATUS', index: 3 },
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
      'FileNo': el.FileNo,
       'Status': el.Status,
      // 'Ref3': el.Ref3,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
}

 

else if (this.type=="Email"  )
{
  this.isFileNoLink = true;
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'Cabinet', header: 'CABINET', index: 2 },
    { field: 'FOLDER', header: 'FOLDER', index: 3 },
    { field: 'SubfolderName', header: 'SUB FOLDER', index: 2 },
    { field: 'TemplateName', header: 'TEMPLATE', index: 3 }, 
    { field: 'FileNo', header: 'FILE NO', index: 2 },
    { field: 'Status', header: 'STATUS', index: 2 },
    { field: 'EntryDate', header: 'Email DATE', index: 2 },
   
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
      'Cabinet': el.Cabinet,
      'FOLDER': el.Folder,
      'SubfolderName': el.SubfolderName,
      'TemplateName': el.TemplateName,

      'FileNo': el.FileNo,
      'Status': el.Status,
    
      'EntryDate': el.EntryDate,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
}

else if (this.type=="Deleted"  )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'Cabinet', header: 'CABINET', index: 2 },
    { field: 'FOLDER', header: 'FOLDER', index: 3 },
    { field: 'SubfolderName', header: 'SUB FOLDER', index: 2 },
    { field: 'TemplateName', header: 'TEMPLATE', index: 3 }, 
    { field: 'FileNo', header: 'FILE NO', index: 2 },
    { field: 'Status', header: 'STATUS', index: 2 },
    { field: 'EntryDate', header: 'DELETED DATE', index: 2 },
   
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
      'Cabinet': el.Cabinet,
      'FOLDER': el.Folder,
      'SubfolderName': el.SubfolderName,
      'TemplateName': el.TemplateName,

      'FileNo': el.FileNo,
      'Status': el.Status,
    
      'EntryDate': el.EntryDate,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
}
else if (this.type=="Searched"  )
{
  this.isFileNoLink = true;
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'Cabinet', header: 'CABINET', index: 2 },
    { field: 'FOLDER', header: 'FOLDER', index: 3 },
    { field: 'SubfolderName', header: 'SUB FOLDER', index: 2 },
    { field: 'TemplateName', header: 'TEMPLATE', index: 3 }, 
    { field: 'FileNo', header: 'FILE NO', index: 2 },
    { field: 'Status', header: 'STATUS', index: 2 },
    { field: 'EntryDate', header: 'DELETED DATE', index: 2 },
   
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
      'Cabinet': el.Cabinet,
      'FOLDER': el.Folder,
      'SubfolderName': el.SubfolderName,
      'TemplateName': el.TemplateName,

      'FileNo': el.FileNo,
      'Status': el.Status,
    
      'EntryDate': el.EntryDate,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
}

else if (this.type=="Favourite"  )
{
  this.isFileNoLink = true;
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'Cabinet', header: 'CABINET', index: 2 },
    { field: 'FOLDER', header: 'FOLDER', index: 3 },
    { field: 'SubfolderName', header: 'SUB FOLDER', index: 2 },
    { field: 'TemplateName', header: 'TEMPLATE', index: 3 }, 
    { field: 'FileNo', header: 'FILE NO', index: 2 },
    { field: 'Status', header: 'STATUS', index: 2 },
    { field: 'EntryDate', header: 'FAVOURITE DATE', index: 2 },
   
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
      'Cabinet': el.Cabinet,
      'FOLDER': el.Folder,
      'SubfolderName': el.SubfolderName,
      'TemplateName': el.TemplateName,

      'FileNo': el.FileNo,
      'Status': el.Status,
    
      'EntryDate': el.EntryDate,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
}

  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
  this.formattedData = formattedData;
  this.loading = false;

}


DownloadFiles(type:any) {

  const apiUrl=this._global.baseAPIUrl+'Status/DownloaddashboardData?userID=0&Type='+type+'&user_Token='+localStorage.getItem('User_Token')
  this._onlineExamService.getAllData(apiUrl).subscribe((data:any) => {     
    this._FilteredList =data;
    this._IndexPendingList =data;

    this.prepareTableData(this._FilteredList, this._IndexPendingList);


  });
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

DLoadData(type:any) {
  //   console.log(type);
     this.type = type;
     this.DownloadFiles(this.type);
     this.displayStyle = "block";
   }

   paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }

  FolderStruture(strfolder:any)
  {

  //  this.FolderCnt= ele.Cnt;
    // CabinetCnt:any;
     //SubFolderCnt:any;

     if (strfolder == "Folder")
     {
 this.Folder =  this.FolderCnt;
 this.Foldername ="Folder";
 
     }
     else if (strfolder == "Cabinet")
     {
       this.Folder =  this.CabinetCnt;
       this.Foldername ="Cabinet";
     }
     else if (strfolder == "SubFolder")
     { 
       this.Folder =  this.SubFolderCnt;   
       this.Foldername ="Sub Folder";   
     }

  }

  MetaData(template: TemplateRef<any>, row: any)
  {


  this.docViewModalRef = this.modalService.show(template);


  $(".modal-dialog").css('max-width', '1300px');
  event.stopPropagation();

  let  __FileNo =row.FileNo;
  let  __TempID = row.TemplateID || 0;

  const apiUrl=this._global.baseAPIUrl+'DataEntry/GetNextFile?id='+__TempID+'&FileNo='+__FileNo+'&user_Token='+ localStorage.getItem('User_Token');

  //const apiUrl=this._global.baseAPIUrl+'DataEntry/GetNextFile?id'+  + '' FileNo='+ __FileNo + '&user_Token=123123'
  this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
     this._IndexList = data;
     this.GetFullFile(row.FileNo);        
    // console.log("Index",data);
  });
  // this.modalRef = this.modalService.show(template);
  }

  GetFullFile(FileNo:any) {

    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetFullFile?ID='+localStorage.getItem('UserID')+'&&_fileName='+ FileNo +'&user_Token='+localStorage.getItem('User_Token');
    this._onlineExamService.getDataById(apiUrl).subscribe(res => {
      if (res) {

        //alert(res.substring(res.lastIndexOf('.'), res.length));
        this.fileExt = res.substring(res.lastIndexOf('.'), res.length);
    // console.log("9090res",res);
        this.FilePath = res;
         /// saveAs(res, row.ACC + '.pdf');
         this._TempFilePath = res;

      }
    });
  }


  ShareLink(template: TemplateRef<any>)
  {
    this.downloadForm.patchValue({htmlContent:  ''});
    var that = this;
  //console.log("Email", this.selectedRows);
    let _CSVData= "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
      // headerArray.push(headers[j]);  
     // console.log("CSV Data", _CSVData);
    }
    this.downloadForm.controls['ACC'].setValue(_CSVData);
    this.downloadForm.controls['FileNo'].setValue(_CSVData);
  
    // if (_CSVData != null) {
     
    // }

    this.modalRef = this.modalService.show(template);

  }

  SendBulkEmail(template: TemplateRef<any>)
  {
    var that = this;
  //console.log("Email", this.selectedRows);
    let _CSVData= "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
      // headerArray.push(headers[j]);  
     // console.log("CSV Data", _CSVData);
    }
    this.downloadForm.controls['ACC'].setValue(_CSVData);
    this.downloadForm.controls['FileNo'].setValue(_CSVData);
  
    // if (_CSVData != null) {
     
    // }

    this.modalRef = this.modalService.show(template);

  }

  @ViewChild('tagInput')
  tagInput: SourceTagInput;
  public validators = [ this.must_be_email.bind(this) ];
  public errorMessages = {
      'must_be_email': 'Please be sure to use a valid email format'
  };
  private addFirstAttemptFailed = false;

  private must_be_email(control: FormControl) {        

      if (this.addFirstAttemptFailed && !this.validateEmail(control.value)) {
          return { "must_be_email": true };
      }
      return null;
  }

  beforeAdd(tag: string) {

    if (!this.validateEmail(tag)) {
      if (!this.addFirstAttemptFailed) {
        this.addFirstAttemptFailed = true;
        this.tagInput.setInputValue(tag);
      }
  
      return throwError(this.errorMessages['must_be_email']);
      //return of('').pipe(tap(() => setTimeout(() => this.tagInput.setInputValue(tag))));
      
    }
    this.addFirstAttemptFailed = false;
    return of(tag);
  }

  private validateEmail(text: string) {
    var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
    return (text && EMAIL_REGEXP.test(text));
  }

  onSendEmail() {

    if (this.selectedRows.length <=10)
    {

    const apiUrl = this._global.baseAPIUrl + 'Mail/SendEmail';
    // this.emailReciepients.forEach((el, i) => {
      let toEmailString = ''; 
      this.emailReciepients.forEach(el => toEmailString += el.display + ',');
      this.downloadForm.value.ToEmailID = toEmailString;
      this._onlineExamService.postData(this.downloadForm.value, apiUrl)
      .subscribe(data => {
        swal.fire({
          title: "Email!",
          text: "Email send successfully",
          type: "success",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-primary",
        });

      });
    // });
    this.modalRef.hide();
    //  this.getSearchResult();   
    }
    else
    {
      this.ShowErrormessage("You can not send more than 10 files on mails.");
    }

  }

  onSendEmailByShare() {

    const apiUrl = this._global.baseAPIUrl + 'Mail/SendEmailBulkFiles';
    // this.emailReciepientsShare.forEach((el, i) => {
      let toEmailString = ''; 
      this.emailReciepientsShare.forEach(el => toEmailString += el.display + ',');
      this.downloadForm.value.ToEmailID = toEmailString;
      this._onlineExamService.postData(this.downloadForm.value, apiUrl)
      .subscribe(data => {
        swal.fire({
          title: "Email!",
          text: "Email send successfully",
          type: "success",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-primary",
        });

      }); 
    // });
    
     this.modalRef.hide();    
    ///  this.getSearchResult();
      //this.OnReset();
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

}
