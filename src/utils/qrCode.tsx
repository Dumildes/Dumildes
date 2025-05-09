/// <reference no-default-lib="true"/>
 
import { QRCodeSVG } from 'qrcode.react';

function QRCode({ link }) {
    const dadosParaQRCode = link;
    
    return <QRCodeSVG value={dadosParaQRCode} size={90}  />

}

export default QRCode;
