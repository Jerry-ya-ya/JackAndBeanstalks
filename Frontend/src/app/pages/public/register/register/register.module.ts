import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import FormsModule to enable template-driven forms (place in imports)
import { FormsModule } from '@angular/forms';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';


@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    FormsModule,
  ]
})
export class RegisterModule { }
