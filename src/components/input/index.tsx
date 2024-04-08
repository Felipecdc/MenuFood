import { Dispatch, SetStateAction } from "react";
import { FiSearch } from 'react-icons/fi'

interface InputRequest {
    placeholder: string;
    type: string;
    value: string;
    onChange: Dispatch<SetStateAction<string>>;
    onClick: () => Promise<void>;
}

export function Input({ onChange, placeholder, type, value, onClick }: InputRequest){
    return(
        <div className="flex w-full items-center justify-center h-10 px-2 rounded-md border bg-white border-brown-700 md:w-[680px] md:h-12">
            <input 
                type={type} 
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="flex w-full h-full rounded-lg focus:outline-none md:text-xl"
            />
            <button onClick={onClick} className="flex w-auto h-full items-center justify-center">
                <FiSearch size={25}/>
            </button>
        </div>
    )
}