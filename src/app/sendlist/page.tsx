'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import { updateItem, fetchItems, fetchTasks } from '@/lib/firebase/firebaseStoreFunctions'
import { listItemType, taskItemType } from '@/types/firebaseDocTypes'
import { downloadCSV } from '@/lib/CSVdownloader'

const SendList = () => {
    const [startDate, setStartDate] = useState<string>('2024-10-01');
    const [endDate, setEndDate] = useState<string>('2024-10-31');
    const [userName, setUserName] = useState<string>('常盤忠靖');
    const [task, setTask] = useState('ALL');
    const [allItems, setAllItems] = useState<listItemType[]>([]);
    const [taskItems, setTaskItems] = useState<taskItemType[] | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [editingItem, setEditingItem] = useState<listItemType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const itemsPerPage = 10

    const router = useRouter();

    useEffect(() => {
        const fetchFirebase = async() => {
            const t = await fetchTasks()
            setTaskItems(t);
        }
        fetchFirebase();
    },[])

    const searchClickHandler = async() => {
        // validation
        const chkDate1 = new Date(startDate);
        const chkDate2 = new Date(endDate);
        if(isNaN(chkDate1.getDate()) || isNaN(chkDate2.getDate())){
            window.alert("開始日、終了日を確認してください")
            return
        }

        setIsLoading(true);
        const props = {
            startDate,
            endDate,
            userName
        }
        const items = await fetchItems(props)
        setAllItems(items)
        setIsLoading(false);
    }

    const handleDownload = () => {
        const padZero = (num: number) => {
            return (num < 10 ? "0" : "") + num;
        };
        const getCurrentDatetime = () => {
            const now = new Date();
            return "" + now.getFullYear() + padZero(now.getMonth() + 1) + padZero(now.getDate()) + padZero(now.getHours()) + padZero(now.getMinutes());
        };

        if(!taskItems) {
            window.alert("業務項目名が正しく読み込めていません。")
            return
        }
        const csvName = "業務報告_" + getCurrentDatetime();
        const props = {
            data: allItems,
            taskItems,
            filename: csvName,
        }
        downloadCSV(props)
    }

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
            docID: editingItem!.docID
        }

        setIsEditDialogOpen(false);
        setAllItems(prevItems =>
            prevItems.map(item =>
                item.docID === updateTask!.docID ? { ...updateTask } : { ...item }
            )
        );
    }

    const editButtonHandler = (searchId: string) => {
        const targetItem = allItems.filter(item => item.docID === searchId)[0];
        if(!targetItem) return
        setEditingItem(targetItem);
        setIsEditDialogOpen(true);
    }

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
        <CardContent>
            <div className="grid gap-4 mb-4 sm:grid-cols-3 lg:grid-cols-4">
                <div className="md:col-span-1 lg:col-span-1">
                    <Label htmlFor="startDate">
                        開始日<text className='ml-3 text-red-500 text-xs'>※必須</text>
                    </Label>
                    <Input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="md:col-span-1 lg:col-span-1">
                    <Label htmlFor="endDate">
                        終了日<text className='ml-3 text-red-500 text-xs'>※必須</text>
                    </Label>
                    <Input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="md:col-span-1 lg:col-span-1">
                    <Label htmlFor="employee">従業員名</Label>
                    <Select value={userName} onValueChange={setUserName}>
                    <SelectTrigger id="employee">
                        <SelectValue placeholder="従業員を選択" />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-100'>
                        <SelectItem value="常盤忠靖">常盤忠靖</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="sm:col-span-3 lg:col-span-1">
                    <Label htmlFor="tasks">業務項目</Label>
                    <Select value={task} onValueChange={setTask}>
                    <SelectTrigger id="task">
                        <SelectValue placeholder="業務項目を選択" />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-100'>
                        <SelectItem value="ALL">全て</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2 p-2'>
                <Button 
                    className="w-full border border-black hover:bg-gray-100"
                    onClick={() => searchClickHandler()}
                >検索
                </Button>
                <Button 
                    variant="outline" 
                    className="w-full border bg-yellow-200 hover:bg-yellow-300"
                    onClick={() => handleDownload()}
                >CSV出力
                </Button>
            </div>
        </CardContent>
        <CardContent>
            <Table className='border'>
            <TableHeader className='bg-gradient-to-b from-blue-800 to-blue-700 text-white'>
                <TableRow>
                <TableHead>日付</TableHead>
                <TableHead>業務項目</TableHead>
                <TableHead>開始時間</TableHead>
                <TableHead>終了時間</TableHead>
                <TableHead>業務時間</TableHead>
                <TableHead>件数</TableHead>
                <TableHead>時速</TableHead>
                <TableHead>従業員名</TableHead>
                <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className='bg-zinc-50'>
                {currentItems.map((item, index) => {
                    const taskName = taskItems?.filter(taskItem => String(taskItem.id) === item.task)[0].taskName
                    return (
                        <TableRow key={index}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{taskName}</TableCell>
                            <TableCell>{item.startTime}</TableCell>
                            <TableCell>{item.endTime}</TableCell>
                            <TableCell>{item.workingHour.toFixed(3)}</TableCell>
                            <TableCell>{item.kensu}</TableCell>
                            <TableCell>{item.perHour}</TableCell>
                            <TableCell>{item.userName}</TableCell>
                            <TableCell>
                            <Button 
                                className='hover:bg-gray-200' 
                                variant="outline" 
                                size="sm"
                                onClick={() => editButtonHandler(item.docID)}
                            >編集</Button>
                            </TableCell>
                        </TableRow>
                    )
                    })}
            </TableBody>
            </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
        <div className={isLoading ? "" : "invisible"}>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            <text className='font-bold invisible sm:inline'>Loading...</text>
        </div>
        <div className="flex items-center gap-2">
            {
                totalPages ?
                <>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <text className='hidden sm:inline'>前へ</text>
                    </Button>
                    <span className="text-sm">
                        {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <text className='hidden sm:inline'>次へ</text>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </>
                :
                <></>
            }
        </div>
        <div>
            <Button className='hover:bg-gray-200' variant="outline" onClick={() => router.back()}>
                戻る
            </Button>
        </div>
        </CardFooter>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                    value={editingItem.task}
                    onValueChange={(value) => setEditingItem({...editingItem, task: value})}
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
        </Dialog>
        </>
    )
}

export default SendList;