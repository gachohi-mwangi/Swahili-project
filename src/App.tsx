/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppShell from './components/layout/AppShell';
import Scenarios from './pages/Scenarios';
import Soundboard from './pages/Soundboard';
import Saved from './pages/Saved';
import Chat from './pages/Chat';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Scenarios />} />
            <Route path="/soundboard" element={<Soundboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/saved" element={<Saved />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AuthProvider>
  );
}
