
interface MosaicProps {
    mosaicItems: MosaicItemProps[]
}

interface MosaicItemProps {
    imagemUrl: string;
    category: string; 
}

export function Mosaic({ mosaicItems }: MosaicProps){

    return(
        <>
            {mosaicItems.map(({category, imagemUrl}) => (
                <div key={category} 
                    className="flex flex-col w-1/2 mb-2 items-center justify-center md:w-1/4 lg:w-60"
                >
                    <div className="flex flex-col w-[95%] h-48 px-2 rounded-lg items-center bg-brown-500 md:w-44 md:h-52 md:rounded-2xl lg:w-52 lg:h-64">
                        <div className="flex w-full h-4/5 mt-2 rounded-lg bg-slate-700 md:rounded-2xl">
                            <img 
                                src={imagemUrl} 
                                alt="imagem" 
                                className="w-full h-full rounded-lg object-cover"
                            />
                        </div>
                        <div className="flex w-full h-auto p-1 text-lg text-white font-bold justify-center items-center">
                            <h1>{category}</h1>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}