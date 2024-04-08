
interface ProductsProps {
    productItems: ItemsProps[]
}

interface ItemsProps {
    category?: string;
    title: string;
    description: string;
    price: string;
    imageUrl: string
}
 
export function Items({ productItems }: ProductsProps){

    return(
        <div className="flex flex-col w-full max-h-96 md:max-w-768 lg:min-w-900 overflow-auto items-center p-2 md:p-4 rounded-lg bg-white-50%">
            {productItems.map(({description, imageUrl, price, title}: ItemsProps) => (
                <div key={title} className="flex flex-row w-full items-center justify-center gap-2 min-h-32 mb-3 border-b border-gray-300 lg:min-h-36">
                    <div className="flex flex-col gap-1 w-full">
                        <h1 className="font-bold text-xl break-all line-clamp-1 lg:text-2xl">{title}</h1>
                        <span className="text-sm lg:text-lg break-all line-clamp-3 text-gray-500" >{description}</span>
                        <h1 className="font-bold text-lg lg:text-2xl">R${price}</h1>
                    </div>
                    <div className="flex max-w-24 min-w-24 max-h-24 min-h-24 rounded-lg items-center justify-center bg-gray-300 overflow-hidden relative
                    lg:min-w-32 lg:min-h-32
                    ">
                        <img 
                            src={imageUrl} 
                            alt="Imagem do produto" 
                            className="absolute w-full h-full object-cover"
                        />
                    </div>
                </div>
            ))}
        </div>
        
    )
}