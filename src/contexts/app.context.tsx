import React, { createContext, useState } from 'react';
import { ExtendsPurchases } from 'src/@types/purchases.type';
import { User } from 'src/@types/user.type';
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth';

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile: User | null;
  setProfile: React.Dispatch<React.SetStateAction<User | null>>;
  extendsPurchases: ExtendsPurchases[];
  setExtendsPurchases: React.Dispatch<React.SetStateAction<ExtendsPurchases[]>>;
  clearData: () => void;
}

export const getInitContext: () => AppContextInterface = () => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  extendsPurchases: [],
  setExtendsPurchases: () => null,
  clearData: () => null
});

const initialContext: AppContextInterface = getInitContext();

export const AppContext = createContext<AppContextInterface>(initialContext);

export default function AppProvider({
  children,
  defaultContext = initialContext
}: {
  children: React.ReactNode;
  defaultContext?: AppContextInterface;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(defaultContext.isAuthenticated);
  const [profile, setProfile] = useState<User | null>(defaultContext.profile);
  const [extendsPurchases, setExtendsPurchases] = useState<ExtendsPurchases[]>(defaultContext.extendsPurchases);
  const clearData = () => {
    setIsAuthenticated(false);
    setProfile(null);
    setExtendsPurchases([]);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        extendsPurchases,
        setExtendsPurchases,
        clearData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
