import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Part, Connection } from '@/lib/types';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export class GeminiAIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

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
   * Get color based on part type for visual variety
   */
  private getPartColor(type: string): string {
    const colorMap: { [key: string]: string } = {
      'Sensor': '#10B981',      // Green
      'Controller': '#3B82F6',  // Blue
      'Display': '#8B5CF6',     // Purple
      'Power': '#F59E0B',       // Amber
      'Actuator': '#EF4444',    // Red
      'Mechanical': '#6B7280',  // Gray
      'Communication': '#06B6D4', // Cyan
      'Storage': '#84CC16',     // Lime
      'Interface': '#F97316',   // Orange
      'Processing': '#EC4899'   // Pink
    };
    
    return colorMap[type] || '#3B82F6'; // Default to blue
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
   * Generate a complete design based on user requirements
   */
  async generateDesign(requirements: string, designType?: string): Promise<{ parts: Partial<Part>[], connections: Partial<Connection>[], description: string }> {
    const prompt = `
      You are a prototyping design assistant. Your task is to generate a complete design based on the requirements.
      
      Design Requirements: ${requirements}
      Design Type: ${designType || 'general prototype'}
      
      CRITICAL: You MUST respond with ONLY a valid JSON object. No explanations, no markdown, no code blocks, no additional text - JUST JSON.
      
      Generate a complete prototyping design that includes:
      
      1. A list of parts with the following structure for each part:
         - name: descriptive name
         - type: category (e.g., "Sensor", "Actuator", "Controller", "Display", "Power", "Mechanical")
         - functionality: what this part does in the design
         - cost: estimated cost as a number
         - costUnit: "USD" or other currency
         - quantity: number of units needed
         - customColor: hex color code based on part type (Sensor: "#10B981", Controller: "#3B82F6", Display: "#8B5CF6", Power: "#F59E0B", Actuator: "#EF4444", Mechanical: "#6B7280")
         - x: x-coordinate for positioning (between 100-800)
         - y: y-coordinate for positioning (between 100-600)
      
      2. A list of connections between parts with these EXACT linkType options:
         AVAILABLE LINK TYPES (use these exact values):
         - "assembly": Physical assembly connection (color: "#3b82f6", strokeWidth: 2, dashArray: "")
         - "power": Electrical power connection (color: "#eab308", strokeWidth: 3, dashArray: "")
         - "data": Data/signal flow connection (color: "#8b5cf6", strokeWidth: 2, dashArray: "5,5")
         - "material": Material flow connection (color: "#10b981", strokeWidth: 2, dashArray: "")
         - "dependency": Dependency relationship (color: "#ef4444", strokeWidth: 2, dashArray: "10,5")
         - "sequence": Sequential order connection (color: "#06b6d4", strokeWidth: 2, dashArray: "")
         
         Each connection must have:
         - from: index of source part (0-based array index)
         - to: index of target part (0-based array index)
         - linkType: one of the exact values above
         - color: exact hex color for the linkType
         - strokeWidth: exact stroke width for the linkType
         - dashArray: exact dash array for the linkType
       
       3. A description explaining the design concept and how it works
       
       RESPOND WITH ONLY THIS JSON FORMAT - NO OTHER TEXT:
       {
         "parts": [
            {
              "name": "Arduino Uno Controller",
              "type": "Controller",
              "functionality": "Main microcontroller for system control",
              "cost": 25.99,
              "costUnit": "USD",
              "quantity": 1,
              "customColor": "#3B82F6",
              "x": 200,
              "y": 150
            },
            {
              "name": "Temperature Sensor",
              "type": "Sensor",
              "functionality": "Measures ambient temperature",
              "cost": 12.50,
              "costUnit": "USD",
              "quantity": 1,
              "customColor": "#10B981",
              "x": 400,
              "y": 150
            }
          ],
         "connections": [
            {
              "from": 0,
              "to": 1,
              "linkType": "data",
              "color": "#8b5cf6",
              "strokeWidth": 2,
              "dashArray": "5,5"
            }
          ],
         "description": "A simple temperature monitoring system with Arduino controller and sensor"
       }
       
       REQUIREMENTS: 
        - Use 0-based indices for connections (first part is index 0, second is index 1, etc.)
        - Ensure every connection references valid part indices
        - Use ONLY the exact linkType values provided above
        - Use the exact color, strokeWidth, and dashArray for each linkType
        - Create meaningful connections that make logical sense:
          * "assembly" for physical mounting/attachment
          * "power" for electrical power supply
          * "data" for control signals and sensor data
          * "material" for fluid/material flow
          * "dependency" for functional dependencies
          * "sequence" for ordered operations
        - Position parts logically with adequate spacing (minimum 150px apart)
        - Use appropriate colors for each part type
        - OUTPUT ONLY JSON - NO MARKDOWN, NO EXPLANATIONS, NO CODE BLOCKS
     `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response text to ensure it's pure JSON
      let cleanedText = text.trim();
      
      // Remove any markdown code blocks if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Remove any leading/trailing whitespace or newlines
      cleanedText = cleanedText.trim();
      
      // Ensure the response starts with { and ends with }
      if (!cleanedText.startsWith('{') || !cleanedText.endsWith('}')) {
        throw new Error('AI response is not valid JSON format');
      }

      const designData = JSON.parse(cleanedText);
      
      if (!designData.parts || !Array.isArray(designData.parts)) {
        throw new Error('Invalid design data: parts array is missing');
      }
      
      if (!designData.connections || !Array.isArray(designData.connections)) {
        throw new Error('Invalid design data: connections array is missing');
      }

      // Add 1-based IDs to parts
      const partsWithIds = designData.parts.map((part: any, index: number) => ({
        ...part,
        id: index + 1,
        customColor: part.customColor || this.getPartColor(part.type),
        imageUrl: '',
        sourceUrl: part.sourceUrl || ''
      }));

      // Process connections to use actual part IDs
      const connectionsWithIds = designData.connections.map((connection: any, index: number) => {
        // Validate connection indices
        if (connection.from < 0 || connection.from >= partsWithIds.length ||
            connection.to < 0 || connection.to >= partsWithIds.length) {
          throw new Error(`Invalid connection indices: from=${connection.from}, to=${connection.to}, parts count=${partsWithIds.length}`);
        }
        
        return {
          ...connection,
          id: index + 1,
          from: partsWithIds[connection.from].id,
          to: partsWithIds[connection.to].id
        };
      });

      return {
        parts: partsWithIds,
        connections: connectionsWithIds,
        description: designData.description || 'Generated design'
      };
    } catch (error) {
      console.error('Error generating design:', error);
      throw new Error(`Failed to generate design: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Edit an existing design based on modification request
   */
  async editDesign(
    modificationRequest: string, 
    currentParts: Part[], 
    currentConnections: Connection[]
  ): Promise<{ parts: Partial<Part>[], connections: Partial<Connection>[], description: string }> {
    const prompt = `
      You are a prototyping design assistant. Your task is to modify an existing design based on the user's request.
      
      CURRENT DESIGN:
      Parts: ${JSON.stringify(currentParts.map(p => ({ 
        id: p.id, 
        name: p.name, 
        type: p.type, 
        functionality: p.functionality,
        cost: p.cost,
        costUnit: p.costUnit,
        quantity: p.quantity,
        x: p.x,
        y: p.y
      })), null, 2)}
      
      Connections: ${JSON.stringify(currentConnections.map(c => ({ 
        id: c.id,
        from: c.from, 
        to: c.to, 
        linkType: c.linkType,
        color: c.color,
        strokeWidth: c.strokeWidth,
        dashArray: c.dashArray
      })), null, 2)}
      
      MODIFICATION REQUEST: ${modificationRequest}
      
      CRITICAL: You MUST respond with ONLY a valid JSON object. No explanations, no markdown, no code blocks, no additional text - JUST JSON.
      
      Based on the modification request, generate the COMPLETE updated design. This should include:
      
      1. ALL parts (modified, new, and unchanged) with the following structure:
         - id: keep existing IDs for unchanged parts, use new sequential IDs for new parts
         - name: descriptive name
         - type: category (e.g., "Sensor", "Actuator", "Controller", "Display", "Power", "Mechanical")
         - functionality: what this part does in the design
         - cost: estimated cost as a number
         - costUnit: "USD" or other currency
         - quantity: number of units needed
         - customColor: hex color code based on part type (Sensor: "#10B981", Controller: "#3B82F6", Display: "#8B5CF6", Power: "#F59E0B", Actuator: "#EF4444", Mechanical: "#6B7280")
         - x: x-coordinate for positioning (between 100-800)
         - y: y-coordinate for positioning (between 100-600)
      
      2. ALL connections (modified, new, and unchanged) with these EXACT linkType options:
         AVAILABLE LINK TYPES (use these exact values):
         - "assembly": Physical assembly connection (color: "#3b82f6", strokeWidth: 2, dashArray: "")
         - "power": Electrical power connection (color: "#eab308", strokeWidth: 3, dashArray: "")
         - "data": Data/signal flow connection (color: "#8b5cf6", strokeWidth: 2, dashArray: "5,5")
         - "material": Material flow connection (color: "#10b981", strokeWidth: 2, dashArray: "")
         - "dependency": Dependency relationship (color: "#ef4444", strokeWidth: 2, dashArray: "10,5")
         - "sequence": Sequential order connection (color: "#06b6d4", strokeWidth: 2, dashArray: "")
         
         Each connection must have:
         - id: keep existing IDs for unchanged connections, use new sequential IDs for new connections
         - from: ID of source part
         - to: ID of target part
         - linkType: one of the exact values above
         - color: exact hex color for the linkType
         - strokeWidth: exact stroke width for the linkType
         - dashArray: exact dash array for the linkType
       
       3. A description explaining what was changed and how the updated design works
       
       IMPORTANT RULES:
       - If the request is to replace a component, remove the old one and add the new one in a similar position
       - If the request is to add components, keep all existing parts and add new ones
       - If the request is to remove components, exclude them from the output
       - Maintain logical connections - update connection endpoints if parts are replaced
       - Preserve unchanged parts with their original IDs and positions
       - Use appropriate positioning to avoid overlaps
       
       RESPOND WITH ONLY THIS JSON FORMAT - NO OTHER TEXT:
       {
         "parts": [
            {
              "id": 1,
              "name": "Arduino Uno Controller",
              "type": "Controller",
              "functionality": "Main microcontroller for system control",
              "cost": 25.99,
              "costUnit": "USD",
              "quantity": 1,
              "customColor": "#3B82F6",
              "x": 200,
              "y": 150
            }
          ],
         "connections": [
            {
              "id": 1,
              "from": 1,
              "to": 2,
              "linkType": "data",
              "color": "#8b5cf6",
              "strokeWidth": 2,
              "dashArray": "5,5"
            }
          ],
         "description": "Updated design based on modification request"
       }
       
       OUTPUT ONLY JSON - NO MARKDOWN, NO EXPLANATIONS, NO CODE BLOCKS
     `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response text to ensure it's pure JSON
      let cleanedText = text.trim();
      
      // Remove any markdown code blocks if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Remove any leading/trailing whitespace or newlines
      cleanedText = cleanedText.trim();
      
      // Ensure the response starts with { and ends with }
      if (!cleanedText.startsWith('{') || !cleanedText.endsWith('}')) {
        throw new Error('AI response is not valid JSON format');
      }

      const designData = JSON.parse(cleanedText);
      
      if (!designData.parts || !Array.isArray(designData.parts)) {
        throw new Error('Invalid design data: parts array is missing');
      }
      
      if (!designData.connections || !Array.isArray(designData.connections)) {
        throw new Error('Invalid design data: connections array is missing');
      }

      // Ensure parts have proper structure
      const partsWithDefaults = designData.parts.map((part: any) => ({
        ...part,
        customColor: part.customColor || this.getPartColor(part.type),
        imageUrl: '',
        sourceUrl: part.sourceUrl || ''
      }));

      return {
        parts: partsWithDefaults,
        connections: designData.connections,
        description: designData.description || 'Design updated successfully'
      };
    } catch (error) {
      console.error('Error editing design:', error);
      throw new Error(`Failed to edit design: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate general prototyping advice
   */
  async generatePrototypingAdvice(query: string, context?: { parts: Part[], connections: Connection[] }): Promise<string> {
    const contextInfo = context && context.parts.length > 0 ? `
      Current Design Context:
      
      Parts in your design (${context.parts.length} total):
      ${JSON.stringify(context.parts.map(p => ({ 
        name: p.name, 
        type: p.type, 
        functionality: p.functionality,
        cost: p.cost,
        costUnit: p.costUnit,
        quantity: p.quantity
      })), null, 2)}
      
      Connections in your design (${context.connections.length} total):
      ${JSON.stringify(context.connections.map(c => ({ 
        from: c.from, 
        to: c.to, 
        linkType: c.linkType 
      })), null, 2)}
      
      Design Summary:
      - Total parts: ${context.parts.length}
      - Total connections: ${context.connections.length}
      - Part types: ${[...new Set(context.parts.map(p => p.type))].join(', ')}
      - Connection types: ${[...new Set(context.connections.map(c => c.linkType))].join(', ')}
    ` : 'No current design loaded. Providing general prototyping advice.';

    const prompt = `
      User Question: ${query}
      
      ${contextInfo}
      
      As a prototyping expert, provide helpful, accurate, and practical advice based on the user's current design context. 
      
      When responding:
      1. Reference specific parts and connections from their design when relevant
      2. Suggest improvements or optimizations based on their current setup
      3. Provide cost-effective solutions considering their existing components
      4. Focus on rapid iteration best practices and design thinking principles
      5. If they have no design loaded, provide general prototyping guidance
      
      Make your response conversational and directly relevant to their specific design situation.
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