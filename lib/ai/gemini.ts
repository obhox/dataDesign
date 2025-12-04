import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Part, Connection, LinkType } from '@/lib/types';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export class GeminiAIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

  /**
   * Generate system architecture process suggestions based on components and connections
   */
  async generateProcessSuggestions(parts: Part[], connections: Connection[]): Promise<string> {
    const prompt = `
      As a system architecture expert, analyze the following system design:

      Components: ${JSON.stringify(parts.map(p => ({ name: p.name, type: p.type, functionality: p.functionality, technology: p.technology, capacity: p.capacity })), null, 2)}

      Data Flows: ${JSON.stringify(connections.map(c => ({ from: c.from, to: c.to, linkType: c.linkType })), null, 2)}

      Please provide:
      1. Architecture optimization suggestions
      2. Potential scalability bottlenecks or single points of failure
      3. Recommended improvements for reliability and performance
      4. Security and compliance considerations

      Keep the response concise and actionable for production systems.
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
   * Generate component recommendations based on existing components
   */
  async generatePartRecommendations(existingParts: Part[], context?: string): Promise<string> {
    const prompt = `
      Based on the following existing system components:
      ${JSON.stringify(existingParts.map(p => ({ name: p.name, type: p.type, functionality: p.functionality, technology: p.technology })), null, 2)}

      ${context ? `Additional context: ${context}` : ''}

      Suggest additional components that would complement this system architecture. Include:
      1. Component name and type
      2. How it integrates with existing components
      3. Benefits it would provide for scalability, reliability, or performance
      4. Typical capacity/throughput expectations

      Focus on practical, production-ready components and cloud-native patterns.
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
   * Analyze system architecture efficiency
   */
  async analyzeWorkflowEfficiency(parts: Part[], connections: Connection[]): Promise<string> {
    const prompt = `
      Analyze the architecture of this system:

      Components: ${JSON.stringify(parts.map(p => ({ name: p.name, type: p.type, technology: p.technology, capacity: p.capacity, x: p.x, y: p.y })), null, 2)}

      Connections: ${JSON.stringify(connections, null, 2)}

      Provide analysis on:
      1. System design score (1-10) based on scalability, reliability, and maintainability
      2. Data flow optimization opportunities
      3. Potential performance bottlenecks
      4. High availability and disaster recovery considerations
      5. Adherence to cloud architecture best practices

      Be specific and provide actionable insights for production systems.
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
   * Generate troubleshooting suggestions for system architecture issues
   */
  async generateTroubleshootingSuggestions(issue: string, relevantParts: Part[]): Promise<string> {
    const prompt = `
      System Architecture Issue: ${issue}

      Relevant Components: ${JSON.stringify(relevantParts.map(p => ({ name: p.name, type: p.type, functionality: p.functionality, technology: p.technology, capacity: p.capacity })), null, 2)}

      Provide troubleshooting suggestions including:
      1. Possible root causes in the architecture
      2. Step-by-step diagnostic procedures
      3. Quick fixes and workarounds for immediate mitigation
      4. Long-term architectural improvements to prevent recurrence

      Focus on practical, production-ready solutions that maintain system reliability.
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
  async generateDesign(requirements: string, designType?: string): Promise<{ parts: Partial<Part>[], connections: Partial<Connection>[], description: string, customLinkTypes?: LinkType[] }> {
    const prompt = `
      You are a system architecture assistant. Your task is to generate a complete system design based on the requirements.

      Design Requirements: ${requirements}
      Design Type: ${designType || 'general system architecture'}

      CRITICAL: You MUST respond with ONLY a valid JSON object. No explanations, no markdown, no code blocks, no additional text - JUST JSON.

      Generate a complete system architecture that includes:
      
      1. A list of components with the following structure for each:
         - name: descriptive name
         - type: category (e.g., "postgresql", "rest-api", "kafka", "microservice", "redis", "etl-pipeline", "mongodb", "lambda", "api-gateway")
         - functionality: what this component does in the system
         - technology: specific technology used (e.g., "PostgreSQL 15", "Node.js 20", "Kafka 3.4")
         - version: version number (e.g., "v2.1.0")
         - capacity: throughput or storage capacity (e.g., "1000 req/s", "100GB storage")
         - customColor: hex color code based on component type
         - x: x-coordinate for positioning (between 100-1200)
         - y: y-coordinate for positioning (between 100-800)
      
      2. A list of connections between components. You can use predefined link types OR create custom ones:

         PREDEFINED LINK TYPES (recommended for common connections):
         - "data-flow": Synchronous data transfer (color: "#3b82f6", strokeWidth: 2, dashArray: "")
         - "async-flow": Asynchronous/event-driven communication (color: "#8b5cf6", strokeWidth: 2, dashArray: "5,5")
         - "dependency": Service dependency (color: "#ef4444", strokeWidth: 2, dashArray: "10,5")
         
         CUSTOM LINK TYPES (create when needed for specific protocols):
         You can create custom link types for specific protocols:
         - linkType: descriptive name (e.g., "http", "grpc", "websocket", "graphql", "message-queue")
         - color: hex color that represents the protocol
         - strokeWidth: 1-4 (thicker for more important connections)
         - dashArray: "" for solid, "5,5" for dashed, "2,3" for dotted, "10,5" for long dashes
         
         Each connection must have:
         - from: index of source part (0-based array index)
         - to: index of target part (0-based array index)
         - linkType: predefined type OR custom descriptive name
         - color: hex color appropriate for the connection type
         - strokeWidth: appropriate thickness (1-4)
         - dashArray: appropriate dash pattern
       
       3. A description explaining the design concept and how it works
       
       RESPOND WITH ONLY THIS JSON FORMAT - NO OTHER TEXT:
       {
         "parts": [
            {
              "name": "API Gateway",
              "type": "api-gateway",
              "functionality": "Routes requests to microservices",
              "technology": "Kong",
              "version": "v3.0",
              "capacity": "50000 req/s",
              "customColor": "#FF4F00",
              "x": 200,
              "y": 150
            },
            {
              "name": "User Service",
              "type": "microservice",
              "functionality": "Manages user accounts",
              "technology": "Node.js",
              "version": "v1.0.0",
              "capacity": "5000 req/s",
              "customColor": "#FF6B6B",
              "x": 400,
              "y": 150
            }
          ],
         "connections": [
            {
              "from": 0,
              "to": 1,
              "linkType": "data-flow",
              "color": "#3b82f6",
              "strokeWidth": 2,
              "dashArray": ""
            }
          ],
         "description": "A microservices architecture with API gateway routing"
       }
       
       REQUIREMENTS:
        - Use 0-based indices for connections (first component is index 0, second is index 1, etc.)
        - Ensure every connection references valid component indices
        - Use ONLY the exact linkType values provided above
        - Use the exact color, strokeWidth, and dashArray for each linkType
        - Create meaningful connections that make logical sense:
          * "data-flow" for synchronous API calls and database queries
          * "async-flow" for event-driven communication and message queues
          * "dependency" for service dependencies
        - Use system design best practices (separation of concerns, scalability, reliability)
        - Position components logically with adequate spacing (minimum 150px apart)
        - Create meaningful data flows that reflect real-world architectures
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

      const validatedConnections = connectionsWithIds.map((conn: any) => this.validateConnection(conn));
      const customLinkTypes = this.extractCustomLinkTypes(validatedConnections);

      return {
        parts: partsWithIds,
        connections: validatedConnections,
        description: designData.description || 'Generated design',
        customLinkTypes: customLinkTypes.length > 0 ? customLinkTypes : undefined
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
  ): Promise<{ parts: Partial<Part>[], connections: Partial<Connection>[], description: string, customLinkTypes?: LinkType[] }> {
    const prompt = `
      You are a system architecture assistant. Your task is to modify an existing design based on the user's request.

      CURRENT DESIGN:
      Components: ${JSON.stringify(currentParts.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
        functionality: p.functionality,
        technology: p.technology,
        version: p.version,
        capacity: p.capacity,
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

      1. ALL components (modified, new, and unchanged) with the following structure:
         - id: keep existing IDs for unchanged components, use new sequential IDs for new components
         - name: descriptive name
         - type: category (e.g., "postgresql", "rest-api", "kafka", "microservice", "redis", "etl-pipeline")
         - functionality: what this component does in the system
         - technology: specific technology used (e.g., "PostgreSQL 15", "Node.js 20")
         - version: version number (e.g., "v2.1.0")
         - capacity: throughput or storage capacity (e.g., "1000 req/s", "100GB storage")
         - customColor: hex color code based on component type
         - x: x-coordinate for positioning (between 100-1200)
         - y: y-coordinate for positioning (between 100-800)
      
      2. ALL connections (modified, new, and unchanged). You can use predefined link types OR create custom ones:
         
         PREDEFINED LINK TYPES (recommended for common connections):
         - "assembly": Physical assembly connection (color: "#3b82f6", strokeWidth: 2, dashArray: "")
         - "power": Electrical power connection (color: "#eab308", strokeWidth: 3, dashArray: "")
         - "data": Data/signal flow connection (color: "#8b5cf6", strokeWidth: 2, dashArray: "5,5")
         - "material": Material flow connection (color: "#10b981", strokeWidth: 2, dashArray: "")
         - "dependency": Dependency relationship (color: "#ef4444", strokeWidth: 2, dashArray: "10,5")
         - "sequence": Sequential order connection (color: "#06b6d4", strokeWidth: 2, dashArray: "")
         
         CUSTOM LINK TYPES (create when needed for specific protocols):
         You can create custom link types for specific protocols:
         - linkType: descriptive name (e.g., "http", "grpc", "websocket", "graphql", "message-queue")
         - color: hex color that represents the protocol
         - strokeWidth: 1-4 (thicker for more important connections)
         - dashArray: "" for solid, "5,5" for dashed, "2,3" for dotted, "10,5" for long dashes
         
         Each connection must have:
         - id: keep existing IDs for unchanged connections, use new sequential IDs for new connections
         - from: ID of source part
         - to: ID of target part
         - linkType: predefined type OR custom descriptive name
         - color: hex color appropriate for the connection type
         - strokeWidth: appropriate thickness (1-4)
         - dashArray: appropriate dash pattern
       
       3. A description explaining what was changed and how the updated design works
       
       IMPORTANT RULES:
       - If the request is to replace a component, remove the old one and add the new one in a similar position
       - If the request is to add components, keep all existing components and add new ones
       - If the request is to remove components, exclude them from the output
       - Maintain logical data flows - update connection endpoints if components are replaced
       - Preserve unchanged components with their original IDs and positions
       - Use appropriate positioning to avoid overlaps
       - Follow system design best practices and architectural patterns
       
       RESPOND WITH ONLY THIS JSON FORMAT - NO OTHER TEXT:
       {
         "parts": [
            {
              "id": 1,
              "name": "API Gateway",
              "type": "api-gateway",
              "functionality": "Routes requests to microservices",
              "technology": "Kong",
              "version": "v3.0",
              "capacity": "50000 req/s",
              "customColor": "#FF4F00",
              "x": 200,
              "y": 150
            }
          ],
         "connections": [
            {
              "id": 1,
              "from": 1,
              "to": 2,
              "linkType": "data-flow",
              "color": "#3b82f6",
              "strokeWidth": 2,
              "dashArray": ""
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

      const validatedConnections = designData.connections.map((conn: any) => this.validateConnection(conn));
      const customLinkTypes = this.extractCustomLinkTypes(validatedConnections);

      return {
        parts: partsWithDefaults,
        connections: validatedConnections,
        description: designData.description || 'Design updated successfully',
        customLinkTypes: customLinkTypes.length > 0 ? customLinkTypes : undefined
      };
    } catch (error) {
      console.error('Error editing design:', error);
      throw new Error(`Failed to edit design: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate general system architecture advice
   */
  async generatePrototypingAdvice(query: string, context?: { parts: Part[], connections: Connection[] }): Promise<string> {
    const contextInfo = context && context.parts.length > 0 ? `
      Current Design Context:

      Components in your design (${context.parts.length} total):
      ${JSON.stringify(context.parts.map(p => ({
        name: p.name,
        type: p.type,
        functionality: p.functionality,
        technology: p.technology,
        version: p.version,
        capacity: p.capacity
      })), null, 2)}

      Connections in your design (${context.connections.length} total):
      ${JSON.stringify(context.connections.map(c => ({
        from: c.from,
        to: c.to,
        linkType: c.linkType
      })), null, 2)}

      Design Summary:
      - Total components: ${context.parts.length}
      - Total connections: ${context.connections.length}
      - Component types: ${[...new Set(context.parts.map(p => p.type))].join(', ')}
      - Connection types: ${[...new Set(context.connections.map(c => c.linkType))].join(', ')}
    ` : 'No current design loaded. Providing general system architecture advice.';

    const prompt = `
      User Question: ${query}

      ${contextInfo}

      As a system architecture expert, provide helpful, accurate, and practical advice based on the user's current design context.

      When responding:
      1. Reference specific components and connections from their design when relevant
      2. Suggest improvements or optimizations based on their current setup
      3. Provide scalable and reliable solutions considering their existing components
      4. Focus on cloud architecture best practices and modern system design patterns
      5. If they have no design loaded, provide general architecture guidance

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
  /**
   * Validate and sanitize connection data for custom link types
   */
  private validateConnection(connection: any): any {
    // Ensure required fields exist
    if (!connection.linkType || !connection.color) {
      throw new Error('Connection missing required fields: linkType and color are required');
    }

    // Validate color format (hex color)
    if (!/^#[0-9A-Fa-f]{6}$/.test(connection.color)) {
      throw new Error(`Invalid color format: ${connection.color}. Must be a valid hex color (e.g., #3b82f6)`);
    }

    // Validate strokeWidth
    const strokeWidth = connection.strokeWidth || 2;
    if (strokeWidth < 1 || strokeWidth > 4) {
      throw new Error(`Invalid strokeWidth: ${strokeWidth}. Must be between 1 and 4`);
    }

    // Validate dashArray format
    const dashArray = connection.dashArray || '';
    if (dashArray && !/^(\d+,\d+)*\d*$/.test(dashArray)) {
      throw new Error(`Invalid dashArray format: ${dashArray}. Must be empty or comma-separated numbers (e.g., "5,5")`);
    }

    return {
      ...connection,
      strokeWidth,
      dashArray
    };
  }
  /**
   * Extract custom link types from connections that are not in predefined types
   */
  private extractCustomLinkTypes(connections: any[]): LinkType[] {
    const predefinedTypes = new Set(['assembly', 'power', 'data', 'material', 'dependency', 'sequence']);
    const customLinkTypesMap = new Map<string, LinkType>();

    connections.forEach((conn: any) => {
      if (!predefinedTypes.has(conn.linkType)) {
        const linkTypeId = `custom-${conn.linkType.toLowerCase().replace(/\s+/g, '-')}`;
        if (!customLinkTypesMap.has(linkTypeId)) {
          customLinkTypesMap.set(linkTypeId, {
            id: linkTypeId,
            name: conn.linkType,
            color: conn.color,
            strokeWidth: conn.strokeWidth || 2,
            dashArray: conn.dashArray || '',
            description: `Custom ${conn.linkType} connection`
          });
        }
      }
    });

    return Array.from(customLinkTypesMap.values());
  }
}

// Export a singleton instance
export const geminiAI = new GeminiAIService();