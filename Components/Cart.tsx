"use client"
import { getDoc } from "firebase/firestore"
import { doc } from "firebase/firestore"
import { getDocs ,setDoc,updateDoc} from "firebase/firestore"
import {useState,useEffect} from 'react';
import {useRouter} from 'next/navigation';
import { auth ,db} from '@/firebase/config';
import { onAuthStateChanged } from "firebase/auth"
import Loading from "./Loading";
import { toast } from "react-toastify";
export default function Cart(){
    const [loading,setloading]=useState(false);
    const[products, setProduct] = useState<any[]>([]);
    const [userId, setUserId] = useState("");
    const [total, setTotal] = useState(0);
    const [balance,setbalance]=useState(0);
    const router=useRouter();
    const [popup,setPopup]=useState(false);
    const fetchCart=async(props:any)=>{
        const user=doc(db,"users",props);
        const cart=await getDoc(user);
        setProduct(cart.data()?.orders);
        setbalance(cart.data()?.balance);
        let temp=0;
        for(let i=0;i<cart.data()?.orders.length;i++){
            if(cart.data()?.orders[i].quantity>0){
                temp+=cart.data()?.orders[i].price*cart.data()?.orders[i].quantity;
            }
        }
        setTotal(temp);
        setloading(false);
        setUserId(props);
    }
    const purchase=async()=>{
        if(balance<total){
            toast.error("Insufficient Balance");
            router.push("/purchase");
            return;
        }
        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);
        
        if (!userSnapshot.exists()) {
            toast.error("User not found");
            return;
        }

        const userData = userSnapshot.data();
        await updateDoc(userRef, {
            orders: userData.orders.map((product:any) => ({
            ...product,
            status: "purchased",
            purchasedquantity:product.quantity,
            quantity:0
            })),
            balance: balance - total*10.6 // Deduct total from the user's balance
        });
        setbalance(balance-total*10.6);
        fetchCart(userId);
        toast.success("Order status updated and balance adjusted");
        router.push("/cart");
    }

    useEffect(() => {
        setloading(true);
        onAuthStateChanged(auth, (user) => {
          if(user){
            fetchCart(user.uid);
          }else{
            router.push("/login");
          }
        });


      }, []);

      const handleQuantityChange = async (id: number, quantity: number) => {
        const userRef = doc(db, "users", userId); // Corrected reference to document
        const userSnapshot = await getDoc(userRef); // Get current user data
        const userData = userSnapshot.data();
      
        // Update orders based on the product ID
        await updateDoc(userRef, {
          orders: userData?.orders.map((product: any) =>
            product.id === id ? { ...product, quantity } : product
          ),
        });
      
        // Display success message and refresh cart
        toast.success("Item Updated");
        fetchCart(userId);
      };
      
    if(loading){
        return <Loading/>
    }
    return (
        <>
            {products.map((product: any) => product.quantity>0&&(
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
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full w-max">
                    {product.category}
                    </span>

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

                <form className="max-w-xs mx-auto">
                        <div className="relative flex items-center max-w-[8rem]">
                            <button type="button" onClick={()=>{
                                handleQuantityChange(product.id,product.quantity-1);
                            }} id="decrement-button" data-input-counter-decrement="quantity-input" className=" bg-blue-100 dark:bg-blue-700 dark:hover:bg-blue-600 dark:border-blue-600 hover:bg-blue-200 border border-blue-300 rounded-s-lg p-3 h-11 focus:ring-blue-100 dark:focus:ring-blue-700 focus:ring-2 focus:outline-none">
                                <svg className="w-3 h-3 text-blue-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                                </svg>
                            </button>
                            <p className="m-4">{product.quantity}</p>
                            <button type="button" onClick={()=>{
                                handleQuantityChange(product.id,product.quantity+1);
                            }}
                            id="increment-button" data-input-counter-increment="quantity-input" className="bg-blue-100 dark:bg-blue-700 dark:hover:bg-blue-600 dark:border-blue-600 hover:bg-blue-200 border border-blue-300 rounded-e-lg p-3 h-11 focus:ring-blue-100 dark:focus:ring-blue-700 focus:ring-2 focus:outline-none">
                                <svg className="w-3 h-3 text-blue-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                                </svg>
                            </button>
                        </div>
                    
                    </form>

            </div>
            ))}
            {total > 0 ? (
                <div className="m-7 flex justify-center items-center flex-col bg-white rounded-lg shadow-md p-4 w-auto">
                    {/* Updated subtotal and cost breakdown */}
                    <p className="text-lg font-semibold text-gray-800">Subtotal: ₹{(total*10).toFixed(2)}</p>
                    <p className="text-lg font-semibold text-gray-800">Shipping: ₹{(total * 0.1).toFixed(2)}</p>
                    <p className="text-lg font-semibold text-gray-800">Tax: ₹{(total * 0.5).toFixed(2)}</p>

                    {/* Calculated Final Total */}
                    <h5 className="text-xl font-bold text-gray-900 mt-2">
                        Final Total: ₹{(total * 10.6).toFixed(2)}
                    </h5>
                        
                        {/* Checkout Button */}
                        <button
                            onClick={async() => {
                                await purchase();
                                setPopup(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-8 py-2 mt-4"
                        >Pay</button>
                </div>

                ) : (
                <h1 className="w-screen h-screen text-[40px] font-semibold text-gray-800 text-center flex justify-center items-center">Cart is Empty!!</h1>
                )}

            {popup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-md p-6 w-96">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Payment Summary</h2>
                
                {/* Display the Total Paid Amount */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-medium text-gray-700">Total Paid Amount:</span>
                    <span className="text-lg font-bold text-green-600">₹{(total*10.6).toFixed(2)}</span>
                </div>
                
                {/* Display the Final Balance */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-medium text-gray-700">Final Balance:</span>
                    <span className="text-lg font-bold text-blue-600">₹{(balance-total*10.6).toFixed(2)}</span>
                </div>

                {/* Close Button */}
                <div className="flex justify-center mt-4">
                    <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                    onClick={async() => {
                        setPopup(false)
                        router.push("/purchase");
                    }}
                    >
                    Close
                    </button>
                </div>
                </div>
            </div>
            )}

        </>
    )
}