import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Part, Connection } from '@/lib/types';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export class GeminiAIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  /**
   * Generate prototyping process suggestions based on parts and connections
   */
  async generateProcessSuggestions(parts: Part[], connections: Connection[]): Promise<string> {
    const prompt = `
      As a prototyping expert, analyze the following prototyping system:
      
      Parts: ${JSON.stringify(parts.map(p => ({ name: p.name, type: p.type, functionality: p.functionality })), null, 2)}
      
      Connections: ${JSON.stringify(connections.map(c => ({ from: c.from, to: c.to, linkType: c.linkType })), null, 2)}
      
      Please provide:
      1. Prototype optimization suggestions
      2. Potential design issues or bottlenecks
      3. Recommended improvements for rapid iteration
      4. Testing and validation checkpoints
      
      Keep the response concise and actionable for prototyping workflows.
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
      Based on the following existing prototyping parts:
      ${JSON.stringify(existingParts.map(p => ({ name: p.name, type: p.type, functionality: p.functionality })), null, 2)}
      
      ${context ? `Additional context: ${context}` : ''}
      
      Suggest additional parts that would complement this prototyping system. Include:
      1. Part name and type
      2. How it integrates with existing parts
      3. Benefits it would provide for rapid prototyping
      4. Estimated cost impact (low/medium/high)
      
      Focus on practical, commonly used prototyping components and rapid iteration tools.
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
   * Analyze prototyping workflow efficiency
   */
  async analyzeWorkflowEfficiency(parts: Part[], connections: Connection[]): Promise<string> {
    const prompt = `
      Analyze the efficiency of this prototyping workflow:
      
      Parts: ${JSON.stringify(parts.map(p => ({ name: p.name, type: p.type, x: p.x, y: p.y })), null, 2)}
      
      Connections: ${JSON.stringify(connections, null, 2)}
      
      Provide analysis on:
      1. Prototyping efficiency score (1-10)
      2. Design flow optimization
      3. Potential rapid iteration opportunities
      4. Resource utilization improvements
      5. Lean prototyping principles application
      
      Be specific and provide actionable insights for faster prototyping cycles.
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
   * Generate troubleshooting suggestions for prototyping issues
   */
  async generateTroubleshootingSuggestions(issue: string, relevantParts: Part[]): Promise<string> {
    const prompt = `
      Prototyping Issue: ${issue}
      
      Relevant Parts: ${JSON.stringify(relevantParts.map(p => ({ name: p.name, type: p.type, functionality: p.functionality })), null, 2)}
      
      Provide troubleshooting suggestions including:
      1. Possible root causes in the prototype design
      2. Step-by-step diagnostic procedures
      3. Quick fixes and workarounds for rapid iteration
      4. When to redesign vs. patch the prototype
      
      Focus on practical, fast solutions that maintain prototyping velocity.
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
   * Generate general prototyping advice
   */
  async generatePrototypingAdvice(query: string, context?: { parts: Part[], connections: Connection[] }): Promise<string> {
    const contextInfo = context ? `
      Current System Context:
      Parts: ${JSON.stringify(context.parts.map(p => ({ name: p.name, type: p.type })), null, 2)}
      Connections: ${JSON.stringify(context.connections.map(c => ({ from: c.from, to: c.to, linkType: c.linkType })), null, 2)}
    ` : '';

    const prompt = `
      Prototyping Query: ${query}
      
      ${contextInfo}
      
      As a prototyping expert, provide helpful, accurate, and practical advice. 
      Focus on rapid iteration best practices, design thinking principles, and cost-effective prototyping solutions.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating prototyping advice:', error);
      throw new Error('Failed to generate prototyping advice');
    }
  }
}

// Export a singleton instance
export const geminiAI = new GeminiAIService();