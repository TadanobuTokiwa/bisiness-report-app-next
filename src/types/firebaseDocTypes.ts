export interface taskItemType {
    chk: number;
    color: string;
    id: number;
    orderNum: number;
    taskName: string;
}

export interface postItemType {
    createDate: string;
    task: number;
    startTime: string;
    endTime: string;
    kensu: number;
    User: string;
    workingHour: number;
    perHour: number;
    DateTimeNum: number;
}

export interface fetchItemType {
    id: number;
    createDate: string;
    task: number;
    startTime: string;
    endTime: string;
    kensu: number;
    User: string;
    workingHour: number;
    perHour: number;
    DateTimeNum: number;
}

export interface listItemType{
    id: number,
    date: string,
    task: number,
    startTime: string,
    endTime: string,
    workingHour: number,
    kensu: number,
    perHour: number,
    userName: string,
}