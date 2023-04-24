import Image from "next/image";
import { ScaleLoader } from "react-spinners";

const Loading = () => {
    return (
        <center style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh"}}>
            <Image 
            src="/whatsapp-logo.png" 
            width={200} height={200} alt="" 
            style={{marginBottom: 10}} priority={true}
            />
            <div>
                <ScaleLoader color="#1eb053" />
            </div>
        </center>
    );
}
 
export default Loading;