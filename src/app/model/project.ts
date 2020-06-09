export interface Project {
    id:Int16Array,
    project:String,
    startDate:Date
    endDate:Date,
    priority:Int16Array,
    manager:any,
    noOfTasks:number,
    noOfCompletedTask:number
}
