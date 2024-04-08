
import { useEffect, useState, useRef, MouseEvent } from "react"

import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

import { db } from "../../services/firebase";
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';

import { toast } from "react-toastify";

import { Container } from "../../components/container";
import { Input } from "../../components/input";
import { Mosaic } from "../../components/mosaic";
import { Footer } from "../../components/footer";

import { Items } from "../../components/items";

interface MosaicProps {
    imagemUrl: string;
    category: string;
}

interface ItemsProps {
    category?: string;
    title: string;
    description: string;
    price: string;
    imageUrl: string
}

interface CategoryProps {
    name: string;
}

export function Menu(){

    useEffect(() => {
        document.title = "Menu - Abigail Coffee";
    }, [])

    const [mosaic, setMosaic] = useState<MosaicProps[]>([]);
    const [mosaicSelected, setMosaicSelected] = useState<MosaicProps[]>([]);

    const [category, setCategory] = useState<CategoryProps[]>([]);

    const [products, setProducts] = useState<ItemsProps[]>([]);

    const [yourFavor, setYouFavor] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchMosaic(){
            try{
                onSnapshot(collection(db, 'mosaic'), (snapshot) => {
                    const mosaicFind = snapshot.docs.map(doc => doc.data() as MosaicProps);
                    const mosaicStatus = snapshot.docs
                        .filter(doc => doc.data().status === true)
                        .map(doc => doc.data() as MosaicProps);
                    setMosaic(mosaicFind);
                    setMosaicSelected(mosaicStatus);
                    alert('chamou')
                })
            }catch(err){
                console.log(err)
            }
        }
        fetchMosaic();
    }, [])

    useEffect(() => {
        async function FetchProducts(){
            try{
                const findItem = await getDocs(collection(db, 'produtos'));
                const productsData = findItem.docs.map(doc => doc.data() as ItemsProps);
                setProducts(productsData)
            }catch(err){
                console.log(err)
            }
        }
        FetchProducts();
        async function FetchCategories(){
            try{
                onSnapshot(collection(db, 'categorias'), (snapshot) => {
                    const categorySnapshot = snapshot.docs.map(doc => doc.data() as CategoryProps);
                    setCategory([{name: 'Todos'}, ...categorySnapshot])
                });
                alert('chamouwwwww')
            }catch(err){
                console.log(err)
            }
        }
        FetchCategories();
    }, [])

    async function handleClick() {

        if(yourFavor === ''){
            toast.warn('Escreva o nome de algum produto!')
            return;
        }

        try{
            const productRef = collection(db, 'produtos');
            const productSnapshot = await getDocs(query(productRef, where('title', '==', yourFavor)))
            if(productSnapshot.empty){
                toast.error('Nenhum produto encontrado com esse nome');
                return;
            };
            const productData = productSnapshot.docs.map(doc => doc.data() as ItemsProps)
            toast.success('Produto encontrado!')
            setProducts(productData)
        }catch(err){
            console.log(err);
            toast.error('Ocorreu um erro ao buscar o produto');
        }    
    }

    function handleMouseDown(e: MouseEvent<HTMLDivElement>) {
        setIsDragging(true);
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
    }

    function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
        if (!isDragging) return;
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
        const walk = x - startX;
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    }

    function handleMouseUp() {
        setIsDragging(false);
    }

    async function handleSelect(name: string){
        try{
            if(name === 'Todos'){
                const findItem = await getDocs(collection(db, 'produtos'));
                const productsData = findItem.docs.map(doc => doc.data() as ItemsProps);
                setProducts(productsData)
                return;
            }

            const productsRef = collection(db, 'produtos');
            const productsQuery = query(productsRef, where('category', '==', name));
            const productsSnapshot = await getDocs(productsQuery);
            const productsData = productsSnapshot.docs.map(doc => doc.data() as ItemsProps);
            setProducts(productsData)
        }catch(err){
            console.log(err)
        }
    }


    return(
        <>
        <Container>
            <div className="flex w-full items-center justify-center px-12">
                <Input
                    type="text"
                    placeholder="Pesquise seu gosto!"
                    value={yourFavor}
                    onChange={setYouFavor}
                    onClick={handleClick}
                />
            </div>
            <div className="flex flex-wrap justify-center px-4 mt-5 md:w-[768px] lg:w-full lg:max-w-[1150px] lg:min-w-[1000px]">
                <Mosaic mosaicItems={mosaicSelected}/>
            </div>
            <div className="flex w-full items-center justify-center py-8">
                <h1 className="text-xl md:text-3xl font-fredoka-one">Faça seu pedido no balcão!</h1>
            </div>
            <div
                className="flex w-full max-w-768 lg:min-w-900 pl-5 overflow-x-scroll md:pl-0"
                style={{ scrollbarWidth: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                ref={scrollRef}
            >
                <div
                    className={`flex mx-auto ${category.length > 5 ? 'justify-center' : 'justify-start'}`}
                    style={{ alignItems: 'center' }}
                >
                    {category.map((value, index) => (
                        <button
                            onClick={() => handleSelect(value.name)}
                            key={index}
                            className="bg-brown-300 rounded-md text-white mx-2"
                        >
                            <h1 className="px-2 py-1 lg:text-lg lg:px-5">{value.name}</h1>
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-center w-full p-5">
                <Items productItems={products} />
            </div>
            <div className="flex items-center justify-center w-full px-5 py-8 md:py-20">
                <div className="flex flex-col md:flex-row w-full md:max-w-768 lg:min-w-900 p-2 md:p-4 rounded-lg bg-white-50%">                    
                    <div className="flex flex-col items-start md:w-1/2">
                        <div>
                            <h1 className="font-bold text-xl pb-3 md:text-2xl">Como chegar</h1>
                            <h3 className="text-sm md:text-lg">Rua João José Rodrigues, n856, Cambui - Campinas / São Paulo</h3>
                        </div>
                        <div className="flex flex-col gap-2 py-5 md:py-10">
                            <a href='#' className='flex gap-2'>
                                <FaWhatsapp size={20    } color='black'/>
                                <h3 className="text-sm">19 989475899</h3>
                            </a>
                            <a 
                                href='https://www.instagram.com/felipe_castroz/' 
                                className='flex gap-2'
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaInstagram size={20} color='black'/>
                                <h3 className="text-sm">@Abigail.coffee</h3>
                            </a>
                            <a href='#' className='flex gap-2'>
                                <FaFacebook size={20} color='black'/>
                                <h3 className="text-sm">Abigail.coffee</h3>
                            </a>
                        </div>
                    </div>
                    <div className="flex w-full h-full">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d774404.386195216!2d-74.6376532!3d40.6956203!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNova%20Iorque%2C%20NY%2C%20EUA!5e0!3m2!1spt-BR!2sbr!4v1710887942923!5m2!1spt-BR!2sbr" 
                            style={{border:0}}
                            className="w-full h-48 md:h-80 rounded-lg"
                            loading="lazy" 
                        />
                    </div>
                </div>
            </div>
        </Container>
        <Footer/>
        </>
    )
}