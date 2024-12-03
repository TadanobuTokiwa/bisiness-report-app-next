import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { taskItemType } from "@/types/firebaseDocTypes"

type ChildComponentProps = {
    editingTask: taskItemType | null;
    addedItems: (taskItemType | null)[];
    setTasks: React.Dispatch<React.SetStateAction<(taskItemType | null)[]>>;
    setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    setEditingTask: React.Dispatch<React.SetStateAction<taskItemType | null>>
    setAddedItems: React.Dispatch<React.SetStateAction<(taskItemType | null)[]>>
    setChangedItems: React.Dispatch<React.SetStateAction<(taskItemType | null)[]>>;
    changedItems: (taskItemType | null)[]
};

const EditDialog = ({
        editingTask,
        addedItems,
        setTasks, 
        setIsEditDialogOpen, 
        setEditingTask, 
        setAddedItems, 
        setChangedItems, 
        changedItems
    }: ChildComponentProps) => {

    const handleSave = () => {

        if(!editingTask || !editingTask.id || !editingTask.orderNum || !editingTask.taskName){
            window.alert("入力内容を確認してください");
            return
        }

        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task!.id === editingTask!.id ? editingTask : task
            ).sort((a, b) => {
                if(a!.orderNum > b!.orderNum) return 1
                else if(a!.orderNum < b!.orderNum) return -1
                else return 0
            })
        )
        setIsEditDialogOpen(false)
        setEditingTask(null)
        
        const is_added = addedItems.filter(addedItem => addedItem && addedItem.id === editingTask.id).length
        if(is_added){
            setAddedItems((prevItems) =>
                prevItems.map((task) =>
                    task!.id === editingTask!.id ? editingTask : task
                ))
        }else{
            if(changedItems.filter(item => item?.id === editingTask.id).length){
                setChangedItems((prevItems) =>
                    prevItems.map((task) =>
                        task!.id === editingTask!.id ? editingTask : task
                    )
                )
            }else{
                setChangedItems((prevItems) => [ ...prevItems, editingTask ])
            }
        }
    }

    return (
        <DialogContent className='bg-slate-50'>
        <DialogHeader>
            <DialogTitle>業務項目の編集</DialogTitle>
        </DialogHeader>
        {editingTask && (
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-id" className="text-right">
                ID
                </Label>
                <Input
                id="task-id"
                value={editingTask.id}
                className="col-span-3"
                disabled
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-order" className="text-right">
                並び順
                </Label>
                <Input
                id="task-order"
                type="number"
                value={editingTask.orderNum}
                onChange={(e) =>
                    setEditingTask({
                    ...editingTask,
                    orderNum: parseInt(e.target.value, 10),
                    })
                }
                className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-name" className="text-right">
                作業項目名
                </Label>
                <Input
                id="task-name"
                value={editingTask.taskName}
                onChange={(e) =>
                    setEditingTask({ ...editingTask, taskName: e.target.value })
                }
                maxLength={12}
                className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-color" className="text-right">
                背景色
                </Label>
                <div className="col-span-3 flex gap-2">
                <Input
                    id="task-color"
                    type="color"
                    value={editingTask.color}
                    onChange={(e) =>
                    setEditingTask({ ...editingTask, color: e.target.value })
                    }
                    className="w-20 p-1 h-10"
                />
                <Input
                    type="text"
                    value={editingTask.color}
                    onChange={(e) =>
                    setEditingTask({ ...editingTask, color: e.target.value })
                    }
                    className="flex-1"
                    placeholder="#000000"
                />
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-visible" className="text-right">
                    表示設定
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                    id="task-visible"
                    checked={editingTask.chk !== 0}
                    onCheckedChange={(checked: boolean) =>
                    setEditingTask({ ...editingTask, chk: checked ? 1 : 0 })
                    }
                />
                <label htmlFor="task-visible" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    表示する
                </label>
                </div>
            </div>
            </div>
        )}
        <DialogFooter>
            <div className='w-full border border-black text-center bg-gray-100 hover:bg-gray-200'>
                <Button onClick={() => handleSave()}>保存</Button>
            </div>
        </DialogFooter>
        </DialogContent>
    )
}

export default EditDialog