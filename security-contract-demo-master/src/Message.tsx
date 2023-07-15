import React from "react";
import "./Message.css";

interface Props {
  text1: any; 
  text2:any
  text3:any
  text4:any
}

const Message: React.FC<Props> = ({ text1,text2,text3,text4}) => {
  if(text3==='deployed')
  {

    return (
      <div>
            <p>Voting contract deployed..<br/> Token Minted: {text1} <br/>Transaction id:{text2}</p>
      </div>
      
      
    );
  }
  else if(text3==='recall' && text4==="recall")
  {
    return (
      <div>
            <p>Voting token recalled ..<br/> to address : {text1} <br/>Transaction id:{text2}</p>
      </div>
      
      
    );

  }
  else return (
    <div>
          <p>KYC Token transferred to address: {text1}<br/>Transaction id: {text2}<br/>Tokens left: {text4}</p>
    </div>
    
    
  );
};

export default Message;


