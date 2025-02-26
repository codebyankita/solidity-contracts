// 'use client';
// import { ethers } from "ethers";
// import { useState, useEffect } from "react";
// import HelloWorldContractABI from "../contracts/HelloWorldContract.json";

// // Correct contract address from your deployment
// const CONTRACT_ADDRESS = "0x82a2ce96da8f45b6c59bec5059f6a3f4516ef653";

// export default function Home() {
//   const [message, setMessage] = useState<string>("");
//   const [newMessage, setNewMessage] = useState<string>("");
//   const [contract, setContract] = useState<ethers.Contract | null>(null);
//   const [account, setAccount] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Connect to MetaMask and initialize contract
//   const connectWallet = async () => {
//     if (window.ethereum) {
//       try {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const accounts = await provider.send("eth_requestAccounts", []);
//         const signer = await provider.getSigner();
//         const ethContract = new ethers.Contract(
//           CONTRACT_ADDRESS,
//           HelloWorldContractABI,
//           signer
//         );

//         setContract(ethContract);
//         setAccount(accounts[0]);
//         setError(null);
//       } catch (error: any) {
//         console.error("Error connecting wallet:", error);
//         setError(`Failed to connect wallet: ${error.message}`);
//       }
//     } else {
//       alert("Please install MetaMask!");
//     }
//   };

//   // Fetch the current message from the contract
//   const fetchMessage = async () => {
//     if (contract) {
//       try {
//         const currentMessage = await contract.getMessage();
//         console.log("Raw response from getMessage:", currentMessage); // Debug log
//         setMessage(currentMessage);
//         setError(null);
//       } catch (error: any) {
//         console.error("Error fetching message:", error);
//         setError(`Failed to fetch message: ${error.message}`);
//       }
//     }
//   };

//   // Update the message on the contract
//   const updateMessage = async () => {
//     if (contract && newMessage) {
//       try {
//         const tx = await contract.setMessage(newMessage);
//         await tx.wait(); // Wait for transaction confirmation
//         setNewMessage(""); // Clear input
//         fetchMessage(); // Refresh message
//         setError(null);
//       } catch (error: any) {
//         console.error("Error updating message:", error);
//         setError(`Failed to update message: ${error.message}`);
//       }
//     }
//   };

//   // Auto-connect and fetch message on load if wallet is already connected
//   useEffect(() => {
//     if (window.ethereum) {
//       connectWallet().then(() => {
//         fetchMessage();
//       }).catch((err) => {
//         console.error("Initial load error:", err);
//       });
//     }
//   }, []);

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h1>Hello World DApp</h1>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {!account ? (
//         <button onClick={connectWallet}>Connect Wallet</button>
//       ) : (
//         <div>
//           <p>Connected Account: {account}</p>
//           <p>Current Message: {message || "Loading..."}</p>

//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Enter new message"
//             style={{ marginRight: "10px" }}
//           />
//           <button onClick={updateMessage}>Update Message</button>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import HelloWorldContractABI from "../contracts/HelloWorldContract.json";

// Correct contract address from your deployment
const CONTRACT_ADDRESS = "0x82a2ce96da8f45b6c59bec5059f6a3f4516ef653";
// Polygon Mainnet block explorer base URL (adjust if on a different network)
const EXPLORER_BASE_URL = "https://polygonscan.com/tx/";

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null); // Store transaction hash

  // Connect to MetaMask and initialize contract
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const ethContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          HelloWorldContractABI,
          signer
        );

        setContract(ethContract);
        setAccount(accounts[0]);
        setError(null);
      } catch (error: any) {
        console.error("Error connecting wallet:", error);
        setError(`Failed to connect wallet: ${error.message}`);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Fetch the current message from the contract
  const fetchMessage = async () => {
    if (contract) {
      try {
        const currentMessage = await contract.getMessage();
        console.log("Raw response from getMessage:", currentMessage);
        setMessage(currentMessage);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching message:", error);
        setError(`Failed to fetch message: ${error.message}`);
      }
    }
  };

  // Update the message on the contract and store tx hash
  const updateMessage = async () => {
    if (contract && newMessage) {
      try {
        const tx = await contract.setMessage(newMessage);
        setTxHash(tx.hash); // Store the transaction hash immediately
        await tx.wait(); // Wait for transaction confirmation
        setNewMessage(""); // Clear input
        fetchMessage(); // Refresh message
        setError(null);
      } catch (error: any) {
        console.error("Error updating message:", error);
        setError(`Failed to update message: ${error.message}`);
        setTxHash(null); // Clear tx hash on error
      }
    }
  };

  // Auto-connect and fetch message on load if wallet is already connected
  useEffect(() => {
    if (window.ethereum) {
      connectWallet().then(() => {
        fetchMessage();
      }).catch((err) => {
        console.error("Initial load error:", err);
      });
    }
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Hello World DApp</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Account: {account}</p>
          <p>Current Message: {message || "Loading..."}</p>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter new message"
            style={{ marginRight: "10px" }}
          />
          <button onClick={updateMessage}>Update Message</button>

          {txHash && (
            <p>
              Transaction confirmed! View on{" "}
              <a
                href={`${EXPLORER_BASE_URL}${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                Polygonscan
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}