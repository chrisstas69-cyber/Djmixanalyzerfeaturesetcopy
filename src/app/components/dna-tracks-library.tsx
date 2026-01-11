"use client";

import { Upload } from "lucide-react";

export default function DNATracks() {
  const handleUpload = () => {
    // TODO: Implement file upload logic
    console.log("Upload files clicked");
  };

  return (
    <div style={{ 
      flex: 1, 
      padding: '40px', 
      overflowY: 'auto',
      background: '#080808'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 600, 
          marginBottom: '8px',
          color: '#fff',
          fontFamily: 'Rajdhani, sans-serif',
        }}>
          Audio Library
        </h1>
        <p style={{ 
          color: '#888', 
          marginBottom: '32px',
          fontSize: '14px',
        }}>
          Upload tracks to analyze their DNA
        </p>

        {/* Upload Area */}
        <div style={{
          border: '2px dashed rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '60px',
          textAlign: 'center',
          background: '#0a0a0a',
          marginBottom: '40px',
          transition: 'all 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0,188,212,0.3)';
          e.currentTarget.style.background = '#0d0d0d';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.background = '#0a0a0a';
        }}
        onClick={handleUpload}
        >
          <Upload style={{ 
            width: '48px', 
            height: '48px', 
            margin: '0 auto 16px',
            color: '#555',
          }} />
          <h3 style={{ 
            color: '#fff', 
            marginBottom: '8px',
            fontSize: '18px',
            fontWeight: 600,
          }}>
            No audio files
          </h3>
          <p style={{ 
            color: '#888', 
            marginBottom: '24px',
            fontSize: '14px',
          }}>
            Upload audio files to see them here
          </p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleUpload();
            }}
            style={{
              background: '#00bcd4',
              color: '#000',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 0 20px rgba(0,188,212,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#00a5b8';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0,188,212,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#00bcd4';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,188,212,0.3)';
            }}
          >
            Upload Files
          </button>
        </div>
      </div>
    </div>
  );
}

