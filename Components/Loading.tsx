export default function Loading(){
    return (
     /* From Uiverse.io by Javierrocadev */ 
     <div className="w-full h-screen flex flex-row gap-2 justify-center items-center">
     <div className="w-8 h-8 rounded-full bg-blue-700 animate-bounce"></div>
     <div className="w-8 h-8 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
     <div className="w-8 h-8 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
   </div>
    )
  }