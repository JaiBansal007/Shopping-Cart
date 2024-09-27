import FrontPage from "@/Components/FrontPage";
import NavBar from "@/Components/NavBar";
import { Toaster } from "react-hot-toast";
export default function Home(){
    return (
        <div>
            <NavBar />
            <FrontPage />
            <Toaster />
        </div>
    );
}