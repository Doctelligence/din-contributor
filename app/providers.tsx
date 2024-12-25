"use client";

import { Provider, createContext, useReducer } from "react";
import type { ThemeProviderProps } from "next-themes";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { config } from '../contract/config';
import { E, P } from "@upstash/redis/zmscore-Dc6Llqgr";
import { useGetEthUsdRate } from "@/hooks/getEthUsdRate";
import { getAllProjects } from "./postgres";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export const SQLContext = createContext<[Record<string, any>[] | undefined, () => void]>([undefined, () => {}]);
export const ExchangeContext = createContext<number | undefined>(undefined);

export function useExchange() {
  return React.useContext(ExchangeContext);
}

const queryClient = new QueryClient();

const deepEqual = function (x: any, y: any) {
  if (x === y) {
    return true;
  }
  else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
    if (Object.keys(x).length != Object.keys(y).length)
      return false;

    for (var prop in x) {
      if (y.hasOwnProperty(prop))
      {  
        if (! deepEqual(x[prop], y[prop]))
          return false;
      }
      else
        return false;
    }
    
    return true;
  }
  else 
    return false;
}

// const 

export function ExchangeProviders({ children }: ProvidersProps) {
  const ethUsdRate = useGetEthUsdRate();
  const [sql, setSql] = useReducer((state: Record<string, any>[] | undefined, action: Record<string, any>[]) => {
    console.log(deepEqual(state, action), state, action);
    return deepEqual(state, action) ? state : action;
    
    // if (!deepEqual(state, action)) {
    //   console.log('not deep equal', res, sql)
    //   setSql(res);
    // }
  }, undefined);
  // const [sql, setSql] = React.useState<Record<string, any> | undefined>(undefined);

  async function getTable() {
    try {
      console.log("GET ALL PROJECT RESPONSE FULL SQL TABLE", sql);
      setSql(await getAllProjects());
      // const res = await getAllProjects();
      // console.log("GET ALL PROJECT RESPONSE FULL SQL TABLE", res);
      // if (!deepEqual(res, sql)) {
      //   console.log('not deep equal', res, sql)
      //   setSql(res);
      // }
    } catch (e) {
      console.error("FULL SQL TABLE", e);
    }
  };

  React.useEffect(() => {
    getTable();
    setInterval(() => getTable(), 10_000);
  }, []);

  console.log("FULL SQL TABLE", Date.now(), sql);

  return (
    <ExchangeContext.Provider value={ethUsdRate}>
      <SQLContext.Provider value={[sql, () => getTable()]}>
        {children}
      </SQLContext.Provider>
    </ExchangeContext.Provider>
  );
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <NextUIProvider navigate={router.push}>
            <ExchangeProviders>
              <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
            </ExchangeProviders>
          </NextUIProvider>
        </WagmiProvider>
      </QueryClientProvider>
  );
}
