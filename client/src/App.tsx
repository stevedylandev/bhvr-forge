import { useState } from "react";
import { createTestClient, http, publicActions, walletActions } from "viem";
import { foundry } from "viem/chains";
import { counterAbi } from "contracts";
import type { ApiResponse } from "shared";
import "./App.css";
import beaver from "./assets/beaver.svg";
import { Button } from "./components/ui/button";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [data, setData] = useState<ApiResponse | undefined>();
  const [counterValue, setCounterValue] = useState<bigint | undefined>();

  const client = createTestClient({
    chain: foundry,
    mode: "anvil",
    transport: http(),
  })
    .extend(publicActions)
    .extend(walletActions);

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
    <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
      <a
        href="https://github.com/stevedylandev/bhvr"
        rel="noreferrer"
        target="_blank"
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
        <Button onClick={sendRequest}>Call API</Button>
        <Button onClick={readContract}>Read Contract</Button>
        <Button variant="secondary" asChild>
          <a rel="noreferrer" target="_blank" href="https://bhvr.dev">
            Docs
          </a>
        </Button>
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
