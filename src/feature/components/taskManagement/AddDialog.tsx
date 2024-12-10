import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { taskItemType } from "@/types/firebaseDocTypes"

type ChildComponentProps = {
    newTask: taskItemType | null;
    setTasks: React.Dispatch<React.SetStateAction<(taskItemType | null)[]>>;
    setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    setNewTask: React.Dispatch<React.SetStateAction<taskItemType | null>>
    setAddedItems: React.Dispatch<React.SetStateAction<(taskItemType | null)[]>>
    tasks: (taskItemType | null)[]
    addedItems: (taskItemType | null)[]
};

const addDialog = ({
    newTask, 
    setTasks, 
    setIsAddDialogOpen, 
    setNewTask, 
    setAddedItems, 
    tasks, 
    addedItems
    }: ChildComponentProps) => {

    const handleAddSave = () => {

        if(!newTask || !newTask.id || !newTask.orderNum || !newTask.taskName){
            window.alert("入力内容を確認してください");
            return
        }

        if (newTask && newTask.taskName) {
            setTasks([...tasks, newTask].sort((a, b) => {
                if(a!.orderNum > b!.orderNum) return 1
                else if(a!.orderNum < b!.orderNum) return -1
                else return 0
            }))
            setIsAddDialogOpen(false)
            setNewTask(null)
            setAddedItems([...addedItems, newTask])
        }
    }

    return (
        <DialogContent className='bg-slate-50'>
        <DialogHeader>
            <DialogTitle>新規業務項目の追加</DialogTitle>
            <DialogDescription>
                編集後、追加ボタンを押してください
            </DialogDescription>
        </DialogHeader>
        {newTask && (
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-task-id" className="text-right">
                ID
                </Label>
                <Input
                id="new-task-id"
                value={newTask.id}
                className="col-span-3"
                disabled
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-task-order" className="text-right">
                並び順
                </Label>
                <Input
                id="new-task-order"
                type="number"
                value={newTask.orderNum}
                onChange={(e) =>
                    setNewTask({
                    ...newTask,
                    orderNum: parseInt(e.target.value, 10),
                    })
                }
                className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-task-name" className="text-right">
                作業項目名
                </Label>
                <Input
                id="new-task-name"
                value={newTask.taskName}
                onChange={(e) =>
                    setNewTask({ ...newTask, taskName: e.target.value })
                }
                maxLength={12}
                className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-task-name" className="text-right">
                チーム名
                </Label>
                <Input
                id="new-task-name"
                value={newTask.teamName}
                onChange={(e) =>
                    setNewTask({ ...newTask, teamName: e.target.value })
                }
                maxLength={5}
                className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-task-name" className="text-right">
                業務項目種別
                </Label>
                <Input
                id="new-task-name"
                value={newTask.taskType}
                onChange={(e) =>
                    setNewTask({ ...newTask, taskType: e.target.value })
                }
                maxLength={6}
                className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-task-color" className="text-right">
                背景色
                </Label>
                <div className="col-span-3 flex gap-2">
                <Input
                    id="new-task-color"
                    type="color"
                    value={newTask.color}
                    onChange={(e) =>
                    setNewTask({ ...newTask, color: e.target.value })
                    }
                    className="w-20 p-1 h-10"
                />
                <Input
                    type="text"
                    value={newTask.color}
                    onChange={(e) =>
                    setNewTask({ ...newTask, color: e.target.value })
                    }
                    className="flex-1"
                    placeholder="#000000"
                />
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-task-visible" className="text-right">
                    表示設定
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                    id="new-task-visible"
                    checked={newTask.chk !== 0}
                    onCheckedChange={(checked: boolean) =>
                    setNewTask({ ...newTask, chk: checked ? 1 : 0})
                    }
                />
                <label htmlFor="new-task-visible" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    表示する
                </label>
                </div>
            </div>
            </div>
        )}
        <DialogFooter>
            <div className='w-full border border-black text-center bg-red-100 hover:bg-red-200'>
                <Button className="w-full" onClick={() => handleAddSave()}>追加</Button>
            </div>
        </DialogFooter>
        </DialogContent>
    )
}

export default addDialog