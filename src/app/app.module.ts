import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RequestComponent } from './pages/content/request/request.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RequestComponent,
    ZXingScannerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
