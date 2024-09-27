"use client"
import React, { useState,useEffect } from 'react';
import Loading from './Loading';
import {useRouter} from 'next/navigation';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc ,updateDoc} from 'firebase/firestore';
import { db } from '@/firebase/config';
import {toast} from 'react-toastify';
export default function Purchase() {
    const [loading, setloading] = useState(false);
    const [userId, setUserId] = useState("");
    const router = useRouter();
    const [products, setProduct] = useState<any[]>([]);
    const fetchCart=async(props:any)=>{
        const user=doc(db,"users",props);
        const cart=await getDoc(user);
        const cartData=cart.data();
        if(cartData){
            setProduct(cartData.orders);
        }
        setloading(false);
        setUserId(props);
    }

    useEffect(() => {
        setloading(true);
        // Your code here
        onAuthStateChanged(auth, (user) => {
            if(user){
                setUserId(user.uid);
                fetchCart(user.uid);
            }else{
                router.push("/login");
            }
        });

        setloading(false);
    }, []);

    if(loading){
        return <Loading/>
    }
    return (
        <>
        {products.map((product: any) => product.purchasedquantity>0&&(product.status=="purchased")&&(
            <div
                key={product.id}
                className="flex flex-col m-7 md:flex-row items-center gap-4 p-4 border-b border-gray-200 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 ease-in-out"
            >
                {/* Product Image */}
                <img
                src={product.src}
                className="w-full md:w-32 h-32 object-contain rounded-md border"
                alt={product.title}
                />

                {/* Product Details */}
                <div className="flex flex-col justify-between w-full">
                {/* Title, Description, and Category */}
                <div className="flex flex-col gap-2">
                    {/* Product Title */}
                    <h1 className="text-lg font-semibold text-gray-800">{product.title}</h1>

                    {/* Product Category */}
                    <div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full w-max mr-2">
                        {product.category}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full w-max">
                        {product.purchasedquantity}
                        </span>
                    </div>
                    {/* Product Description */}
                    <p className="text-sm text-gray-600">{product.description.substring(0,100)}...</p>
                </div>

                {/* Price, Quantity, and Controls */}
                <div className="flex items-center justify-between mt-4">
                    {/* Product Price */}
                    <span className="text-md font-medium text-green-600">₹{Math.floor(product.price*10)}</span>

                    {/* Quantity Controls */}



                    {/* Product Rating */}
                    <div className="flex items-center">
                    {/* Stars */}
                    <div className="flex">
                        {[...Array(5)].map((_, index) => (
                        <svg
                            key={index}
                            className={`w-4 h-4 ${
                            index < product.rating ? 'text-yellow-400' : 'text-gray-300'
                            } fill-current`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 15l-5.09 2.673 1.177-5.8L2 8.163l5.905-.56L10 2.5l2.095 5.103L18 8.163l-4.09 3.71L13.09 17.673z" />
                        </svg>
                        ))}
                    </div>
                    {/* Show the rating number beside the stars */}
                    <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
                    </div>
                </div>
                </div>


            </div>

            ))}

        </>
    )
}