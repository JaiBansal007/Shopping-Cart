"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword ,GoogleAuthProvider, onAuthStateChanged, signInWithPopup} from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
const googleauthprovider=new GoogleAuthProvider();
export default function SignUp(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [match, setMatch] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if(password!==confirmPassword){
      setMatch(false);
    }else{
      setMatch(true);
    }
    
  }, [confirmPassword]);
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        router.push("/profile");
      }
    })
  },[]);
    const handler = async () => {
    console.log(email, password);
    if(match){
      try {
        const res=await createUserWithEmailAndPassword(auth,email, password);
        await setDoc(doc(db, "users", res.user.uid), {
          email: email,
          password: password,
          id: res.user.uid,
          orders: [],
          complaint: [],
          balance: 0,
        });

        await setDoc(doc(db, "post", res.user.uid), {
          userpost: [],
        });
        toast.success("Successfully Logged in");
        router.push("/profile");
      } catch (error) {
        toast.error("Invalid Credentials");
      }
    }
  };
  const googleregister = async () => {
    try {
      const res = await signInWithPopup(auth, googleauthprovider);
      const userId = res.user.uid;
  
      // Check if user already exists
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);
  
      if (!userSnap.exists()) {
        // User does not exist, create the user document
        await setDoc(userDocRef, {
          email: res.user.email,
          password: "", // Store empty password or remove if not needed
          id: userId,
          orders: [],
          complaint: [],
          balance: 0,
        });
  
        await setDoc(doc(db, "post", userId), {
          userpost: [],
        });
      }
  
      toast.success("Successfully Logged in");
      router.push("/shopping");
    } catch (error) {
      toast.error("Login Failed");
      console.log(error);
    }
  };
    return (
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
    <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="mt-12 flex flex-col items-center">
                <h1 className="text-2xl xl:text-3xl font-extrabold">
                    Sign up
                </h1>
                <div className="w-full flex-1 mt-8">
                    <div className="flex flex-col items-center">
                        <button
                            className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                            <div className="bg-white p-2 rounded-full">
                                <svg className="w-4" viewBox="0 0 533.5 544.3">
                                    <path
                                        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                                        fill="#4285f4" />
                                    <path
                                        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                                        fill="#34a853" />
                                    <path
                                        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                                        fill="#fbbc04" />
                                    <path
                                        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                                        fill="#ea4335" />
                                </svg>
                            </div>
                            <span className="ml-4" onClick={googleregister}>
                                Sign up with Google
                            </span>
                        </button>

                    </div>

                    <div className="my-12 border-b text-center">
                        <div
                            className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                            Or sign up with e-mail
                        </div>
                    </div>

                    <div className="mx-auto max-w-xs">
                        <input
                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            type="email" placeholder="Email" />
                        <input
                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                            type="password" placeholder="Password" />
                        <button
                            className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                            <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <path d="M20 8v6M23 11h-6" />
                            </svg>
                            <span className="ml-3">
                                Sign Up
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')`,
                  backgroundSize: 'cover', // Optional: cover or contain for image sizing
                  backgroundRepeat: 'no-repeat', // Optional: prevent image repeating
                  height: '100vh', // Optional: set height
                  width: '100%' // Optional: set width
                }}>
            </div>
        </div>
    </div>
</div>
    )
  }
  
  