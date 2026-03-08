import React from "react";
import { useState, useEffect, useRef } from "react";

// ─── Shared Utilities ──────────────────────────────────────────────────────────
const useInView = (threshold = 0.12) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const FadeIn = ({ children, delay = 0, className = "", style = {} }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style
    }}>{children}</div>
  );
};

const AnimatedCounter = ({ target, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0; const step = target / 55;
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// ─── Product Data ──────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "entra",
    name: "Microsoft Entra",
    tagline: "Secure Every Identity. Everywhere.",
    category: "Identity & Access",
    icon: "🛡️",
    accent: "#3b82f6",
    accent2: "#6366f1",
    description: "Microsoft Entra is your unified identity and access platform—protecting people, apps, and data across any cloud, any network, any device.",
    hero: "radial-gradient(ellipse 70% 55% at 60% 20%, #1e3a8a 0%, #0d1b3e 50%, #020617 100%)",
    features: [
      { icon: "🔐", title: "Single Sign-On", desc: "One set of credentials for all apps—cloud, on-prem, and SaaS. Boost productivity while reducing password fatigue." },
      { icon: "📱", title: "Multi-Factor Authentication", desc: "Phishing-resistant MFA with authenticator app, FIDO2 keys, biometrics, and certificate-based auth." },
      { icon: "🎯", title: "Conditional Access", desc: "Granular, context-aware policies that enforce access controls based on user, device, location, and risk signals." },
      { icon: "🌐", title: "External Identities", desc: "Invite and manage partners, customers, and consumers with scalable B2B and B2C identity workflows." },
      { icon: "🗝️", title: "Privileged Identity Management", desc: "Just-in-time privileged access with approvals, time limits, and full audit trails for sensitive roles." },
      { icon: "📊", title: "Identity Governance", desc: "Automated access reviews, entitlement management, and lifecycle workflows to stay compliant." },
    ],
    stats: [{ v: 700, s: "K+", l: "Organizations" }, { v: 99, s: ".99%", l: "Uptime" }, { v: 1, s: "B+", l: "Auth/Day" }, { v: 140, s: "+", l: "Countries" }],
    plans: [
      { name: "Free", price: "0", period: "per user/mo", color: "#475569", features: ["500K object limit", "SSO (10 apps)", "MFA", "Basic security reports", "User provisioning"] },
      { name: "P1", price: "6", period: "per user/mo", color: "#3b82f6", popular: true, features: ["All Free features", "Conditional Access", "Identity Protection", "Hybrid identities", "Self-service password reset", "Groups-based access"] },
      { name: "P2", price: "9", period: "per user/mo", color: "#6366f1", features: ["All P1 features", "Privileged Identity Mgmt", "Identity Protection (P2)", "Access Reviews", "Entitlement Management", "Risk-based Conditional Access"] },
    ],
  },
  {
    id: "virtual-machines",
    name: "Azure Virtual Machines",
    tagline: "On-demand, scalable computing power.",
    category: "Compute",
    icon: "💻",
    accent: "#0ea5e9",
    accent2: "#06b6d4",
    description: "Deploy Windows and Linux VMs in seconds. Choose from hundreds of configurations, scale effortlessly, and pay only for what you use.",
    hero: "radial-gradient(ellipse 70% 55% at 65% 20%, #0c4a6e 0%, #041e30 50%, #020617 100%)",
    features: [
      { icon: "⚡", title: "Instant Provisioning", desc: "Spin up VMs in under 60 seconds. Pre-built images for Windows Server, Ubuntu, RHEL, and hundreds of Marketplace images." },
      { icon: "📏", title: "VM Scale Sets", desc: "Automatically scale thousands of identical VMs with load balancing and autoscale rules based on demand." },
      { icon: "🌍", title: "Global Regions", desc: "Deploy in 60+ Azure regions worldwide for ultra-low latency and geo-redundancy with no upfront cost." },
      { icon: "🔒", title: "Isolated Security", desc: "Dedicated physical hardware options for compliance. Azure Confidential Computing for TEE-based workloads." },
      { icon: "💾", title: "Premium Storage", desc: "NVMe Ultra Disk, Premium SSD, and Ephemeral OS disks delivering millions of IOPS for demanding workloads." },
      { icon: "🔧", title: "Hybrid Benefit", desc: "Bring your existing Windows Server and SQL Server licenses to Azure and save up to 85% vs. pay-as-you-go pricing." },
    ],
    stats: [{ v: 60, s: "+", l: "Regions" }, { v: 800, s: "+", l: "VM Sizes" }, { v: 99, s: ".99%", l: "SLA" }, { v: 40, s: "%", l: "Cost Savings*" }],
    plans: [
      { name: "B1s", price: "7.59", period: "per month", color: "#0ea5e9", features: ["1 vCPU", "1 GiB RAM", "Burstable", "4 GiB SSD", "Best for dev/test", "Linux pricing"] },
      { name: "D4s v5", price: "153", period: "per month", color: "#0284c7", popular: true, features: ["4 vCPUs", "16 GiB RAM", "Premium SSD", "General purpose", "Load balanced", "Production workloads"] },
      { name: "E8s v5", price: "392", period: "per month", color: "#06b6d4", features: ["8 vCPUs", "64 GiB RAM", "Memory optimized", "Ultra Disk support", "SAP certified", "Enterprise databases"] },
    ],
  },
  {
    id: "azure-sql",
    name: "Azure SQL Database",
    tagline: "Intelligent, scalable relational cloud database.",
    category: "Databases",
    icon: "🗄️",
    accent: "#10b981",
    accent2: "#059669",
    description: "A fully managed relational database with built-in AI, automatic tuning, and hyperscale up to 100 TB—with zero downtime patching.",
    hero: "radial-gradient(ellipse 70% 55% at 65% 20%, #064e3b 0%, #021a12 50%, #020617 100%)",
    features: [
      { icon: "🤖", title: "Built-in AI", desc: "Automatic performance tuning, intelligent query processing, and threat detection powered by machine learning." },
      { icon: "📈", title: "Hyperscale", desc: "Scale storage up to 100 TB on demand with near-instant read replicas and sub-second failover." },
      { icon: "🔄", title: "Always-On", desc: "99.995% SLA with built-in high availability, automatic backups with 35-day point-in-time restore." },
      { icon: "🛡️", title: "Advanced Security", desc: "Always Encrypted, Transparent Data Encryption, row-level security, and dynamic data masking out of the box." },
      { icon: "🌐", title: "Elastic Pools", desc: "Share resources across multiple databases dynamically—ideal for SaaS apps with unpredictable per-tenant usage." },
      { icon: "⚙️", title: "Serverless", desc: "Auto-pause when idle, auto-resume on demand. Pay only for compute used per second for intermittent workloads." },
    ],
    stats: [{ v: 99, s: ".995%", l: "SLA" }, { v: 100, s: " TB", l: "Max Storage" }, { v: 35, s: " days", l: "PITR Backup" }, { v: 5, s: "X", l: "Faster Queries" }],
    plans: [
      { name: "Basic", price: "4.99", period: "per month", color: "#10b981", features: ["2 GB storage", "5 DTUs", "7-day backups", "Single DB", "Dev & test", "Basic SLA"] },
      { name: "Standard S3", price: "75", period: "per month", color: "#059669", popular: true, features: ["250 GB storage", "100 DTUs", "35-day backups", "Geo-replication", "Threat detection", "Standard SLA"] },
      { name: "Business Critical", price: "910", period: "per month", color: "#065f46", features: ["4 TB storage", "8 vCores", "In-memory OLTP", "Read replicas", "Zone redundant", "99.995% SLA"] },
    ],
  },
  {
    id: "azure-kubernetes",
    name: "Azure Kubernetes Service",
    tagline: "Enterprise-grade Kubernetes, managed for you.",
    category: "Containers",
    icon: "🐳",
    accent: "#8b5cf6",
    accent2: "#7c3aed",
    description: "Deploy, scale, and manage containerized applications with a fully managed Kubernetes service. Serverless nodes, integrated DevOps, and enterprise security.",
    hero: "radial-gradient(ellipse 70% 55% at 65% 20%, #2e1065 0%, #120828 50%, #020617 100%)",
    features: [
      { icon: "⚡", title: "Serverless Nodes", desc: "Virtual Nodes powered by Azure Container Instances for burst scaling with no VM provisioning—pay per pod per second." },
      { icon: "🔄", title: "GitOps & DevOps", desc: "Native integration with GitHub Actions, Azure DevOps, and Flux for automated cluster deployments and drift reconciliation." },
      { icon: "🔒", title: "Workload Identity", desc: "Federated identity credentials for pods with no secrets stored. Native Entra ID integration for RBAC at scale." },
      { icon: "🌐", title: "Multi-cluster Fleet", desc: "Manage hundreds of clusters as a fleet. Centralized policy, upgrades, and workload placement across regions." },
      { icon: "📊", title: "Integrated Monitoring", desc: "Container Insights, Prometheus metrics, Grafana dashboards, and automatic log collection from day one." },
      { icon: "🛡️", title: "Policy & Compliance", desc: "Azure Policy add-on enforces OPA Gatekeeper constraints cluster-wide with compliance reporting in Azure Portal." },
    ],
    stats: [{ v: 99, s: ".95%", l: "API SLA" }, { v: 3, s: "s", l: "Scale Trigger" }, { v: 5000, s: "+", l: "Nodes/Cluster" }, { v: 60, s: "+", l: "Regions" }],
    plans: [
      { name: "Free Tier", price: "0", period: "cluster mgmt/mo", color: "#8b5cf6", features: ["Free cluster management", "Pay for VMs only", "Community support", "Best for dev/test", "Standard SLA", "100 nodes max"] },
      { name: "Standard", price: "72", period: "per cluster/mo", color: "#7c3aed", popular: true, features: ["Uptime SLA 99.95%", "AZ redundancy", "Microsoft support", "500 nodes", "Workload Identity", "Policy add-on"] },
      { name: "Premium", price: "144", period: "per cluster/mo", color: "#5b21b6", features: ["Long-term support", "Istio service mesh", "AI toolchain operator", "Confidential nodes", "FIPS 140-2 nodes", "Enterprise support"] },
    ],
  },
  {
    id: "azure-openai",
    name: "Azure OpenAI Service",
    tagline: "GPT-4, DALL·E, and more—enterprise-grade.",
    category: "AI & Machine Learning",
    icon: "🧠",
    accent: "#f59e0b",
    accent2: "#d97706",
    description: "Access OpenAI's powerful models including GPT-4o, o1, DALL·E 3, and Whisper—with Azure's enterprise security, compliance, and private networking.",
    hero: "radial-gradient(ellipse 70% 55% at 65% 20%, #451a03 0%, #1a0a00 50%, #020617 100%)",
    features: [
      { icon: "🤖", title: "GPT-4o & o1", desc: "The latest OpenAI models with multimodal capabilities—text, vision, and audio—with predictable throughput and SLA." },
      { icon: "🔒", title: "Private & Secure", desc: "Your data never trains OpenAI models. Deploy in your VNet, use private endpoints, and meet compliance requirements." },
      { icon: "📏", title: "Provisioned Throughput", desc: "Reserved model capacity for latency-sensitive workloads with guaranteed TPMs and no rate limit surprises." },
      { icon: "🛠️", title: "Fine-tuning", desc: "Customize GPT-4o mini and GPT-3.5 Turbo on your data for domain-specific applications with high accuracy." },
      { icon: "🌐", title: "Global Deployment", desc: "Deploy models globally across Azure regions with geo-load balancing and routing for lowest latency." },
      { icon: "🔌", title: "REST & SDK", desc: "OpenAI-compatible API. SDKs for Python, .NET, JavaScript, and Java with LangChain and Semantic Kernel support." },
    ],
    stats: [{ v: 128, s: "K", l: "Context Window" }, { v: 99, s: ".9%", l: "SLA" }, { v: 50, s: "+", l: "Models" }, { v: 1, s: "ms", l: "Median Latency" }],
    plans: [
      { name: "Pay-as-you-go", price: "0.002", period: "per 1K tokens (GPT-3.5)", color: "#f59e0b", features: ["No commitment", "GPT-3.5 Turbo", "Ada Embeddings", "DALL·E 3", "Whisper STT", "On-demand scaling"] },
      { name: "GPT-4o", price: "0.005", period: "per 1K input tokens", color: "#d97706", popular: true, features: ["GPT-4o multimodal", "Vision capabilities", "128K context", "Function calling", "JSON mode", "Structured outputs"] },
      { name: "Provisioned", price: "2", period: "per PTU/hour", color: "#92400e", features: ["Guaranteed throughput", "Lowest latency", "SLA-backed", "o1 & GPT-4o", "Custom fine-tunes", "Priority support"] },
    ],
  },
  {
    id: "azure-storage",
    name: "Azure Blob Storage",
    tagline: "Massively scalable object storage for the cloud.",
    category: "Storage",
    icon: "🗂️",
    accent: "#06b6d4",
    accent2: "#0891b2",
    description: "Store any amount of unstructured data—images, videos, documents, backups, and data lakes—with 99.999999999% durability and global redundancy.",
    hero: "radial-gradient(ellipse 70% 55% at 65% 20%, #0e4f5e 0%, #041a22 50%, #020617 100%)",
    features: [
      { icon: "♾️", title: "Unlimited Scale", desc: "No cap on data volume or object count. Scale from gigabytes to exabytes seamlessly without architecture changes." },
      { icon: "🔄", title: "Data Lifecycle", desc: "Automatically tier data from Hot to Cool to Cold to Archive based on age and access patterns—cutting costs by 80%." },
      { icon: "🌍", title: "Geo-redundancy", desc: "RA-GZRS provides 16-nines durability by replicating synchronously across zones and asynchronously across regions." },
      { icon: "🔒", title: "Immutable Storage", desc: "WORM policies with time-based retention and legal hold for SEC 17a-4, FINRA, and CFTC compliance." },
      { icon: "⚡", title: "Data Lake Gen2", desc: "Hierarchical namespace turns Blob Storage into a full HDFS-compatible data lake with ACL-level security." },
      { icon: "🔌", title: "NFS 3.0 & SFTP", desc: "Mount blob containers as NFS or connect via SFTP for lift-and-shift of legacy workloads with zero code changes." },
    ],
    stats: [{ v: 99, s: "B+", l: "Durability (9s)" }, { v: 500, s: " TB/s", l: "Throughput" }, { v: 60, s: "+", l: "Regions" }, { v: 80, s: "%", l: "Archive Savings" }],
    plans: [
      { name: "Hot", price: "0.018", period: "per GB/month", color: "#06b6d4", features: ["Frequent access", "Lowest latency", "$0.004/10K read ops", "CDN integration", "SAS tokens", "Versioning"] },
      { name: "Cool", price: "0.01", period: "per GB/month", color: "#0891b2", popular: true, features: ["Infrequent access", "30-day minimum", "Lower storage cost", "Lifecycle management", "Replication", "Snapshots"] },
      { name: "Archive", price: "0.00099", period: "per GB/month", color: "#0e7490", features: ["Rare access", "180-day minimum", "Lowest storage cost", "Rehydration required", "Compliance ready", "Immutable WORM"] },
    ],
  },
  {
    id: "azure-functions",
    name: "Azure Functions",
    tagline: "Serverless compute. Zero infrastructure.",
    category: "Serverless",
    icon: "⚡",
    accent: "#a855f7",
    accent2: "#9333ea",
    description: "Run event-driven code without managing servers. Scale from zero to millions of executions with sub-second cold starts and a true pay-per-execution model.",
    hero: "radial-gradient(ellipse 70% 55% at 65% 20%, #3b0764 0%, #160525 50%, #020617 100%)",
    features: [
      { icon: "🎯", title: "Event-Driven Triggers", desc: "Respond to HTTP, queues, blobs, timers, Event Grid, Service Bus, Cosmos DB change feed, and 200+ connectors." },
      { icon: "🌡️", title: "Durable Functions", desc: "Stateful workflows with fan-out/fan-in, human interaction, and long-running process orchestration patterns." },
      { icon: "📦", title: "Flex Consumption", desc: "Always-warm instances with concurrency-based scaling. No cold starts for latency-sensitive APIs." },
      { icon: "🔗", title: "Bindings", desc: "Input and output bindings eliminate boilerplate for Cosmos DB, Service Bus, Tables, Event Hubs, and more." },
      { icon: "🛡️", title: "VNet Integration", desc: "Inject functions into your VNet for private connectivity to databases, services, and on-prem resources." },
      { icon: "🌍", title: "Multi-language", desc: "Write in C#, JavaScript, TypeScript, Python, Java, PowerShell, or custom handlers for any runtime." },
    ],
    stats: [{ v: 1, s: "M+", l: "Free Executions/mo" }, { v: 100, s: "ms", l: "Avg Cold Start" }, { v: 99, s: ".95%", l: "SLA" }, { v: 200, s: "+", l: "Trigger Types" }],
    plans: [
      { name: "Consumption", price: "0.20", period: "per 1M executions", color: "#a855f7", features: ["1M free/month", "400K GB-s free", "Auto-scale to 200", "Pay per execution", "All triggers", "No idle cost"] },
      { name: "Flex Consumption", price: "0.20", period: "per 1M executions", color: "#9333ea", popular: true, features: ["Always-warm instances", "Concurrency scaling", "VNet integration", "Private endpoints", "Zone redundancy", "Custom concurrency"] },
      { name: "Premium EP1", price: "143", period: "per month", color: "#7e22ce", features: ["Pre-warmed instances", "Unlimited execution", "vNet integration", "1 core / 3.5 GB RAM", "Custom images", "No cold starts"] },
    ],
  },
  {
    id: "azure-cosmos",
    name: "Azure Cosmos DB",
    tagline: "Globally distributed NoSQL at any scale.",
    category: "Databases",
    icon: "🌌",
    accent: "#ef4444",
    accent2: "#dc2626",
    description: "A fully managed, multi-model NoSQL database with turnkey global distribution, single-digit millisecond latency, and 99.999% SLA for reads and writes.",
    hero: "radial-gradient(ellipse 70% 55% at 65% 20%, #450a0a 0%, #1a0404 50%, #020617 100%)",
    features: [
      { icon: "🌍", title: "Global Distribution", desc: "Add and remove regions with a click. Multi-region writes with automatic conflict resolution and sub-10ms latency globally." },
      { icon: "🔧", title: "Multi-model APIs", desc: "One service, multiple APIs: NoSQL, MongoDB, Cassandra, Gremlin (graph), and Table—no migration needed." },
      { icon: "📊", title: "Autoscale RU/s", desc: "Throughput scales instantly from 100 to 1M+ RU/s based on actual demand. Pay only for peak usage." },
      { icon: "🤖", title: "Integrated Vector DB", desc: "Native vector indexing and search for RAG patterns. Store and query embeddings alongside your operational data." },
      { icon: "♾️", title: "Serverless", desc: "Per-operation pricing with no minimum throughput. Perfect for intermittent workloads and microservices." },
      { icon: "🔄", title: "Change Feed", desc: "Real-time stream of every document change for event-driven architectures, cache invalidation, and analytics." },
    ],
    stats: [{ v: 99, s: ".999%", l: "SLA" }, { v: 10, s: "ms", l: "P99 Latency" }, { v: 60, s: "+", l: "Regions" }, { v: 5, s: "", l: "Consistency Levels" }],
    plans: [
      { name: "Serverless", price: "0.25", period: "per 1M RUs", color: "#ef4444", features: ["No min throughput", "50 GB storage", "Single region", "Pay per operation", "All APIs", "Dev & test workloads"] },
      { name: "Autoscale", price: "0.008", period: "per 100 RU/s per hour", color: "#dc2626", popular: true, features: ["Instant scale", "Multi-region reads", "All consistency levels", "1 TB storage", "Analytical store", "Change feed"] },
      { name: "Multi-region Write", price: "0.016", period: "per 100 RU/s per hour", color: "#991b1b", features: ["Active-active writes", "99.999% SLA", "Conflict resolution", "Unlimited regions", "Zone redundancy", "Global failover"] },
    ],
  },
  {
    id: "azure-devops",
    name: "Azure DevOps",
    tagline: "Plan, build, ship, and monitor—together.",
    category: "DevOps",
    icon: "🔄",
    accent: "#0ea5e9",
    accent2: "#38bdf8",
    description: "A complete DevOps platform: Azure Boards, Repos, Pipelines, Test Plans, and Artifacts—fully integrated for teams of any size.",
    hero: "radial-gradient(ellipse 70% 55% at 65% 20%, #0c3a56 0%, #041525 50%, #020617 100%)",
    features: [
      { icon: "📋", title: "Azure Boards", desc: "Agile planning with Kanban, Scrum, and custom dashboards. Backlog management and sprint planning at enterprise scale." },
      { icon: "📁", title: "Azure Repos", desc: "Unlimited private Git repos with pull requests, branch policies, code search, and semantic code analysis." },
      { icon: "🚀", title: "Azure Pipelines", desc: "Cloud-native CI/CD supporting any language, platform, and cloud. 1,800 free minutes/month, parallel jobs, and YAML pipelines." },
      { icon: "🧪", title: "Test Plans", desc: "Manual and exploratory testing with rich reporting. Test case management and load testing integration." },
      { icon: "📦", title: "Azure Artifacts", desc: "Universal package manager for NuGet, npm, Maven, Python, and Universal packages with upstream sources." },
      { icon: "🔌", title: "1,000+ Integrations", desc: "Deep integrations with GitHub, Jira, Slack, Teams, ServiceNow, and hundreds more via the Marketplace." },
    ],
    stats: [{ v: 1800, s: "min", l: "Free CI/CD/mo" }, { v: 10, s: " GB", l: "Free Artifacts" }, { v: 99, s: ".9%", l: "SLA" }, { v: 1000, s: "+", l: "Extensions" }],
    plans: [
      { name: "Free", price: "0", period: "up to 5 users", color: "#0ea5e9", features: ["5 free users", "Azure Boards", "Azure Repos", "1,800 CI/CD min", "2 GiB Artifacts", "Basic features"] },
      { name: "Basic", price: "6", period: "per user/month", color: "#0284c7", popular: true, features: ["All Free features", "Advanced Boards", "Unlimited Repos", "Request & feedback", "Charts & widgets", "Full Artifacts (2 GiB)"] },
      { name: "Basic + Test Plans", price: "52", period: "per user/month", color: "#0369a1", features: ["All Basic features", "Azure Test Plans", "Manual test tracking", "Exploratory testing", "Load testing", "Advanced analytics"] },
    ],
  },
  {
    id: "azure-monitor",
    name: "Azure Monitor",
    tagline: "Full-stack observability for your Azure estate.",
    category: "Management & Governance",
    icon: "📊",
    accent: "#22c55e",
    accent2: "#16a34a",
    description: "Collect, analyze, and act on telemetry from your cloud and on-premises environments. AI-powered insights, dashboards, and automated remediation.",
    hero: "radial-gradient(ellipse 70% 55% at 65% 20%, #052e16 0%, #021008 50%, #020617 100%)",
    features: [
      { icon: "📥", title: "Unified Data Collection", desc: "Collect metrics, logs, and traces from VMs, containers, databases, apps, and custom sources via OpenTelemetry." },
      { icon: "🤖", title: "AIOps & Alerts", desc: "ML-powered anomaly detection, smart alert grouping, and automatic root cause analysis to reduce alert fatigue." },
      { icon: "📈", title: "Azure Dashboards", desc: "Pin metrics, logs, and App Insights to rich, shareable dashboards with role-based visibility and time ranges." },
      { icon: "🔍", title: "Log Analytics", desc: "Kusto Query Language (KQL) for powerful ad-hoc log analysis across petabytes of data with sub-second results." },
      { icon: "🌐", title: "Application Insights", desc: "APM for .NET, Java, Node.js, Python apps with distributed tracing, request tracking, and live metrics." },
      { icon: "🔔", title: "Autoscale & Remediation", desc: "Trigger scale-out, runbooks, Logic Apps, and webhooks automatically in response to metric thresholds." },
    ],
    stats: [{ v: 99, s: ".9%", l: "SLA" }, { v: 730, s: " days", l: "Log Retention" }, { v: 50, s: "+", l: "Data Sources" }, { v: 10, s: "s", l: "Alert Latency" }],
    plans: [
      { name: "Metrics", price: "0", period: "basic metrics free", color: "#22c55e", features: ["Free platform metrics", "93-day retention", "Basic alerts (1,000/mo)", "Dashboards", "Autoscale", "Activity Logs"] },
      { name: "Log Analytics", price: "2.76", period: "per GB ingested", color: "#16a34a", popular: true, features: ["First 5 GB/workspace free", "31-day retention", "KQL queries", "Log Alerts", "Workbooks", "Sentinel-ready"] },
      { name: "Application Insights", price: "2.76", period: "per GB ingested", color: "#15803d", features: ["First 5 GB free", "90-day retention", "Distributed tracing", "Availability tests", "Live Metrics", "Smart detection"] },
    ],
  },
];

// ─── Shared UI Components ──────────────────────────────────────────────────────
const GlowOrb = ({ style }) => (
  <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(90px)", opacity: 0.15, pointerEvents: "none", ...style }} />
);

const PricingCard = ({ plan, accent }) => (
  <div style={{
    flex: 1, minWidth: 220,
    background: plan.popular ? `linear-gradient(145deg, ${accent}18, ${accent}08)` : "rgba(255,255,255,0.025)",
    border: `1px solid ${plan.popular ? accent + "55" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 20, padding: "2rem",
    position: "relative", overflow: "hidden",
    transform: plan.popular ? "scale(1.04)" : "scale(1)",
    boxShadow: plan.popular ? `0 0 50px ${accent}20` : "none",
    transition: "all 0.3s"
  }}>
    {plan.popular && (
      <div style={{
        position: "absolute", top: 16, right: 16,
        background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
        color: "white", fontSize: 11, fontWeight: 700,
        padding: "3px 10px", borderRadius: 100, letterSpacing: "0.05em"
      }}>POPULAR</div>
    )}
    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{plan.name}</div>
    <div style={{ marginBottom: 20 }}>
      <span style={{ fontSize: 40, fontWeight: 800, color: "white", letterSpacing: "-0.04em" }}>${plan.price}</span>
      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginLeft: 6 }}>{plan.period}</span>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
      {plan.features.map(f => (
        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: `${accent}30`, border: `1px solid ${accent}60`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="9" height="9" viewBox="0 0 12 10"><polyline points="1,5 4,8 11,1" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{f}</span>
        </div>
      ))}
    </div>
    <button style={{
      width: "100%", padding: "11px 0", borderRadius: 10,
      background: plan.popular ? `linear-gradient(135deg, ${accent}, ${plan.color})` : "rgba(255,255,255,0.06)",
      border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.12)",
      color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.01em",
      transition: "all 0.2s",
      boxShadow: plan.popular ? `0 4px 20px ${accent}40` : "none"
    }}>Get Started</button>
  </div>
);

// ─── Product Page ──────────────────────────────────────────────────────────────
const ProductPage = ({ product, onNavigate, allProducts }) => {
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [product.id]);

  return (
    <div ref={scrollRef} style={{ overflowY: "auto", height: "100%", background: "#020617" }}>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: "70vh", display: "flex", alignItems: "center", padding: "100px 3rem 60px", overflow: "hidden" }}>
        {/* Dark base layer always on top of everything background */}
        <div style={{ position: "absolute", inset: 0, background: "#020617" }} />
        {/* Subtle colored gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: product.hero, opacity: 0.85 }} />
        {/* Extra dark vignette so text is always readable */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(2,6,23,0.75) 0%, rgba(2,6,23,0.2) 100%)" }} />
        {/* Glow orbs — kept subtle */}
        <div style={{ position: "absolute", width: 480, height: 480, top: "-15%", right: "0%", borderRadius: "50%", background: product.accent, filter: "blur(120px)", opacity: 0.12, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 280, height: 280, bottom: "-5%", left: "5%", borderRadius: "50%", background: product.accent2, filter: "blur(100px)", opacity: 0.10, pointerEvents: "none" }} />
        {/* Grid */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }}>
          <defs><pattern id={`grid-${product.id}`} width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="#94a3b8" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill={`url(#grid-${product.id})`} />
        </svg>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 760 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
            padding: "5px 14px", borderRadius: 100,
            background: `${product.accent}25`, border: `1px solid ${product.accent}55`
          }}>
            <span style={{ color: product.accent, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{product.category}</span>
          </div>
          <h1 style={{
            fontSize: "clamp(2.4rem, 5vw, 4.2rem)", fontWeight: 800,
            letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 12,
            color: "white"
          }}>
            <span style={{ fontSize: "0.75em", marginRight: 8 }}>{product.icon}</span>{product.name}
          </h1>
          <p style={{
            fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)", fontWeight: 300,
            color: product.accent, marginBottom: 20, letterSpacing: "-0.01em",
            opacity: 0.9
          }}>{product.tagline}</p>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.75, maxWidth: 580, fontWeight: 300, marginBottom: 40 }}>{product.description}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button style={{
              padding: "13px 32px", borderRadius: 12, fontFamily: "'DM Sans', sans-serif",
              background: `linear-gradient(135deg, ${product.accent}, ${product.accent2})`,
              border: "none", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer",
              boxShadow: `0 0 30px ${product.accent}40`
            }}>Start Free →</button>
            <button style={{
              padding: "13px 32px", borderRadius: 12, fontFamily: "'DM Sans', sans-serif",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.8)", fontSize: 15, fontWeight: 600, cursor: "pointer"
            }}>View Docs</button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "60px 3rem", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: `repeat(${product.stats.length}, 1fr)`, gap: 32 }}>
          {product.stats.map(({ v, s, l }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 40, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1,
                background: `linear-gradient(135deg, #fff, ${product.accent})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}><AnimatedCounter target={v} suffix={s} /></div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "90px 3rem", maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 800,
            letterSpacing: "-0.03em", marginBottom: 16, textAlign: "center",
            background: `linear-gradient(135deg, #fff 50%, ${product.accent})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>Key Features</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", textAlign: "center", fontSize: 15, marginBottom: 56, maxWidth: 500, margin: "0 auto 56px" }}>
            Everything you need, built in and production-ready from day one.
          </p>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {product.features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.07}>
              <div style={{
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 18, padding: "1.75rem", transition: "all 0.3s", cursor: "default",
                position: "relative", overflow: "hidden"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = product.accent + "44"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: `${product.accent}20`, border: `1px solid ${product.accent}35`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, marginBottom: 16
                }}>{f.icon}</div>
                <h3 style={{ color: "white", fontWeight: 700, fontSize: 16, marginBottom: 8, letterSpacing: "-0.02em" }}>{f.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13.5, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: "80px 3rem", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800,
              textAlign: "center", marginBottom: 14, letterSpacing: "-0.03em",
              background: `linear-gradient(135deg, #fff 40%, ${product.accent})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>Pricing</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", textAlign: "center", fontSize: 14, marginBottom: 52, maxWidth: 440, margin: "0 auto 52px" }}>
              Transparent, predictable pricing. No hidden fees.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
              {product.plans.map(plan => <PricingCard key={plan.name} plan={plan} accent={product.accent} />)}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* More Products */}
      <section style={{ padding: "80px 3rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h3 style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 28 }}>Explore More Azure Products</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {allProducts.filter(p => p.id !== product.id).map(p => (
              <button key={p.id} onClick={() => onNavigate(p.id)} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
                borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${p.accent}18`; e.currentTarget.style.borderColor = `${p.accent}44`; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              ><span>{p.icon}</span>{p.name}</button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── Entra Home Page ───────────────────────────────────────────────────────────
const EntraHome = ({ onNavigate }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = e => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  return (
    <div style={{ overflowY: "auto", height: "100%", background: "#020617" }}>
      {/* cursor follower */}
      <div style={{
        position: "fixed", zIndex: 5, pointerEvents: "none", width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
        transform: `translate(${mouse.x - 175}px, ${mouse.y - 175}px)`, transition: "transform 0.12s ease"
      }} />

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 3rem" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%, #1e3a8a 0%, #0f172a 60%, #020617 100%)" }} />
        <GlowOrb style={{ width: 600, height: 600, top: "-15%", left: "60%", background: "#3b82f6" }} />
        <GlowOrb style={{ width: 400, height: 400, top: "30%", left: "-10%", background: "#6366f1" }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }}>
          <defs><pattern id="home-grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#60a5fa" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#home-grid)" />
        </svg>
        {[...Array(18)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", width: (i % 3) + 2, height: (i % 3) + 2, borderRadius: "50%",
            background: "#60a5fa", left: `${(i * 17 + 5) % 100}%`, top: `${(i * 13 + 8) % 100}%`,
            opacity: 0.15 + (i % 4) * 0.07, animation: `float ${4 + (i % 4)}s ease-in-out infinite alternate`,
            animationDelay: `${(i * 0.4) % 3}s`, pointerEvents: "none"
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 1, maxWidth: 860, textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px",
            borderRadius: 100, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)",
            marginBottom: 36, animation: "float 3s ease-in-out infinite alternate"
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399" }} />
            <span style={{ color: "#93c5fd", fontSize: 13, fontWeight: 500, letterSpacing: "0.04em" }}>Now available — Microsoft Entra Suite</span>
          </div>

          <h1 style={{
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)", fontWeight: 800, lineHeight: 1.05,
            letterSpacing: "-0.04em", marginBottom: 28,
            background: "linear-gradient(160deg, #ffffff 0%, #ffffff 40%, #60a5fa 70%, #818cf8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>Secure Every<br />Identity. Everywhere.</h1>

          <p style={{ fontSize: 19, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, maxWidth: 560, margin: "0 auto 48px", fontWeight: 300 }}>
            Microsoft Entra is your unified identity and access platform—protecting people, apps, and data across any cloud, any network, any device.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("entra")} style={{
              padding: "14px 36px", borderRadius: 12, fontFamily: "'DM Sans', sans-serif",
              background: "linear-gradient(135deg, #2563eb, #4f46e5)", border: "none",
              color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 0 40px rgba(79,70,229,0.4)"
            }}>Explore Entra →</button>
            <button style={{
              padding: "14px 36px", borderRadius: 12, fontFamily: "'DM Sans', sans-serif",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
              color: "white", fontSize: 16, fontWeight: 600, cursor: "pointer"
            }}>Watch Demo</button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "70px 3rem", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {[{ v: 700, s: "K+", l: "Organizations" }, { v: 99, s: ".99%", l: "Uptime SLA" }, { v: 1, s: "B+", l: "Auth / Day" }, { v: 140, s: "+", l: "Countries" }].map(({ v, s, l }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, background: "linear-gradient(135deg, #fff, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                <AnimatedCounter target={v} suffix={s} />
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Azure Products Grid */}
      <section style={{ padding: "90px 3rem", maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <span style={{
            display: "inline-block", padding: "4px 14px", borderRadius: 100,
            background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
            fontWeight: 600, marginBottom: 20
          }}>Azure Products</span>
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em",
            lineHeight: 1.1, marginBottom: 14,
            background: "linear-gradient(135deg, #fff 50%, #93c5fd)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>10 Azure Services.<br />One Unified Platform.</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, maxWidth: 480, marginBottom: 56 }}>
            Explore the products that power the world's most critical workloads.
          </p>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
          {PRODUCTS.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.05}>
              <div onClick={() => onNavigate(p.id)} style={{
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20, padding: "1.75rem", cursor: "pointer",
                transition: "all 0.3s", position: "relative", overflow: "hidden"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${p.accent}12`; e.currentTarget.style.borderColor = `${p.accent}44`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.3)`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ position: "absolute", top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle, ${p.accent}15 0%, transparent 70%)`, borderRadius: "0 20px 0 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 12, fontSize: 22,
                    background: `${p.accent}20`, border: `1px solid ${p.accent}40`,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>{p.icon}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: p.accent, background: `${p.accent}18`, border: `1px solid ${p.accent}35`, padding: "3px 10px", borderRadius: 100, letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.category}</span>
                </div>
                <h3 style={{ color: "white", fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em", marginBottom: 8 }}>{p.name}</h3>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>{p.tagline}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: p.accent, fontSize: 13, fontWeight: 600 }}>
                  Explore <svg width="14" height="14" viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke={p.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "36px 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>© 2025 Microsoft Corporation. All rights reserved.</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Security", "Accessibility"].map(item => (
            <a key={item} href="#" style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, textDecoration: "none" }}>{item}</a>
          ))}
        </div>
      </footer>
    </div>
  );
};

// ─── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = ({ currentPage, onNavigate, collapsed, setCollapsed }) => {
  const categories = [...new Set(PRODUCTS.map(p => p.category))];

  return (
    <div style={{
      width: collapsed ? 64 : 256, flexShrink: 0,
      background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column", transition: "width 0.3s ease",
      overflow: "hidden", position: "relative", zIndex: 10
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 10, minHeight: 64 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 18px rgba(99,102,241,0.4)", cursor: "pointer"
        }} onClick={() => onNavigate("home")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        {!collapsed && (
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", lineHeight: 1.2 }}>Microsoft</div>
            <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: 13, letterSpacing: "-0.01em" }}>Azure Portal</div>
          </div>
        )}
        <div style={{ marginLeft: "auto", cursor: "pointer" }} onClick={() => setCollapsed(!collapsed)}>
          <svg width="16" height="16" viewBox="0 0 16 16" style={{ opacity: 0.4, transition: "transform 0.3s", transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}>
            <path d="M10 3L5 8l5 5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Home */}
      <div style={{ padding: "12px 10px 4px" }}>
        <div onClick={() => onNavigate("home")} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8,
          cursor: "pointer", background: currentPage === "home" ? "rgba(99,102,241,0.18)" : "transparent",
          border: currentPage === "home" ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
          transition: "all 0.2s"
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🏠</span>
          {!collapsed && <span style={{ color: currentPage === "home" ? "#a5b4fc" : "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 500 }}>Home</span>}
        </div>
      </div>

      {/* Products grouped by category */}
      <div style={{ overflowY: "auto", flex: 1, padding: "4px 10px 16px" }}>
        {categories.map(cat => (
          <div key={cat}>
            {!collapsed && (
              <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "14px 6px 6px" }}>{cat}</div>
            )}
            {PRODUCTS.filter(p => p.category === cat).map(p => {
              const active = currentPage === p.id;
              return (
                <div key={p.id} onClick={() => onNavigate(p.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                  borderRadius: 8, cursor: "pointer", marginBottom: 2,
                  background: active ? `${p.accent}20` : "transparent",
                  border: active ? `1px solid ${p.accent}40` : "1px solid transparent",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                title={collapsed ? p.name : ""}
                >
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{p.icon}</span>
                  {!collapsed && (
                    <span style={{ color: active ? "white" : "rgba(255,255,255,0.5)", fontSize: 12.5, fontWeight: active ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.name}
                    </span>
                  )}
                  {!collapsed && active && (
                    <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: p.accent, boxShadow: `0 0 8px ${p.accent}` }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom */}
      {!collapsed && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>Microsoft Azure © 2025</div>
        </div>
      )}
    </div>
  );
};

// ─── Top Bar ───────────────────────────────────────────────────────────────────
const TopBar = ({ currentProduct }) => {
  const p = PRODUCTS.find(x => x.id === currentProduct);
  return (
    <div style={{
      height: 56, borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(2,6,23,0.8)", backdropFilter: "blur(20px)",
      display: "flex", alignItems: "center", padding: "0 24px",
      gap: 16, flexShrink: 0, zIndex: 20
    }}>
      {p && (
        <>
          <span style={{ fontSize: 18 }}>{p.icon}</span>
          <span style={{ color: "white", fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>{p.name}</span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>·</span>
          <span style={{ padding: "3px 10px", borderRadius: 100, background: `${p.accent}18`, border: `1px solid ${p.accent}35`, color: p.accent, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.category}</span>
        </>
      )}
      {!p && <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Microsoft Azure — Product Catalog</span>}
      <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
        <button style={{ padding: "6px 16px", borderRadius: 8, background: "linear-gradient(135deg, #2563eb, #4f46e5)", border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Portal</button>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>A</span>
        </div>
      </div>
    </div>
  );
};

// ─── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  const currentProduct = PRODUCTS.find(p => p.id === currentPage);

  const navigate = (id) => setCurrentPage(id);

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      background: "#020617", fontFamily: "'DM Sans', sans-serif", color: "white", overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300&display=swap');
        @keyframes float { from { transform: translateY(0) } to { transform: translateY(-18px) } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.5 } 100% { transform: scale(1.7); opacity: 0 } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
      <TopBar currentProduct={currentPage !== "home" ? currentPage : null} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar currentPage={currentPage} onNavigate={navigate} collapsed={collapsed} setCollapsed={setCollapsed} />
        <main style={{ flex: 1, overflow: "hidden" }}>
          {currentPage === "home"
            ? <EntraHome onNavigate={navigate} />
            : <ProductPage product={currentProduct} onNavigate={navigate} allProducts={PRODUCTS} />
          }
        </main>
      </div>
    </div>
  );
}
