
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Save, ListPlus, Trash2, Pencil, Check } from "lucide-react"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { createTemplate } from '@/store/slices/TaskForm';
import { addtemplate, removetemplate, upDateTaskName } from "@/store/slices/Templates"

interface tasks {
    id: number;
    task: string;
    startTime: string;
    endTime: string;
    kensu: number;
    team: string;
}
interface template {
    id: number;
    templateName: string;
    tasks: tasks[];
}

const Template = () => {

    const [ userTemplates, setUserTemplates ] = useState<template[]>([])
    const [ editName, setEditName ] = useState<string>("");
    const [ editId, setEditId ] = useState<number | null>(null);
    const dispatch = useDispatch()
    const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
    const { templates } = useAppSelector((store) => store.templates as RootState['templates']);
    const { tasks } = useAppSelector((store) => store.tasks);

    useEffect(() => {
        setUserTemplates(templates)
    },[templates])

    const dropDownInit = () => {
        setEditId(null)
        setEditName("")
    }

    const deleteTemplate = (targetId: number) => {
        setUserTemplates((prev) => prev.filter(item => item.id !== targetId))
        dispatch(removetemplate(targetId))
    }

    const selectTemplate = (tasks: tasks[]) => {
        dispatch(createTemplate(tasks))
    }

    const editTemplateName = (targetId: number, name: string) => {
        setEditId(targetId)
        setEditName(name)
    }
    
    const changeTemplateName = () => {
        if(editName && editId){
            setUserTemplates((prev) => prev.map(item => item.id === editId ? { ...item ,templateName: editName} : item))
            dispatch(upDateTaskName({id: editId, newTemplateName: editName}))
        }
        setEditId(null)
        setEditName("")
    }

    const addTemplate = () => {
        const newTemplate: template = {
            id: Math.floor(Math.random() * 10000000),
            templateName: "新規テンプレート",
            tasks
        }
        dispatch(addtemplate(newTemplate));
        setUserTemplates( [ ...userTemplates, newTemplate ])
        window.alert("新しいテンプレートを保存しました")
    }

    return (
        <div className="grid grid-cols-1 gap-2">
            <DropdownMenu onOpenChange={(isOpen) => isOpen && dropDownInit()}>
                <DropdownMenuTrigger asChild>
                <Button className='hover:bg-gray-200' variant="outline" size="sm">
                    <ListPlus className="w-4 h-4 mr-2" />
                    テンプレート
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-gray-100">
                { !userTemplates.length ? <span className="p-3">テンプレートがありません</span> :
                    editId ?
                    <div className="flex">
                        <Input 
                            maxLength={8} 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                        className="hover:bg-gray-200 ml-2"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation()
                            changeTemplateName()
                        }}
                        >
                        <Check className="w-4 h-4 text-destructive text-blue-600" />
                        </Button>
                    </div>
                    :
                    userTemplates.map((template, index) => (
                        <DropdownMenuItem key={index} className="flex justify-between items-center">
                                <>
                                <span 
                                    className="w-full p-4 hover:bg-gray-200"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        selectTemplate(template.tasks)
                                    }}
                                >{template.templateName}</span>
                                <Button
                                className="hover:bg-gray-200"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    editTemplateName(template.id, template.templateName)
                                }}
                                >
                                <Pencil className="w-4 h-4 text-destructive" />
                                </Button>
                                </>
                            <Button
                            className="hover:bg-gray-200"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation()
                                deleteTemplate(template.id)
                            }}
                            >
                            <Trash2 className="w-4 h-4 text-destructive text-red-600" />
                            </Button>
                        </DropdownMenuItem>
                    ))
                }
                </DropdownMenuContent>
            </DropdownMenu>
            <Button 
                onClick={() => addTemplate()}
                className='hover:bg-gray-200' 
                variant="outline" 
                size="sm"
            >
                <Save className="w-4 h-4 mr-2" />
                現在の入力を保存
            </Button>
        </div>
    )
}

export default Template