# dataDesign - AI-Powered System Design Canvas

An intelligent, interactive system architecture and data flow visualization tool built with Next.js and React Flow. dataDesign combines visual design capabilities with AI-powered assistance to streamline system design and architecture planning.

## ✨ Key Features

### 🎯 Core Functionality
- **Interactive System Diagrams**: Visual representation of system components and data flows using React Flow
- **Component Library**: Comprehensive library of system components categorized by type (databases, APIs/services, message systems, data processing)
- **Architecture Documentation**: Export detailed markdown documentation of your system architecture
- **Real-time Editing**: Add, edit, and delete components with live updates and instant visual feedback
- **Data Flow Management**: Define relationships between components with simplified connection types
- **Export/Import**: Save and load system designs in JSON format for easy sharing and backup

### 🤖 AI-Powered Features
- **AI Architecture Generation**: Generate complete system architectures from natural language descriptions
- **Smart Suggestions**: Get AI-powered recommendations for additional components and optimizations
- **Architecture Analysis**: Analyze system design for scalability, reliability, and performance
- **Troubleshooting Assistant**: Get help diagnosing and solving architectural issues
- **Interactive Chat**: Conversational AI interface for architecture guidance and technical support
- **Design Editing**: Modify existing architectures using natural language commands

### 🎨 User Experience
- **Modern UI**: Clean, responsive interface built with Tailwind CSS and Radix UI
- **Drag & Drop**: Intuitive component placement and data flow creation
- **Sample Projects**: Pre-loaded e-commerce microservices architecture demonstrating system capabilities
- **Mobile Responsive**: Works seamlessly across desktop, tablet, and mobile devices
- **Dark/Light Mode**: Theme support for comfortable usage in any environment

## 🛠 Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4.1.9 with custom animations
- **Flow Visualization**: @xyflow/react for interactive node-based diagrams
- **AI Integration**: Google Gemini AI (Gemini 2.5 Pro) for intelligent features
- **UI Components**: Radix UI primitives with custom styling
- **Form Handling**: React Hook Form with Zod validation
- **Markdown**: React Markdown with syntax highlighting
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Mono

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, pnpm, or yarn package manager
- Google Gemini API key (for AI features)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/obhox/dataDesign.git
  cd dataDesign
  ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   To get a Gemini API key:
   - Visit [Google AI Studio](https://aistudio.google.com)
   - Create a new API key
   - Copy the key to your `.env.local` file

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 Usage

### Getting Started

1. **Load Sample Data**: Click "Load Sample" to see a pre-configured e-commerce microservices architecture
2. **Explore AI Features**: Use the AI chat interface to generate new system designs or get suggestions
3. **Add Components**: Use the component library on the right to drag and drop new services, databases, etc.
4. **Create Data Flows**: Select components and use the connection tools to link them
5. **Edit Properties**: Click on any component to edit its technology stack, capacity, and specifications
6. **Export Architecture**: Save your work using JSON export or generate documentation

### AI-Powered Architecture Generation

dataDesign's AI capabilities allow you to design systems using natural language:

- **Generate New Architectures**: Type "Generate a microservices architecture for an e-commerce platform" or "Create a data pipeline for analytics"
- **Modify Existing Designs**: Say "Add a Redis cache layer" or "Replace PostgreSQL with MongoDB"
- **Get Suggestions**: Ask "What components would improve scalability?" or "How can I optimize this architecture?"
- **Troubleshoot Issues**: Request help with "This service is a bottleneck" or "How do I improve reliability?"

### Component Categories

- **Databases**: PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch, DynamoDB, etc.
- **APIs & Services**: REST APIs, GraphQL, gRPC, Microservices, Lambda functions, WebSockets, etc.
- **Message Systems**: RabbitMQ, Kafka, SQS, Pub/Sub, Event buses, Kinesis, etc.
- **Data Processing**: ETL pipelines, Stream processors, Data lakes, Analytics engines, CDC, etc.

### Connection Types

- **Data Flow**: Synchronous data transfer between services
- **Async Flow**: Asynchronous or event-driven communication
- **Dependency**: Service dependencies
- **Custom**: User-defined connection types for specific protocols

## 🤖 Sample Project: E-Commerce Microservices Architecture

The included sample project demonstrates a scalable e-commerce system with:

- **Frontend Layer**: React web application
- **API Gateway**: Kong gateway for routing and rate limiting
- **Microservices**: User Service (Node.js), Product Service (Python FastAPI), Order Service (Java Spring Boot)
- **Databases**: PostgreSQL for users/orders, MongoDB for products
- **Caching**: Redis for session management and frequently accessed data
- **Event Streaming**: Kafka for order events and inventory updates
- **Data Flows**: Synchronous API calls, asynchronous event-driven communication, service dependencies

Total system: 10 components with defined capacity and SLA specifications.

## 📁 Project Structure

```
dataDesign/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── ai/           # AI integration endpoints
│   │       └── chat/     # AI chat API
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/           # React components
│   ├── ui/              # Reusable UI components (Radix UI)
│   ├── ai-chat.tsx      # AI chat interface
│   ├── ai-suggestions-panel.tsx # AI suggestions
│   ├── canvas.tsx       # Main flow canvas
│   ├── component-library.tsx # Component library
│   ├── custom-node.tsx  # Custom flow nodes
│   ├── custom-edge.tsx  # Custom flow edges
│   ├── part-editor.tsx  # Component property editor
│   ├── prototyping-mind-map.tsx # Main mind map
│   ├── simple-chat-bar.tsx # Simple AI chat
│   └── toolbar.tsx      # Main toolbar
├── lib/                 # Utilities and configuration
│   ├── ai/             # AI integration
│   │   └── gemini.ts   # Google Gemini AI service
│   ├── constants.ts    # Component definitions and sample data
│   ├── types.ts        # TypeScript type definitions
│   └── utils.ts        # Utility functions
├── hooks/              # Custom React hooks
├── styles/             # Additional styles
├── public/             # Static assets
└── README.md           # Project documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Customization

### Adding New Components

1. Edit `lib/constants.ts` to add new component types to `COMPONENT_CATEGORIES`
2. Update the component library with your new system components
3. Components support custom colors, icons, and technology specifications

### Modifying Sample Data

Update the `SAMPLE_DATA` object in `lib/constants.ts` to create your own sample architectures with custom components and data flows.

### Extending AI Capabilities

The AI service in `lib/ai/gemini.ts` can be extended with new methods:
- Add new prompt templates for specific use cases
- Implement custom design generation logic
- Create specialized analysis functions

### Styling

The project uses Tailwind CSS with custom component styling. Modify `app/globals.css` for global styles or individual component files for specific styling.

## 🤝 Contributing

We welcome contributions to dataDesign! Here's how you can help:

### Ways to Contribute

- 🐛 **Bug Reports**: Report issues via GitHub Issues
- 💡 **Feature Requests**: Suggest new features or improvements
- 🔧 **Code Contributions**: Submit pull requests for bug fixes or new features
- 📖 **Documentation**: Improve documentation and examples
- 🧪 **Testing**: Help test new features and report feedback

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/obhox/flow.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Install dependencies: `npm install`
5. Set up environment variables (see Installation section)
6. Make your changes
7. Test your changes: `npm run dev`
8. Commit your changes: `git commit -m 'Add amazing feature'`
9. Push to the branch: `git push origin feature/amazing-feature`
10. Open a Pull Request

### Code Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add comments for complex logic
- Update documentation when needed
- Test your changes thoroughly

### Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Update the README.md if needed
3. Make sure all tests pass
4. Request review from maintainers
5. Address any feedback promptly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

## 🙏 Acknowledgments

- **[React Flow](https://reactflow.dev)** - For the excellent flow diagram library
- **[Radix UI](https://radix-ui.com)** - For accessible UI components
- **[Tailwind CSS](https://tailwindcss.com)** - For utility-first CSS framework
- **[Google Gemini AI](https://ai.google.dev)** - For powerful AI capabilities
- **[Lucide](https://lucide.dev)** - For beautiful icons
- **[Next.js](https://nextjs.org)** - For the amazing React framework
- **[Vercel](https://vercel.com)** - For hosting and analytics

## 📞 Support & Community

- 🐛 **Issues**: [GitHub Issues](https://github.com/obhox/dataDesign/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/obhox/dataDesign/discussions)
- 📧 **Email**: hello@obhoxsystems.com
- 🐦 **Twitter**: [@obhoxsys](https://twitter.com/obhoxsys)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

dataDesign can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- AWS
- Google Cloud Platform

---

**dataDesign** - Streamlining system design and architecture planning with AI-powered intelligence.

Made with ❤️ by Joy Oguntona
