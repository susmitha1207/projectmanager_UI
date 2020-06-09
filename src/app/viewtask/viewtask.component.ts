import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../model/Task';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { Project } from '../model/Project';

@Component({
  selector: 'app-viewtask',
  templateUrl: './viewtask.component.html',
  styleUrls: ['./viewtask.component.css']
})
export class ViewtaskComponent implements OnInit {
  taskList:Task[];
  listSearch:string;
  projectList:Project[];

  constructor(private taskService:TaskService,private routes:Router,private projectService:ProjectService) { }

  ngOnInit(): void {
    this.getAllTasks();
    this.getAllProjects();
  }
  sortList(paramName:string){
    if(paramName==="startDate"){
      this.taskList=this.taskList.sort((a,b) => {
        return new Date(a.startDate) >new Date(b.startDate)?-1:1;
      });
    }else if(paramName==="endDate"){
      this.taskList=this.taskList.sort((a,b) => {
        return new Date(a.endDate) >new Date(b.endDate)?-1:1;
      });
    }else if(paramName==="priority"){
      this.taskList=this.taskList.sort((a,b) => {
        return a.priority > b.priority?-1:1;
      });
    }else if(paramName==="Completed"){
      this.taskList=this.taskList.sort((a,b) => {
        return a.status > b.status?-1:1;
      });
    }
  }
  editTask(task:Task){
    this.routes.navigate(['/task',task.id]);
  }
  endTask(task:Task){
    task.status=1;
    this.taskService.saveOrUpdate(task).subscribe(data=>{
      
    })
  }
  getAllTasks(){
    this.taskService.getAllTasks().subscribe(data =>{
      this.taskList=data;
    })
  }
  getAllProjects(){
    this.projectService.getAllProjects()
      .subscribe(data => {
        this.projectList = data;
        console.log(data);
      })
  }
  setManager(){
    // this.listSearch='';
  }
  selectedRow(obj:any,type:string){
    if(type==='project'){
      // this.project=obj;
      // this.taskForm.get('project').setValue(obj.project);
      // this.taskForm.get('projectId').setValue(obj.id);
      this.listSearch = obj.project;
    }
  }
}
