import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { downloadCSV } from '@/lib/CSVdownloader'
import { listItemType, taskItemType } from "@/types/firebaseDocTypes"
import { fetchItems } from "@/lib/api/items"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

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
    const [searchEmail, setSearchEmail] = useState<string>(userEmail);
    const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
    const [taskType, setTaskType] = useState<string>('ALL');
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const taskTypes = [...new Set(allTaskItems.map(item => item.taskType))]
    
    useEffect(() => {
        setSelectedTasks(allTaskItems.map(item => item.id))
    },[allTaskItems])

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
                searchEmail,
                taskNumbers: selectedTasks,
            }
            const item = await fetchItems(props)
            setAllItems(item)
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

    const handleCheckboxChange = (id: number, isChecked: boolean) => {
        setSelectedTasks((prev) =>
            isChecked ? [...prev, id] : prev.filter((item) => item !== id)
        );
        setTaskType("")
    }

    const selectedAll = () => {
        setSelectedTasks(allTaskItems.map(item => item.id))
    }

    const selectedClear = () => {
        setSelectedTasks([])
    }

    const selectedTypeItem = (taskType: string) => {
        setSelectedTasks(allTaskItems.filter(item => item.taskType === taskType).map(item => item.id))
    }

    return (
        <CardContent>
        <div className="grid gap-4 mb-4 sm:grid-cols-2">
            <div className="grid gap-4 grid-cols-2">
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
            </div>
            <div className="md:col-span-1 lg:col-span-1">
                <Label htmlFor="employee">メールアドレス</Label>
                <Select value={searchEmail} onValueChange={setSearchEmail}>
                <SelectTrigger id="employee">
                    <SelectValue placeholder="従業員を選択" />
                </SelectTrigger>
                <SelectContent className='bg-gray-100'>
                    <SelectItem value={userEmail}>{userEmail}</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div className="sm:col-span-2">
                <Label htmlFor="taskType">業務項目種別</Label>
                <RadioGroup
                    value={taskType}
                    onValueChange={setTaskType}
                    className="flex flex-wrap gap-4"
                    >
                    <div 
                        className="flex items-center space-x-2"
                        onClick={() => selectedAll()}
                    >
                        <RadioGroupItem value="ALL" id="ALL" />
                        <Label htmlFor="ALL">ALL</Label>
                    </div>
                    <div 
                        className="flex items-center space-x-2"
                        onClick={() => selectedClear()}
                    >
                        <RadioGroupItem value="clear" id="clear" />
                        <Label htmlFor="clear">クリア</Label>
                    </div>
                    {taskTypes.map(taskType => (
                        <div 
                            key={taskType} 
                            className="flex items-center space-x-2"
                            onClick={() => selectedTypeItem(taskType)}
                        >
                        <RadioGroupItem value={taskType} id={`genre-${taskType}`} />
                        <Label htmlFor={`genre-${taskType}`}>{taskType}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
            <div className="sm:col-span-2">
                <Label htmlFor="tasks">業務項目</Label>
                <Button 
                    onClick={() => setIsVisible(!isVisible)}
                    className="border p-1 h-6 ml-3"
                >
                    {isVisible ? "Hide" : "Show"}
                </Button>
                <div
                    className={`transition-all duration-500 ease-in-out transform overflow-hidden ${
                    isVisible ? "h-auto opacity-100" : "h-0 opacity-0"
                    } bg-gray-100 p-4 mt-4 rounded-lg shadow-md`}
                    style={{ transitionProperty: "max-height, opacity" }}
                >
                    <div className="flex flex-wrap gap-4">
                    {taskItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox
                                checked={selectedTasks.includes(item.id)}
                                onCheckedChange={(isChecked) =>
                                    handleCheckboxChange(item.id, isChecked as boolean)
                                }
                            />
                            <label htmlFor={item.taskName} className="cursor-pointer" style={{"backgroundColor" : item.color}}>
                                {item.taskName}
                            </label>
                        </div>
                    ))}
                    </div>
                </div>
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