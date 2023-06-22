import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirstPanelComponent } from './pages/content/request/first-panel/first-panel.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ScannerComponent } from './pages/content/request/scanner/scanner.component';
import { RequestComponent } from './pages/content/request/request.component';
import { MatIconModule } from '@angular/material/icon';
import { FormService } from './pages/services/form.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@NgModule({
  declarations: [
    AppComponent,
    RequestComponent,
    FirstPanelComponent,
    ScannerComponent,
  ],
  imports: [
    BrowserModule,
    CdkStepperModule,
    MatChipsModule,
    MatIconModule,
    MatGridListModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatFormFieldModule,
    MatStepperModule,
    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    ZXingScannerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  providers: [
    FormService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
