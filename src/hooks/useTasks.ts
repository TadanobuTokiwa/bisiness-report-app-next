import { fetchTasks } from '@/lib/firebase/firebaseStoreFunctions';
import { taskItemType } from '@/types/firebaseDocTypes';
import { useQuery } from '@tanstack/react-query';

export const useTasks = () => {
    return useQuery<taskItemType[], Error>({
        queryKey : ['tasks'], 
        queryFn: fetchTasks
    });
};