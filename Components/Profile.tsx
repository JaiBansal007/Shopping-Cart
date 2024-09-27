"use client"

import React from 'react';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {auth,db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
export default function ProfilePage() {
  // Dummy data for the profile and orders
    const router = useRouter();
    const [username, setUsername] = useState<string|null>("");
    const [useremail, setUseremail] = useState<string|null>("");
    const  [balance,setbalance]=useState<number>(0);
    const fetchbalance=async(props:any)=>{
      const user =doc(db,"users",props);
      const userRef=await getDoc(user);
      const userData=userRef.data();
      setbalance(userData?.balance);
    }
  useEffect(() => {
    // Fetch user data and orders
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUsername(user.displayName);
            setUseremail(user.email);
            fetchbalance(user.uid);
        } else {
            router.push('/login');
        }
        }
    );
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Profile Page</h1>
          <div className="flex gap-4">
            <button
                onClick={() => {
                    toast.success('Logged out successfully');
                    router.push('/login');
                    auth.signOut();
                    
                }} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
              Logout
            </button>

          </div>
        </div>

        {/* User Info */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold">User Information</h2>
          <p className="mt-2">
            <strong>Name:</strong> {username}
          </p>
          <p>
            <strong>Email:</strong> {useremail}
          </p>
          <p>
            <strong>Balance:</strong> {balance}
          </p>
        </div>

      </div>
    </div>
  );
}
