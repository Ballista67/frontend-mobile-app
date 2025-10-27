import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { collection, doc, getDoc, getFirestore } from '@react-native-firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { AccountType } from '@/constants/utils';

type UserContextType = {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  accountType: AccountType | null;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  accountType: null
});

export function UserProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountType, setAccountType] = useState<"student" | "teacher" | null>(null);

  const db = getFirestore();

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = auth().onAuthStateChanged(async (user) => {

      if (user) {

        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.data();

        setUser(user);
        setLoading(false);

        if (data) setAccountType(data.accountType)

      }

    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, accountType }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}