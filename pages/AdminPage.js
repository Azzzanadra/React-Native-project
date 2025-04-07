'use client'

import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import '../app/globals.css';
import { useRouter } from 'next/navigation';

function AdminPage() {
    const router = useRouter()
    const [items, setItems] = useState([])
    const [add,setAdd] = useState({
        title: '',
        price: 0.0,
        description: '',
        category: '',
        image: '#'
    })
    const [Query, setQuery] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const apiCall= async ()=>{
        try{
            const response = await axios.get("https://fakestoreapi.com/products");
            setItems(response.data);            
        }
        catch(error){
            console.error("Error fetching products:", error);
        }
    }

    useEffect(() =>{
        const token = localStorage.getItem('authToken');
        if (!token){
            router.push('/login')
        }else{
            setIsAuthenticated(true);
            apiCall();            
        }
    },[])
    const handleChange = (e) => {
        setAdd(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const handleAdd = async () => {
        try {
            const response = await axios.post('https://fakestoreapi.com/products', add);
            
            setItems(prev => [...prev, response.data]); 
            
            setAdd({ title: '', price: 0.0, description: '', category: '', image: '' });
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    // function onSubmit(e){
    //     e.preventDefault();

    //     const value = inputRef.current.value;
    //     setAdd(...add,value)
    //     if (value === '') return;
    //     setItems(prev =>{
    //         return [...prev,value]
    //     });
    //     inputRef.current.value = '';
    // }

    const filterItems = items.filter((item =>{
        return item.title.toLowerCase().includes(Query.toLowerCase())
    }))

    function desc(productId){

        router.push(`/products/${productId}`);
    }

    //     const axios = require('axios');
    //   const product = {id:21, title: 'New Product', price: 29.99 };
    //   axios.post('https://fakestoreapi.com/products', product)
    //     .then(response => console.log(response.data));
  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-100 gap-16 text-black'>
        <nav className="flex items-center w-full bg-blue-400 justify-between">
            <img src="#" alt="#" />
            {/* <div className="flex mr-5 p-5">
                <CgProfile className='text-5xl text-white pr-2'/>
                <FaShoppingCart className='text-5xl text-white pl-2'/>
            </div> */}
            {/* <span onClick={handleLogout} className='text-white text-2xl cursor-pointer border-2 border-white'>Logout</span> */}
        </nav>
        <div className="flex flex-col items-center justify-around">
            {/* Search bar */}
            <h1 className='text-4xl'>Admin page</h1>
            <div className="flex">
                <input value={Query} onChange={(e) => setQuery(e.target.value)}  type="text" name='text' placeholder='Search for the product here' className='bg-gray-100 outline-none text-sm flex-1'/>
                <span onClick={apiCall} className='p-10 bg-blue-400 text-white cursor-pointer'>Search</span>
            </div>
            {/* add products */}
            <div className='flex'>
                <input onChange={handleChange}  type="text" name='title' placeholder='Add product title' className='bg-gray-100 outline-none text-sm flex-1'/>
                <input onChange={handleChange}  type="price" name='price' placeholder='Add product price' className='bg-gray-100 outline-none text-sm flex-1'/>
                <input onChange={handleChange}  type="description" name='description' placeholder='Add product description' className='bg-gray-100 outline-none text-sm flex-1'/>
                <input onChange={handleChange}  type="category" name='category' placeholder='Add product category' className='bg-gray-100 outline-none text-sm flex-1'/>
                <button onClick={handleAdd} className='p-10 bg-blue-400 text-white cursor-pointer'>Add</button>
            </div>
            {/* items */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.length >0?(
                    filterItems.map((item)=>(
                        <div key={item.id} className="bg-white p-4 shadow-md">
                            <img src={item.image} alt={item.title} loading="lazy" className="w-32 h-32 object-cover mx-auto" />
                            <h2 onClick={() => desc(item.id)} className="text-lg font-bold mt-2 cursor-pointer">{item.title}</h2>
                            <p className="text-gray-700">${item.price}</p>
                            <p>{item.category}</p>
                        </div>
                    ))
                ):(
                    <p>Loading products....</p>
                )}
            </div>
        </div>
    </div>
  )
}

export default AdminPage