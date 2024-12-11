import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Trash2, Plus, Send, Loader } from 'lucide-react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { addTask, removeTask, resetTask, updateTask } from '@/store/slices/TaskForm';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { postItemType, taskItemType } from "@/types/firebaseDocTypes";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { addItem } from "@/lib/api/items";

interface tasks {
    id: number;
    task: string;
    startTime: string;
    endTime: string;
    kensu: number;
    team: string;
}
interface updateTaskAction{
    id: number;
    field: keyof tasks;
    value: string | number;
}

type ChildComponentProps = {
    cardMoved: boolean;
    setCardMoved: React.Dispatch<React.SetStateAction<boolean>>;
    postUserName: string;
    postDate: string;
};

const TasksForm = ({cardMoved, setCardMoved, postUserName, postDate}: ChildComponentProps) => {

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)

    const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
    const { tasks } = useAppSelector((store) => store.tasks);
    const dispatch = useDispatch()
    const { user } = useAuth();
    const postUserEmail = postUserName === "" && user?.email ? user.email : postUserName

    const { data } = useTasks();
    const taskItems: taskItemType[] = data ? data.filter(item => item.chk) : []
    const taskTeams = [...new Set(taskItems.map(item => item.teamName))]

    const editTask = ({id, field, value}: updateTaskAction) => {
        if((field === "startTime" || field === "endTime") && typeof value === "string" && value.split(":").length === 3){
            value = value.slice(0, -3)
        }
        const action = {id, field, value}
        dispatch(updateTask(action))
    }
    
    const trashHandler = (id: number) => {
        dispatch(removeTask(id))
    }

    const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
        if (event.propertyName === 'transform') {
            setCardMoved(true);
            setLoading(false);
        }
    }
    
    const addButtonHandler = () => {
        dispatch(addTask())
    }

    const teamNameCheanged = (id: number, value: string) => {
        editTask({id, field: 'team', value});
        editTask({id, field: 'task', value: ""})
    }

    const handleSubmit = async() => {
        const chkList = tasks.filter(task => task.startTime >= task.endTime);
        const chkList2 = tasks.filter(task => task.task === "");
        if(chkList.length + chkList2.length !== 0){
            window.alert("入力内容を確認してください");
            return
        }
        if(!postUserEmail){
            window.alert("ユーザー情報を確認してください");
            return
        }
        
        setLoading(true)
        try{ 
            await Promise.all(
            tasks.map(async (task) => {
                const dateTime1 = new Date('2024-03-01 ' + task.startTime + ':00')
                const dateTime2 = new Date('2024-03-01 ' + task.endTime + ':00')
                const diff = dateTime2.getTime() - dateTime1.getTime(); 
                const date = postDate ? new Date(postDate) : new Date();
                const perHour = task.kensu === 0 ? 0 : Math.floor(Math.pow(10,2) * (task.kensu / (diff / (60*60*1000)))) / Math.pow(10,2);
                const newTask: postItemType = {
                    "createDate": date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2,'0') + "-" + String(date.getDate()).padStart(2,'0'),
                    "task": Number(task.task),
                    "startTime": task.startTime,
                    "endTime": task.endTime,
                    "kensu": Number(task.kensu),
                    "User": postUserEmail,
                    "workingHour": Math.floor(Math.pow(10,3) * (diff / (60*60*1000))) / Math.pow(10,3),
                    "perHour": perHour,
                    "DateTimeNum": Number(String(date.getFullYear()) + String(date.getMonth() + 1).padStart(2,'0') + String(date.getDate()).padStart(2,'0') + String(task.startTime.replaceAll(":","")))
                }
                await addItem(newTask)
            })
            )    
            setIsSubmitted(true)
            dispatch(resetTask())
        } catch {
            window.alert("エラーが発生しました");
            setLoading(false);
        }
    }

    return (
        <Card 
            className={
                `transition-all duration-500 ease-in-out bg-slate-50
                ${isSubmitted ? 'translate-x-full opacity-0' : ''} 
                ${cardMoved ? 'absolute' : ''}
            `}
            onTransitionEnd={handleTransitionEnd}
        >
            <CardContent className="space-y-4 pt-6">
                {tasks.map((task) => (
                    <div key={task.id} className="flex flex-col md:flex-row items-start md:items-center gap-2 p-2 rounded-md">
                    <Select
                        value={task.team}
                        onValueChange={(value) => teamNameCheanged(task.id, value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="チームを選択" />
                        </SelectTrigger>
                        <SelectContent className='bg-gray-100'>
                            {taskTeams?.map((item,index) => {
                                return(
                                    <SelectItem 
                                        key={index} 
                                        value={item} 
                                        className="hover:border-y border-black hover:brightness-110"
                                    >{item}</SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                    <Select
                        value={task.task}
                        onValueChange={(value) => editTask({id: task.id, field: 'task', value})}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="タスクを選択" />
                        </SelectTrigger>
                        <SelectContent className='bg-gray-100'>
                            {taskItems?.filter(item => {
                                return item.teamName === task.team
                            }).map((item,index) => {
                                return(
                                    <SelectItem 
                                        key={index} 
                                        value={String(item.id)} 
                                        className="hover:border-y border-black hover:brightness-110"
                                        style={{"backgroundColor": item.color}}
                                    >{item.taskName}</SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                    <div className="flex flex-wrap md:flex-nowrap justify-around gap-2 w-full md:w-3/4">
                        <div className="flex items-center gap-2 md:w-auto">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                            <Input
                            type="time"
                            value={task.startTime}
                            onChange={(e) => editTask({id: task.id, field: 'startTime', value: e.target.value})}
                            className="w-24"
                            step={60}
                            />
                            <span>~</span>
                            <Input
                            type="time"
                            value={task.endTime}
                            onChange={(e) => editTask({id: task.id, field: 'endTime', value: e.target.value})}
                            className="w-24"
                            step={60}
                            />
                        </div>
                        </div>
                        <Input
                        type="number"
                        value={task.kensu}
                        onChange={(e) => editTask({id: task.id, field: 'kensu', value: e.target.value})}
                        className="w-20"
                        min={0}
                        />
                        <Button variant="ghost" className="border rounded-xl hover:bg-gray-200" size="icon" onClick={() => !loading ? trashHandler(task.id) : console.log("送信中です")}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" className='hover:bg-gray-200' onClick={() => !loading ? addButtonHandler() : console.log("送信中です")}>
                    <Plus className="w-4 h-4 mr-2" />
                    追加
                </Button>
                {loading ?
                    <Button className='border border-black text-white bg-sky-700 hover:bg-sky-700'>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        送信中...
                    </Button>
                    :
                    <Button className='border border-black text-white bg-sky-700 hover:bg-sky-800' onClick={handleSubmit}>
                        <Send className="w-4 h-4 mr-2" />
                        送信
                    </Button>
                }
            </CardFooter>
        </Card>
    )
}

export default TasksForm