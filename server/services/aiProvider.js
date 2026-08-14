/**
 * AI Provider Abstraction Layer
 * Allows switching between Groq, IBM Granite, or other providers
 * without changing application logic.
 */

const Groq = require("groq-sdk");

class GroqProvider {
  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GROQ_API_KEY is not configured. Please add it to your server/.env file."
      );
    }
    this.client = new Groq({ apiKey });
    this.model = process.env.GROQ_MODEL || "llama3-8b-8192";
  }

  async chat(messages, options = {}) {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2048,
      stream: false,
    });
    return completion.choices[0]?.message?.content || "";
  }
}

/**
 * IBM Granite Provider (Future Integration)
 * Implement this class when IBM Cloud / Granite credentials are available.
 */
class GraniteProvider {
  constructor() {
    this.apiKey = process.env.IBM_API_KEY;
    this.projectId = process.env.IBM_PROJECT_ID;
    this.model = process.env.IBM_MODEL || "ibm/granite-13b-instruct-v2";
    this.endpoint = process.env.IBM_ENDPOINT || "https://us-south.ml.cloud.ibm.com";
  }

  async chat(messages, options = {}) {
    // IBM Granite integration placeholder
    // Replace with actual IBM watsonx.ai SDK call when credentials are available
    throw new Error(
      "IBM Granite provider not yet configured. Set IBM_API_KEY, IBM_PROJECT_ID in .env"
    );
  }
}

/**
 * Returns the configured AI provider instance.
 * Set AI_PROVIDER=groq (default) or AI_PROVIDER=granite in .env
 */
function getAIProvider() {
  const provider = process.env.AI_PROVIDER || "groq";
  switch (provider.toLowerCase()) {
    case "granite":
      return new GraniteProvider();
    case "groq":
    default:
      return new GroqProvider();
  }
}

module.exports = { getAIProvider, GroqProvider, GraniteProvider };
