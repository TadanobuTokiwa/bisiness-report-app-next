'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { listItemType, taskItemType } from '@/types/firebaseDocTypes'
import SearchComp from '@/feature/components/sendlist/SearchComp'
import TasksTable from '@/feature/components/sendlist/TasksTable'
import ListFooter from '@/feature/components/sendlist/ListFooter'
import ItemEditDialog from '@/feature/components/sendlist/ItemEditDialog'
import ProtectedRoute from '../../protectedRoute'
import { useTasks } from '@/hooks/useTasks'

const SendList = () => {
    const [allItems, setAllItems] = useState<listItemType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [editingItem, setEditingItem] = useState<listItemType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const itemsPerPage = 10

    const { data } = useTasks();
    const taskItems: taskItemType[] = data ? data.filter(item => item.chk) : []
    const allTaskItems: taskItemType[] = data ? data : []

    const totalPages = Math.ceil(allItems.length / itemsPerPage)
    const currentItems = allItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )

    return (
        <ProtectedRoute>
        <Card className="m-4 shadow-lg bg-slate-50">
        <CardHeader>
            <CardTitle>リスト</CardTitle>
        </CardHeader>
            <SearchComp 
                setIsLoading={setIsLoading} 
                setAllItems={setAllItems} 
                taskItems={taskItems}
                allTaskItems={allTaskItems}
                allItems={allItems}
                setCurrentPage={setCurrentPage}
                userName="ALL"
            />
            <TasksTable
                currentItems={currentItems}
                taskItems={allTaskItems}
                setEditingItem={setEditingItem}
                setIsEditDialogOpen={setIsEditDialogOpen}
                manager={true}
            />
            <ListFooter
                isLoading={isLoading}
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <ItemEditDialog
                editingItem={editingItem}
                setIsEditDialogOpen={setIsEditDialogOpen}
                setAllItems={setAllItems}
                setEditingItem={setEditingItem}
                taskItems={taskItems}
            />
        </Dialog>
        </ProtectedRoute>
    )
}

export default SendList;