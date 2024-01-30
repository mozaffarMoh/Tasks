export interface loginDataInterface {
  email: string;
  password: string;
  role: string;
}

export interface RegisterDataInterface {
  username : string;
  email: string;
  password: string;
}

export interface TasksRowsInterface {
  id : number;
  userId?:any;
  image : any;
  _id : number;
  username : string;
  title : string;
  deadline : Date;
  status : string;
  description : string;
}

export interface UsersRowInterface {
  id : number;
  _id : number;
  role : string;
  username : string;
  email : string;
  createdAt : Date;
  assignedTasks : number;
  status : string;
}

export interface AddTaskInterface {
  title : string,
  username : string,
  imageFile : File,
  deadline : Date,
  description : string
}