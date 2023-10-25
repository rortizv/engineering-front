import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular'; // Import LoadingController

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.validateJWTinLocalStorage();
  }

  async login() {
    const { username, password } = this.loginForm.value;

    const loading = await this.loadingController.create({
      message: 'Logging in...',
    });

    loading.present();

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.authService.userLogged = response.user.email;
        this.toastController.create({
          message: `User logged in successfully`,
          duration: 3000,
          position: 'bottom',
          color: 'success'
        }).then(toast => {
          toast.present();
        });
        loading.dismiss();
        this.router.navigate(['/dashboard']);
        this.loginForm.reset();
      },
      error: (error) => {
        this.toastController.create({
          message: `Email or password incorrect`,
          duration: 3000,
          position: 'bottom',
          color: 'danger'
        }).then(toast => {
          toast.present();
        });
        loading.dismiss();
      },
    });
  }

  async validateJWTinLocalStorage() {
    const savedToken = localStorage.getItem('authToken');

    if (savedToken && savedToken !== 'undefined' && savedToken !== null && savedToken !== '' && savedToken !== undefined && savedToken !== 'null') {
      const loading = await this.loadingController.create({
        message: 'Logging in...',
      });

      loading.present();

      this.authService.validateJWT(savedToken).subscribe({
        next: (response) => {
          this.authService.userLogged = response.user.email;
          loading.dismiss();
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.log(error);
          localStorage.removeItem('authToken');
          loading.dismiss();
        },
      });
    } else {
      localStorage.removeItem('authToken');
    }
  }


}
