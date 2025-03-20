import { Component, OnInit, TemplateRef } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { OnlineExamServiceService } from 'src/app/Services/online-exam-service.service';
import { Globalconstants } from 'src/app/Helper/globalconstants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.scss']
})
export class NewDashboardComponent implements OnInit {
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  dashboardForm:FormGroup;
  ProductCount;
  VesselNameCount:[];
  modalRef: BsModalRef;
  private chart: am4charts.XYChart;
  first = 0;
  rows = 10;
  _FilteredList = []; 
  UserList: any;
  type: string;
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
     private _global: Globalconstants,
     
  ) { }
  ngOnInit(){
    this.dashboardForm = this.formBuilder.group({
      DATE_FROM : [],
      DATE_TO : [],
      ProductName:[],
      User_Token:localStorage.getItem('User_Token'),
    })
    this.VesselNameCount = this.VesselNameCount
   this.PortNameChart();
   this.prepareTableData(this._FilteredList,this._FilteredList);

}
onSearch()
{
  this.PortNameChart();
}
  PortNameChart() {

    // alert("PortName");
  
    const apiUrl = this._global.baseAPIUrl + 'Status/GetportNames';
  //  const apiUrl=this._global.baseAPIUrl+'Status/GetportNames?userID=0&user_Token='+localStorage.getItem('User_Token')
  
    this._onlineExamService.postData(this.dashboardForm.value,apiUrl).subscribe((data:any) => {   

      //debugger
            console.log("data", data)
      data.sort((a: any) => {
        return new Date(a.PortName).valueOf();
      });
      am4core.useTheme(am4themes_animated);
      var PotNameChart = am4core.create("PotNameChart", am4charts.XYChart);
      PotNameChart.data = [];
  
  data.forEach((element, index) => {
    if(index<27) {
      PotNameChart.data.push({
        // "date": date,
        "PortName": element.PortName,
        "Cnt": element.Cnt
      });
    }
  });
  PotNameChart.colors.list = [
    am4core.color("#3E79DA")
  ];

  var categoryAxis = PotNameChart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.dataFields.category = "PortName";
  categoryAxis.renderer.minGridDistance = 60;
  categoryAxis.title.text = "Port Names";
  categoryAxis.renderer.labels.template.fill = am4core.color("#888");
  categoryAxis.renderer.labels.template.fontSize = 14;
  categoryAxis.renderer.grid.template.disabled = true;
  // categoryAxis.renderer.labels.template.fill = am4core.color("#888");
  // categoryAxis.renderer.line.strokeOpacity = 1;

  var valueAxis = PotNameChart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.title.text = "Count of Vessels";
  valueAxis.renderer.labels.template.fill = am4core.color("#888");
  valueAxis.renderer.grid.template.disabled = true;
  // valueAxis.renderer.labels.template.fill = am4core.color("#888");
  // valueAxis.renderer.line.strokeOpacity = 1;
  
  // Create series
  var series = PotNameChart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = "Cnt";
  series.dataFields.categoryX = "PortName";
  series.name = "Visits";
  series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
  series.columns.template.fillOpacity = 1;
  PotNameChart.scrollbarX = new am4core.Scrollbar();
  PotNameChart.scrollbarY = new am4core.Scrollbar();
  var columnTemplate = series.columns.template;
  columnTemplate.strokeWidth = 0;
  columnTemplate.strokeOpacity = 1;
  
  var labelBullet = series.bullets.push(new am4charts.LabelBullet());
  labelBullet.label.verticalCenter = "bottom";
  labelBullet.label.dy = -10;
  labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";

  this.ProductNameChart();
  })
  }

  ProductNameChart() {


    
    // alert("ProductName");
  
    const apiUrl = this._global.baseAPIUrl + 'Status/GettProductname';
  //  const apiUrl=this._global.baseAPIUrl+'Status/GetportNames?userID=0&user_Token='+localStorage.getItem('User_Token')
  
    this._onlineExamService.postData(this.dashboardForm.value,apiUrl).subscribe((data:any) => {   
      // debugger
//console.log("data111", data)
      // data.sort((a: any) => {
      //   return new Date(a.ProductName).valueOf();
      // });
      am4core.useTheme(am4themes_animated);
      var productchart= am4core.create("ProductNameChart", am4charts.XYChart);
      productchart.data = [];
  
  data.forEach((element, index) => {
    if(index<50) {
      productchart.data.push({
        // "date": date,
        "ProductName": element.ProductName,
        "Cnt": element.Cnt
      });
    }
  });


  productchart.colors.list = [
am4core.color("#3E79DA")
];
// Create axes

var categoryAxis2 = productchart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis2.renderer.grid.template.location = 0;
categoryAxis2.dataFields.category = "ProductName";
categoryAxis2.renderer.minGridDistance = 60;
categoryAxis2.title.text = "Product Names";
categoryAxis2.renderer.labels.template.fill = am4core.color("#888");
categoryAxis2.renderer.labels.template.fontSize = 14;
categoryAxis2.renderer.grid.template.disabled = true;
categoryAxis2.renderer.labels.template.wrap = false;
var valueAxis2 = productchart.yAxes.push(new am4charts.ValueAxis());
valueAxis2.title.text = "Product Quantity";
valueAxis2.renderer.labels.template.fill = am4core.color("#888");
valueAxis2.renderer.grid.template.disabled = true;
valueAxis2.renderer.labels.template.wrap = false;
// Create series
var series2 = productchart.series.push(new am4charts.ColumnSeries());
series2.dataFields.valueY = "Cnt";
series2.dataFields.categoryX = "ProductName";
series2.name = "Visits";
series2.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
series2.columns.template.fillOpacity = 1;

var columnTemplate2 = series2.columns.template;
columnTemplate2.strokeWidth = 0;
columnTemplate2.strokeOpacity = 1;

productchart.scrollbarX = new am4core.Scrollbar();
productchart.scrollbarY = new am4core.Scrollbar();

// yAxis3.renderer.labels.template.wrap = false;

var labelBullet1 = series2.bullets.push(new am4charts.LabelBullet());
labelBullet1.label.verticalCenter = "bottom";
labelBullet1.label.dy = -10;
labelBullet1.label.text = "{values.valueY.workingValue.formatNumber('#.')}";
this.ProductQuntity();
    })
  }

  ProductQuntity(){

    // alert('ProductQuntity');
// 
    const apiUrl = this._global.baseAPIUrl + 'Status/GetProductCountAndVesselCoun';
    //  const apiUrl=this._global.baseAPIUrl+'Status/GetportNames?userID=0&user_Token='+localStorage.getItem('User_Token')
    
      this._onlineExamService.postData(this.dashboardForm.value,apiUrl).subscribe((data:any) => {   
        data.sort((a: any, b: any) => {
          return new Date(a.ProductCount, b.VesselNameCount).valueOf();
        });
        am4core.useTheme(am4themes_animated);
        var chart3= am4core.create("productQuantityAndVessels", am4charts.XYChart);
        chart3.data = [];
        console.log("ProductQuntity 3rd ", data)
    data.forEach((element, index) => {
      if(index<50) {
        chart3.data.push({
          // "date": date,
         "ProductName": element.ProductName,
         "ProductCount": element.ProductCount,
          "VesselNameCount": element.VesselNameCount
          
        });
      }
    });
chart3.colors.step = 1;
chart3.legend = new am4charts.Legend()
chart3.legend.position = 'top'
chart3.legend.paddingBottom = 10
chart3.legend.labels.template.maxWidth = 15
var xAxis3 = chart3.xAxes.push(new am4charts.CategoryAxis())
xAxis3.dataFields.category = 'ProductName'
//xAxis3.dataFields.category = 'VesselNameCount'
xAxis3.renderer.cellStartLocation = 0
xAxis3.renderer.cellEndLocation = 0.9
xAxis3.renderer.grid.template.location = 0;
xAxis3.title.text = "Products";
xAxis3.renderer.labels.template.fill = am4core.color("#888");
xAxis3.renderer.labels.template.fontSize = 14;
xAxis3.renderer.grid.template.disabled = true;
xAxis3.renderer.maxLabelPosition = 0.99;
xAxis3.renderer.minLabelPosition = 0.01;
xAxis3.renderer.labels.template.wrap = false;
var yAxis3 = chart3.yAxes.push(new am4charts.ValueAxis());
yAxis3.min = 0;
yAxis3.title.text = "Product Quantity & Count of Vessels";
yAxis3.renderer.labels.template.fill = am4core.color("#888");
yAxis3.renderer.labels.template.fontSize = 14;
yAxis3.renderer.grid.template.disabled = true;
yAxis3.renderer.maxLabelPosition = 0.99;
yAxis3.renderer.minLabelPosition = 0.01;

yAxis3.renderer.labels.template.wrap = false;

chart3.scrollbarX = new am4core.Scrollbar();
chart3.scrollbarY = new am4core.Scrollbar();


function createSeries1(value, name) {
    var series3 = chart3.series.push(new am4charts.ColumnSeries())
    series3.dataFields.valueY = 'ProductCount'
//    series3.dataFields.valueY = 'VesselNameCount'
   series3.dataFields.categoryX = 'ProductName'
   // series3.dataFields.categoryX = 'VesselNameCount'
    series3.name = name   
    series3.columns.template.tooltipText = "{xAxisX}: [bold]{valueY}[/]";
    series3.columns.template.fillOpacity = 1;

    var labelBullet1 = series3.bullets.push(new am4charts.LabelBullet());
    labelBullet1.label.verticalCenter = "bottom";
    labelBullet1.label.dy = -10;
    labelBullet1.label.text = "{values.valueY.workingValue.formatNumber('#.')}";
    return series3;
}

function createSeries2(value, name) {
  var series3 = chart3.series.push(new am4charts.ColumnSeries())
 // series3.dataFields.valueY = 'Cnt'
    series3.dataFields.valueY = 'VesselNameCount'
 series3.dataFields.categoryX = 'ProductName'
 // series3.dataFields.categoryX = 'VesselNameCount'
 series3.columns.template.tooltipText = "{xAxisX}: [bold]{valueY}[/]";
 series3.columns.template.fillOpacity = 1;

 var labelBullet1 = series3.bullets.push(new am4charts.LabelBullet());
labelBullet1.label.verticalCenter = "bottom";
labelBullet1.label.dy = -10;
labelBullet1.label.text = "{values.valueY.workingValue.formatNumber('#.')}";

//  xAxis3.renderer.maxLabelPosition = 0.99;
// xAxis3.renderer.minLabelPosition = 0.01;
// xAxis3.renderer.mouseEnabled = true;
// xAxis3.renderer.cursorTooltipEnabled = true;

  series3.name = name
  return series3;
 
}


chart3.colors.list = [
  am4core.color("#3E79DA"),
  am4core.color("#ff0000")
];
createSeries1('first', 'Product Quantity');
createSeries2('second', 'Vessels');
this.productSuplier();
  })
}

  productSuplier(){

    // alert('productSuplier');
    const apiUrl = this._global.baseAPIUrl + 'Status/GetProductnameAndSupplier';
    //  const apiUrl=this._global.baseAPIUrl+'Status/GetportNames?userID=0&user_Token='+localStorage.getItem('User_Token')
    
      this._onlineExamService.postData(this.dashboardForm.value,apiUrl).subscribe((data:any) => {   
  console.log("data11144", data)
        data.sort((a: any, b: any) => {
          return new Date(a.ProductName, b.SupplierName).valueOf();
        });
        am4core.useTheme(am4themes_animated);
        var chart4= am4core.create("productAndSupliers", am4charts.XYChart);
        chart4.data = [];
    
    data.forEach((element, index) => {
      if(index<50) {
        chart4.data.push({
          // "date": date,
          "ProductName": element.ProductName,
          "SupplierName": element.SupplierName,
          "Cnt": element.Cnt
        });
      }
    });

chart4.colors.list = [
am4core.color("#3E79DA")
];
// Create axes

var categoryAxis4 = chart4.xAxes.push(new am4charts.CategoryAxis());
categoryAxis4.renderer.grid.template.location = 0;
categoryAxis4.dataFields.category = "ProductName" 
// categoryAxis4.dataFields.category = "SupplierName";
categoryAxis4.renderer.minGridDistance = 60;
categoryAxis4.title.text = "Product Names";
categoryAxis4.renderer.labels.template.fill = am4core.color("#888");
categoryAxis4.renderer.labels.template.fontSize = 14;
categoryAxis4.renderer.grid.template.disabled = true;

var valueAxis4 = chart4.yAxes.push(new am4charts.ValueAxis());
valueAxis4.title.text = "Supplier Quantity";
valueAxis4.renderer.labels.template.fill = am4core.color("#888");
valueAxis4.renderer.grid.template.disabled = true;

// Create series
var series4 = chart4.series.push(new am4charts.ColumnSeries());
series4.dataFields.valueY = "Cnt";
series4.dataFields.categoryX = "ProductName";
// series4.dataFields.categoryX = "SupplierName";
series4.name = "Visits";
series4.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
series4.columns.template.fillOpacity = 1;

chart4.scrollbarX = new am4core.Scrollbar();
chart4.scrollbarY = new am4core.Scrollbar();

var columnTemplate4 = series4.columns.template;
columnTemplate4.strokeWidth = 0;
columnTemplate4.strokeOpacity = 1;

var labelBullet1 = series4.bullets.push(new am4charts.LabelBullet());
labelBullet1.label.verticalCenter = "bottom";
labelBullet1.label.dy = -10;
labelBullet1.label.text = "{values.valueY.workingValue.formatNumber('#.')}";

  })
}

SuplierPopup(template: TemplateRef<any> , product:any) {

  this.dashboardForm.patchValue({
    ProductName:product
  })

  this.modalRef = this.modalService.show(template);
  const apiUrl = this._global.baseAPIUrl + 'Status/GetSupplierDetail';
    this._onlineExamService.postData(this.dashboardForm.value,apiUrl).subscribe((data:any) => {   
      this.UserList = data;
      this._FilteredList = data;

     // console.log("data500",data);
      this.prepareTableData( this.UserList,  this._FilteredList);
  })
  
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
// if (this.type=="ProductName" || this.type=="SupplierName" ){
let tableHeader: any = [
  { field: 'srNo', header: "SR NO", index: 1 },
  { field: 'SupplierName', header: 'SUPLIER NAME', index: 3 },
  { field: 'Cnt', header: 'QUANTITY', index: 3 },
];

tableData.forEach((el, index) => {
  formattedData.push({
    'srNo': parseInt(index + 1),
    'SupplierName': el.SupplierName,
    'id': el.id,
    'Cnt': el.Cnt,
  
  });

});
this.headerList = tableHeader;
// }

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
}
