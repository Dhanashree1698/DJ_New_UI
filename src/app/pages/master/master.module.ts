import { OnlineExamServiceService } from "../../Services/online-exam-service.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
// import { BsDropdownModule } from "ngx-bootstrap";
import { BsDropdownModule, BsDatepickerModule } from "ngx-bootstrap";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPrintModule } from "ngx-print";
import { ModalModule } from 'ngx-bootstrap/modal';
import { DepartmentComponent } from "./department/department.component";
import { BranchMappingComponent } from "./branch-mapping/branch-mapping.component";
import { RouterModule } from "@angular/router";''
import { DepartmentRoutes } from "./master.routing";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BranchComponent } from "./branch/branch.component";
import { DocumentTypeComponent } from "./document-type/document-type.component";
import { TemplateComponent } from "./template/template.component";
import { DocTypeMappingComponent } from "./doctype-mapping/doctype-mapping.component";
import { ViewCustomFormComponent } from "./view-customform/view-customform.component";
import { AddFieldComponent } from "./addfield/addfield.component";
import { TemplateMappingComponent } from "./template-mapping/template-mapping.component";
import { TemplateconfigComponent } from "./templateconfig/templateconfig.component"; //   ./templateconfig/templateconfig.component";
import { RegionMappingComponent } from "./region-mapping/region-mapping.component";
import { EntityComponent } from "./entity/entity.component";
import { EntityMappingComponent } from "./entity-mapping/entity-mapping.component";
import { DSConfigComponent } from "./DSConfig/DSConfig.component";
import { TableModule } from 'primeng/table';
import { NotificationComponent } from "./notification/notification.component";
import { ClientMasterComponent } from './client-master/client-master.component';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [NotificationComponent , DepartmentComponent,DSConfigComponent,BranchMappingComponent,BranchComponent,EntityComponent,EntityMappingComponent,TemplateComponent,DocumentTypeComponent,DocTypeMappingComponent,ViewCustomFormComponent,AddFieldComponent,TemplateMappingComponent,TemplateconfigComponent,RegionMappingComponent, ClientMasterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DepartmentRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    NgxPrintModule,
    TableModule,
    ToastModule
  ]
})
export class MasterModule {}
