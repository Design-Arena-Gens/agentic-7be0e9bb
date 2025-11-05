import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Sales Agent',
  description: 'Agent to manage sales',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="app-header">
          <div className="container">
            <h1>Sales Agent</h1>
            <nav>
              <a href="#dashboard">Dashboard</a>
              <a href="#leads">Leads</a>
              <a href="#pipeline">Pipeline</a>
              <a href="#playbooks">Playbooks</a>
              <a href="#agent">Agent</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="app-footer">
          <div className="container">? {new Date().getFullYear()} Sales Agent</div>
        </footer>
      </body>
    </html>
  );
}
