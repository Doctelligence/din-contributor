import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useReadContract } from 'wagmi';
import { config, CONTRACT_ADDRESS } from './config';
import abi from './abi';
import './App.css';

const queryClient = new QueryClient()

function WagmiCompoment() {

  // @ts-ignore
  const { data, error, ...args } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'MAX_SCORE',
  });

  if (error) return <code>{error.message}</code>

  return <div>{'Max Score is: ' + data}</div>
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
              <WagmiCompoment />
            </WagmiProvider>
          </QueryClientProvider>
      </header>
    </div>
  );
}

export default App;
