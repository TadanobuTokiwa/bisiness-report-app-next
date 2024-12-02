import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { updateItem } from '@/lib/firebase/firebaseStoreFunctions'
import { listItemType, taskItemType } from "@/types/firebaseDocTypes"

type ChildComponentProps = {
    editingItem: listItemType | null;
    setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setAllItems: React.Dispatch<React.SetStateAction<listItemType[]>>;
    setEditingItem: React.Dispatch<React.SetStateAction<listItemType | null>>;
    taskItems: taskItemType[]
};

const ItemEditDialog = ({editingItem, setIsEditDialogOpen, setAllItems, setEditingItem, taskItems}: ChildComponentProps) => {

    const handleEditSave = async() => {
        const {newItem, error} = await updateItem(editingItem!)
        
        if(error && !newItem){
            window.alert("エラーが発生しました。")
            return
        }

        const updateTask = {
            date: newItem.createDate,
            task: newItem.task,
            startTime: newItem.startTime,
            endTime: newItem.endTime,
            workingHour: newItem.workingHour,
            kensu: newItem.kensu,
            perHour: newItem.perHour,
            userName: editingItem!.userName,
            id: editingItem!.id
        }

        setIsEditDialogOpen(false);
        setAllItems(prevItems =>
            prevItems.map(item =>
                item.id === updateTask!.id ? { ...updateTask } : { ...item }
            )
        );
    }

    return (
        <DialogContent className='bg-slate-50'>
        <DialogHeader>
            <DialogTitle>項目の編集</DialogTitle>
        </DialogHeader>
        {editingItem && (
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">
                日付
                </Label>
                <Input
                id="edit-date"
                type="date"
                value={editingItem.date}
                onChange={(e) => setEditingItem({...editingItem, date: e.target.value})}
                className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-task" className="text-right">
                業務項目
                </Label>
                <Select
                value={String(editingItem.task)}
                onValueChange={(value) => setEditingItem({...editingItem, task: Number(value)})}
                >
                <SelectTrigger id="edit-task" className="col-span-3">
                    <SelectValue placeholder="業務項目を選択" />
                </SelectTrigger>
                <SelectContent>
                    {taskItems?.map((item,index) => {
                        return(
                            <SelectItem 
                                key={index} 
                                value={String(item.id)} 
                                style={{"backgroundColor": item.color}}
                            >{item.taskName}</SelectItem>
                        )
                    })}
                </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-start-time" className="text-right">
                開始時間
                </Label>
                <Input
                id="edit-start-time"
                type="time"
                value={editingItem.startTime}
                onChange={(e) => setEditingItem({...editingItem, startTime: e.target.value})}
                className="col-span-3"
                step={60}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-end-time" className="text-right">
                終了時間
                </Label>
                <Input
                id="edit-end-time"
                type="time"
                value={editingItem.endTime}
                onChange={(e) => setEditingItem({...editingItem, endTime: e.target.value})}
                className="col-span-3"
                step={60}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-count" className="text-right">
                件数
                </Label>
                <Input
                id="edit-count"
                type="number"
                value={editingItem.kensu}
                onChange={(e) => setEditingItem({...editingItem, kensu: parseInt(e.target.value, 10)})}
                className="col-span-3"
                />
            </div>
            </div>
        )}
            <DialogFooter>
                <Button className='w-full bg-blue-600 text-white hover:bg-blue-700' type="submit" onClick={handleEditSave}>保存</Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default ItemEditDialog