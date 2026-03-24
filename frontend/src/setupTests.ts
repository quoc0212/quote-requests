import '@testing-library/jest-dom';

// Suppress "not wrapped in act" warnings from async state updates in tests
Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
