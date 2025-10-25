import React, { useState, useEffect } from 'react';
import logService from '../services/logService';

/**
 * Componente de Debug - Visualizador de Logs
 * Adicionar em App.tsx com CTRL+L para abrir/fechar
 */
export const LogViewer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    // CTRL+L para abrir/fechar
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        if (!isOpen) {
          refreshLogs();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  const refreshLogs = () => {
    setLogs(logService.getLogs());
  };

  const filteredLogs = filter === 'ALL' 
    ? logs 
    : logs.filter(log => log.action === filter);

  const downloadLogs = () => {
    const dataStr = logService.exportLogs();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `logs-${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!isOpen) return null;

  const actions = ['ALL', ...new Set(logs.map(log => log.action))];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '500px',
      height: '100vh',
      backgroundColor: '#1e1e1e',
      color: '#d4d4d4',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.5)',
      fontFamily: 'monospace'
    }}>
      {/* Header */}
      <div style={{
        padding: '15px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0 }}>📊 Log Viewer</h3>
        <div>
          <button onClick={refreshLogs} style={buttonStyle}>🔄</button>
          <button onClick={downloadLogs} style={buttonStyle}>💾</button>
          <button onClick={() => logService.clearLogs()} style={buttonStyle}>🗑️</button>
          <button onClick={() => setIsOpen(false)} style={buttonStyle}>✖️</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        padding: '10px 15px',
        backgroundColor: '#252525',
        fontSize: '12px',
        display: 'flex',
        gap: '15px'
      }}>
        <span>Total: {logs.length}</span>
        <span>Filtered: {filteredLogs.length}</span>
        <span>Session: {logService.getSessionLogs().length}</span>
      </div>

      {/* Filter */}
      <div style={{ padding: '10px 15px', borderBottom: '1px solid #333' }}>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{
            width: '100%',
            padding: '5px',
            backgroundColor: '#333',
            color: '#d4d4d4',
            border: '1px solid #555',
            borderRadius: '3px'
          }}
        >
          {actions.map(action => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      </div>

      {/* Logs */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '10px'
      }}>
        {filteredLogs.slice().reverse().map((log, idx) => (
          <div key={idx} style={{
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#252525',
            borderRadius: '5px',
            fontSize: '11px',
            borderLeft: `3px solid ${getColorForAction(log.action)}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong style={{ color: getColorForAction(log.action) }}>
                {log.action}
              </strong>
              <span style={{ color: '#888' }}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div style={{ color: '#aaa', marginBottom: '3px' }}>
              📍 {log.page}
            </div>
            {log.userId && (
              <div style={{ color: '#aaa', marginBottom: '3px' }}>
                👤 {log.userId}
              </div>
            )}
            {log.details && (
              <details style={{ marginTop: '5px' }}>
                <summary style={{ cursor: 'pointer', color: '#888' }}>Details</summary>
                <pre style={{ 
                  marginTop: '5px', 
                  padding: '5px',
                  backgroundColor: '#1e1e1e',
                  borderRadius: '3px',
                  fontSize: '10px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  marginLeft: '5px',
  padding: '5px 10px',
  backgroundColor: '#333',
  color: '#d4d4d4',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer'
};

const getColorForAction = (action: string): string => {
  const colorMap: Record<string, string> = {
    'PAGE_VIEW': '#4CAF50',
    'CLICK': '#2196F3',
    'LOGIN': '#9C27B0',
    'LOGOUT': '#FF9800',
    'REGISTER': '#00BCD4',
    'WORKOUT_CREATE': '#8BC34A',
    'WORKOUT_START': '#FFEB3B',
    'WORKOUT_COMPLETE': '#4CAF50',
    'EXERCISE_SELECT': '#03A9F4',
    'SEARCH': '#FFC107',
    'ERROR': '#F44336',
    'API_CALL': '#673AB7',
    'SESSION_END': '#9E9E9E'
  };
  return colorMap[action] || '#888';
};

export default LogViewer;
