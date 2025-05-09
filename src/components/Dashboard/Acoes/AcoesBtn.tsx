import React from 'react'
import './acoesBtn.css'
import { useNavigate } from 'react-router-dom'

interface BtnProps {
    img: string;
    title: string;
    root: string;
}

const AcoesBtn: React.FC<BtnProps> = ({img, title, root}) => {
    const navigate = useNavigate();
    return (
        <div className="cardAction">
            <div className='card-item' onClick={()=>navigate(root)}>
                <img src={img} alt="" />
                <p className='btnAction'>{title}</p>
            </div>
        </div>
    )
}

export default AcoesBtn
