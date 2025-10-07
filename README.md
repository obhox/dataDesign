# Flow by Obhox Systems

An interactive prototyping component visualization and BOM (Bill of Materials) management tool built with Next.js and React Flow.

## 🚀 Features

- **Interactive Mind Map**: Visual representation of prototyping components and their relationships
- **Component Library**: Comprehensive library of prototyping components categorized by type (mechanical, electrical, control, hydraulic)
- **BOM Management**: Track costs, quantities, and specifications for each component
- **Real-time Editing**: Add, edit, and delete components with live updates
- **Connection Management**: Define relationships between components with different link types
- **Sample Projects**: Pre-loaded robotics project demonstrating system capabilities
- **Export/Import**: Save and load project configurations in JSON format
- **Responsive Design**: Modern, clean interface that works across devices

## 🛠 Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4.1.9 with custom animations
- **Flow Visualization**: @xyflow/react for interactive node-based diagrams
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Mono
- **Analytics**: Vercel Analytics

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 Usage

### Getting Started

1. **Load Sample Data**: Click "Load Sample" to see a pre-configured autonomous mobile robot project
2. **Add Components**: Use the component library on the left to drag and drop new parts
3. **Create Connections**: Select components and use the connection tools to link them
4. **Edit Properties**: Click on any component to edit its properties, cost, and specifications
5. **Export Project**: Save your work using the export functionality

### Component Categories

- **Mechanical**: Frames, gears, wheels, bearings, etc.
- **Electrical**: Motors, sensors, controllers, batteries, etc.
- **Control**: PLCs, HMIs, drives, encoders, etc.
- **Hydraulic**: Pumps, cylinders, valves, filters, etc.

### Connection Types

- **Assembly**: Physical assembly relationships
- **Power**: Electrical power connections
- **Data**: Communication and data flow
- **Material**: Material flow paths
- **Dependency**: Logical dependencies
- **Sequence**: Process sequence relationships

## 🤖 Sample Project: Autonomous Mobile Robot

The included sample project demonstrates a comprehensive robotics system with:

- **Chassis & Structure**: Aluminum frame with mounting points
- **Locomotion System**: Dual drive motors with omni-directional wheels
- **Power System**: LiPo battery with power distribution
- **Control System**: Raspberry Pi 4B with motor drivers
- **Sensing System**: LiDAR, RGB-D camera, IMU, ultrasonic sensors
- **Manipulation System**: Servo-driven gripper assembly
- **Communication**: WiFi/Bluetooth module with emergency stop

Total project cost: ~$1,000 with detailed component specifications.

## 📁 Project Structure

```
Flow/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── canvas.tsx        # Main flow canvas
│   ├── component-library.tsx
│   ├── prototyping-mind-map.tsx
│   ├── part-editor.tsx
│   └── toolbar.tsx
├── lib/                  # Utilities and constants
│   ├── constants.ts      # Component definitions and sample data
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Customization

### Adding New Components

1. Edit `lib/constants.ts` to add new component types to `COMPONENT_CATEGORIES`
2. Update the `ALL_COMPONENTS` array with your new components
3. Components support custom colors, icons, and properties

### Modifying Sample Data

Update the `SAMPLE_DATA` object in `lib/constants.ts` to create your own sample projects with custom parts and connections.

### Styling

The project uses Tailwind CSS with custom component styling. Modify `app/globals.css` for global styles or individual component files for specific styling.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [v0.app](https://v0.dev) for rapid prototyping
- Uses [React Flow](https://reactflow.dev) for interactive diagrams
- UI components powered by [Radix UI](https://radix-ui.com)
- Icons by [Lucide](https://lucide.dev)

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Flow by Obhox Systems** - Streamlining prototyping visualization and BOM management.