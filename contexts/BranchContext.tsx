"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getBranches } from "@/lib/api";

export type Branch = {
  id: string;
  companyId: string;
  name: string;
  address: string;
  phone: string;
};

interface BranchContextType {
  companyId: string;
  branches: Branch[];
  activeBranch: Branch | null;
  activeBranchId: string | null;
  setActiveBranchId: (id: string) => void;
  isLoading: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

// For testing purposes, we default to company "1"
const DEFAULT_COMPANY_ID = "1";

export function BranchProvider({ children }: { children: ReactNode }) {
  const [companyId] = useState(DEFAULT_COMPANY_ID);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const fetchedBranches = await getBranches(companyId);
      setBranches(fetchedBranches);
      if (fetchedBranches.length > 0) {
        // Retrieve last used branch from local storage or set to first branch
        const savedBranchId = localStorage.getItem("activeBranchId");
        if (savedBranchId && fetchedBranches.find((b) => b.id === savedBranchId)) {
          setActiveBranchId(savedBranchId);
        } else {
          setActiveBranchId(fetchedBranches[0].id);
        }
      }
      setIsLoading(false);
    }
    init();
  }, [companyId]);

  useEffect(() => {
    if (activeBranchId) {
      localStorage.setItem("activeBranchId", activeBranchId);
    }
  }, [activeBranchId]);

  const activeBranch = branches.find((b) => b.id === activeBranchId) || null;

  return (
    <BranchContext.Provider value={{ companyId, branches, activeBranch, activeBranchId, setActiveBranchId, isLoading }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider");
  }
  return context;
}
