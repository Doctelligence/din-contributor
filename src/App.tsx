import React from 'react';
import logo from './logo.svg';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useReadContract } from 'wagmi';
import { config } from './config';
import abi from './abi';
import './App.css';

const queryClient = new QueryClient()

function WagmiCompoment() {

  // @ts-ignore
  const { data, error, ...args } = useReadContract({
    address: '0x085b721dA12D70115B275174743dF90A1E3e44B4',
    abi: abi,
    functionName: 'MAX_SCORE',
    // args: [],
  });

  console.log(data, args);

  if (error) return <code>{error.message}</code>

  return <div>{'a' + data}</div>
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
              Test <WagmiCompoment />
            </WagmiProvider>
          </QueryClientProvider>
      </header>
    </div>
  );
}

export default App;
