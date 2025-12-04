import {
  Database,
  Server,
  Cloud,
  Workflow,
  MessageSquare,
  GitBranch,
  Zap,
  HardDrive,
  Network,
  Boxes,
  Globe,
  Search,
  BarChart,
  Container,
  Cpu,
} from "lucide-react"
import type { LinkType, Category } from "./types"

export const COMPONENT_CATEGORIES: Record<string, Category> = {
  databases: {
    name: "Databases",
    icon: Database,
    components: [
      { id: "postgresql", name: "PostgreSQL", icon: Database, customColor: "#336791" },
      { id: "mysql", name: "MySQL", icon: Database, customColor: "#4479A1" },
      { id: "mongodb", name: "MongoDB", icon: Database, customColor: "#47A248" },
      { id: "dynamodb", name: "DynamoDB", icon: Database, customColor: "#4053D6" },
      { id: "cassandra", name: "Cassandra", icon: Database, customColor: "#1287B1" },
      { id: "redis", name: "Redis", icon: HardDrive, customColor: "#DC382D" },
      { id: "memcached", name: "Memcached", icon: HardDrive, customColor: "#1BA672" },
      { id: "elasticsearch", name: "Elasticsearch", icon: Search, customColor: "#005571" },
    ],
  },
  services: {
    name: "APIs & Services",
    icon: Server,
    components: [
      { id: "rest-api", name: "REST API", icon: Globe, customColor: "#61DAFB" },
      { id: "graphql", name: "GraphQL API", icon: Network, customColor: "#E535AB" },
      { id: "grpc", name: "gRPC Service", icon: Workflow, customColor: "#244C5A" },
      { id: "microservice", name: "Microservice", icon: Boxes, customColor: "#FF6B6B" },
      { id: "lambda", name: "Lambda/Serverless", icon: Cloud, customColor: "#FF9900" },
      { id: "websocket", name: "WebSocket", icon: MessageSquare, customColor: "#010101" },
      { id: "api-gateway", name: "API Gateway", icon: Server, customColor: "#FF4F00" },
    ],
  },
  messaging: {
    name: "Message Systems",
    icon: MessageSquare,
    components: [
      { id: "rabbitmq", name: "RabbitMQ", icon: MessageSquare, customColor: "#FF6600" },
      { id: "sqs", name: "SQS", icon: MessageSquare, customColor: "#FF9900" },
      { id: "kafka", name: "Kafka", icon: Workflow, customColor: "#231F20" },
      { id: "pubsub", name: "Pub/Sub", icon: MessageSquare, customColor: "#4285F4" },
      { id: "event-bus", name: "Event Bus", icon: GitBranch, customColor: "#6B46C1" },
      { id: "kinesis", name: "Kinesis", icon: Workflow, customColor: "#FF9900" },
    ],
  },
  processing: {
    name: "Data Processing",
    icon: GitBranch,
    components: [
      { id: "etl-pipeline", name: "ETL Pipeline", icon: GitBranch, customColor: "#0066CC" },
      { id: "data-lake", name: "Data Lake", icon: Database, customColor: "#00758F" },
      { id: "stream-processor", name: "Stream Processor", icon: Zap, customColor: "#E25A1C" },
      { id: "analytics", name: "Analytics Engine", icon: BarChart, customColor: "#669DF6" },
      { id: "cdc", name: "CDC Pipeline", icon: GitBranch, customColor: "#FF6F61" },
      { id: "data-warehouse", name: "Data Warehouse", icon: HardDrive, customColor: "#4285F4" },
    ],
  },
}

export const ALL_COMPONENTS = Object.values(COMPONENT_CATEGORIES).flatMap((cat) => cat.components)

export const LINK_TYPES: LinkType[] = [
  {
    id: "data-flow",
    name: "Data Flow",
    color: "#3b82f6",
    strokeWidth: 2,
    dashArray: "",
    description: "Synchronous data transfer between services",
  },
  {
    id: "async-flow",
    name: "Async Flow",
    color: "#8b5cf6",
    strokeWidth: 2,
    dashArray: "5,5",
    description: "Asynchronous or event-driven communication",
  },
  {
    id: "dependency",
    name: "Dependency",
    color: "#ef4444",
    strokeWidth: 2,
    dashArray: "10,5",
    description: "Service depends on another service",
  },
]

export const SAMPLE_DATA = {
  parts: [
    // Frontend Layer
    {
      id: 1,
      type: "rest-api",
      name: "Web Client",
      customColor: "#61DAFB",
      functionality: "React-based web application serving the user interface",
      imageUrl: "",
      technology: "React 18",
      version: "v2.1.0",
      capacity: "10000 concurrent users",
      x: 200,
      y: 100,
    },
    // API Gateway
    {
      id: 2,
      type: "api-gateway",
      name: "API Gateway",
      customColor: "#FF4F00",
      functionality: "Routes requests to microservices, handles authentication and rate limiting",
      imageUrl: "",
      technology: "Kong",
      version: "v3.0",
      capacity: "50000 req/s",
      sla: "99.99% uptime",
      x: 600,
      y: 100,
    },
    // Microservices
    {
      id: 3,
      type: "microservice",
      name: "User Service",
      customColor: "#FF6B6B",
      functionality: "Manages user accounts, authentication, and profiles",
      imageUrl: "",
      technology: "Node.js",
      version: "v1.5.0",
      capacity: "5000 req/s",
      x: 300,
      y: 300,
    },
    {
      id: 4,
      type: "microservice",
      name: "Product Service",
      customColor: "#FF6B6B",
      functionality: "Product catalog, inventory, and search functionality",
      imageUrl: "",
      technology: "Python FastAPI",
      version: "v2.0.1",
      capacity: "8000 req/s",
      x: 600,
      y: 300,
    },
    {
      id: 5,
      type: "microservice",
      name: "Order Service",
      customColor: "#FF6B6B",
      functionality: "Order processing, payment integration, and fulfillment",
      imageUrl: "",
      technology: "Java Spring Boot",
      version: "v1.8.2",
      capacity: "3000 req/s",
      x: 900,
      y: 300,
    },
    // Databases
    {
      id: 6,
      type: "postgresql",
      name: "User DB",
      customColor: "#336791",
      functionality: "Stores user profiles, authentication data, and preferences",
      imageUrl: "",
      technology: "PostgreSQL 15",
      capacity: "100GB storage, 1000 connections",
      x: 300,
      y: 500,
    },
    {
      id: 7,
      type: "mongodb",
      name: "Product DB",
      customColor: "#47A248",
      functionality: "Document store for product catalog with flexible schema",
      imageUrl: "",
      technology: "MongoDB 6.0",
      capacity: "500GB storage",
      x: 600,
      y: 500,
    },
    {
      id: 8,
      type: "postgresql",
      name: "Order DB",
      customColor: "#336791",
      functionality: "Transactional database for orders and payments",
      imageUrl: "",
      technology: "PostgreSQL 15",
      capacity: "200GB storage",
      x: 900,
      y: 500,
    },
    // Cache
    {
      id: 9,
      type: "redis",
      name: "Cache Layer",
      customColor: "#DC382D",
      functionality: "Caches frequently accessed data and session management",
      imageUrl: "",
      technology: "Redis 7.0",
      capacity: "16GB memory, 100k ops/s",
      x: 1100,
      y: 200,
    },
    // Message Queue
    {
      id: 10,
      type: "kafka",
      name: "Event Stream",
      customColor: "#231F20",
      functionality: "Event streaming for order events, inventory updates, and notifications",
      imageUrl: "",
      technology: "Kafka 3.4",
      capacity: "1M messages/s",
      x: 1100,
      y: 400,
    },
  ],
  connections: [
    // Client to Gateway
    { from: 1, to: 2, id: 1, linkType: "data-flow", color: "#3b82f6", strokeWidth: 2, dashArray: "" },

    // Gateway to Services
    { from: 2, to: 3, id: 2, linkType: "data-flow", color: "#3b82f6", strokeWidth: 2, dashArray: "" },
    { from: 2, to: 4, id: 3, linkType: "data-flow", color: "#3b82f6", strokeWidth: 2, dashArray: "" },
    { from: 2, to: 5, id: 4, linkType: "data-flow", color: "#3b82f6", strokeWidth: 2, dashArray: "" },

    // Services to Databases
    { from: 3, to: 6, id: 5, linkType: "data-flow", color: "#3b82f6", strokeWidth: 2, dashArray: "" },
    { from: 4, to: 7, id: 6, linkType: "data-flow", color: "#3b82f6", strokeWidth: 2, dashArray: "" },
    { from: 5, to: 8, id: 7, linkType: "data-flow", color: "#3b82f6", strokeWidth: 2, dashArray: "" },

    // Cache connections
    { from: 2, to: 9, id: 8, linkType: "data-flow", color: "#3b82f6", strokeWidth: 2, dashArray: "" },
    { from: 4, to: 9, id: 9, linkType: "dependency", color: "#ef4444", strokeWidth: 2, dashArray: "10,5" },

    // Event streaming
    { from: 5, to: 10, id: 10, linkType: "async-flow", color: "#8b5cf6", strokeWidth: 2, dashArray: "5,5" },
    { from: 4, to: 10, id: 11, linkType: "async-flow", color: "#8b5cf6", strokeWidth: 2, dashArray: "5,5" },

    // Service dependencies
    { from: 5, to: 3, id: 12, linkType: "dependency", color: "#ef4444", strokeWidth: 2, dashArray: "10,5" },
  ],
}
