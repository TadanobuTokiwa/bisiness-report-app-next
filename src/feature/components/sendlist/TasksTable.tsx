import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { listItemType, taskItemType } from "@/types/firebaseDocTypes";

type ChildComponentProps = {
    currentItems: listItemType[];
    taskItems: taskItemType[];
    setEditingItem: React.Dispatch<React.SetStateAction<listItemType | null>>;
    setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    manager: boolean
    isLoading: boolean
};

const TasksTable = ({currentItems, taskItems, setEditingItem, setIsEditDialogOpen, manager, isLoading}: ChildComponentProps) => {

    const editButtonHandler = (searchId: number) => {
        const targetItem = currentItems.filter(item => item.id === searchId)[0];
        if(!targetItem) return
        setEditingItem(targetItem);
        setIsEditDialogOpen(true);
    }

    return (
        <CardContent>
            <Table className='border'>
            <TableHeader className='bg-gradient-to-b from-blue-800 to-blue-700 text-white'>
                <TableRow>
                <TableHead>ID</TableHead>    
                <TableHead>日付</TableHead>
                <TableHead>業務項目</TableHead>
                <TableHead>開始時間</TableHead>
                <TableHead>終了時間</TableHead>
                <TableHead>件数</TableHead>
                <TableHead>時速</TableHead>
                <TableHead>メールアドレス</TableHead>
                <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className='bg-zinc-50'>
                {currentItems.map((item, index) => {
                    const targetTask = taskItems?.filter(taskItem => taskItem.id === item.task)[0]
                    const taskName = targetTask ? targetTask.taskName : "エラー"
                    const disableEdit = !manager && new Date(item.createDate).toDateString() !== new Date().toDateString()
                    return (
                        <TableRow key={index} className="hover:bg-gray-200">
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.createDate}</TableCell>
                            <TableCell className={targetTask ? "" : "bg-red-500"}>{taskName}</TableCell>
                            <TableCell>{item.startTime}</TableCell>
                            <TableCell>{item.endTime}</TableCell>
                            <TableCell>{item.kensu}</TableCell>
                            <TableCell>{item.perHour}</TableCell>
                            <TableCell>{item.User.split("@")[0]}</TableCell>
                            <TableCell>
                            <Button 
                                className={disableEdit ? "invisible" : 'hover:bg-gray-200'} 
                                variant="outline" 
                                size="sm"
                                disabled={isLoading}
                                onClick={() => !disableEdit && editButtonHandler(item.id)}
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