// src/hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';

export type User = {
  name?: string;
  email: string;
};

const KEY = 'prostore:user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  function login(u: User) {
    setUser(u);
    try { localStorage.setItem(KEY, JSON.stringify(u)); } catch {}
  }

  function logout() {
    setUser(null);
    try { localStorage.removeItem(KEY); } catch {}
  }

  return { user, ready, login, logout };
}
