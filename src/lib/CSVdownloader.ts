import { listItemType, taskItemType } from "@/types/firebaseDocTypes";

type propsType = {
    data: listItemType[],
    allTaskItems: taskItemType[],
    filename: string,
}

export const downloadCSV = ({data, allTaskItems, filename}: propsType) => {
    if (!data || !data.length) return;

    const headers = ["日付", "業務項目", "開始時間", "終了時間", "業務時間", "件数", "時速", "メールアドレス"];

    const rows = data.map((item) => {
        const taskItem = allTaskItems?.filter(taskItem => taskItem.id === item.task)
        const taskName = taskItem.length === 1 ? taskItem[0].taskName ? taskItem[0].taskName : "" : ""
        return ([
            item.createDate,
            taskName,
            item.startTime,
            item.endTime,
            item.workingHour.toFixed(3),
            item.kensu,
            item.perHour,
            item.User,
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