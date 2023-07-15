import "./App.css";

import { useState, useRef } from "react";
import TransferForm from './TransferForm';
import { DefaultProvider, SensiletSigner, PubKey, toHex, sha256, toByteString, bsv, MethodCallOptions, findSig, SignatureResponse } from "scrypt-ts";
import { HelloWorld } from "./contracts/helloworld";
import { Identity } from "./contracts/identity";
import Form from "./form";
import Message from "./Message";
import { text } from "stream/consumers";
import ConnectWalletBox from "./ConnectWalletBox"
import Retransfer from './Retransfer';

function App() {
  const x="Sensilate";

  const [isConnected, setConnected] = useState(false);

  const signerRef = useRef<SensiletSigner>();

  const [contract, setContract] = useState<HelloWorld | undefined>(undefined)

  const [deployedTxId, setDeployedTxId] = useState<string>("")

  const [myPubkey, setMyPubkey] = useState("");
  const [myAddress, setmyAddress] = useState<string>("")

  let [vote_tokens, setvote_tokens] = useState<any>(0);
  const [Mintedvote_tokens, setMintedvote_tokens] = useState<any>(0);
  const [alicebalance, setAliceBalance] = useState(0);
  const [transferIndex, setransferIndex] = useState(0);
   let [TransferTxid, setransferTxid] = useState<string>("")
   let [RecallTxid, setRecall] = useState<string>("")
  const [transferAddress, setransferAddress] = useState<string>("")
  const Deploy_call = async () => {
    try {
      if (!isConnected || !myPubkey) {
        setConnected(false);
        alert("Please connect wallet first.");
        return;
      }

      const signer = signerRef.current as SensiletSigner;





    } catch (e) {
      console.error('deploy Kyc failed', e);
      alert('deploy kyc failed');
    }
  };


  const handleSubmit = async (formData: any) => {
    try {
      if (!isConnected || !myPubkey) {
        setConnected(false);
        alert("Please connect wallet first.");
        return;
      }

      let vote_deployTx: bsv.Transaction
      // last contract calling transaction

      // contract output index





      console.log(formData);
      const name = formData.tokenName;
      const Token_Name = formData.tokenName

      const Protocol_Name = formData.protocolName

      const Token_Symbol = formData.symbol

      const Token_supply = formData.totalSupply

      setMintedvote_tokens(Token_supply)
      setvote_tokens(Token_supply)
      const vote_satoshisIssued = Token_supply


      const Data_On_chain = "...................................... Token_Name:" + Token_Name + " Protocol_Name:" + Protocol_Name + " Token_Symbol:" + Token_Symbol + " Token_Supply:" + Token_supply + ".................................."



      // I am the issuer, and the first user as well

      const initialInstance = new Identity(PubKey(toHex(myPubkey)), toByteString(Data_On_chain, true))

      // there is one key in the signer, that is `myPrivateKey` (added by default)
      const signer = signerRef.current as SensiletSigner;
      await initialInstance.connect(signer)

      // I issue 10 re-callable satoshis
      vote_deployTx = await initialInstance.deploy(vote_satoshisIssued)
      console.log(`I issue ${vote_satoshisIssued} vote_token: ${vote_deployTx.id}`);
      const idx = vote_deployTx.id;


      setDeployedTxId(idx)

    } catch (e) {

      console.error('deploy Kyc failed', e);
      alert('deploy kyc failed');
    }
  };


  const handlTransfer = async (formData: any) => {
    const bsvNetwork = 'testnet'
    const vote_satoshisIssued:any= vote_tokens
    let lastCallTx: bsv.Transaction
    let vote_LastCall: bsv.Transaction
    // contract output index


    let vote_deployTx: bsv.Transaction
    // last contract calling transaction
    let vote_lastCallTx: bsv.Transaction
    // contract output index
    const vote_atOutputIndex = transferIndex;

    const vote_satoshisSendToAlice = 1

 
    // Convert address string to a public key on testnet
    const x = formData.address
    const y = x.toString()

  
    const alicePubkey = bsv.PublicKey.fromString(y);

    const myPublicKey = myPubkey
    console.log(myPublicKey)
    console.log(alicePubkey)

    const provider = new DefaultProvider()
    if(TransferTxid==="")
    {
      TransferTxid=deployedTxId 
    }
    console.log("index"+vote_atOutputIndex)
    const tx = await provider.getTransaction(TransferTxid)

    const meInstance = Identity.fromTx(tx, vote_atOutputIndex)

    // connect a signer
    const signer = signerRef.current as SensiletSigner;
    await meInstance.connect(signer)

    // now `meInstance` is good to use
    console.log('Contract `Recallable` recovered after deployed')

    // I send 7 to alice, keep 3 left
    const meNextInstance = meInstance.next()

    const aliceNextInstance = meInstance.next()
    aliceNextInstance.userPubKey = PubKey(toHex(alicePubkey))







    //   const { tx: callTx } = await p2pkh.methods.unlock(
    //     (sigResponses: SignatureResponse[]) => findSig(sigResponses, $publickey),
    //     $publickey,
    //     {
    //         pubKeyOrAddrToSign: $publickey.toAddress()
    //     } as MethodCallOptions<P2PKH>
    // );








    const { tx: transferToAliceTx } = await meInstance.methods.transfer1(
      (sigResponses: SignatureResponse[]) => findSig(sigResponses, bsv.PublicKey.fromString(myPubkey)),
      PubKey(toHex(alicePubkey)),
      BigInt(vote_satoshisSendToAlice),
      {
  
        pubKeyOrAddrToSign: bsv.PublicKey.fromString(myPubkey),
        next: [
          {
            // outputIndex 0: UTXO of alice
            instance: aliceNextInstance,
            balance: vote_satoshisSendToAlice
          },
          {
            // outputIndex 1: the change UTXO back to me
            instance: meNextInstance,
            balance: vote_satoshisIssued - vote_satoshisSendToAlice,
          },
        ],
      } as unknown as MethodCallOptions<Identity>
    )
   
    const addr = alicePubkey.toAddress(bsvNetwork).toString()
     const  myPubkey1=bsv.PublicKey.fromString(myPubkey);

    const addr1 = myPubkey1.toAddress(bsvNetwork).toString()
    setmyAddress(addr1)
    console.log(
      `I send 1 to ${addr}: ${transferToAliceTx.id}`
    )
    setransferAddress(addr)
    setransferTxid(transferToAliceTx.id)
    setransferIndex(1)
    vote_tokens=vote_tokens-1
    setvote_tokens(vote_tokens)
  };
  const handlReTransfer= async (formData: any) => {
    console.log(formData)
    const provider = new DefaultProvider()
    const  txcidx=formData.TransactionIdCustomer
    const tx = await provider.getTransaction(txcidx.toString())

    

    // connect a signer
 


    const bobNextInstance= Identity.fromTx(tx,formData.OutputIndex)
  
    const signer = signerRef.current as SensiletSigner;
    await bobNextInstance.connect(signer)
    const meRecallInstance = bobNextInstance.next()
    meRecallInstance.userPubKey = PubKey(toHex( myPubkey))

    const { tx: recallTx } = await bobNextInstance.methods.recall(
      (sigResponses: SignatureResponse[]) => findSig(sigResponses, bsv.PublicKey.fromString(myPubkey)),
        {
            // sign with the private key corresponding to `myPublicKey` (which is `myPrivateKey` in the signer)
            // since I am the issuer at the beginning
            pubKeyOrAddrToSign: bsv.PublicKey.fromString(myPubkey),
            next: {
                instance: meRecallInstance,
                balance: 1,
                atOutputIndex: 0,
            },
        } as MethodCallOptions<Identity>
    )

    console.log("Recallable of kyc token called :  "+recallTx.id)
    setRecall(recallTx.id)

  }

  const sensiletLogin = async () => {
    try {
      const provider = new DefaultProvider();
      const signer = new SensiletSigner(provider);

      signerRef.current = signer;

      const { isAuthenticated, error } = await signer.requestAuth()
      if (!isAuthenticated) {
        throw new Error(error)
      }

      const pubkey = await signer.getDefaultPubKey();

      setMyPubkey(toHex(pubkey))

      setConnected(true)
     setmyAddress(pubkey.toAddress().toString())
     


    }

    catch (error) {
      console.error("sensiletLogin failed", error);
      alert("sensiletLogin failed")
    }
  };


  return (
    <div className="App">

      <header className="App-header">
     


        {
          isConnected ?

            <div>
              {/* <label>Deployer Balance: {alicebalance} <span> (satoshis)</span></label>
              <br />
              <button
                className="pure-button button-large sensilet"
                onClick={Deploy_call}>Deploy and call contract</button> */}
              <Form onSubmit={handleSubmit} />
              {

                deployedTxId ? <Message text1={Mintedvote_tokens}  text2= {deployedTxId} text3="deployed" text4={vote_tokens}/> :
                  <div></div>
              }
               
              <TransferForm onSubmit={handlTransfer} />
              {

                TransferTxid ? <Message text1={transferAddress} text2={TransferTxid}  text4={vote_tokens}text3="transfer"/> :
                  <div></div>
              }
            

            </div>

            :
        
              <ConnectWalletBox  onClick={sensiletLogin}
              />
            
        }




      </header>
    </div>
  );
}

export default App;
