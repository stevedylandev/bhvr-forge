import { useState } from "react";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { counterAbi } from "contracts";
import type { ApiResponse } from "shared";
import "./App.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D404fBaF464DfD85";

function App() {
  const [data, setData] = useState<ApiResponse | undefined>();
  const [counterValue, setCounterValue] = useState<bigint | undefined>();

  const client = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  async function callAPI() {
    try {
      const req = await fetch(`${SERVER_URL}/hello`);
      const res: ApiResponse = await req.json();
      setData(res);
    } catch (error) {
      console.log(error);
    }
  }

  async function readContract() {
    try {
      const result = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: counterAbi,
        functionName: "number",
      });
      setCounterValue(result);
    } catch (error) {
      console.log("Contract read error:", error);
    }
  }

  return (
    <div className="App">
      <h1>BHVR + Foundry</h1>
      <p>Full-stack TypeScript with Smart Contracts</p>

      <div className="card">
        <button type="button" onClick={callAPI}>
          Call API
        </button>
        <button type="button" onClick={readContract}>
          Read Contract
        </button>

        {data && (
          <pre className="response">
            <code>API: {data.message}</code>
          </pre>
        )}

        {counterValue !== undefined && (
          <pre className="response">
            <code>Counter: {counterValue.toString()}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

export default App;
