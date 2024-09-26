"use client"
import NavBar from '@/Components/NavBar';
import React from 'react';
import Cart from '@/Components/Cart';
import { useEffect,useState } from 'react';
import { addDoc, getDocs } from 'firebase/firestore';
import {collection} from 'firebase/firestore';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase/config';
export default function FrontPage(props:any){
    const[products, setProduct] = useState<any[]>([]);
    const router=useRouter();
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if(user){
          console.log("User is logged in");
        }else{
          router.push("/login");
        }
      });
      getDocs(collection(db, "products")).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setProduct((prev) => [...prev, doc.data()]);
        });
      });
    }, []);
    return (
        <>
            <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">


        {/* Iterate through the products array and render each Cart */}
        <div className="flex flex-wrap justify-center gap-10">
          {products.map((product:any) => (
            <Cart
              key={product.id}
              title={product.title}
              rating={product.rating.rate}
              src={product.image}
            />
          ))}
        </div>
      </div>
    </div>

        </>
    )
}