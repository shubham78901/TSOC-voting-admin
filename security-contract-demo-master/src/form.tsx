import React, { useState } from "react";
import "./Form.css";

interface FormProps {
  onSubmit: (formData: FormData) => void;
}

interface FormData {
  tokenName: string;
  protocolName: string;
  totalSupply: number;

  symbol: string;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const [tokenName, setTokenName] = useState("");
  const [protocolName, setProtocolName] = useState("");
  const [totalSupply, setTotalSupply] = useState(0);
 
  const [symbol, setSymbol] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData: FormData = {
      tokenName,
      protocolName,
      totalSupply,

      symbol,
    
    };

    onSubmit(formData);
  };

  return (
    
    <form onSubmit={handleSubmit} className="form-container">
     
      <div className="form-group">
    
      <h3>Mint voting Token</h3>
        <label htmlFor="tokenName">Election_Name:</label>
        <input
          type="text"
          id="tokenName"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="protocolName">Commision head:</label>
        <input
          type="text"
          id="protocolName"
          value={protocolName}
          onChange={(e) => setProtocolName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="totalSupply">Tota_Voters:</label>
        <input
          type="number"
          id="totalSupply"
          value={totalSupply}
          onChange={(e) => setTotalSupply(parseInt(e.target.value))}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="symbol">State:</label>
        <input
          type="text"
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
      </div>
      <button type="submit" className="form-button">
        Mint
      </button>
    </form>
  );
};

export default Form;
