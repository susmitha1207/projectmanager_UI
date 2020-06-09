import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from '../model/Project';
import { Location } from '@angular/common';
import { ProjectService } from '../services/project.service';
import { User } from '../model/User';
import { UserService } from '../services/user.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  public projectForm: FormGroup;
  private project: Project;
  inputReadonly: boolean;
  submitted = false;
  saveBtnName = 'Add';
  projectList: Project[];
  projectSearch: string;
  userList: User[];
  userSearch: string;
  today = new Date().toISOString().split('T')[0];
  user: User;

  constructor(private formBuilder: FormBuilder, private projectService: ProjectService, private userService: UserService, /*private modal: ModalComponent*/) { }

  ngOnInit(): void {
    this.inputReadonly = false;
    this.getAllProjects();
    this.getAllUsers();
    // this.modal.isUserModal = true;
    this.projectForm = new FormGroup({
      id: new FormControl(),
      project: new FormControl('', [Validators.required]),
      setDate: new FormControl(),
      startDate: new FormControl({ value: '', disabled: true }),
      endDate: new FormControl({ value: '', disabled: true }),
      priority: new FormControl(),
      manager: new FormControl({ value: '', disabled: true }, [Validators.required]),
      managerId: new FormControl('',[Validators.required])
    });
  }

  get f() { return this.projectForm.controls; }


  onSubmit() {
    this.submitted = true;
    if (this.projectForm.invalid) {
      return;
    } else {
      let projectFormValue = this.projectForm.value;
      let project: Project = {
        id: projectFormValue.id,
        project: projectFormValue.project,
        startDate: new Date(projectFormValue.startDate),
        endDate: new Date(projectFormValue.endDate),
        priority: projectFormValue.priority,
        manager:this.user,
        noOfTasks:0,
        noOfCompletedTask:0
      }
      this.saveorupdate(project);
    }
  }
  saveorupdate(project: Project) {
    if (project.id === null) {
      this.projectService.saveOrUpdate(project)
        .subscribe(res => {
          this.getAllProjects();
          this.onReset();
          console.log(res);
        });
    } else {
      if (this.project) {
        this.project.project = project.project;
        this.project.startDate = project.startDate;
        this.project.endDate = project.endDate;
        this.project.priority = project.priority;
        this.projectService.saveOrUpdate(this.project)
          .subscribe(res => {
            this.getAllProjects();
            this.onReset();
          });
      }

    }
  }
  editProject(project: Project) {
    this.project = project;
    this.saveBtnName = 'Update';
    console.log(project);
    let editProject={
      id:this.project.id,
      project: this.project.project,
      setDate:this.project.startDate!==null && this.project.endDate!==null,
      startDate: this.project.startDate,
      endDate: this.project.endDate,
      priority: this.project.priority,
      manager: this.project.manager.firstName+' '+this.project.manager.lastName, 
      managerId: this.project.manager.id
    }
    this.projectForm.setValue(editProject);
    this.setDates(editProject.setDate);
    
  }
  getAllProjects() {
    this.projectService.getAllProjects()
      .subscribe(data => {
        this.projectList = data;
        console.log(data);
      })
  }
  deleteProject(id: string) {
    this.projectService.deleteProject(id)
      .subscribe(data => {
        console.log(data);
        this.getAllProjects();
      })
  }
  setDates(checked) {
    let startDt = this.projectForm.get('startDate');
    let endDt = this.projectForm.get('endDate');
    var today = new Date();
    var nextDay = new Date(new Date().setDate(today.getDate() + 1));
    if (checked) {
      var minStartDay = new Date().toISOString().split('T')[0];
      var minEndDay = nextDay.toISOString().split('T')[0];
      startDt.enable();
      document.getElementsByName("startdate")[0].setAttribute('min', minStartDay);
      startDt.setValue(new Date().toISOString().substr(0, 10));
      endDt.enable();
      document.getElementsByName("enddate")[0].setAttribute('min', minEndDay);
      endDt.setValue(nextDay.toISOString().substr(0, 10));
    } else {
      startDt.disable();
      startDt.setValue('');
      endDt.disable();
      endDt.setValue('');
    }
  }
  onReset() {
    if (this.saveBtnName === "Update") {
      this.saveBtnName = 'Add';
    }
    // this.saveBtnName==='Update'?'Add':'Add';
    this.setDates(false);
    this.submitted = false;
    this.projectForm.reset();
  }
  sortList(paramName: string) {
    if(paramName==="startDate"){
      this.projectList=this.projectList.sort((a,b) => {
        return new Date(a.startDate) >new Date(b.startDate)?-1:1;
      });
    }else if(paramName==="endDate"){
      this.projectList=this.projectList.sort((a,b) => {
        return new Date(a.endDate) >new Date(b.endDate)?-1:1;
      });
    }else if(paramName==="priority"){
      this.projectList=this.projectList.sort((a,b) => {
        return a.priority > b.priority?-1:1;
      });
    }else if(paramName==="Completed"){
      this.projectList=this.projectList.sort((a,b) => {
        return a.noOfCompletedTask > b.noOfCompletedTask?-1:1;
      });
    }

  }
  getAllUsers() {
    this.userService.getAllUsers()
      .subscribe(data => {
        this.userList = data;
        console.log(data);
      })
  }
  selectedRow(user) {
    this.user = user;
    this.projectForm.get('managerId').setValue(user.id);
    this.projectForm.get('manager').setValue(user.firstName + ' ' + user.lastName);
    this.userSearch = user.firstName + ' ' + user.lastName;
    console.log(user);
  }
  setManager() {

  }
}
