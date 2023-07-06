import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatIconModule } from '@angular/material/icon';
import { FormService } from './pages/services/form.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { RequestComponent } from './pages/content/request/request.component';
import { FirstPanelComponent } from './pages/content/request/first-panel/first-panel.component';
import { SecondPanelComponent } from './pages/content/request/second-panel/second-panel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThirdPanelComponent } from './pages/content/request/third-panel/third-panel.component';
import { FourthPanelComponent } from './pages/content/request/fourth-panel/fourth-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    RequestComponent,
    FirstPanelComponent,
    SecondPanelComponent,
    ThirdPanelComponent,
    FourthPanelComponent,
  ],
  imports: [
    AutoCompleteModule,
    NgbTypeaheadModule,
    BrowserModule,
    MatIconModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ZXingScannerModule,
    CommonModule,
    NgbModule,
  ],
  providers: [FormService],
  bootstrap: [AppComponent],
})
export class AppModule { }
