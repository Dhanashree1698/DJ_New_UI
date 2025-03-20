import { OnlineExamServiceService } from "../../Services/online-exam-service.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPrintModule } from "ngx-print";
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from "@angular/router";
import { uploadRoutes } from "./upload.routing";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FileUploadComponent } from "./fileupload/fileupload.component";
import { DataUploadComponent } from './dataupload/dataupload.component';
//import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import {FileUploadModule} from 'primeng/fileupload';
import { SftpUploadComponent } from "./sftpupload/sftpupload.component";
import { TableModule } from 'primeng/table';
import { BulkUserComponent } from "./bulkuser/bulkuser.component";
import { BulkFolderComponent } from "./bulkfolder/bulkfolder.component";
import { BulkFolderMappingComponent } from "./bulkfoldermapping/bulkfoldermapping.component";
import { BulkfilenamemappingComponent } from "./bulk-filenamemapping/bulk-filenamemapping.component";
import { BulkFileUploadComponent } from "./bulk-file-upload/bulk-file-upload.component";
import { BulkFileRenamingComponent } from "./bulk-file-renaming/bulk-file-renaming.component";
import { ToastModule } from 'primeng/toast';

//sftpuploadForm


@NgModule({
  declarations: [FileUploadComponent, DataUploadComponent,SftpUploadComponent, BulkUserComponent,
     BulkFolderComponent, BulkFolderMappingComponent,BulkfilenamemappingComponent,BulkFileUploadComponent
    ,BulkFileRenamingComponent
    ],
  imports: [
    CommonModule,
    RouterModule.forChild(uploadRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    NgxPrintModule,
    FileUploadModule,
    TableModule,
    ToastModule
  ]
})
export class UploadModule {}
