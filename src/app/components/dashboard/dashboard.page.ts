import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { UserDetailPage } from '../user-detail/user-detail.page';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  users: any[] = [];

  constructor(public authService: AuthService,
    public userService: UserService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private router: Router) { }

  ngOnInit(): void {
    this.getUsers();
    this.userService.userList$.subscribe(users => {
      this.users = users;
    });
  }

  logout() {
    localStorage.removeItem('authToken');
    this.toastController.create({
      message: 'User has logged out',
      duration: 3000,
      position: 'bottom',
      color: 'success'
    }).then(toast => {
      toast.present();
    });
    this.router.navigate(['/login']);
  }

  async getUsers() {
    await this.userService.getUsers().subscribe({
      next: (response: any) => {
        console.log(response);
        response.users.forEach((user: any) => {
          user.createdAt = new Date(user.createdAt);
        });
        this.users = response.users;
        this.userService.setUserList(this.users);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  deleteUser(user: any) {
    this.confirmDelete(user);
  }

  changeUserState(user: any) {
    this.userService.changeUserState(user.id, user.state).subscribe({
      next: (response: any) => {
        this.toastController.create({
          message: `User ${user.email} state changed successfully`,
          duration: 3000,
          position: 'bottom',
          color: 'success'
        }).then(toast => {
          toast.present();
        });
        console.log('User state changed successfully', response);
      },
      error: (error: any) => {
        this.toastController.create({
          message: `Error changing user ${user.email} state`,
          duration: 3000,
          position: 'bottom',
          color: 'danger'
        }).then(toast => {
          toast.present();
        });
        console.error('Error changing user state', error);
      }
    });
  }

  async loadUserDetail(user: any) {
    const modal = await this.modalCtrl.create({
      component: UserDetailPage,
      componentProps: {
        user,
        isEditing: true
      }
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    if (user.name != data.name || user.email != data.email) {
      await this.getUsers();
    }
  }

  async confirmDelete(user: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to PERMANTENTLY delete ${user.email}?`,
      subHeader: 'This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            // call service to delete user
            this.userService.deleteUser(user.id).subscribe({
              next: (response: any) => {
                // if user deleted is the same as the logged in user, log out
                this.toastController.create({
                  message: `User ${user.email} deleted permanently`,
                  duration: 3000,
                  position: 'bottom',
                  color: 'success'
                }).then(toast => {
                  toast.present();
                });
                if (user.email === this.authService.userLogged) {
                  this.logout();
                  return;
                }
                console.log('User deleted successfully', response);
                this.getUsers();
              },
              error: (error: any) => {
                console.error('Error deleting user', error);
              }
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async createUser() {
    const modal = await this.modalCtrl.create({
      component: UserDetailPage,
      componentProps: {
        user: null,
        onUserCreated: (newUser: any) => {
          // Callback function to update users list
          if (newUser) {
            this.toastController.create({
              message: `User ${newUser.email} created successfully`,
              duration: 3000,
              position: 'bottom',
              color: 'success'
            }).then(toast => {
              toast.present();
            });
            this.getUsers(); // Refresh the users list
          }
        }
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.getUsers();
    }
  }


}
