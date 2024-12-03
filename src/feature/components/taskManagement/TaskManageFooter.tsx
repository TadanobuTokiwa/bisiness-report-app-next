import { Button } from "@/components/ui/button"
import { addTaskManager, updateTaskManager } from "@/lib/api/tasks";
import { taskItemType } from "@/types/firebaseDocTypes";
import { useRouter } from "next/navigation"

type ChildComponentProps = {
    tasks: (taskItemType | null)[];
    changedItems: (taskItemType | null)[];
    addedItems: (taskItemType | null)[]
    setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    setNewTask: React.Dispatch<React.SetStateAction<taskItemType | null>>
    setAddedItems: React.Dispatch<React.SetStateAction<(taskItemType | null)[]>>
    setChangedItems: React.Dispatch<React.SetStateAction<(taskItemType | null)[]>>
};

const TaskManageFooter = ({
    tasks,
    changedItems, 
    addedItems, 
    setIsAddDialogOpen, 
    setNewTask,  
    setAddedItems,
    setChangedItems
    }: ChildComponentProps) => {


    const router = useRouter();

    const handleAdd = () => {
        setIsAddDialogOpen(true)
        setNewTask({
            id: Math.max(...tasks.map(t => t!.id)) + 1,
            orderNum: Math.max(...tasks.map(t => t!.orderNum)) + 1,
            taskName: '',
            color: '#bbdefb',
            chk: 1,
        })
    }

    const handleSaveAll = () => {
        if(addedItems.length){
            const newTasks = addedItems.filter(item => item !== null)
            addTaskManager(newTasks)
            setAddedItems([])
        }

        if(changedItems.length){
            const editTasks = changedItems.filter(item => item !== null)
            updateTaskManager(editTasks)
            setChangedItems([])
        }
    }

    const handleReturn = () => {
        if (changedItems.length || addedItems.length) {
            if (window.confirm('変更が保存されていません。保存せずに戻りますか？')) {
                setChangedItems([])
                setAddedItems([])
                router.back()
            }
        } else {
            router.back()
        }
    }  

    return (
        <>
            <Button 
            className='border border-black hover:bg-slate-100'
            onClick={handleAdd}>
            追加
            </Button>
            <div className="space-x-2">
            <Button 
                className='border border-black mr-3 hover:bg-slate-100'
                variant="default" 
                onClick={handleSaveAll}
                disabled={changedItems.length === 0 && addedItems.length === 0}
            >
                保存
            </Button>
            <Button 
                className='hover:bg-slate-100'
                variant="outline" 
                onClick={handleReturn}
            >
                戻る
            </Button>
            </div>
        </>
    )
}

export default TaskManageFooter