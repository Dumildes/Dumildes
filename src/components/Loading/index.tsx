import { FiLoader } from "react-icons/fi"

type ComponentParam = {
    size: number
}

export const Loading = ({ size }: ComponentParam) => {

    return (
        <div className="flex items-center justify-center">
            <FiLoader
                size={size}
                className="animate-spin"
            />
        </div>
    );
}