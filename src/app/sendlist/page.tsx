'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { fetchTasks } from '@/lib/firebase/firebaseStoreFunctions'
import { listItemType, taskItemType } from '@/types/firebaseDocTypes'
import SearchComp from '@/feature/components/sendlist/SearchComp'
import TasksTable from '@/feature/components/sendlist/TasksTable'
import ListFooter from '@/feature/components/sendlist/ListFooter'
import ItemEditDialog from '@/feature/components/sendlist/ItemEditDialog'

const SendList = () => {
    const [allItems, setAllItems] = useState<listItemType[]>([]);
    const [taskItems, setTaskItems] = useState<taskItemType[] | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [editingItem, setEditingItem] = useState<listItemType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const itemsPerPage = 10

    useEffect(() => {
        const fetchFirebase = async() => {
            const t = await fetchTasks()
            setTaskItems(t);
        }
        fetchFirebase();
    },[])

    const totalPages = Math.ceil(allItems.length / itemsPerPage)
    const currentItems = allItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )

    return (
        <>
        <Card className="m-4 shadow-lg bg-slate-50">
        <CardHeader>
            <CardTitle>リスト</CardTitle>
        </CardHeader>
            <SearchComp 
                setIsLoading={setIsLoading} 
                setAllItems={setAllItems} 
                taskItems={taskItems}
                allItems={allItems}
            />
            <TasksTable
                currentItems={currentItems}
                taskItems={taskItems}
                setEditingItem={setEditingItem}
                setIsEditDialogOpen={setIsEditDialogOpen}
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
        </>
    )
}

export default SendList;