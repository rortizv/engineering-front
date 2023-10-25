import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

registerLocaleData(localeEsCO, 'es-CO');

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CO' }
  ]
})
export class SharedModule { }
