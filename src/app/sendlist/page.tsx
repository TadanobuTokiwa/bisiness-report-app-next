'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from 'next/navigation'

const SendList = () => {
    const [startDate, setStartDate] = useState('2024-10-01')
    const [endDate, setEndDate] = useState('2024-10-31')
    const [employee, setEmployee] = useState('常盤忠靖')
    const [task, setTask] = useState('ALL')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const router = useRouter();

    const allItems = useMemo(() => Array.from({ length: 35 }, (_, index) => ({
        date: `2024-10-${String(index + 1).padStart(2, '0')}`,
        task: '(入)在庫確認',
        startTime: '09:00',
        endTime: '09:01',
        workHours: 0.016,
        count: index,
        speed: index,
        employeeName: '常盤忠靖'
    })), [])

    const totalPages = Math.ceil(allItems.length / itemsPerPage)
    const currentItems = allItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )

    return (
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
                    <Select value={employee} onValueChange={setEmployee}>
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
                <Button className="w-full border border-black hover:bg-gray-100">検索</Button>
                <Button variant="outline" className="w-full border bg-yellow-200 hover:bg-yellow-300">CSV出力</Button>
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
                {currentItems.map((item, index) => (
                <TableRow key={index}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.task}</TableCell>
                    <TableCell>{item.startTime}</TableCell>
                    <TableCell>{item.endTime}</TableCell>
                    <TableCell>{item.workHours.toFixed(3)}</TableCell>
                    <TableCell>{item.count}</TableCell>
                    <TableCell>{item.speed}</TableCell>
                    <TableCell>{item.employeeName}</TableCell>
                    <TableCell>
                    <Button className='hover:bg-gray-200' variant="outline" size="sm">編集</Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
        <div className="invisible"></div>
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
                前へ
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
                次へ
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
        <div>
            <Button className='hover:bg-gray-200' variant="outline" onClick={() => router.back()}>
                戻る
            </Button>
        </div>
        </CardFooter>
        </Card>
    )
}

export default SendList;