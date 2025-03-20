import { Component, Inject, OnInit, NgZone, PLATFORM_ID, ViewChild, TemplateRef } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
 import { Globalconstants } from "../../../Helper/globalconstants";
  import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
 import { FormGroup, FormBuilder, Validators } from "@angular/forms";
 import { ToastrService } from "ngx-toastr";
// Themes begin
am4core.useTheme(dataviz);
am4core.useTheme(am4themes_animated);
// Themes end


import { AxisRenderer } from '@amcharts/amcharts4/charts';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

 

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.css"]
})




export class DashboardComponent implements OnInit {
  readonly DEFAULT_SLICE_STROKE_WIDTH: number = 0;
  readonly DEFAULT_SLICE_OPACITY: number = 1;
  readonly DEFAULT_ANIMATION_START_ANGLE: number = -90;
  readonly DEFAULT_ANIMATION_END_ANGLE: number = -90;
  private chart: am4charts.XYChart;
  downloadCount: any;
  displayStyle: string;
  type: any;
  private _TempFilePath: any;
  FilePath: any;
  fileExt: any;
  private _IndexList: {};
  modalRef: BsModalRef;
  isUserTable: boolean;

  constructor(
     private formBuilder: FormBuilder,
     public toastr: ToastrService,
     private _onlineExamService: OnlineExamServiceService,
     private _global: Globalconstants,
    private zone: NgZone,
    private modalService: BsModalService,
    @Inject(PLATFORM_ID) private platformId,
  ) {
     am4core.useTheme(am4themes_animated);}

     Checker:any;
     Deleted:any;
     DeleteLastWeek:any;
     DeleteTillDate:any;
     DOCFIles:any;
     EmailNotSent:number=10;
     EmailSent:number=25;
     Favourite:any;
     FileSize:number=45;
     Folder:any;
     FolderCnt:any;
     CabinetCnt:any;
     SubFolderCnt:any;
     JPGFIles:any;
     LoginLastWeek:any;
     LoginTillDate:any;
     Maker:any;
     Metadata:any;
     OCRFilesInProcess:any;
     OCRFilesConverted:any;
     PageCount:any;
     PDFFIles:any;
     Reject:any;
     Searched:any;
     TotalFiles:any;
     TotalSize:number=2000;
     User:any;
     WithData:any;
     Viewed:any;
     WithoutData:any;
     XLSFIles:any;
     _FilteredList:any;
     _IndexPendingList:any;
     first = 0;
  rows = 10;
  Foldername:any ="Total Folder";
  _HeaderList:any;
  MakerUploaded:any;
  
  _ColNameList = ["FileNo","Cabinet", "Folder", "SubfolderName" , "TemplateName","Status","EntryDate"];

     ngOnInit() {
    this.StatusList();
    this.UploadStatus();
  }
  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
  StatusList() {
    const apiUrl=this._global.baseAPIUrl+'Status/GetStatusCount?userID=0&user_Token='+localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data:any) => {     

    //  console.log("data",data);
      data.forEach(ele =>{
     // console.log("ele.Activity",ele.Activity); // 1, "string", false
      //console.log("ele.Cnt",ele.Cnt); // 1, "string", false

        if (ele.Activity =="Checker")
        {
       this.Checker= ele.Cnt;
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
        else if (ele.Activity =="DeleteTillDate")
        {
       this.DeleteTillDate= ele.Cnt;
        }
        else if (ele.Activity =="DOC FIles")
        {
       this.DOCFIles= ele.Cnt;
        }   

        else if (ele.Activity =="EmailNotSent")
        {
       this.EmailNotSent= ele.Cnt;
        }
        else if (ele.Activity =="EmailSent")
        {
       this.EmailSent= ele.Cnt;
        }
        else if (ele.Activity =="Favourite")
        {
       this.Favourite= ele.Cnt;
        }
        else if (ele.Activity =="FileSize")
        {
       this.FileSize= ele.Cnt;
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

        else if (ele.Activity =="LoginLastWeek")
        {
       this.LoginLastWeek= ele.Cnt;
        }
        if (ele.Activity =="LoginTillDate")
        {
       this.LoginTillDate= ele.Cnt;
        }

        if (ele.Activity =="Maker")
        {
       this.Maker= ele.Cnt;
        }
        else if (ele.Activity =="Metadata")
        {
       this.Metadata= ele.Cnt;
        }

        else if (ele.Activity =="OCR Files Converted")
        {
        this.OCRFilesConverted= ele.Cnt;
        }
        else if (ele.Activity =="OCR Files In Process")
        {
       this.OCRFilesInProcess= ele.Cnt;
        }

        else if (ele.Activity =="PageCount")
        {
       this.PageCount= ele.Cnt;
        }
        else if (ele.Activity =="PDF FIles")
        {
       this.PDFFIles= ele.Cnt;
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
        else if (ele.Activity =="TotalSize")
        {
       this.TotalSize= ele.Cnt;

     //  alert(ele.Cnt);
        }

        else if (ele.Activity =="User")
        {
       this.User= ele.Cnt;
        }
        else if (ele.Activity =="Viewed")
        {
       this.Viewed= ele.Cnt;
        }
        else if (ele.Activity =="WithData")
        {
        //  alert(ele.Cnt)
       this.WithData= ele.Cnt;
        }

        else if (ele.Activity =="WithoutData")
        {
       this.WithoutData= ele.Cnt;
        }
       else if (ele.Activity =="XLS FIles")
        {
       this.XLSFIles= ele.Cnt;
        }

        else if (ele.Activity =="Download")
        {
       this.downloadCount= ele.Cnt;
        }

      });
      this.loadChartsData();

    //   for (let entry of data) {
    //     console.log(entry); // 1, "string", false
    //     break;
    // }
 
  //   for (var _i = 0; _i < data.length; _i++) {
  //     var num = numbers[_i];
  //     console.log(num);
  // }
   
  // if(data !="")         
  //     {
        

       
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

  loadChartsData() {
    // pie chart
    var chart = am4core.create("chartdiv", am4charts.PieChart);
    var chart2 = am4core.create("chartdiv2", am4charts.PieChart);
    
    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "country";

    // Let's cut a hole in our Pie chart the size of 30% the radius
  //  chart.innerRadius = am4core.percent(70);;
  //pieSeries
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
    chart.legend = new am4charts.Legend();
    chart.legend.itemContainers.template.events.on("hit", (ev: any) => {
      this.downloadData(ev.target.dataItem.dataContext.properties.category);
    });

    chart.data = [{
      "country": "Utilized",
      "value": this.FileSize,
      "color": am4core.color("#f6a01a"),
      "labelColor": "#005984"
    }, {
      "country": "Available",
      "value": this.TotalSize,
      "color": am4core.color("#e6e6e6"),
      "labelColor": "#005984"
    }];

    var label = pieSeries.createChild(am4core.Label);
    const percent = ((this.FileSize/(this.FileSize+this.TotalSize))*100).toFixed(2);
    label.text =  percent + '%';
    label.fontSize = '50px';
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 40;
    

    var pieSeries = chart2.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "country";

    // Let's cut a hole in our Pie chart the size of 30% the radius
    chart2.innerRadius = am4core.percent(50);
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.hidden = true;
    pieSeries.tooltip.disabled = true;
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.strokeWidth =0;


    //pieSeries.calculatePercent = true;
    
   // pieSeries.labels.template.text = "{value}";
    pieSeries.legendSettings.valueText = '{value}'
    pieSeries.labels.template.maxWidth = 130;
    pieSeries.labels.template.wrap = true;
  //  pieSeries.labels.template.truncate = true;
    pieSeries.labels.template.disabled = true;

    
    //chart2.legend.valueLabels.template.text = "{value.value}";
    // pieSeries.slices.template.strokeOpacity = 0;

    //alert(this.EmailNotSent);
    //alert(this.EmailSent);
    // Add a legend
  
    chart2.legend = new am4charts.Legend();
    chart2.legend.position = "right";
    chart2.legend.valign = "middle";
    //chart2.legend.valueLabels.template.disabled = true;
    //chart2.legend.valueLabels.template.disabled = true;
    chart2.legend.itemContainers.template.events.on("hit", (ev: any) => {
      this.downloadData(ev.target.dataItem.dataContext.properties.category);
    });

    chart2.data = [{
      "country": "Email Sent",
      "value": this.EmailSent,
      "color": am4core.color("#005984"),
      "fontSize": 12
    }, {
      "country": "Not Sent",
      "value": this.EmailNotSent,
      "color": am4core.color("#f6a01a"),
      "fontSize": 12
    }];

    // OCR status chart
    var ocrStatusChart = am4core.create("ocrStatusChart", am4charts.PieChart);
    var pieSeries = ocrStatusChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "ocrStatus";

    // Let's cut a hole in our Pie chart the size of 30% the radius
    ocrStatusChart.innerRadius = am4core.percent(0);
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.hidden = true;
    pieSeries.tooltip.disabled = true;
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.strokeWidth =1;
    pieSeries.legendSettings.valueText = '{count}'
    pieSeries.labels.template.maxWidth = 130;
    pieSeries.labels.template.wrap = true;
    pieSeries.labels.template.disabled = true;
    // Add a legend
    ocrStatusChart.legend = new am4charts.Legend();
    ocrStatusChart.legend.itemContainers.template.events.on("hit", (ev: any) => {
      this.downloadData(ev.target.dataItem.dataContext.properties.category);
    });
    ocrStatusChart.data = [
      {
        "ocrStatus": "Converted",
        "count": this.OCRFilesConverted,
        "color": am4core.color("#f6a01a"),
        "fontSize": 12
      }, {
        "ocrStatus": "In process",
        "count": this.OCRFilesInProcess,
        "color": am4core.color("#005984"),
        "fontSize": 12
      }];



    /* filesChart chart instance */
    var filesChart = am4core.create("filesChart", am4charts.XYChart);

    /* Create axes */
    var categoryAxis = filesChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.labels.template.fill = am4core.color("#005984");
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    var valueAxis = filesChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fill = am4core.color("#005984");
    /* Create series */
    var series = filesChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "category";
    series.columns.template.strokeWidth = 1;
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

    // filesChart.legend.itemContainers.template.events.on("hit", (ev: any) => {
    //   this.downloadData(ev.target.dataItem.dataContext.properties.category);
    // });

    //Doc with/without metadata chart
    // pie chart
    var docMetadataChart = am4core.create("docMetadataChart", am4charts.PieChart);
    
    // Add and configure Series
    var pieSeries = docMetadataChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "country";

    // Let's cut a hole in our Pie chart the size of 30% the radius
    docMetadataChart.innerRadius = am4core.percent(70);;
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
    docMetadataChart.legend = new am4charts.Legend();
    docMetadataChart.legend.position = "right";
    docMetadataChart.legend.valign = "middle";
    docMetadataChart.legend.itemContainers.template.events.on("hit", (ev: any) => {
      this.downloadData(ev.target.dataItem.dataContext.properties.category);
    });
    docMetadataChart.data = [{
      "country": "With Data",
      "value": this.WithData,
      "color": am4core.color("#F6A01A")
    }, {
      "country": "Without Data",
      "value": this.WithoutData,
      "color": am4core.color("#005984")
    }
    // , {
    //   "country": "Without Data Entry",
    //   "value": 333,
    //   "color": am4core.color("#E6E6E6")
  //  }
  ];


    // Maker/Checker chart
    // OCR status chart
    var makerCheckedChart = am4core.create("makerCheckedChart", am4charts.PieChart);
    var pieSeries = makerCheckedChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "ocrStatus";
    
    // Let's cut a hole in our Pie chart the size of 30% the radius
    makerCheckedChart.innerRadius = am4core.percent(0);
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.hidden = true;
    pieSeries.tooltip.disabled = true;
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.strokeWidth =1;
    pieSeries.legendSettings.valueText = '{count}'
    pieSeries.labels.template.maxWidth = 130;
    pieSeries.labels.template.wrap = true;
    pieSeries.labels.template.disabled = true;
    // Add a legend
    makerCheckedChart.legend = new am4charts.Legend();
    makerCheckedChart.legend.position = "right";
    makerCheckedChart.legend.valign = "middle";
    makerCheckedChart.legend.itemContainers.template.events.on("hit", (ev: any) => {
      this.downloadData(ev.target.dataItem.dataContext.properties.category);
    });
    makerCheckedChart.data = [
      {
        "ocrStatus": "Maker Pending",
        "count": this.MakerUploaded,
        "color": am4core.color("#F6A01A"),
        "fontSize": 12
      },
      // , {
      //   "ocrStatus": "Checker Approved",
      //   "count": this.Checker,
      //   "color": am4core.color("#005984"),
      //   "fontSize": 12
      //}, 
      {
        "ocrStatus": "Checker Pending",
        "count": this.Maker,
        "color": am4core.color("#005984"),
        "fontSize": 12
      }
      , {
        "ocrStatus": "Reject",
        "count": this.Reject,
        "color": am4core.color("#FF0000"),
        "fontSize": 12
      }
      
    ];
  }
    

  downloadData(type) {
  
    //alert(type);
   // console.log(type);
    this.type = type;
    this.DownloadFiles(this.type);
    this.displayStyle = "block";
  }

  DLoadData(type:any) {
 //   console.log(type);
    this.type = type;
    this.DownloadFiles(this.type);
    this.displayStyle = "block";
  }

  closePopup() {
    this.displayStyle = "none";
  }

formattedData: any = [];
headerList: any;
immutableFormattedData: any;
loading: boolean = true;
prepareTableData(tableData, headerList) {
  let formattedData = [];
 // alert(this.type);


if (this.type=="Email Sent" || this.type=="Not Sent" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },{ field: 'FileNo', header: 'FILE NO', index: 2 },
    { field: 'ToEmailID', header: 'TO EMAILID', index: 3 },{ field: 'SendBy', header: 'SEND BY', index: 3 },
    { field: 'SendDate', header: 'SEND DATE', index: 7 }, { field: 'IsSend', header: 'IS SEND', index: 8 },

  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'FileNo': el.FileNo,'ToEmailID': el.ToEmailID,'SendBy': el.SendBy,'SendDate': el.SendDate,'IsSend': el.IsSend,   
    
    });
 
  });
  this.headerList = tableHeader;
}
else if (this.type=="Deleted" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },{ field: 'UserName', header: 'USER NAME', index: 2 },
    { field: 'FileNo', header: 'FILE NO', index: 3 },
    { field: 'ActivityName', header: 'ACTIVITY NAME', index: 3 },{ field: 'DownloadDate', header: 'DELETED DATE', index: 3 },
   // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'UserName': el.UserName,
      'FileNo': el.FileNo,
      'ActivityName': el.ActivityName,'DownloadDate': el.DownloadDate
      //,'DownloadDate': el.SendDate,'IsSend': el.IsSend,   
    
    });
 
  });
  this.headerList = tableHeader;
}
//LoginFailed

else if (this.type=="LoginFailed" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },{ field: 'UserName', header: 'USER NAME', index: 2 },
    { field: 'AttemptCount', header: 'ATTEMPT COUNT', index: 3 },
    //{ field: 'LoginDate', header: 'LOGIN DATE', index: 3 },
   // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'UserName': el.UserName,'AttemptCount': el.AttemptCount,
      
      //'LoginDate': el.LoginDate
      //,'DownloadDate': el.SendDate,'IsSend': el.IsSend,   
    
    });
 
  });
  this.headerList = tableHeader;
}
else if (this.type=="PDF" || this.type=="JPG" ||this.type=="tif" || this.type=="XLS" || this.type=="Doc")
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

  
else if (this.type=="Utilized" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },{ field: 'FileNo', header: 'FILE NO', index: 2 },
    { field: 'PageCount', header: 'PAGE COUNT', index: 3 },{ field: 'FileSize', header: 'FILE SIZE', index: 3 },
   // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'FileNo': el.FileNo,'PageCount': el.PageCount,'FileSize': el.FileSize
      //,'DownloadDate': el.SendDate,'IsSend': el.IsSend,   
    
    });
 
  });
  this.headerList = tableHeader;
}

else if (this.type=="Download" )
{
 // console.log("Download",tableData);
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },{ field: 'UserName', header: 'USER NAME', index: 2 },
    { field: 'FileNo', header: 'FILE NO', index: 2 },
    
    { field: 'ActivityName', header: 'ACTIVITY NAME', index: 3 },{ field: 'DownloadDate', header: 'DOWNLOAD DATE', index: 3 },
   // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'UserName': el.UserName,'ActivityName': el.ActivityName,'DownloadDate': el.DownloadDate
      ,'FileNo': el.FileNo
      //,'IsSend': el.IsSend,   
    
    });
 
  });
  this.headerList = tableHeader;
}
else if (this.type=="Upload" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },{ field: 'FileNo', header: 'FILE NO', index: 2 },
    { field: 'DepartmentName', header: 'CABINET', index: 2 },
    { field: 'BranchName', header: 'FOLDER', index: 3 },
    { field: 'SubfolderName', header: 'SUB FOLDER', index: 2 },
    { field: 'TemplateName', header: 'TEMPLATE', index: 3 }, 

    //  { field: 'ActivityName', header: 'Activity Name', index: 3 },{ field: 'DownloadDate', header: 'DownloadDate', index: 3 },
   // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'FileNo': el.FileNo,

      'DepartmentName': el.DepartmentName,
      'BranchName': el.BranchName,
      'SubfolderName': el.SubfolderName,
      'TemplateName': el.TemplateName,

     
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
else if (this.type=="User")
{
 // console.log("tableData",tableData);
 this.isUserTable = true;
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },{ field: 'USERID', header: 'USER ID', index: 2 },
    { field: 'LastLoginDatetime', header: 'LAST LOGIN DATE', index: 3 },
    { field: 'PasswodExpiryDate', header: 'PASSWORD EXPIRY DATE', index: 3 },
    { field: 'Status', header: 'STATUS', index: 3 },
    
    //,{ field: 'DownloadDate', header: 'DownloadDate', index: 3 },
   // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'USERID': el.USERID,
      'LastLoginDatetime': el.LastLoginDatetime
     ,'Status': el.Status
      
      ,'PasswodExpiryDate': el.PasswodExpiryDate
      //,'DownloadDate': el.SendDate,'IsSend': el.IsSend,   
    
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

else if (this.type=="Pages" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },

    { field: 'DepartmentName', header: 'CABINET', index: 2 },
    { field: 'BranchName', header: 'FOLDER', index: 3 },
    { field: 'SubfolderName', header: 'SUB FOLDER', index: 2 },
    { field: 'TemplateName', header: 'TEMPLATE', index: 3 }, 
    { field: 'FileNo', header: 'FILE NO', index: 2 },
    { field: 'PageCount', header: 'PAGE COUNT', index: 3 },
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
      'PageCount': el.PageCount,
      // 'Ref3': el.Ref3,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
}
//Maker Uploaded
else if (this.type=="Maker Pending" )
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

else if (this.type=="Checker Pending" || this.type=="Reject" )
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

else if (this.type=="With Data" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'FileNo', header: 'FILE NO', index: 2 },
    // { field: 'Status', header: 'Status', index: 3 },
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
      // 'Status': el.Status,
      // 'Ref3': el.Ref3,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
}

else if (this.type=="Without Data" )
{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'FileNo', header: 'FILE NO', index: 2 },
    // { field: 'Status', header: 'Status', index: 3 },
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
      // 'Status': el.Status,
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



  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
  this.formattedData = formattedData;
  this.loading = false;

}


DownloadFiles(type:any) {
  this.formattedData = [];
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

  UploadStatus() {
    const apiUrl=this._global.baseAPIUrl+'Status/GetDashboardData?userID=0&user_Token='+localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data:any) => {   

      data.sort((a: any, b: any) => {
        return new Date(b.UplaodDate).valueOf() - new Date(a.UplaodDate).valueOf();
      });

    // Create chart instance
    let chart = am4core.create("downloadUploadChart", am4charts.XYChart);

    chart.data = [];
    data.forEach((element, index) => {
      if(index<7) {
        const date = new Date(element.UplaodDate).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short'
        });
        chart.data.push({
          "date": date,
          "download": element.DataUplaodCount,
          "upload": element.FileUplaodCount
        });
      }
    });

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.labels.template.fill = am4core.color("#005984");
    categoryAxis.dataFields.category = "date";
    categoryAxis.renderer.grid.template.location = 0;


    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fill = am4core.color("#005984");
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

    // Create series
    function createSeries(field, name) {
      
      // Set up series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.name = name;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "date";
      series.sequencedInterpolation = true;
      if(field === 'upload') {
        series.fill = am4core.color('#005984');
        series.dummyData = {
          flag: 'assets/img/icons/dashboard/Group_762.svg'
        }
      } else {
        series.fill = am4core.color('#F6A01A');
        series.dummyData = {
          flag: 'assets/img/icons/dashboard/Group_763.svg'
        }
      }
      
      // Make it stacked
      series.stacked = true;
      
      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
      
      // Add label
      let labelBullet = series.bullets.push(new am4charts.LabelBullet());
      // labelBullet.label.text = "{valueY}";
      labelBullet.locationY = 0.5;
      labelBullet.label.hideOversized = true;
      
      return series;
    }

    createSeries("download", "Download");
    createSeries("upload", "Upload");

    // Legend
    chart.legend = new am4charts.Legend();
    // Remove square from marker template
    let marker = chart.legend.markers.template;
    marker.disposeChildren();

    // Add custom image instead
    let dollar = marker.createChild(am4core.Image);
    dollar.width = 40;
    dollar.height = 40;
    dollar.verticalCenter = "top";
    dollar.horizontalCenter = "left";

    // We're going to use an adapter to set href
    dollar.adapter.add("href", function(href, target) {
    if (target.dataItem && target.dataItem.dataContext && target.dataItem.dataContext['dummyData']) {
      return target.dataItem.dataContext['dummyData'].flag;
    }
    else {
      return href;
    }
    });
    chart.legend.itemContainers.template.events.on("hit", (ev: any) => {
      this.downloadData(ev.target.dataItem.dataContext.properties.name);
    });
    });
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

//alert(strfolder);

  }

 

  DownloadData(type:any) {

    const apiUrl=this._global.baseAPIUrl+'Status/DownloaddashboardData?userID=0&Type='+type+'&user_Token='+localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data:any) => {     
      this._FilteredList =data;
      this._IndexPendingList =data;
  
     // console.log("this._FilteredList",this._FilteredList);

      this.downloadFile();
      
  
    });
  }

  GetHeaderNames()
  {
    this._HeaderList="";
    for (let j = 0; j < this._ColNameList.length; j++) {  
         
        this._HeaderList += this._ColNameList[j] +((j <= this._ColNameList.length-2)?',':'') ;
      // headerArray.push(headers[j]);  
    }
    this._HeaderList += '\n'
    this._FilteredList.forEach(stat => {
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
  //  console.log(csvData) 
    if(this._FilteredList.length>0) {
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
    dwldLink.setAttribute("download",  "LogReport" + ".csv"); 
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

  MetaData(template: TemplateRef<any>, row: any)
  {


  this.modalRef = this.modalService.show(template);


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

}



