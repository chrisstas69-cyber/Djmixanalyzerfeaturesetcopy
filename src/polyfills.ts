// Polyfill for Buffer in browser environment
import { Buffer } from 'buffer';

// Make Buffer available globally for packages that expect it
(window as any).Buffer = Buffer;
(window as any).global = window;
