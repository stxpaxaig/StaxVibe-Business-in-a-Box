import { createContext, useContext, useState, type ReactNode } from "react";

export interface PaymentProduct {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface PaymentContextValue {
  product: PaymentProduct | null;
  openModal: (product: PaymentProduct) => void;
  closeModal: () => void;
}

const PaymentContext = createContext<PaymentContextValue | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<PaymentProduct | null>(null);

  return (
    <PaymentContext.Provider
      value={{
        product,
        openModal: setProduct,
        closeModal: () => setProduct(null),
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment(): PaymentContextValue {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error("usePayment must be used inside PaymentProvider");
  return ctx;
}
