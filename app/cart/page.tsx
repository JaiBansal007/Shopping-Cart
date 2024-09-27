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
export default async function Home() {
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
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <Cart />
    </div>
  );
}
