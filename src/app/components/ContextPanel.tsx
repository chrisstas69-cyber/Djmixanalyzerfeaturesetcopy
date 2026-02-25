import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContextPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: 'dna' | 'constraints' | 'history';
}

export function ContextPanel({ isOpen, onClose, activeTab = 'dna' }: ContextPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-96 h-screen bg-[var(--surface-charcoal)] border-l border-[var(--border-subtle)] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
            <h2 className="text-[var(--text-primary)]">Context</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--surface-panel)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <Tabs.Root defaultValue={activeTab} className="flex-1 flex flex-col">
            <Tabs.List className="flex border-b border-[var(--border-subtle)] px-6">
              <Tabs.Trigger
                value="dna"
                className="px-4 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:border-b-2 data-[state=active]:border-[var(--accent-amber)] transition-colors"
              >
                DNA
              </Tabs.Trigger>
              <Tabs.Trigger
                value="constraints"
                className="px-4 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:border-b-2 data-[state=active]:border-[var(--accent-amber)] transition-colors"
              >
                Constraints
              </Tabs.Trigger>
              <Tabs.Trigger
                value="history"
                className="px-4 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:border-b-2 data-[state=active]:border-[var(--accent-amber)] transition-colors"
              >
                History
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="dna" className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm text-[var(--text-secondary)]">Current Settings</h4>
                <div className="space-y-2">
                  <SettingRow label="Genre" value="Techno" />
                  <SettingRow label="Subgenre" value="Minimal" />
                  <SettingRow label="Energy" value="70" />
                  <SettingRow label="Darkness" value="60" />
                  <SettingRow label="BPM Range" value="126-130" />
                  <SettingRow label="Swing" value="50" />
                  <SettingRow label="Groove Tightness" value="65" />
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="constraints" className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm text-[var(--text-secondary)]">Active Warnings</h4>
                <div className="space-y-3">
                  <ConstraintItem
                    severity="advisory"
                    message="Percussion density is higher than typical for this style."
                    action="Auto-fix"
                  />
                  <ConstraintItem
                    severity="info"
                    message="Low-end energy may conflict with sub bass in club systems."
                    action="Review"
                  />
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="history" className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm text-[var(--text-secondary)]">Version Timeline</h4>
                <div className="space-y-2">
                  <HistoryItem version="C" label="Darker Version" time="2m ago" active />
                  <HistoryItem version="B" label="Reduced Percussion" time="5m ago" />
                  <HistoryItem version="A" label="Original" time="8m ago" />
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded bg-[var(--surface-panel)]">
      <span className="text-sm text-[var(--text-tertiary)]">{label}</span>
      <span className="text-sm text-[var(--text-primary)] font-mono tabular-nums">{value}</span>
    </div>
  );
}

function ConstraintItem({ severity, message, action }: { severity: string; message: string; action: string }) {
  const colors = {
    advisory: 'text-[var(--warning-red)]',
    info: 'text-[var(--accent-amber)]'
  };

  return (
    <div className="p-3 rounded-lg border border-[var(--border-medium)] space-y-2">
      <p className={`text-sm ${colors[severity as keyof typeof colors]}`}>{message}</p>
      <button className="text-xs px-3 py-1 rounded bg-[var(--surface-charcoal)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        {action}
      </button>
    </div>
  );
}

function HistoryItem({ version, label, time, active = false }: { version: string; label: string; time: string; active?: boolean }) {
  return (
    <div className={`p-3 rounded-lg border ${
      active 
        ? 'border-[var(--accent-amber)] bg-[var(--accent-amber)]/5' 
        : 'border-[var(--border-subtle)]'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm ${active ? 'text-[var(--accent-amber)]' : 'text-[var(--text-primary)]'}`}>
          Version {version}
        </span>
        <span className="text-xs text-[var(--text-tertiary)]">{time}</span>
      </div>
      <p className="text-xs text-[var(--text-secondary)]">{label}</p>
    </div>
  );
}
