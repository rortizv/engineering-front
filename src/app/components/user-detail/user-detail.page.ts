import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: 'user-detail.page.html',
  styleUrls: ['user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  userForm: FormGroup;
  id: any;
  state: boolean = true;
  createdAt: any;
  updatedAt: any;
  isEditing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private modalController: ModalController,
    public toastController: ToastController,
    public userService: UserService
  ) {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ionViewWillEnter() {
    let isEditing = this.navParams.get('isEditing');
    if (isEditing) {
      this.isEditing = this.navParams.get('isEditing');
    } else {
      this.isEditing = false;
    }
  }

  ngOnInit() {
    const user = this.navParams.get('user');
    if (user) {
      this.id = user.id;
      this.state = user.state;
      this.createdAt = user.createdAt;
      this.updatedAt = user.updatedAt;
      this.userForm.patchValue(user);
    }
  }

  async save() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      if (!this.isEditing) {
        await this.userService.createUser(userData).subscribe({
          next: (response: any) => {
            this.toastController.create({
              message: `User created successfully`,
              duration: 3000,
              position: 'bottom',
              color: 'success',
            }).then((toast) => {
              toast.present();
            });
            console.log('User created successfully', response);
            this.userService.getUsers().subscribe({
              next: (response: any) => {
                const updatedUserList = response.users;
              },
              error: (error: any) => {
                console.error('Error creating user', error);
              },
            });
            this.dismiss(response.user);
          },
          error: (error: any) => {
            console.error('Error creating user', error);
          },
        });
      } else {
        userData.id = this.id;
        await this.userService.updateUser(userData).subscribe({
          next: (response: any) => {
            this.toastController.create({
              message: 'User updated successfully',
              duration: 3000,
              position: 'bottom',
              color: 'success',
            }).then((toast) => {
              toast.present();
            });
            console.log('User updated successfully', response);

            this.userService.getUsers().subscribe({
              next: (response: any) => {
                const updatedUserList = response.users;
                this.userService.setUserList(updatedUserList);
              },
              error: (error: any) => {
                console.error('Error updating user', error);
              },
            });
            this.dismiss(response.user);
          },
          error: (error: any) => {
            console.error('Error updating user', error);
          },
        });
      }
      this.dismiss(userData);
    }
  }

  cancel() {
    this.dismiss();
  }

  async dismiss(data = null) {
    const topModal = await this.modalController.getTop();
    if (topModal) {
      this.modalController.dismiss(data);
    }
  }
}
