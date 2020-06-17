import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, FormControl,Validators  } from '@angular/forms';
import { User } from '../model/User';
import { UserService } from '../services/user.service';
import { Project } from '../model/Project';
import { ProjectService } from '../services/project.service';
import { Task } from '../model/Task';
import { ParentTask } from '../model/ParentTask';
import { TaskService } from '../services/task.service';
import { ActivatedRoute, NavigationStart, Event as NavigationEvent, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
// import { _MatTabLinkBase } from '@angular/material/tabs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  taskForm:FormGroup;
  submitted=false;
  saveBtnName='Add';
  isParent=false;
  listSearch: string;
  userList: User[];
  project:Project;
  projectList:Project[];
  task:Task;
  user:User[];
  parentTask:ParentTask;
  parentTaskList:ParentTask[];

  constructor(private formBuilder: FormBuilder,private projectService: ProjectService, private userService: UserService,private taskService:TaskService,private route:ActivatedRoute,private router:Router)  { }

  get f() { return this.taskForm.controls; }


  ngOnInit(): void {
  let id= this.route.snapshot.paramMap.get("id");
  if(id!=="null"){
    this.createForm();
    this.getTaskById(id);
    this.saveBtnName="Update";
  }else{
    this.createForm();
  }
  this.router.events
  .pipe(
    filter( (event:any) =>event instanceof NavigationStart)
  )
  .subscribe(
    (event: any) => {
      if(event.url==='/task/null'){
        this.createForm();
      }
  }
);
  this.getAllParentTasks()
  this.getAllUsers();
  this.getAllProjects();
  
  
  }
createForm(){
  var today=new Date();
  var nextDay=new Date(new Date().setDate(today.getDate()+1));
  this.taskForm = new FormGroup({
    id: new FormControl(),
    project: new FormControl({ value: '', disabled: true }),
    projectId: new FormControl(''),
    task: new FormControl('', [Validators.required]),
    parent: new FormControl(),
    priority: new FormControl(),
    parentTask: new FormControl({ value: '', disabled: true }),
    parentTaskId: new FormControl(''),
    startDate: new FormControl(new Date().toISOString().substr(0, 10)),
    endDate: new FormControl(nextDay.toISOString().substr(0, 10)),
    user: new FormControl({ value: '', disabled: true }),
    userId: new FormControl(''),
    status: new FormControl(0)
  });
}

  onSubmit() {
    this.submitted=true;
    if (this.taskForm.invalid) {
      return;
    }else{
      let taskFormValue = this.taskForm.value;

      let task:Task={
        id:taskFormValue.id,
        task:taskFormValue.task,
        project:this.project,
        parent:taskFormValue.parent,
        parentTask:this.parentTask,
        priority:taskFormValue.priority,
        startDate:taskFormValue.startDate,
        endDate:taskFormValue.endDate,
        user:this.user,
        status:taskFormValue.status

      }
     this.saveOrUpdate(task);
    }
   
  }
  saveOrUpdate(task:Task){
    // if (task.id === null) {
      this.taskService.saveOrUpdate(task)
        .subscribe(res => {
         // this.getAllProjects();
          this.onReset();
          console.log(res);
        });
    // }
  }
  onReset(){
    this.taskForm.reset();
    if(this.saveBtnName==="Update"){
      this.saveBtnName='Add';
    }
    this.submitted = false;
  }
  getTaskById(id:string){
    this.taskService.getTaskById(id)
    .subscribe(data=>{
      this.task=data
      this.setFormValues(this.task);
    });
  }
  setFormValues(task:Task){
    let formValues:any={
      id:task.id,
      project:task.project.project,
      projectId:task.project.id,
      task:task.task,
    parent: task.parent,
    priority: task.priority,
    parentTask: task.parentTask.parentTask,
    parentTaskId: task.parentTask.id,
    startDate:new Date(task.startDate).toISOString().substr(0, 10),
    endDate: new Date(task.endDate).toISOString().substr(0, 10),
    user: task.user?task.user.firstName+' '+task.user.lastName:'',
    userId: task.user?task.user.id:'',
    status:task.status

    }
    this.taskForm.setValue(formValues);
    this.setParent(task.parent);
    this.project=task.project;
    this.user=task.user;
    this.parentTask=task.parentTask;
;
  }
  setParent(checked){
    this.isParent=checked;
    let startDt=this.taskForm.get('startDate');
    let endDt=this.taskForm.get('endDate');
    // let parentTask=this.taskForm.get('parentTask');
    let user=this.taskForm.get('user');
    let priority=this.taskForm.get('priority');
    var today=new Date();
    var nextDay=new Date(new Date().setDate(today.getDate()+1));
    if(checked){
      startDt.disable();
      priority.disable();
      this.taskForm.get('projectId').disable();
      this.taskForm.get('parentTaskId').disable();
      this.taskForm.get('userId').disable();

      this.taskForm.get('projectId').setValue('');
      this.taskForm.get('parentTaskId').setValue('');
      this.taskForm.get('userId').setValue('');
      startDt.setValue('');
      //startDt.setValue(new Date().toISOString().substr(0, 10));
      endDt.disable();
      endDt.setValue('');
     //endDt.setValue(nextDay.toISOString().substr(0, 10));
    }else{
      var minStartDay = new Date().toISOString().split('T')[0];
      var minEndDay = nextDay.toISOString().split('T')[0];
      startDt.enable();
      document.getElementsByName("startdate")[0].setAttribute('min', minStartDay);
      priority.enable();
      this.taskForm.get('projectId').enable();
      this.taskForm.get('parentTaskId').enable();
      this.taskForm.get('userId').enable();
      //startDt.setValue('');
      endDt.enable();
      endDt.enable();
      document.getElementsByName("enddate")[0].setAttribute('min', minEndDay);
      startDt.setValue(new Date().toISOString().substr(0, 10));
      endDt.setValue(nextDay.toISOString().substr(0, 10));
    }
  }
  // selectedRow(user:any){

  // }
  selectedRow(obj:any,type:string){
    if(type==='project'){
      this.project=obj;
      this.taskForm.get('project').setValue(obj.project);
      this.taskForm.get('projectId').setValue(obj.id);
      this.listSearch = obj.project;
    }else if(type==='user'){
      this.user = obj;
      this.taskForm.get('userId').setValue(obj.id);
      this.taskForm.get('user').setValue(obj.firstName + ' ' + obj.lastName);
      this.listSearch = obj.firstName + ' ' + obj.lastName;
    }else if(type==='parentTask'){
      this.listSearch=obj.parentTask;
      this.parentTask=obj;
      this.taskForm.get('parentTask').setValue(obj.parentTask);
      this.taskForm.get('parentTaskId').setValue(obj.id);
    }
  }
  setManager(){
    this.listSearch='';
  }
  getAllUsers() {
    this.userService.getAllUsers()
      .subscribe(data => {
        this.userList = data;
        console.log(data);
      })
  }
  getAllProjects(){
    this.projectService.getAllProjects()
      .subscribe(data => {
        this.projectList = data;
        console.log(data);
      })
  }
  getAllParentTasks(){
    this.taskService.getAllParentTasks()
    .subscribe(data=>{
      this.parentTaskList=data;
    })
  }
}
