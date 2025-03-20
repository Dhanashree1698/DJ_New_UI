import { Routes } from "@angular/router";
import { DataEntryComponent } from './data-entry/data-entry.component';
import { FileTaggingComponent } from './file-tagging/file-tagging.component';
import { EditIndexingComponent } from './EditIndexing/EditIndexing.component';
import { CheckerComponent } from './checker/checker.component';




export const DepartmentRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "Maker",
        component: DataEntryComponent
      },
      {
        path: "tagging",
        component: FileTaggingComponent
      },
      {
        path: "EditIndexing",
        component: EditIndexingComponent
      },
      {
        path: "Checker",
        component: CheckerComponent
      }
    ]
  }
];
