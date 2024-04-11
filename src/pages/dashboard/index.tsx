
import { ChangeEvent, useEffect, useState, useContext, FormEvent, useRef } from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { AuthContext } from "../../context/AuthProvider";
import { v4 as uuidV4 } from 'uuid';
import { FiSearch, FiTrash } from "react-icons/fi";

import { toast } from "react-toastify";

import { storage, db } from "../../services/firebase";
import { uploadBytes, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { addDoc, collection, getDocs, query, where, updateDoc, doc, setDoc, startAfter, endBefore, deleteDoc } from 'firebase/firestore';

import { Container } from "../../components/container";
import { Mosaic } from "../../components/mosaic";
import { Footer } from "../../components/footer";
import { FiUpload } from "react-icons/fi";

interface ImageItemProps {
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
}

interface MosaicProps {
    imagemUrl: string;
    category: string;
}

interface ItemFoundProps {
    title: string;
    category: string;
    description: string;
    price: string | Number;
    imageUrl: string;
    imageName: string
}

export function Dashboard(){

    useEffect(() => {
        document.title = "Dashboard - Abigail Coffee"
    }, [])

    const { user } = useContext(AuthContext);

    const [mosaicSelected, setMosaicSelected] = useState<MosaicProps[]>([]);
    const [updateMosaic, setUpdateMosaic] = useState<boolean>(false)

    const [categories, setCategories] = useState<string[]>([]);
    const [reloadCategory, setReloadCategory] = useState<boolean>(false);

    const [ItemImage, setItemImage] = useState<ImageItemProps | null>();
    const [loadingImage, setLoadingImage] = useState<boolean>(false)

    const titleRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLTextAreaElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)
    const categoryRef = useRef<HTMLSelectElement>(null)
    const newCategoryRef = useRef<HTMLInputElement>(null)

    const searchItemRef = useRef<HTMLInputElement>(null);
    const [itemFound, setItemFound] = useState<ItemFoundProps | null>(null)

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        async function fetchCategories(){
            try{
                const categoryCollection = collection(db, 'categorias');
                const categorySnapshot = await getDocs(categoryCollection);
                const categories = categorySnapshot.docs.map(doc => doc.data().name);
                setCategories(categories)
            }catch(err){
                console.log(err)
            }
        }
        fetchCategories();
    }, [reloadCategory])

    useEffect(() => {
        async function fetchMosaic(){
            try{
                const mosaicCollection = collection(db, 'mosaic');
                const mosaicSnapshot = await getDocs(mosaicCollection);
                const mosaicStatus = mosaicSnapshot.docs
                    .filter(doc => doc.data().status === true)
                    .map(doc => doc.data() as MosaicProps)
                setMosaicSelected(mosaicStatus)
            }catch(err){
                console.log(err)
            }
        }
        fetchMosaic();
    }, [updateMosaic])

    async function handleSearch(){        
        const productName = searchItemRef.current?.value;

        if(!searchItemRef.current?.value){
            toast.warn('Digite o nome de algum produto!');
            return;
        }

        try{
            const productRef = collection(db, 'produtos');
            const productSnapshot = await getDocs(query(productRef, where('title', '==', productName?.trim())))
            
            if(productSnapshot.empty){
                toast.error('Nenhum produto encontrado com esse nome!');
                return;
            };

            const productData = productSnapshot.docs[0].data() as ItemFoundProps;
            toast.success('Produto encontrado!')
            setItemFound(productData);
            setTitle(productData?.title);
            setDescription(productData?.description);
            setPrice(productData?.price as string)
        }catch(err){
            console.log(err);
            toast.error('Ocorreu um erro ao buscar o produto!');
        }
    }

    async function handleFile(e: ChangeEvent<HTMLInputElement>){
        setLoadingImage(true)
        if(e.target.files && e.target.files[0]){
            const image = e.target.files[0]
            if(image.type === "image/jpeg" || image.type === "image/png"){
                await handleUpload(image)
                setLoadingImage(false)
                return;
            }else{
                alert("Envie uma imagem jpeg ou png")
                setLoadingImage(false)
                return;
            }
        }
    }

    async function handleUpload(image: File){
        if(!user?.uid){
            return
        }

        const currentUid = user?.uid;
        const uidImage = uuidV4();

        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);

        uploadBytes(uploadRef, image)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadUrl) => {
                const imageFind = {
                    name: uidImage,
                    uid: currentUid,
                    previewUrl: URL.createObjectURL(image),
                    url: downloadUrl,
                }
                setItemImage(imageFind)
            })
        })
        .catch((err) => {
            toast.error('Erro na requisição!')
            console.log(err)
        })
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault()
        
        const title = titleRef.current?.value.trim();
        const description = descriptionRef.current?.value.trim();
        const price = priceRef.current?.value.trim();
        const categorySelected = categoryRef.current?.value.trim();
        const newCategory = newCategoryRef.current?.value.trim(); 

        if(!ItemImage){
            toast.error("Envie alguma imagem!");
            return;
        }else if(!title || !description || !price){
            toast.error("Preencha todos os campos");
            return;
        }else if(categorySelected === "Categorias" && !newCategory){
            toast.error("Selecione uma categoria ou crie uma nova");
            return;
        }else if(newCategory && categories.includes(newCategory)){
            toast.error("Essa categoria já existe!");
            return;
        }else if(categorySelected !== "Categorias" && newCategory){
            toast.error("Escolha apenas um campo de categoria!");
            return;
        }
        
        let category = categorySelected;

        if(newCategory){
            try{
                const categoryRef = collection(db, 'categorias');
                const categorySnapshot = await getDocs(categoryRef);
                const existItem = categorySnapshot.docs.find( doc => doc.data().name === newCategory);

                if(existItem){
                    alert('Categoria existente!')
                    return;
                }
                
                await addDoc(collection(db, 'categorias'), {
                    name: newCategory
                })
                .then(() => {
                    category = newCategory
                })
                .catch((err) => {
                    alert('erro')
                    console.log(err)
                })
            }catch(err){
                console.log(err)
            }
        }

        const { url, name } = ItemImage;
        
        try{
            await addDoc(collection(db, 'produtos'), {
                title,
                description,
                price,
                category,
                imageUrl: url,
                imageName: name
            })
            toast.success('Produto registrado no banco!')
            const refsToClear = [titleRef, descriptionRef, priceRef, newCategoryRef];
            refsToClear.forEach(ref => {
                if(ref.current){
                    ref.current.value = '';
                }
            })
            setItemImage(null)
            if(categoryRef.current){
                categoryRef.current.value = 'Categorias';
            }
        }catch(err){
            toast.error('Houve um problema ao registrar, tente novamente mais tarde!')
            console.log(err)
        }
        
        try{
            const mosaicRef = collection(db, 'mosaic');
            const mosaicQuery = await getDocs(mosaicRef);
            
            let nextId = 1;

            mosaicQuery.forEach((doc) => {
                const id = parseInt(doc.id);
                if (id >= nextId) {
                    nextId = id + 1;
                }
            });

            const existentMosaic = mosaicQuery.docs.find(doc => doc.data().category === category)

            if(existentMosaic){
                console.log('ja existe');
                return;
            }

            const mosaicDocRef = doc(mosaicRef, nextId.toString());
            try {
                await setDoc(mosaicDocRef, {
                    imagemUrl: ItemImage.url,
                    category: category,
                    status: false
                });
            } catch (err) {
                console.log(err);
            }
        }catch(err){
            toast.error('Erro na requisição!')
            console.log(err)
        }

        setReloadCategory(!reloadCategory);
    }

    async function handleDeleteImage(){
        setLoadingImage(true)
        const imagePath = `images/${ItemImage?.uid}/${ItemImage?.name}`;
        const imageRef = ref(storage, imagePath);
        try{
            await deleteObject(imageRef);
            setItemImage(null)
            setLoadingImage(false)
        }catch(err){
            console.log("Erro ao deletar!");
            toast.error("Erro ao deletar!!");
            setLoadingImage(false)
        }
    }

    const handleNext = async () => {
        try {
            const mosaicRef = collection(db, 'mosaic');
            const mosaicQuery = query(mosaicRef, where('status', '==', true));
            const mosaicSnapshot = await getDocs(mosaicQuery);

            if (mosaicSnapshot.empty) {
                console.log("Não há itens disponíveis no mosaic.");
                return;
            }

            const lastTrueItem = mosaicSnapshot.docs[mosaicSnapshot.docs.length - 1];
            const firstTrueItem = mosaicSnapshot.docs[0].ref;

            const nextFalseItemQuery = query(mosaicRef, where('status', '==', false), startAfter(lastTrueItem));
            const nextFalseItemSnapshot = await getDocs(nextFalseItemQuery);

            if(!nextFalseItemSnapshot.empty){
                const nextFalseItemRef = nextFalseItemSnapshot.docs[0].ref;
                await updateDoc(firstTrueItem, { status: false })
                await updateDoc(nextFalseItemRef, { status: true })
                setUpdateMosaic(!updateMosaic)
            }else{
                console.log("Não há próximos itens com status false.");
            }
        }catch(error){
            toast.error("Erro ao buscar dados!");
            console.error("Erro ao buscar dados do Firebase:", error);
        }
    };
    
    const handlePrev = async () => {
        try {
            const mosaicRef = collection(db, 'mosaic');
            const mosaicQuery = query(mosaicRef, where('status', '==', true));
            const mosaicSnapshot = await getDocs(mosaicQuery);

            if (mosaicSnapshot.empty) {
                console.log("Não há itens disponíveis no mosaic.");
                return;
            }

            const lastTrueItem = mosaicSnapshot.docs[mosaicSnapshot.docs.length - 1].ref;
            const firstTrueItem = mosaicSnapshot.docs[0];

            const prevFalseItemQuery = query(mosaicRef, where('status', '==', false), endBefore(firstTrueItem));
            const prevFalseItemSnapshot = await getDocs(prevFalseItemQuery);
    
            if(!prevFalseItemSnapshot.empty){
                const prevFalseItemRef = prevFalseItemSnapshot.docs[prevFalseItemSnapshot.docs.length - 1].ref;
                await updateDoc(lastTrueItem, { status: false })
                await updateDoc(prevFalseItemRef, { status: true })
                setUpdateMosaic(!updateMosaic);
            }else{
                console.log("Não há itens com status false antes.");
            }
        }catch(error){
            toast.error("Erro ao buscar dados!");
            console.error("Erro ao buscar dados do Firebase:", error);
        }
    };

    async function handleEdit(){
        if(title === '' || description === '' || price === ''){
            toast.warn('Preencha todos os campos!')
            return;
        }

        try{
            const productRef = collection(db, 'produtos');
            const productSnapshot = await getDocs(productRef);

            if(productSnapshot.empty){
                toast.error('Nenhum produto encontrado.');
                return;            
            }

            const productName = searchItemRef.current?.value.trim();

            const productDoc = productSnapshot.docs.find(doc => doc.data().title === productName);

            if(!productDoc){
                toast.error('Ops, ocorreu algum erro!')
                return;
            }

            const newData = {
                title: title,
                description: description,
                price: price,
            }

            if (searchItemRef.current) {
                searchItemRef.current.value = title;
            }

            await updateDoc(productDoc.ref, newData);
            toast.success('Produto editado com sucesso!')
        }catch(err){
            console.log(err)
            toast.error('Erro na requisição!')
        }
    }

    async function handleDelet(){
        try{
            const productName = searchItemRef.current?.value.trim();

            if (!productName) {
                toast.warn('Digite o nome do produto para excluí-lo.');
                return;
            }

            const productRef = collection(db, 'produtos');
            const productSnapshot = await getDocs(productRef);

            if (productSnapshot.empty) {
                console.log('Nenhum produto encontrado.');
                return;
            }

            const productDoc = productSnapshot.docs.find(doc => doc.data().title === productName);

            if (!productDoc) {
                toast.error('Produto não encontrado.');
                return;
            }

            const productData = productDoc.data() as ItemFoundProps;
            const imageName = productData.imageName;
            console.log(imageName)
            const imageRef = ref(storage, `images/${user?.uid}/${imageName}`);
            await deleteObject(imageRef)

            const itemCategoryRef = productDoc.data().category;
            const productsWithSameCategory = productSnapshot.docs.filter(doc => doc.data().category === itemCategoryRef);
            if(productsWithSameCategory.length === 1){
                const mosaicRef = collection(db, 'mosaic');
                const mosaicQuery = await getDocs(query(mosaicRef, where('category', '==', itemCategoryRef)));

                const categoryRef = collection(db, 'categorias');
                const categoryQuery = await getDocs(query(categoryRef, where('name', '==', itemCategoryRef)));

                await deleteDoc(mosaicQuery.docs[0].ref)
                await deleteDoc(categoryQuery.docs[0].ref)
            }

            await deleteDoc(productDoc.ref)
            toast.success('Produto deletado com sucesso!')
            
            if(searchItemRef.current){
                searchItemRef.current.value = '';
            }
            setItemFound(null)
        }catch(err){
            toast.error('Erro na requisição!')
            console.log(err)
        }
    }

    return(
        <>
        <Container>
            <div className="flex flex-wrap justify-center px-4 mt-5 md:w-[768px] lg:w-full lg:max-w-[1150px] lg:min-w-[1000px]">
                <Mosaic mosaicItems={mosaicSelected}/>
            </div>
            <div className="w-full max-w-900 lg:min-w-900 p-5">
                <div className="flex h-20 p-2 items-center justify-between bg-white rounded-lg">                    
                    <h1 className="text-lg md:text-xl font-bold">Alterar Mostruario</h1>
                    <div className="flex items-center justify-center gap-2">
                        <button className="flex w-7 h-7 items-center justify-center rounded-md bg-gray-400"
                            onClick={handlePrev}
                        >
                            <MdArrowBackIosNew size={20} color="white"/>
                        </button>
                        <div className="flex gap-1">
                            {Array.from({length: 4}).map((_, index) => (
                                <div 
                                    className="flex items-center justify-center w-7 h-9 rounded-md bg-brown-700"
                                    key={index}
                                >
                                    <span className="text-gray-300">{index + 1}</span>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="flex w-7 h-7 items-center justify-center rounded-md bg-gray-400"
                                onClick={handleNext}
                        >
                            <MdArrowForwardIos size={20} color="white"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-900 lg:min-w-900 p-5">
                <div className="flex flex-col rounded-lg bg-white-50%">
                    <div className="flex p-2 rounded-t-lg mb-2 bg-white">
                        <h1 className="text-xl font-bold">Alterar item</h1>
                    </div>
                    <div className="flex flex-col p-3 items-center justify-center">
                        <div className="flex w-full max-w-500 items-center justify-center h-10 px-2 rounded-md border bg-white border-brown-700 md:w-[680px] md:h-12">
                            <input 
                                type="text"
                                placeholder="Procure um produto"
                                ref={searchItemRef}
                                className="flex w-full h-full rounded-lg focus:outline-none md:text-xl"
                            />
                            <button onClick={handleSearch} className="flex w-auto h-full items-center justify-center">
                                <FiSearch size={25}/>
                            </button>
                        </div>
                        <div className="flex flex-col w-full items-center justify-center py-5 min-h-20">
                            {itemFound ? (
                                <div className="flex w-full max-w-900 gap-2 items-center justify-center">
                                    <div className="flex flex-col gap-1 w-full">
                                        <input
                                            className="w-full text-base border border-neutral-300 rounded-lg px-2 py-1"
                                            type="text"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            placeholder="Escreva sua alteração!"
                                        />
                                        <textarea 
                                            className="w-full max-h-20 text-base border border-neutral-300 rounded-lg px-2 py-1"
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}     
                                            placeholder="Escreva sua alteração!"
                                        />
                                        <input
                                            className="w-full text-base border border-neutral-300 rounded-lg px-2 py-1"
                                            type="text"
                                            value={price}
                                            onChange={e => setPrice(e.target.value)}
                                            placeholder="Escreva sua alteração!"
                                        />
                                        <div className="flex w-full gap-3 items-center justify-center md:justify-start">
                                            <button 
                                                className="md:w-1/3 font-medium bg-green-500 px-5 mt-1 rounded-md"
                                                onClick={handleEdit}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                className="md:w-1/3 font-medium bg-red-500 px-5 mt-1 rounded-md"
                                                onClick={handleDelet}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex max-w-24 min-w-24 max-h-40 min-h-40 rounded-lg items-center justify-center bg-gray-300 overflow-hidden relative md:min-w-44 md:min-h-44">                                        
                                        <img 
                                            alt="Imagem do produto"
                                            src={itemFound?.imageUrl} 
                                            className="absolute w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <h1 className="text-gray-500 text-xl">Nenhum resultado</h1>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-900 lg:min-w-900 p-5">
                <div className="flex p-2 rounded-t-lg bg-white">
                    <h1>Criar novo item</h1>
                </div>
                <div className="flex flex-col items-start md:items-center justify-center md:flex-row rounded-b-lg bg-white-50%">
                    <div className="flex w-1/2 items-center justify-center">
                        <button className="flex h-52 md:h-60 w-44 md:w-52 items-center justify-center m-3 rounded-lg bg-white border-2 border-gray-300">

                            {loadingImage === true ? (
                                <div>
                                    <h1 className="text-sm">Carregando</h1>
                                </div>
                            ) : (
                                <>
                                <div className="absolute cursor-pointer">
                                    <FiUpload size={30} color="gray" className="cursor-pointer"/>
                                </div>
                                <div className="relative h-full w-full">
                                    <input 
                                        type="file"
                                        accept="image/"
                                        className="opacity-0 w-full h-full cursor-pointer z-50"
                                        onChange={handleFile}
                                    />
                                    {ItemImage && (
                                        <div className="flex absolute items-center justify-center inset-0 z-0">
                                            <button className="absolute" onClick={handleDeleteImage}>
                                                <FiTrash size={28} color="#e3827b"/>
                                            </button>
                                            <img 
                                                src={ItemImage.url} 
                                                className="w-full h-full object-cover rounded-lg"
                                                alt="Imagem do produto" 
                                            />
                                        </div>
                                    )}
                                </div>
                                </>
                            )}
                        </button>
                    </div>
                    <form className="flex w-full flex-col p-3 items-start md:items-center justify-center" onSubmit={onSubmit}>
                        <div className="flex flex-col md:flex-row w-full ">
                            <div className="flex flex-col w-full">
                                <h1>Titulo</h1>
                                <input 
                                    type="text" 
                                    placeholder="Ditie o nome do produto" 
                                    ref={titleRef}
                                    className="rounded-md border h-9 border-gray-400 mb-2 px-2 py-1"
                                />
                                <h1>Descrição</h1>
                                <textarea 
                                    placeholder="Descrição do produto" 
                                    ref={descriptionRef}
                                    className="rounded-md border h-9 border-gray-400 mb-2 px-2 py-1"
                                />
                                <h1>Valor</h1>
                                <input 
                                    type="text" 
                                    placeholder="Ex: 29,90"
                                    ref={priceRef} 
                                    className="rounded-md border h-9 border-gray-400 mb-2 px-2 py-1"
                                />
                                <div className="flex flex-row gap-2 w-full ">
                                    <div className="flex flex-col w-1/2">
                                        <h1>Categoria</h1>
                                        <select 
                                            name="" 
                                            id=""
                                            ref={categoryRef}
                                            defaultValue='Categorias'
                                            className="rounded-md border h-9 bg-white border-gray-400 mb-2 px-2 py-1"
                                        >
                                            <option disabled hidden>Categorias</option>
                                            {categories.map((value, index) => (
                                                <option key={index} value={value}>{value}</option>
                                            ))}

                                        </select>
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                        <h1>Nova Categoria</h1>
                                        <input 
                                            type="text" 
                                            placeholder="Ex: Cappucino"
                                            ref={newCategoryRef} 
                                            className="rounded-md border h-9 border-gray-400 mb-2 px-2 py-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full h-10 my-3 text-lg text-white font-bold rounded-lg bg-black">
                            Cadastrar
                        </button>
                    </form>
                </div>
            </div>
        </Container>
        <Footer/>
        </>
    )
}