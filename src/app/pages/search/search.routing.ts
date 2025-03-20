import { Routes } from "@angular/router";
 import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { FileStorageComponent } from './file-storage/file-storage.component';
import { ContentSearchComponent } from './Content-Search/Content-Search.component';
import { BulkDownlaodComponent } from './BulkDownlaod/BulkDownlaod.component';
import { SearchComponent } from './Search/Search.component';
import { DeleteFilesComponent } from './DeleteFiles/DeleteFiles.component';
import { BasicSearchComponent } from './Basic-Search/Basic-Search.component';
import { GlobalsearchComponent } from './globalsearch/globalsearch.component';
import { OcrsearchComponent } from "./ocr-search/ocr-search.component";
import { FolderStutureComponent } from "./folder-stuture/folder-stuture.component";
// import { IPLSearchComponent } from "./ipl-Search/ipl-Search.component";
// import { IPLSearchfilterComponent } from "./ipl-search-filter/ipl-search-filter.component";

//DataUploadComponent
 
 
export const searchRoutes: Routes = [
  {
    path: "",
    children: [      
      {
        path: "advance-search",
       component: AdvancedSearchComponent
      },
      {
        path: "file-storage",
       component: FileStorageComponent
      },
      {
        path: "folder-stuture",
       component: FolderStutureComponent
      },
      {
        path: "quick-search",
       component: ContentSearchComponent
      },
        {
         path: "bulk-downlaod",
        component: BulkDownlaodComponent
       },
      {
        path: "ASearch",
       component: SearchComponent
      },
      {
        path: "delete-files",
       component: DeleteFilesComponent
      } ,
      {
        path: "basic-search",
       component: BasicSearchComponent
      } ,
      {
        path: "globalsearch",
       component: GlobalsearchComponent
      } ,
      {
        path: "ocrsearch",
       component: OcrsearchComponent
      } ,
      // {
      //   path: "ipl-search",
      //  component: IPLSearchComponent
      // } ,
      // {
      //   path: "ipl-search-filter",
      //  component: IPLSearchfilterComponent
      // } ,
      

      
            
    ]
  }
];
