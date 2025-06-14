import { useState } from "react";
import beaver from "./assets/beaver.svg";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { counterAbi } from "contracts";
import type { ApiResponse } from "shared";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D404fBaF464DfD85";

const viemClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

function App() {
  const [data, setData] = useState<ApiResponse | undefined>();
  const [counterValue, setCounterValue] = useState<bigint | undefined>();

  async function sendRequest() {
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
      const result = await viemClient.readContract({
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
    <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
      <a
        href="https://github.com/stevedylandev/bhvr"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={beaver}
          className="w-16 h-16 cursor-pointer"
          alt="beaver logo"
        />
      </a>
      <h1 className="text-5xl font-black">bhvr</h1>
      <h2 className="text-2xl font-bold">Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo with smart contracts</p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={sendRequest}
          className="bg-black text-white px-2.5 py-1.5 rounded-md"
        >
          Call API
        </button>
        <button
          type="button"
          onClick={readContract}
          className="bg-black text-white px-2.5 py-1.5 rounded-md"
        >
          Read Contract
        </button>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://bhvr.dev"
          className="border-1 border-black text-black px-2.5 py-1.5 rounded-md"
        >
          Docs
        </a>
      </div>
      {data && (
        <pre className="bg-gray-100 p-4 rounded-md">
          <code>
            Message: {data.message} <br />
            Success: {data.success.toString()}
          </code>
        </pre>
      )}
      {counterValue !== undefined && (
        <pre className="bg-gray-100 p-4 rounded-md">
          <code>Counter Value: {counterValue.toString()}</code>
        </pre>
      )}
    </div>
  );
}

export default App;
