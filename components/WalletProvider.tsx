"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { isConnected, requestAccess, getAddress, getNetwork } from "@stellar/freighter-api";

interface WalletContextValue {
  address: string;
  isAvailable: boolean | null;
  networkWarning: string | null;
  connect: () => Promise<void>;
  refresh: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [networkWarning, setNetworkWarning] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await isConnected();
    setIsAvailable(res.isConnected ?? false);
    const addr = await getAddress();
    setAddress(addr?.address ?? "");
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const connect = useCallback(async () => {
    setNetworkWarning(null);
    const access = await requestAccess();
    if (access.error || !access.address) {
      return;
    }
    setAddress(access.address);

    const net = await getNetwork();
    if (net.error) {
      setNetworkWarning("No se pudo verificar la red.");
      return;
    }
    const n = (net.network ?? "").toUpperCase();
    if (n !== "TESTNET") {
      setNetworkWarning(`Red: ${n}. Cambia a TESTNET para anclar.`);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress("");
    setNetworkWarning(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isAvailable,
        networkWarning,
        connect,
        refresh,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
}
