import { Globalconstants } from "./Helper/globalconstants";
import { Listboxclass } from "./Helper/listboxclass";
import { AuthGuardService } from "./Services/auth-guard.service";
import { AuthenticationService } from "./Services/authentication.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ToastrModule } from "ngx-toastr";
import { TagInputModule } from "ngx-chips";
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
//import {ToastModule} from 'primeng/toast';
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { PresentationModule } from "./pages/presentation/presentation.module";
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import { OnlineExamServiceService } from './Services/online-exam-service.service';
import { MessagesModule } from 'primeng/messages';
import { LoginNewComponent } from './pages/login-new/login-new.component';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HttpRequestInterceptor } from './Services/http-request-interceptor';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxCaptchaModule } from 'ngx-captcha';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MessageService } from 'primeng/api'; 
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    AppRoutingModule,
    ToastrModule.forRoot(),
    CollapseModule.forRoot(),
    TagInputModule,
    PresentationModule,
    MatProgressSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxCaptchaModule,
    MatInputModule,
    MatFormFieldModule,
    ToastrModule,
    MessagesModule,
    ToastModule
  ],
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent,LoginNewComponent, ForgetPasswordComponent],
  providers: [AuthGuardService,MessageService, Listboxclass, Globalconstants, { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
