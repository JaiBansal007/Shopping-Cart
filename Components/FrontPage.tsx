"use client"
import NavBar from '@/Components/NavBar';
import React from 'react';
import Card from '@/Components/Card';
import { useEffect,useState } from 'react';
import { addDoc, getDocs } from 'firebase/firestore';
import {collection} from 'firebase/firestore';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase/config';
import Loading from '@/Components/Loading';
export default function FrontPage(props:any){
    const[products, setProduct] = useState<any[]>([]);
    const[loading,setloading]=useState(true);
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
        setloading(false);
      });
    }, []);
    if(loading){
      return <Loading/>
    }
    return (
        <>
            <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">


        {/* Iterate through the products array and render each Card */}
        <div className="flex flex-wrap justify-center gap-10">
          {products.map((product:any) => (
            <Card
              id={product.id}
              title={product.title}
              rating={product.rating.rate}
              src={product.image}
              category={product.category}
              price={product.price}
              description={product.description}
            />
          ))}
        </div>
      </div>
    </div>

        </>
    )
}