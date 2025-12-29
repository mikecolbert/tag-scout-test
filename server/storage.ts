// Storage interface - currently not used for SEO Meta Checker
// The application doesn't require persistent storage
// This file is kept as a placeholder for future features

export interface IStorage {
  // Add storage methods here if needed in the future
}

export class MemStorage implements IStorage {
  constructor() {
    // Initialize storage if needed
  }
}

export const storage = new MemStorage();
