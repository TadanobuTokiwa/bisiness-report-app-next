import { listItemType, taskItemType } from "@/types/firebaseDocTypes";

type propsType = {
    data: listItemType[],
    allTaskItems: taskItemType[],
    filename: string,
}

export const downloadCSV = ({data, allTaskItems, filename}: propsType) => {
    if (!data || !data.length) return;

    const headers = ["ID", "日付", "業務項目", "開始時間", "終了時間", "業務時間", "件数", "時速", "従業員名", "メールアドレス", "業務項目種別", "チームの業務"];

    const rows = data.map((item) => {
        const taskItem = allTaskItems?.filter(taskItem => taskItem.id === item.task)
        const taskName = taskItem.length === 1 ? taskItem[0].taskName ? taskItem[0].taskName : "" : ""
        const taskTeam = taskItem.length === 1 ? taskItem[0].teamName ? taskItem[0].teamName : "" : ""
        const taskType = taskItem.length === 1 ? taskItem[0].taskType ? taskItem[0].taskType : "" : ""
        return ([
            item.id,
            item.createDate,
            taskName,
            item.startTime,
            item.endTime,
            item.workingHour.toFixed(3),
            item.kensu,
            item.perHour,
            item.UserName,
            item.User,
            taskType,
            taskTeam
        ])
    });

    // 文字化け回避
    const bom = '\uFEFF';

    const csvContent = [headers, ...rows]
        .map((row) => row.join(','))
        .join('\n');

    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.click();

    // オブジェクトURLをクリーンアップ
    URL.revokeObjectURL(url);
}