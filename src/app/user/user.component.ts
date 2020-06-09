import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, FormControl,Validators  } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../model/User';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  submitted = false;
  userForm:FormGroup;
  user:User;
  userList:User[];
  saveBtnName='Add';
  userSearch:string;

get f() { return this.userForm.controls; }
  constructor(private formBuilder: FormBuilder,private userService :UserService) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.userForm = this.formBuilder.group({
      id:[],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      employeeId: ['', Validators.required]
  });
  }

 

onSubmit() {
  this.submitted=true; 
  if (this.userForm.invalid) {
    return;
  }else{
    console.log(this.userForm.value);
    let formValue=this.userForm.value;
    let user: User = {
      id:this.userForm.value.id,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      employeeId: this.userForm.value.employeeId,
      project:null,
      task:null
    }
    this.saveorupdate(user);

  }
    
}  
saveorupdate(user: User){
  if(user.id===null){
    this.userService.saveOrUpdate(user)
    .subscribe(res => {
      this.getAllUsers();
      this.onReset();
      console.log(res);
    });
  }else{
    if(this.user){
      this.user.firstName=user.firstName;
      this.user.lastName=user.lastName;
      this.user.employeeId=user.employeeId;
      this.userService.saveOrUpdate(this.user)
      .subscribe(res => {
        this.getAllUsers();
        this.onReset();
      });
    }
    
  }
}
editUser(user: User){
  this.user=user;
  this.saveBtnName='Update';
  console.log(user);
  let userValues ={
    id:user.id,
    firstName:user.firstName,
    lastName:user.lastName,
    employeeId:user.employeeId
  }
  this.userForm.setValue(userValues);
}
getAllUsers(){
  this.userService.getAllUsers()
  .subscribe(data => {
    this.userList=data;
    console.log(data);
  })
}
deleteUser(id:string){
  this.userService.deleteUser(id)
  .subscribe( data=>{
    console.log(data);
    this.getAllUsers();
  })
}
onReset() {
  if(this.saveBtnName==="Update"){
    this.saveBtnName='Add';
  }
  // this.saveBtnName==='Update'?'Add':'Add';
  this.submitted = false;
  this.userForm.reset();
}
sortList(paramName:string){
  if(paramName==="firstName"){
    this.userList=this.userList.sort((a,b) => {
      return a.firstName<b.firstName ? -1:1;
    });
  }else if(paramName==="lastName"){
    this.userList=this.userList.sort((a,b) => {
      return a.lastName<b.lastName ? -1:1;
    });
  }else if(paramName==="id"){
    this.userList=this.userList.sort((a,b) => {
      return a.id<b.id ? -1:1;
    });
  }
  
}
}
