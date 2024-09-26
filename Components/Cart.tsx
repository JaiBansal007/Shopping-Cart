export default function Cart(props:any){

    return (
        <>
            <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4">
                <img className="w-full h-48 object-contain" src={props.src} alt="Product Image"/>
                
                <div className="px-6 py-4">

                    <div className="font-bold text-xl mb-2">{props.title}</div>
                    

                    <div className="flex items-center mb-4">
  {/* Generate an array of 5 stars */}
                    {[...Array(5)].map((_, index) => (
                        <svg
                        key={index}
                        className={`w-4 h-4 ${
                            index < props.rating ? 'text-yellow-500' : 'text-gray-300'
                        } fill-current`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        >
                        <path d="M10 15l-5.09 2.673 1.177-5.8L2 8.163l5.905-.56L10 2.5l2.095 5.103L18 8.163l-4.09 3.71L13.09 17.673z" />
                        </svg>
                    ))}

                    {/* Show the rating number beside the stars */}
                    <span className="ml-2 text-sm text-gray-600">({props.rating})</span>
                    </div>



                <div className="flex justify-between">

                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Buy</button>

                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add to Cart</button>
                </div>
            </div>
            </div>

        </>
    )
}