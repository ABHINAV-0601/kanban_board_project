import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { NgToastService } from 'ng-angular-popup';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-task',
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.css']
})
export class AssignTaskComponent implements OnInit{

  maxDate: Date = new Date();
  random:any = Math.floor(Math.random() * 1000);
  user:any
  constructor(private userService:UserServiceService,private fb:FormBuilder, private popup:NgToastService,private route:Router){
    this.maxDate.setDate(this.maxDate.getDate() + 1);
    this.taskId?.setValue(this.random)
   
  }

  
  ngOnInit(): void {
    this.userService.getSpecificUser().subscribe(
      response => {
        console.log(response)
        this.user = response
        console.log(this.user);
        console.log(this.user.fullName)
        this.assignee?.setValue(this.user?.fullName)
      }
    )
    
  }

  addForm = this.fb.group({
    taskId: [''],
    taskTitle: ['', [Validators.required, Validators.minLength(10)]],
    assignee: [''],
    taskDescription: ['', [Validators.required, Validators.minLength(20)]],
    taskPriority: [''],
    taskDeadline: ['', Validators.required]

  })

  get taskId() { return this.addForm.get("taskId") }

  get taskTitle() { return this.addForm.get("taskTitle") }

  get assignee() { return this.addForm.get("assignee") }

  get taskDescription() { return this.addForm.get("taskDescription") }

  get taskPriority() { return this.addForm.get("taskPriority") }

  get taskDeadline() { return this.addForm.get("taskDeadline") }

  onSubmit(){
    this.userService.addTask(localStorage.getItem('email'),this.addForm.value).subscribe(
      response => {
        console.log(response)
        // alert('Task added successfully');
        // this.popup.success({detail:"Assigned",summary:"Task Assigned Successfully",duration:5000})
        Swal.fire(
          'Assigned!',
          'Task Assigned Successfully!!',
          'success'
        )
        this.route.navigateByUrl("allusers")
      },(err) => {
        console.log(err)
        // this.popup.error({detail:"Task Limit Reached",summary:"Max number of task has been assigned",duration:5000})
        Swal.fire({
          title: 'Task Limit Reached!',
          text: 'Maximum number of task has been assigned to this user',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        // alert("Task Limit Reached!!")
        this.route.navigateByUrl("allusers")
      }
    )
  }

}
