export interface taskItemType {
    chk: number;
    color: string;
    id: number;
    orderNum: number;
    taskName: string;
    teamName: string;
    taskType: string;
}

export interface postItemType {
    createDate: string;
    task: number;
    startTime: string;
    endTime: string;
    kensu: number;
    User: string;
    UserName: string;
    workingHour: number;
    perHour: number;
    DateTimeNum: number;
}

export interface listItemType {
    id: number;
    createDate: string;
    task: number | null;
    startTime: string;
    endTime: string;
    kensu: number;
    User: string;
    UserName: string;
    workingHour: number;
    perHour: number;
    DateTimeNum: number;
}