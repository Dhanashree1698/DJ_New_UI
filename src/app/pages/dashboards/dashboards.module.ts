import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UserdashboardComponent } from "./Userdashboard/Userdashboard.component";
import { AlternativeComponent } from "./alternative/alternative.component";
import { RouterModule } from "@angular/router";
import { DashboardsRoutes } from "./dashboards.routing";
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TableModule } from 'primeng/table';
import { ModalModule } from "ngx-bootstrap/modal";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { TagInputModule } from "ngx-chips";
import { BsDatepickerModule } from "ngx-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NewDashboardComponent } from "./new-dashboard/new-dashboard.component";

@NgModule({
  declarations: [DashboardComponent, AlternativeComponent,UserdashboardComponent, NewDashboardComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forChild(DashboardsRoutes),
    NgxChartsModule,
    TableModule,
    ModalModule.forRoot(),
    NgxDocViewerModule,
    NgxExtendedPdfViewerModule,
    AngularEditorModule,
    TagInputModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    FormsModule
   // BrowserAnimationsModule
  ],
  exports: [DashboardComponent, AlternativeComponent]
})
export class DashboardsModule {}
