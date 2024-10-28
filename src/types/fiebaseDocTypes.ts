export interface taskItemType {
    chk: boolean;
    color: string;
    id: number;
    orderNum: number;
    taskName: string;
}

export interface postItemType {
    createDate: string;
    task: string;
    startTime: string;
    endTime: string;
    kensu: number;
    User: string;
    workingHour: number;
    perHour: number;
    DateTimeNum: number;
}