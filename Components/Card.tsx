"use client"
import { arrayUnion, getDoc, updateDoc } from "firebase/firestore"
import { doc } from "firebase/firestore"
import { collection } from "firebase/firestore"
import { getDocs,addDoc } from "firebase/firestore"
import {useState,useEffect} from 'react';
import {useRouter} from 'next/navigation';
import { auth ,db} from '@/firebase/config';
import { onAuthStateChanged } from "firebase/auth"
import Loading from "./Loading";
import { toast } from "react-toastify";
export default function Card(props:any){
    const [loading,setloading]=useState(true);
    const[products, setProduct] = useState<any[]>([]);
    const [userId, setUserId] = useState("");
    const router=useRouter();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if(user){
            setUserId(user.uid);
          }else{
            router.push("/login");
          }
        });

      }, []);
      
      const addtocart = async () => {
        const userref = doc(db, "users", userId);
      
        // Retrieve the user's current orders
        const userSnapshot = await getDoc(userref);
        const userData = userSnapshot.data();
      
        // Check if the product already exists in the orders
        const existingProduct = userData?.orders.find((order:any) => order.id === props.id);
      
        if (existingProduct) {
          // If the product exists, increase its quantity
          const updatedOrders = userData?.orders.map((order:any) =>
            order.id === props.id ? { ...order, quantity: order.quantity + 1 } : order
          );
      
          // Update the user's orders array with the modified quantity
          await updateDoc(userref, {
            orders: updatedOrders,
          });
        } else {
          // If the product does not exist, add it with quantity 1
          await updateDoc(userref, {
            orders: arrayUnion({
              id: props.id,
              title: props.title,
              rating: props.rating,
              src: props.src,
              category: props.category,
              price: props.price,
              description: props.description,
              status: "pending",
              quantity: 1, // Set initial quantity as 1
            }),
          });
        }
        toast.success("item added to cart");
      };
      const buy=async()=>{
          addtocart();
          router.push("/cart");
      }

    return (
        <>
<div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 flex flex-col justify-between">
  <img className="w-full h-48 object-contain" src={props.src} alt="Product Image" />

  <div className="px-6 py-4">
    {/* Product Title */}
    <div className="font-bold text-xl mb-2">{props.title}</div>

    {/* Product Price */}
    <div className="text-lg font-semibold text-green-600 mb-2">₹{Math.floor(props.price*10)}</div>

    {/* Product Rating */}
    <div className="flex items-center mb-4">
      {/* Generate an array of 5 stars */}
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-4 h-4 ${index < props.rating ? 'text-yellow-500' : 'text-gray-300'} fill-current`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.09 2.673 1.177-5.8L2 8.163l5.905-.56L10 2.5l2.095 5.103L18 8.163l-4.09 3.71L13.09 17.673z" />
        </svg>
      ))}
      {/* Show the rating number beside the stars */}
      <span className="ml-2 text-sm text-gray-600">({props.rating})</span>
    </div>

    {/* Buttons */}
    <div className="flex justify-between">
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={buy}>Buy</button>
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={addtocart}>Add to Cart</button>
    </div>
  </div>
</div>

        </>
    )
}