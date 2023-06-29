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
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { RequestComponent } from './pages/content/request/request.component';
import { FirstPanelComponent } from './pages/content/request/first-panel/first-panel.component';
import { SecondPanelComponent } from './pages/content/request/second-panel/second-panel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    RequestComponent,
    FirstPanelComponent,
    SecondPanelComponent,
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    InputTextModule,
    MessagesModule,
    DialogModule,
    AutoCompleteModule,
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
export class AppModule {}
