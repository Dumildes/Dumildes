import React, { useState, useEffect } from 'react'
import './seguradoras.css'
import CNPApi from '../../../services/CNPApi';

const Seguradoras: React.FC = () => {
    const [seguradoras, setSeguradoras] = useState([]);

    useEffect(() => {

        CNPApi.get('seguradoras')
        .then((response)=>{
            console.log(response)
        })
        .catch((err) => console.log(err))
    
    }, [])
  return (
    <div>
      <h1>Seguradoras</h1>
    </div>
  )
}

export default Seguradoras
