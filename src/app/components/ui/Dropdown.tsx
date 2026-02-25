import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
  disabled?: boolean;
}

export function Dropdown({ label, value, onValueChange, options, disabled = false }: DropdownProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-[var(--text-secondary)]">{label}</label>
      <Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <Select.Trigger className="flex items-center justify-between w-full px-3 py-2 bg-[var(--surface-charcoal)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] hover:border-[var(--border-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)]/20 transition-all disabled:opacity-50">
          <Select.Value />
          <Select.Icon>
            <ChevronDown className="w-4 h-4" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden bg-[var(--surface-panel)] border border-[var(--border-medium)] rounded-lg shadow-2xl">
            <Select.Viewport className="p-1">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex items-center px-3 py-2 text-sm text-[var(--text-primary)] rounded cursor-pointer outline-none select-none hover:bg-[var(--surface-charcoal)] data-[highlighted]:bg-[var(--surface-charcoal)]"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
