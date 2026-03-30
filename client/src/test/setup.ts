import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Simple Jest shim so we can use `jest.*` APIs in Vitest tests
// without changing the rest of the setup.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).jest = vi;
