'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ProtectedRoute from '../protectedRoute'
import { taskItemType } from '@/types/firebaseDocTypes'
import { useRouter } from 'next/navigation'
import { addTaskManager, fetchAllTasks, updateTaskManager } from '@/lib/firebase/firebaseStoreFunctions'

const TaskManagement = () => {

    const [tasks, setTasks] = useState<(taskItemType | null)[]>([])
    const [editingTask, setEditingTask] = useState<taskItemType | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
    const [changedItems, setChangedItems] = useState<(taskItemType | null)[]>([])
    const [addedItems, setAddedItems] = useState<taskItemType[]>([])
    const [newTask, setNewTask] = useState<taskItemType | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const router = useRouter()

    useEffect(() => {
        const dataFetch = async() => {
            const allTasks = await fetchAllTasks()
            setTasks(allTasks)
        }
        dataFetch().then(() => setLoading(false))
    }, [])

    const handleEdit = (task: taskItemType) => {
        setEditingTask(task)
        setIsEditDialogOpen(true)
    }

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
        
        if(editingTask.docID === ""){
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

    const handleAdd = () => {
        setIsAddDialogOpen(true)
        setNewTask({
            id: Math.max(...tasks.map(t => t!.id)) + 1,
            orderNum: Math.max(...tasks.map(t => t!.orderNum)) + 1,
            taskName: '',
            color: '#bbdefb',
            chk: true,
            docID: "",
        })
    }

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

    const handleSaveAll = () => {
        addedItems.forEach(item => {
            addTaskManager(item!)
        })
        setAddedItems([])

        changedItems.forEach(item => {
            updateTaskManager(item!)
        })
        setChangedItems([])
    }

    const handleReturn = () => {
        if (changedItems.length || addedItems.length) {
            if (window.confirm('変更が保存されていません。保存せずに戻りますか？')) {
                setChangedItems([])
                setAddedItems([])
                router.push("/")
            }
        }
    }  

    return (
        <ProtectedRoute>
        <Card className="w-full max-w-4xl mx-auto my-5 bg-slate-50">
            <CardHeader>
                <CardTitle>業務項目管理画面</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                <Table>
                    <TableHeader className='bg-red-50'>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead className="text-center">並び順</TableHead>
                        <TableHead>作業項目名 (最大12文字)</TableHead>
                        <TableHead>背景色</TableHead>
                        <TableHead className="text-center">表示</TableHead>
                        <TableHead>編集</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody className='bg-white'>
                    {
                        tasks.map((task) => (
                            <TableRow key={task!.id} className='hover:bg-slate-50'>
                            <TableCell className="w-[80px]">{task!.id}</TableCell>
                            <TableCell className="w-[80px] text-center">{task!.orderNum}</TableCell>
                            <TableCell>{task!.taskName}</TableCell>
                            <TableCell className="w-[100px]">
                                <div
                                className="h-6 w-full rounded"
                                style={{ backgroundColor: task!.color }}
                                />
                            </TableCell>
                            <TableCell className="w-[80px] text-center">{task!.chk ? "表示" : "非表示"}</TableCell>
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
            </CardContent>
            <CardFooter className="flex justify-between">
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
            </CardFooter>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                            checked={editingTask.chk}
                            onCheckedChange={(checked: boolean) =>
                            setEditingTask({ ...editingTask, chk: checked })
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
            </Dialog>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className='bg-slate-50'>
                <DialogHeader>
                    <DialogTitle>新規業務項目の追加</DialogTitle>
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
                            checked={newTask.chk}
                            onCheckedChange={(checked: boolean) =>
                            setNewTask({ ...newTask, chk: checked })
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
                        <Button onClick={() => handleAddSave()}>追加</Button>
                    </div>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
        </ProtectedRoute>
    )
}

export default TaskManagement;