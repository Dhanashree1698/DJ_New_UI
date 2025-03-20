import { Routes } from "@angular/router";
import { FileUploadComponent } from "./fileupload/fileupload.component";
import { DataUploadComponent } from "./dataupload/dataupload.component";
//import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { SftpUploadComponent } from "./sftpupload/sftpupload.component";
import { BulkUserComponent } from "./bulkuser/bulkuser.component";
import { BulkFolderComponent } from "./bulkfolder/bulkfolder.component";
import { BulkFolderMappingComponent } from "./bulkfoldermapping/bulkfoldermapping.component";
import { BulkfilenamemappingComponent } from "./bulk-filenamemapping/bulk-filenamemapping.component";
import { BulkFileUploadComponent } from "./bulk-file-upload/bulk-file-upload.component";
import { BulkFileRenamingComponent } from "./bulk-file-renaming/bulk-file-renaming.component";

 
export const uploadRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "file-upload",
       component: FileUploadComponent
      },
      {
        path: "data-upload",
       component: DataUploadComponent
      },
      {
        path: "sftpupload",
       component: SftpUploadComponent
      },
      {
        path: "bulkuser",
        component: BulkUserComponent
      },
      {
        path: "bulkfolder",
        component: BulkFolderComponent
      },
      {
        path: "bulkfoldermapping",
        component: BulkFolderMappingComponent
      }
      ,
      {
        path: "bulkFilemapping",
        component: BulkfilenamemappingComponent
      }
      ,
      {
        path: "bulkfileupload",
        component: BulkFileUploadComponent
      }
      ,
      {
        path: "bulkfilerenaming",
        component: BulkFileRenamingComponent
      }
      
    ]
  }
];
