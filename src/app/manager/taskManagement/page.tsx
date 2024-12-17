'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import ProtectedRoute from '../../protectedRoute'
import { taskItemType } from '@/types/firebaseDocTypes'
import { fetchAllTasks } from '@/lib/api/tasks'
import TaskManageTable from '@/feature/components/taskManagement/TaskManageTable'
import TaskManageFooter from '@/feature/components/taskManagement/TaskManageFooter'
import EditDialog from '@/feature/components/taskManagement/EditDialog'
import AddDialog from '@/feature/components/taskManagement/AddDialog'

const TaskManagement = () => {

    const [tasks, setTasks] = useState<(taskItemType | null)[]>([])
    const [editingTask, setEditingTask] = useState<taskItemType | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
    const [changedItems, setChangedItems] = useState<(taskItemType | null)[]>([])
    const [addedItems, setAddedItems] = useState<(taskItemType | null)[]>([])
    const [newTask, setNewTask] = useState<taskItemType | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        // DBと一致させるためcache未使用
        const dataFetch = async() => {
            const allTasks = await fetchAllTasks()
            setTasks(allTasks)
        }
        dataFetch().then(() => setLoading(false))
    }, [])

    return (
        <ProtectedRoute>
        <Card className="w-full max-w-4xl mx-auto my-5 bg-slate-50">
            <CardHeader>
                <CardTitle>業務項目管理画面</CardTitle>
            </CardHeader>
            <CardContent>
                <TaskManageTable 
                    tasks={tasks}
                    setEditingTask={setEditingTask}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    loading={loading}
                />
            </CardContent>
            <CardFooter className="flex justify-between">
                <TaskManageFooter
                    tasks={tasks}
                    changedItems={changedItems} 
                    addedItems={addedItems}
                    setIsAddDialogOpen={setIsAddDialogOpen}
                    setNewTask={setNewTask}
                    setAddedItems={setAddedItems}
                    setChangedItems={setChangedItems}
                />
            </CardFooter>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <EditDialog 
                    editingTask={editingTask} 
                    addedItems={addedItems}
                    setTasks={setTasks}
                    setIsEditDialogOpen={setIsEditDialogOpen} 
                    setEditingTask={setEditingTask}
                    setAddedItems={setAddedItems}
                    setChangedItems={setChangedItems}
                    changedItems={changedItems}
                />
            </Dialog>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <AddDialog 
                    newTask={newTask}
                    setTasks={setTasks}
                    setIsAddDialogOpen={setIsAddDialogOpen} 
                    setNewTask={setNewTask}
                    setAddedItems={setAddedItems}
                    tasks={tasks}
                    addedItems={addedItems}
                />
            </Dialog>
        </Card>
        </ProtectedRoute>
    )
}

export default TaskManagement;