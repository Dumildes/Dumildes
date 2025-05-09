/// <reference no-default-lib="true"/>
 
import './Loading.css'; 

export default function LoadingShort({ text }) {
    return (
       

        <div className="loading-container" >
        <div className="loaderShort"></div>
      

        {
            text && <p >{text}</p>
        }
    </div>
    )
}