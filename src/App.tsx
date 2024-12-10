import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useReadContract } from 'wagmi';
import { DINNabar } from './Navbar';
import { useTheme } from 'next-themes';
import { Button } from '@nextui-org/react';
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

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      The current theme is: {theme}
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <Button>Press me</Button>
    </div>
  )
};

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
              <DINNabar />
              <ThemeSwitcher/>
              <WagmiCompoment />
            </WagmiProvider>
          </QueryClientProvider>
    //   </header>
    // </div>
  );
}

export default App;
