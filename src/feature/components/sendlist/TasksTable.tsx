import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { listItemType, taskItemType } from "@/types/firebaseDocTypes";

type ChildComponentProps = {
    currentItems: listItemType[]
    taskItems: taskItemType[] | undefined;
    setEditingItem: React.Dispatch<React.SetStateAction<listItemType | null>>;
    setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TasksTable = ({currentItems, taskItems, setEditingItem, setIsEditDialogOpen}: ChildComponentProps) => {

    const editButtonHandler = (searchId: string) => {
        const targetItem = currentItems.filter(item => item.docID === searchId)[0];
        if(!targetItem) return
        setEditingItem(targetItem);
        setIsEditDialogOpen(true);
    }

    return (
        <CardContent>
            <Table className='border'>
            <TableHeader className='bg-gradient-to-b from-blue-800 to-blue-700 text-white'>
                <TableRow>
                <TableHead>日付</TableHead>
                <TableHead>業務項目</TableHead>
                <TableHead>開始時間</TableHead>
                <TableHead>終了時間</TableHead>
                <TableHead>業務時間</TableHead>
                <TableHead>件数</TableHead>
                <TableHead>時速</TableHead>
                <TableHead>従業員名</TableHead>
                <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className='bg-zinc-50'>
                {currentItems.map((item, index) => {
                    const taskName = taskItems?.filter(taskItem => String(taskItem.id) === item.task)[0].taskName
                    const disableEdit = new Date(item.date).toDateString() !== new Date().toDateString()
                    return (
                        <TableRow key={index}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{taskName}</TableCell>
                            <TableCell>{item.startTime}</TableCell>
                            <TableCell>{item.endTime}</TableCell>
                            <TableCell>{item.workingHour.toFixed(3)}</TableCell>
                            <TableCell>{item.kensu}</TableCell>
                            <TableCell>{item.perHour}</TableCell>
                            <TableCell>{item.userName}</TableCell>
                            <TableCell>
                            <Button 
                                className={disableEdit ? "invisible" : 'hover:bg-gray-200'} 
                                variant="outline" 
                                size="sm"
                                onClick={() => !disableEdit && editButtonHandler(item.docID)}
                            >編集</Button>
                            </TableCell>
                        </TableRow>
                    )
                    })}
            </TableBody>
            </Table>
        </CardContent>
    )
}

export default TasksTable