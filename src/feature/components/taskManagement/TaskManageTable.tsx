import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { taskItemType } from "@/types/firebaseDocTypes";

type ChildComponentProps = {
    tasks: (taskItemType | null)[];
    setEditingTask: React.Dispatch<React.SetStateAction<taskItemType | null>>;
    setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean
};

const TaskManageTable = ({tasks, setEditingTask, setIsEditDialogOpen, loading}: ChildComponentProps) => {

    const handleEdit = (task: taskItemType) => {
        setEditingTask(task)
        setIsEditDialogOpen(true)
    }

    return (
        <div className="rounded-md border">
        <Table>
            <TableHeader className='bg-red-50'>
            <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="text-center">並び順</TableHead>
                <TableHead>作業項目名 (最大12文字)</TableHead>
                <TableHead>チーム名</TableHead>
                <TableHead>業務項目種別</TableHead>
                <TableHead>背景色</TableHead>
                <TableHead className="text-center">表示</TableHead>
                <TableHead></TableHead>
            </TableRow>
            </TableHeader>
            <TableBody className='bg-white'>
            {
                tasks.map((task) => (
                    <TableRow key={task!.id} className='hover:bg-slate-50'>
                    <TableCell className="w-[80px]">{task!.id}</TableCell>
                    <TableCell className="w-[80px] text-center">{task!.orderNum}</TableCell>
                    <TableCell>{task!.taskName}</TableCell>
                    <TableCell>{task!.teamName}</TableCell>
                    <TableCell>{task!.taskType}</TableCell>
                    <TableCell className="w-[100px]">
                        <div
                        className="h-6 w-full rounded"
                        style={{ backgroundColor: task!.color }}
                        />
                    </TableCell>
                    <TableCell className={`w-[80px] text-center ${task!.chk ? "" : "text-red-500 font-bold"}`}>{task!.chk ? "表示" : "非表示"}</TableCell>
                    <TableCell className="w-[100px]">
                        <Button className='hover:bg-slate-100' variant="outline" size="sm" onClick={() => handleEdit(task!)}>
                        編集
                        </Button>
                    </TableCell>
                    </TableRow>
                ))
            }
            </TableBody>
        </Table>
        {loading ? <strong className='w-full'>Loading...</strong> : <></>}
        </div>
    )
}

export default TaskManageTable