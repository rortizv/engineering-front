// register.page.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    let newUser = this.registerForm.value;

    this.authService.register(newUser).subscribe({
      next: (response: any) => {
        this.toastController.create({
          message: `User registered successfully`,
          duration: 3000,
          position: 'bottom',
          color: 'success'
        }).then(toast => {
          toast.present();
        });
        console.log('User registered successfully');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.toastController.create({
          message: `Error registering user`,
          duration: 3000,
          position: 'bottom',
          color: 'danger'
        }).then(toast => {
          toast.present();
        });
        console.error('Error registering user', error);
      },
    });
  }
}
