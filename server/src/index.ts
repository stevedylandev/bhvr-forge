import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import type { ApiResponse } from 'shared'
import { counterAbi } from 'contracts'

const app = new Hono()
app.use(cors())

// Web3 client setup
const client = createPublicClient({
  chain: sepolia,
  transport: http()
})

app.get('/contracts/:address/counter', async (c) => {
  try {
    const address = c.req.param('address') as `0x${string}`

    const result = await client.readContract({
      address,
      abi: counterAbi,
      functionName: 'number'
    })

    const response: ApiResponse = {
      message: `Counter value: ${result}`,
      success: true
    }

    return c.json(response)
  } catch (error) {
    return c.json({
      message: 'Failed to read contract',
      success: false
    }, 500)
  }
})

export default app
