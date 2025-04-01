import { OnlineExamServiceService } from "../../Services/online-exam-service.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { BsDropdownModule } from "ngx-bootstrap";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TooltipModule,BsDatepickerModule } from "ngx-bootstrap";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPrintModule } from "ngx-print";
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from "@angular/router";
import { searchRoutes } from "./search.routing";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { ContentSearchComponent } from './Content-Search/Content-Search.component';
import { FileStorageComponent } from './file-storage/file-storage.component';
// import { BulkDownlaodComponent } from './BulkDownlaod/BulkDownlaod.component';
import { DeleteFilesComponent } from './DeleteFiles/DeleteFiles.component';
import { BasicSearchComponent } from './Basic-Search/Basic-Search.component';
import { GlobalsearchComponent } from './globalsearch/globalsearch.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SearchComponent } from './Search/Search.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {DataTablesModule} from 'angular-datatables';
import { TreeModule } from 'primeng/tree';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from "ngx-chips";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { OcrsearchComponent } from "./ocr-search/ocr-search.component";
import { FolderStutureComponent } from './folder-stuture/folder-stuture.component';
import { BulkDownlaodComponent } from "./BulkDownlaod/BulkDownlaod.component";
// import { IPLSearchComponent } from "./ipl-Search/ipl-Search.component";
// import { IPLSearchfilterComponent } from "./ipl-search-filter/ipl-search-filter.component";

import { ToastModule } from 'primeng/toast';
@NgModule({
  declarations: [OcrsearchComponent,  BulkDownlaodComponent,DeleteFilesComponent,AdvancedSearchComponent,GlobalsearchComponent,BasicSearchComponent,FileStorageComponent,ContentSearchComponent,SearchComponent, FolderStutureComponent],
  imports: [
    CommonModule,
    
    RouterModule.forChild(searchRoutes),
    FormsModule,
    MDBBootstrapModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    DataTablesModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    NgxPrintModule,
    NgMultiSelectDropDownModule.forRoot(),
    TreeModule,
    TableModule,
    TabViewModule,
    CheckboxModule,
    NgxExtendedPdfViewerModule,
    MatMenuModule,
    MatIconModule,
    AngularEditorModule,
    TagInputModule,
    NgxDocViewerModule,
    ToastModule
  ]
})
export class SearchModule {}
