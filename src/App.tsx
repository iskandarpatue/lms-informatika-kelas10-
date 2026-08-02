import React from 'react';

export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#1e293b',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #334155',
          textAlign: 'center',
          maxWidth: '500px',
        }}
      >
        <h1 style={{ color: '#60a5fa', marginBottom: '10px' }}>
          LMS Informatika SMA Kelas 10
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '20px' }}>
          Sistem Pembelajaran Interaktif Pak Iskandar Patue, S.Pd
        </p>

        <div
          style={{
            backgroundColor: '#065f46',
            color: '#34d399',
            padding: '10px',
            borderRadius: '8px',
            fontWeight: 'bold',
          }}
        >
          🟢 System Status: Active & Ready
        </div>
      </div>
    </div>
  );
}