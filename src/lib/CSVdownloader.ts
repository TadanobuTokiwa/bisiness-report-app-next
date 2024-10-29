import { listItemType, taskItemType } from "@/types/firebaseDocTypes";

type propsType = {
    data: listItemType[],
    taskItems: taskItemType[],
    filename: string,
}

export const downloadCSV = ({data, taskItems, filename}: propsType) => {
    if (!data || !data.length) return;

    const headers = ["日付", "業務項目", "開始時間", "終了時間", "業務時間", "件数", "時速", "従業員名"];

    const rows = data.map((item) => {
        const taskName = taskItems?.filter(taskItem => String(taskItem.id) === item.task)[0].taskName
        return ([
            item.date,
            taskName,
            item.startTime,
            item.endTime,
            item.workingHour.toFixed(3),
            item.kensu,
            item.perHour,
            item.userName,
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