import { ReactNode } from "react"

export function Container({children}: { children: ReactNode }){
    return(
        <div className="flex flex-col py-3 items-center lg:px-52">
            {children}
        </div>
    )
}