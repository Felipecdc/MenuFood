
export function Footer(){
    return(
        <div className="flex flex-col p-3 w-full items-center justify-center bg-gray-400">
            <span className="text-slate-800">
                Criado por <a 
                            className="border-b border-blue-800 text-blue-900"
                            href="https://www.instagram.com/felipe_castroz/"
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                                Felipe Castro
                            </a>
            </span>
            <span className="text-slate-800">Name.official.io | Todos os direitos reservados</span>
        </div>
    )
}