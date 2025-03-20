import { Routes } from "@angular/router";
import { StatusComponent } from "./status/status.component";
import { LogsComponent } from "./logs/logs.component";
import { MetadataComponent } from "./metadata/metadata.component";
import { TagReportComponent } from "./TagReport/TagReport.component";
import { SpaceComponent } from "./Space/Space.component";
import { EmailLogComponent } from "./EmailLog/EmailLog.component";
import { PrintBarcodeComponent } from "./print-barcode/print-barcode.component";
import { FilestatusComponent } from "./Filestatus/Filestatus.component";
import { MinimasterComponent } from "./mini-master/mini-master.component";
import { DocumentmissingComponent } from "./document-missing/document-missing.component";
import { UserReportComponent } from "./user-report/user-report.component";
import { FolderStutureComponent } from "../search/folder-stuture/folder-stuture.component";
import { FolderReportComponent } from "./folder-report/folder-report.component";

export const reportRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "status",
        component: StatusComponent
      },    
      {
        path: "logs",
        component: LogsComponent
      },
      {
        path: "meta-data",
        component: MetadataComponent
      },   
      {
        path: "DocumentStatus",
        component: TagReportComponent
      },
      {
        path: "space",
        component: SpaceComponent
      }, 
      {
        path: "EmailLog",
        component: EmailLogComponent
      },
      {
        path: "print-barcode",
        component: PrintBarcodeComponent
      }
      ,
      {
        path: "Filestatus",
        component: FilestatusComponent
      },
      {
        path: "Minimaster",
        component: MinimasterComponent
      },  
      {
        path: "document-missing",
        component: DocumentmissingComponent
      }, 
      {
        path: "user-report",
        component: UserReportComponent
      }, 
      {
        path: "folder-report",
        component: FolderReportComponent
      }, 
      
    ]

  }
];
