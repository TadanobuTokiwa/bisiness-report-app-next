import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { updateItem } from '@/lib/api/items'
import { listItemType, taskItemType } from "@/types/firebaseDocTypes"

type ChildComponentProps = {
    editingItem: listItemType | null;
    setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setAllItems: React.Dispatch<React.SetStateAction<listItemType[]>>;
    setEditingItem: React.Dispatch<React.SetStateAction<listItemType | null>>;
    taskItems: taskItemType[]
};

const ItemEditDialog = ({editingItem, setIsEditDialogOpen, setAllItems, setEditingItem, taskItems}: ChildComponentProps) => {

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ selectTeam, setSelectTeam ] = useState<string>("")
    const taskTeams = [...new Set(taskItems.map(item => item.teamName))]

    useEffect(() => {
        const team = taskItems.filter(item => item.id === editingItem?.task)[0]
        if(team){
            setSelectTeam(team.teamName)
        }
    },[taskItems, editingItem])

    const handleEditSave = async() => {
        if(!editingItem){
            return
        }

        const timeChk1 = editingItem.startTime >= editingItem.endTime;
        const timeChk2 = editingItem.startTime === "";
        if(editingItem.task === null || editingItem.task === undefined || timeChk1 || timeChk2){
            window.alert("入力内容を確認してください")
            return
        }

        setIsLoading(true)
        const {responseData, newData} = await updateItem(editingItem)
        
        if(!responseData.success){
            setIsLoading(false)
            window.alert("エラーが発生しました。")
            return
        }

        setIsEditDialogOpen(false);
        setIsLoading(false)
        setAllItems(prevItems =>
            prevItems.map(item =>
                item.id === newData.data.id ? { ...newData.data } : { ...item }
            )
        );
    }

    const selectedTeam = (value: string) => {
        setSelectTeam(value)
        setEditingItem({...editingItem!, task: null})
    }

    return (
        <DialogContent className='bg-slate-50'>
        <DialogHeader>
            <DialogTitle>項目の編集</DialogTitle>
            <DialogDescription>
                編集後、保存ボタンを押してください
            </DialogDescription>
        </DialogHeader>
        {editingItem && (
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-id" className="text-right">
                ID
                </Label>
                <Input
                id="task-id"
                value={editingItem.id}
                className="col-span-3"
                disabled
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">
                日付
                </Label>
                <Input
                id="edit-date"
                type="date"
                value={editingItem.createDate}
                onChange={(e) => setEditingItem({...editingItem, createDate: e.target.value})}
                className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-task" className="text-right">
                チーム名
                </Label>
                <Select
                value={selectTeam}
                onValueChange={(value) => selectedTeam(value)}
                >
                <SelectTrigger id="edit-task" className="col-span-3">
                    <SelectValue placeholder="チーム名を選択" />
                </SelectTrigger>
                <SelectContent className="bg-gray-100">
                    {taskTeams?.map((item,index) => {
                        return(
                            <SelectItem 
                                key={index} 
                                value={item} 
                                className= "hover:border-y border-black hover:brightness-110"
                            >{item}</SelectItem>
                        )
                    })}
                </SelectContent>
                </Select>
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
                    {taskItems?.filter(item => {
                        return item.teamName === selectTeam
                    }).map((item,index) => {
                        return(
                            <SelectItem 
                                key={index} 
                                value={String(item.id)} 
                                className= "hover:border-y border-black hover:brightness-110"
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
                <Button 
                    className='w-full bg-blue-600 text-white hover:bg-blue-700'
                    type="submit"
                    onClick={handleEditSave}
                    disabled={isLoading}
                >
                    {isLoading ? "保存中..." : "保存"}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default ItemEditDialog