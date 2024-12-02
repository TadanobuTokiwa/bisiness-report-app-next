import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchAllUserItems, fetchAllUserTaskFilterdItems, fetchTaskFilterdItems } from '@/lib/firebase/firebaseStoreFunctions'
import { downloadCSV } from '@/lib/CSVdownloader'
import { listItemType, taskItemType } from "@/types/firebaseDocTypes"
import { fetchItems } from "@/lib/api/items"

type ChildComponentProps = {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setAllItems: React.Dispatch<React.SetStateAction<listItemType[]>>;
    taskItems: taskItemType[];
    allTaskItems: taskItemType[];
    allItems: listItemType[];
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    userEmail: string
};

const SearchComp = ({setIsLoading, setAllItems, taskItems, allTaskItems, allItems, setCurrentPage, userEmail}: ChildComponentProps) => {
    const [startDate, setStartDate] = useState<string>(new Date().toLocaleDateString('sv-SE'));
    const [endDate, setEndDate] = useState<string>(new Date().toLocaleDateString('sv-SE'));
    const [searchName, setSearchName] = useState<string>(userEmail);
    const [task, setTask] = useState('ALL');

    const searchClickHandler = async() => {
        // validation
        const chkDate1 = new Date(startDate);
        const chkDate2 = new Date(endDate);
        if(isNaN(chkDate1.getDate()) || isNaN(chkDate2.getDate())){
            window.alert("開始日、終了日を確認してください")
            return
        }

        setIsLoading(true);
        if(searchName === "ALL" && task === "ALL"){
            const props = {
                startDate,
                endDate
            }
            const item = await fetchAllUserItems(props)
            setAllItems(item)
        }else if(searchName === "ALL" && task !== "ALL"){
            const props = {
                startDate,
                endDate,
                task
            }
            const item = await fetchAllUserTaskFilterdItems(props)
            setAllItems(item)
        }else{
            if(task === "ALL"){
                const props = {
                    startDate,
                    endDate,
                    userEmail: searchName
                }
                const items = await fetchItems(props)
                setAllItems(items)
            }else{
                const props = {
                    startDate,
                    endDate,
                    userName: searchName,
                    task
                }
                const items = await fetchTaskFilterdItems(props)
                setAllItems(items)
            }
        }
        setIsLoading(false);
        setCurrentPage(1);
    }

    const handleDownload = () => {
        const padZero = (num: number) => {
            return (num < 10 ? "0" : "") + num;
        };
        const getCurrentDatetime = () => {
            const now = new Date();
            return "" + now.getFullYear() + padZero(now.getMonth() + 1) + padZero(now.getDate()) + padZero(now.getHours()) + padZero(now.getMinutes());
        };

        if(!allTaskItems) {
            window.alert("業務項目名が正しく読み込めていません。")
            return
        }
        const csvName = "業務報告_" + getCurrentDatetime();
        const props = {
            data: allItems,
            allTaskItems,
            filename: csvName,
        }
        downloadCSV(props)
    }

    return (
        <CardContent>
        <div className="grid gap-4 mb-4 sm:grid-cols-3 lg:grid-cols-4">
            <div className="md:col-span-1 lg:col-span-1">
                <Label htmlFor="startDate">
                    開始日<strong className='ml-3 text-red-500 text-xs'>※必須</strong>
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
                    終了日<strong className='ml-3 text-red-500 text-xs'>※必須</strong>
                </Label>
                <Input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <div className="md:col-span-1 lg:col-span-1">
                <Label htmlFor="employee">メールアドレス</Label>
                <Select value={searchName} onValueChange={setSearchName}>
                <SelectTrigger id="employee">
                    <SelectValue placeholder="従業員を選択" />
                </SelectTrigger>
                <SelectContent className='bg-gray-100'>
                    <SelectItem value={userEmail}>{userEmail}</SelectItem>
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
                    <SelectItem value="ALL">ALL</SelectItem>
                    {taskItems.map(item => {
                        return(
                            <SelectItem 
                                key={item.id}
                                value={String(item.id)}
                                style={{"backgroundColor": item.color}}
                            >
                                {item.taskName}
                            </SelectItem>
                        )
                    })}
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
    )
}

export default SearchComp