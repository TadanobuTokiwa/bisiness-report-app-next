export interface taskItemType {
    chk: boolean;
    color: string;
    id: number;
    orderNum: number;
    taskName: string;
    docID: string;
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

export interface listItemType{
    date: string;
    task: number,
    startTime: string,
    endTime: string,
    workingHour: number,
    kensu: number,
    perHour: number,
    userName: string,
    docID: string,
}