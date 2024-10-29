import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader } from "lucide-react"
import { CardFooter } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

type ChildComponentProps = {
    isLoading: boolean;
    totalPages: number;
    currentPage: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const ListFooter = ({isLoading, totalPages, currentPage, setCurrentPage}: ChildComponentProps) => {

    const router = useRouter();

    return (
        <CardFooter className="flex justify-between">
        <div className={isLoading ? "" : "invisible"}>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            <strong className='font-bold invisible sm:inline'>Loading...</strong>
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
                        <strong className='hidden sm:inline'>前へ</strong>
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
                        <strong className='hidden sm:inline'>次へ</strong>
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
    )
}

export default ListFooter