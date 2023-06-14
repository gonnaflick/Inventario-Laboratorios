import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RequestComponent } from './pages/content/request/request.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirstPanelComponent } from './pages/content/request/first-panel/first-panel.component';

@NgModule({
  declarations: [AppComponent, FirstPanelComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RequestComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
