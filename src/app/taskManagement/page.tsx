'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ProtectedRoute from '../protectedRoute'

export default function Component() {

    const [tasks, setTasks] = useState([
        { id: 2, orderNum: 1, taskName: '(入)在庫確認', color: '#ffcdd2' },
        { id: 3, orderNum: 2, taskName: '(入)道具検品', color: '#ffcdd2' },
        { id: 6, orderNum: 3, taskName: '(入)郵送伝票', color: '#ffcdd2' },
        { id: 96, orderNum: 4, taskName: '(入)紙売契対応', color: '#ffcdd2' },
        { id: 103, orderNum: 5, taskName: '(入)不備対応', color: '#ffcdd2' },
        { id: 1, orderNum: 10, taskName: '(入)日付チェック', color: '#bbdefb' },
        { id: 7, orderNum: 11, taskName: '(入)CL業務', color: '#bbdefb' },
        { id: 21, orderNum: 21, taskName: '(切)仕分け', color: '#ffcdd2' },
        { id: 111, orderNum: 22, taskName: '(切)預かり対応', color: '#ffcdd2' },
        { id: 32, orderNum: 30, taskName: '(切)スキャナー括更新', color: '#bbdefb' },
        { id: 33, orderNum: 31, taskName: '(切)商品移動', color: '#bbdefb' },
        { id: 34, orderNum: 32, taskName: '(切)売却処理', color: '#bbdefb' },
        { id: 35, orderNum: 33, taskName: '(切)発送作業', color: '#bbdefb' },
        { id: 110, orderNum: 34, taskName: '(切)棚付け', color: '#bbdefb' },
    ])
    const [editingTask, setEditingTask] = useState(
        { id: 110, orderNum: 34, taskName: '(切)棚付け', color: '#bbdefb' }
    )
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    const [newTask, setNewTask] = useState({
        id: 0,
        orderNum: 0,
        taskName: '',
        color: '#bbdefb'
    })

    const handleEdit = (task) => {
        setEditingTask(task)
        setIsEditDialogOpen(true)
    }

    const handleSave = () => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === editingTask.id ? editingTask : task
            )
        )
        setIsEditDialogOpen(false)
        setEditingTask(null)
        setHasChanges(true)
    }

    const handleAdd = () => {
        setIsAddDialogOpen(true)
        setNewTask({
            id: Math.max(...tasks.map(t => t.id)) + 1,
            orderNum: Math.max(...tasks.map(t => t.orderNum)) + 1,
            taskName: '',
            color: '#bbdefb'
        })
    }

    const handleAddSave = () => {
        if (newTask.taskName) {
            setTasks([...tasks, newTask])
            setIsAddDialogOpen(false)
            setNewTask(null)
            setHasChanges(true)
        }
    }

    const handleSaveAll = () => {
        // Here you would typically save all changes to your backend
        console.log('Saving all changes:', tasks)
        setHasChanges(false)
    }

    const handleReturn = () => {
        if (hasChanges) {
            if (window.confirm('変更が保存されていません。保存せずに戻りますか？')) {
                // Here you would typically navigate back
                console.log('Returning without saving changes')
            }
        } else {
        // Here you would typically navigate back
        console.log('Returning')
        }
    }

    return (
        <ProtectedRoute>
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>業務項目管理画面</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead className="text-center">並び順</TableHead>
                        <TableHead>作業項目名 (最大12文字)</TableHead>
                        <TableHead>背景色</TableHead>
                        <TableHead className="text-center">表示</TableHead>
                        <TableHead>編集</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                        <TableCell className="w-[80px]">{task.id}</TableCell>
                        <TableCell className="w-[80px] text-center">{task.orderNum}</TableCell>
                        <TableCell>{task.taskName}</TableCell>
                        <TableCell className="w-[100px]">
                            <div
                            className="h-6 w-full rounded"
                            style={{ backgroundColor: task.color }}
                            />
                        </TableCell>
                        <TableCell className="w-[80px] text-center">表示</TableCell>
                        <TableCell className="w-[100px]">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(task)}>
                            編集
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={handleAdd}>
                追加
                </Button>
                <div className="space-x-2">
                <Button 
                    variant="default" 
                    onClick={handleSaveAll}
                    disabled={!hasChanges}
                >
                    保存
                </Button>
                <Button 
                    variant="outline" 
                    onClick={handleReturn}
                >
                    戻る
                </Button>
                </div>
            </CardFooter>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
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
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={handleSave}>保存</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
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
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={handleAddSave}>追加</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
        </ProtectedRoute>
    )
}