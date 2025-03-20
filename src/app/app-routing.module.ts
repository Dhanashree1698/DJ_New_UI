import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { PresentationComponent } from "./pages/presentation/presentation.component";
import { LoginNewComponent } from './pages/login-new/login-new.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { ForgetPasswordComponent } from "./pages/forget-password/forget-password.component";
import { AuthGuardService } from "./Services/auth-guard.service";


const routes: Routes = [
  {
    path: "",
    redirectTo: "Login",
    pathMatch: "full"
  },
  {
    path: "Login",
    component: LoginNewComponent
  },
  {
    path: "forgot-password",
    component: ForgetPasswordComponent
  },
  {
    path: "Forbidden",
    component: ForbiddenComponent
  },
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "dashboards",
        loadChildren: () => import('./pages/dashboards/dashboards.module').then(m => m.DashboardsModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "usermanagement",
        loadChildren: () => import('./pages/user-management/user-management.module').then(m => m.UserManagementModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "master",
        loadChildren: () => import('./pages/master/master.module').then(m => m.MasterModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "process",
        loadChildren: () => import('./pages/process/process.module').then(m => m.ProcessModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "report",
        loadChildren: () => import('./pages/report/report.module').then(m => m.ReportModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "upload",
        loadChildren: () => import('./pages/upload/upload.module').then(m => m.UploadModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "search",
        loadChildren: () => import('./pages/search/search.module').then(m => m.SearchModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "components",
        loadChildren: () => import('./pages/components/components.module').then(m => m.ComponentsModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "forms",
        loadChildren: () => import('./pages/forms/forms.module').then(m => m.FormsModules),
        canActivate: [AuthGuardService]
      },
      {
        path: "tables",
        loadChildren: () => import('./pages/tables/tables.module').then(m => m.TablesModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "maps",
        loadChildren: () => import('./pages/maps/maps.module').then(m => m.MapsModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "widgets",
        loadChildren: () => import('./pages/widgets/widgets.module').then(m => m.WidgetsModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "charts",
        loadChildren: () => import('./pages/charts/charts.module').then(m => m.ChartsModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "calendar",
        loadChildren: () => import('./pages/calendar/calendar.module').then(m => m.CalendarModule),
        canActivate: [AuthGuardService]
      },
      {
        path: "examples",
        loadChildren: () => import('./pages/examples/examples.module').then(m => m.ExamplesModule),
        canActivate: [AuthGuardService]
      }
    ]
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "examples",
        loadChildren:
          () => import('./layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  },
  {
    path: "**",
    redirectTo: "Login"
  }


];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
