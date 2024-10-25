'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Clock, Plus, Send, Trash2 } from 'lucide-react'

const Home = () => {
  const [tasks, setTasks] = useState([{ id: 1, task: '', startTime: '09:00', endTime: '09:00', kensu: 0 }])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const addTask = () => {
    const newTask = { id: tasks.length + 1, task: '', startTime: '09:00', endTime: '09:00', kensu: 0 }
    setTasks([...tasks, newTask])
  }

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const updateTask = (id: number, field: string, value: string | number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, [field]: value } : task))
  }

  const handleSubmit = () => {

    const chkList = tasks.filter(task => task.startTime >= task.endTime);
    const chkList2 = tasks.filter(task => task.kensu === 0);
    if(chkList.length + chkList2.length !== 0){
        window.alert("入力内容を確認してください");
        return
    }

    tasks.map((task) => {
      const dateTime1 = new Date('2024-03-01 ' + task.startTime + ':00')
      const dateTime2 = new Date('2024-03-01 ' + task.endTime + ':00')
      const diff = dateTime2.getTime() - dateTime1.getTime(); 
      const date = new Date()
      const perHour = task.kensu === 0 ? 0 : Math.floor(Math.pow(10,2) * (task.kensu / (diff / (60*60*1000)))) / Math.pow(10,2);
      const newTask = {
          "createDate": date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2,'0') + "-" + String(date.getDate()).padStart(2,'0'),
          "task": task.task,
          "startTime": task.startTime,
          "endTime": task.endTime,
          "kensu": task.kensu,
          "User": "常盤忠靖",
          "workingHour": Math.floor(Math.pow(10,3) * (diff / (60*60*1000))) / Math.pow(10,3),
          "perHour": perHour,
          "DateTimeNum": Number(String(date.getFullYear()) + String(date.getMonth() + 1).padStart(2,'0') + String(date.getDate()).padStart(2,'0') + String(task.startTime.replaceAll(":","")))
      }
      console.log(newTask)
    })
    setIsSubmitted(true)
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">業務報告</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">ユーザー名: 常磐忠晴</span>
          <Button className='hover:bg-gray-200' variant="outline" size="sm">ログアウト</Button>
        </div>
      </div>
      
      <Card className={`transition-all duration-500 ease-in-out ${isSubmitted ? 'translate-x-full opacity-0' : ''}`}>
        <CardContent className="space-y-4 pt-6">
          {tasks.map((task) => (
            <div key={task.id} className="flex flex-col md:flex-row items-start md:items-center gap-2 p-2 rounded-md">
              <Select
                value={task.task}
                onValueChange={(value) => updateTask(task.id, 'task', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="タスクを選択" />
                </SelectTrigger>
                <SelectContent className='bg-gray-100'>
                  <SelectItem value="task1">タスク1</SelectItem>
                  <SelectItem value="task2">タスク2</SelectItem>
                  <SelectItem value="task3">タスク3</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-wrap md:flex-nowrap justify-around gap-2 w-full md:w-3/4">
                <div className="flex items-center gap-2 md:w-auto">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={task.startTime}
                      onChange={(e) => updateTask(task.id, 'startTime', e.target.value)}
                      className="w-24"
                    />
                    <span>~</span>
                    <Input
                      type="time"
                      value={task.endTime}
                      onChange={(e) => updateTask(task.id, 'endTime', e.target.value)}
                      className="w-24"
                    />
                  </div>
                </div>
                <Input
                  type="number"
                  value={task.kensu}
                  onChange={(e) => updateTask(task.id, 'kensu', e.target.value)}
                  className="w-20"
                  min={0}
                />
                <Button variant="ghost" className="border rounded-xl hover:bg-gray-200" size="icon" onClick={() => removeTask(task.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className='hover:bg-gray-200' onClick={addTask}>
            <Plus className="w-4 h-4 mr-2" />
            追加
          </Button>
          <Button className='border border-black text-white bg-sky-700 hover:bg-sky-800 ' onClick={handleSubmit}>
            <Send className="w-4 h-4 mr-2" />
            送信
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-4 flex justify-between">
      <div className="invisible"></div>
        {isSubmitted && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">送信完了</h2>
            <p className="mt-2">業務報告が正常に送信されました。</p>
          </div>
        )}
        <Button className='border border-blue-900 hover:bg-gray-200' variant="secondary">リスト表示</Button>
      </div>
    </div>
  )
}

export default Home;