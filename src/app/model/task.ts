export interface Task {
    id:Int16Array,
    task:String,
    parent:boolean,
    parentTask:any,
    project:any,
    startDate:Date
    endDate:Date,
    priority:Int16Array,
    status:any,
    user:any
}