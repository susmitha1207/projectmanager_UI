import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../model/User';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  user:User;
  userList:User[];
  userSearch:string;
  isUserModal:boolean;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }
  setUserModal(flag:boolean){
    this.isUserModal=true;
  }
  getAllUsers(){
    this.userService.getAllUsers()
    .subscribe(data => {
      this.userList=data;
      console.log(data);
    })
  }
  selectedRow(user){
    this.user=user;
   // this.projectForm.get('manager').setValue(user.firstName+' '+user.lastName);
    this.userSearch=user.firstName+' '+user.lastName;
    console.log(user);
  }
  setManager(){
   
  }
}
