import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Part, Connection } from '@/lib/types';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export class GeminiAIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  /**
   * Generate manufacturing process suggestions based on parts and connections
   */
  async generateProcessSuggestions(parts: Part[], connections: Connection[]): Promise<string> {
    const prompt = `
      As a manufacturing expert, analyze the following manufacturing system:
      
      Parts: ${JSON.stringify(parts.map(p => ({ name: p.name, type: p.type, functionality: p.functionality })), null, 2)}
      
      Connections: ${JSON.stringify(connections.map(c => ({ from: c.from, to: c.to, linkType: c.linkType })), null, 2)}
      
      Please provide:
      1. Process optimization suggestions
      2. Potential bottlenecks or issues
      3. Recommended improvements
      4. Quality control checkpoints
      
      Keep the response concise and actionable.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating process suggestions:', error);
      throw new Error('Failed to generate process suggestions');
    }
  }

  /**
   * Generate part recommendations based on existing parts
   */
  async generatePartRecommendations(existingParts: Part[], context?: string): Promise<string> {
    const prompt = `
      Based on the following existing manufacturing parts:
      ${JSON.stringify(existingParts.map(p => ({ name: p.name, type: p.type, functionality: p.functionality })), null, 2)}
      
      ${context ? `Additional context: ${context}` : ''}
      
      Suggest additional parts that would complement this manufacturing system. Include:
      1. Part name and type
      2. How it integrates with existing parts
      3. Benefits it would provide
      4. Estimated cost impact (low/medium/high)
      
      Focus on practical, commonly used manufacturing components.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating part recommendations:', error);
      throw new Error('Failed to generate part recommendations');
    }
  }

  /**
   * Analyze manufacturing workflow efficiency
   */
  async analyzeWorkflowEfficiency(parts: Part[], connections: Connection[]): Promise<string> {
    const prompt = `
      Analyze the efficiency of this manufacturing workflow:
      
      Parts: ${JSON.stringify(parts.map(p => ({ name: p.name, type: p.type, x: p.x, y: p.y })), null, 2)}
      
      Connections: ${JSON.stringify(connections, null, 2)}
      
      Provide analysis on:
      1. Workflow efficiency score (1-10)
      2. Material flow optimization
      3. Potential automation opportunities
      4. Resource utilization improvements
      5. Lean manufacturing principles application
      
      Be specific and provide actionable insights.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error analyzing workflow efficiency:', error);
      throw new Error('Failed to analyze workflow efficiency');
    }
  }

  /**
   * Generate troubleshooting suggestions for manufacturing issues
   */
  async generateTroubleshootingSuggestions(issue: string, relevantParts: Part[]): Promise<string> {
    const prompt = `
      Manufacturing Issue: ${issue}
      
      Relevant Parts: ${JSON.stringify(relevantParts.map(p => ({ name: p.name, type: p.type, functionality: p.functionality })), null, 2)}
      
      Provide troubleshooting suggestions including:
      1. Possible root causes
      2. Step-by-step diagnostic procedures
      3. Preventive measures
      4. When to escalate to specialists
      
      Focus on practical, safety-first approaches.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating troubleshooting suggestions:', error);
      throw new Error('Failed to generate troubleshooting suggestions');
    }
  }

  /**
   * Generate general manufacturing advice
   */
  async generateManufacturingAdvice(query: string, context?: { parts: Part[], connections: Connection[] }): Promise<string> {
    const contextInfo = context ? `
      Current System Context:
      Parts: ${JSON.stringify(context.parts.map(p => ({ name: p.name, type: p.type })), null, 2)}
      Connections: ${JSON.stringify(context.connections.map(c => ({ from: c.from, to: c.to, linkType: c.linkType })), null, 2)}
    ` : '';

    const prompt = `
      Manufacturing Query: ${query}
      
      ${contextInfo}
      
      As a manufacturing expert, provide helpful, accurate, and practical advice. 
      Focus on industry best practices, safety considerations, and cost-effective solutions.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating manufacturing advice:', error);
      throw new Error('Failed to generate manufacturing advice');
    }
  }
}

// Export a singleton instance
export const geminiAI = new GeminiAIService();