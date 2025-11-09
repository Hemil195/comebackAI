import dotenv from "dotenv";

dotenv.config();

class ApiKeyManager {
  constructor() {
    // Load all API keys from environment variables
    this.apiKeys = [];
    let keyIndex = 1;
    
    while (process.env[`API_KEY_${keyIndex}`]) {
      const key = process.env[`API_KEY_${keyIndex}`];
      if (key && key !== 'your_second_api_key_here' && key !== 'your_third_api_key_here' && 
          key !== 'your_fourth_api_key_here' && key !== 'your_fifth_api_key_here') {
        this.apiKeys.push({
          key: key,
          index: keyIndex,
          usageCount: 0,
          lastUsed: null
        });
      }
      keyIndex++;
    }
    
    if (this.apiKeys.length === 0) {
      throw new Error("No valid API keys found in environment variables");
    }
    
    this.currentIndex = 0;
    console.log(`✅ Loaded ${this.apiKeys.length} API key(s) for rotation`);
  }
  
  // Get the next API key in round-robin fashion
  getNextKey() {
    if (this.apiKeys.length === 0) {
      throw new Error("No API keys available");
    }
    
    const apiKeyObj = this.apiKeys[this.currentIndex];
    apiKeyObj.usageCount++;
    apiKeyObj.lastUsed = new Date();
    
    // Move to next key for next request
    this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
    
    console.log(`🔑 Using API Key #${apiKeyObj.index} (Used ${apiKeyObj.usageCount} times)`);
    
    return apiKeyObj.key;
  }
  
  // Get statistics about API key usage
  getStats() {
    return this.apiKeys.map(apiKey => ({
      keyIndex: apiKey.index,
      usageCount: apiKey.usageCount,
      lastUsed: apiKey.lastUsed
    }));
  }
  
  // Get total number of available keys
  getKeyCount() {
    return this.apiKeys.length;
  }
}

// Export a singleton instance
export default new ApiKeyManager();
