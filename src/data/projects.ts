import type { Project } from "./types";

/**
 * PROJECT INVENTORY
 * -----------------
 * Every description here is derived from the project's own repository, its README,
 * its PRD, or the live product. Nothing is inferred. Where a project has not yet
 * been documented, `status: "awaiting-assets"` keeps the copy deliberately thin
 * rather than filling the gap with invention.
 *
 * SWAPPING IN REAL SCREENSHOTS
 * Drop a file at `public/images/projects/<slug>/hero.png` and change the `src`
 * below. Every surface that renders the project — featured rail, horizontal
 * gallery, archive grid, case study — reads from this one object.
 */

const img = (slug: string, name: string) => `/images/projects/${slug}/${name}.svg`;

export const projects: Project[] = [
  /* ─────────────────────────  MAJORLINK  ───────────────────────── */
  {
    slug: "majorlink",
    title: "Majorlink",
    tagline: "Crypto, gift cards and bill payments in one Nigerian money app",
    group: "FINTECH / FINANCIAL SYSTEMS",
    disciplines: ["PRODUCT", "FINTECH", "WEB", "MOBILE"],
    typeLine: "FINTECH / WEB / MOBILE",
    year: "2025 — 2026",
    role: "Frontend & product engineering",
    platform: "Web · iOS · Android",
    description:
      "Majorlink is a Nigerian money app for trading gift cards, converting crypto to Naira and paying bills from one balance. I built the public web platform that fronts the product — marketing, onboarding, compliance pages and the authenticated checkout flow.",
    problem:
      "Gift card and crypto liquidity in Nigeria is fragmented across informal desks and single-purpose apps, so users juggle several channels and have no consistent view of rates or settlement.",
    solution:
      "A single consumer surface that puts gift card exchange, crypto-to-Naira conversion and bill payments behind one account, backed by an operations console for rates, KYC and payouts.",
    features: [
      "Gift card exchange with published, tiered rates",
      "USDT / BTC conversion routed to Nigerian bank accounts",
      "Airtime, data, electricity and subscription bill payments",
      "Idle-session timeout and cookie-consent handling on authenticated routes",
      "AML, Terms and Privacy surfaces maintained alongside the product",
    ],
    stack: ["React", "React Router", "Axios", "Lenis", "Swiper", "Reactstrap", "React Helmet"],
    outcome:
      "Live at majorlink.co with the mobile app published on Google Play and the App Store.",
    links: [
      { label: "majorlink.co", href: "https://majorlink.co" },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.olamide81.MajorlinkApp",
      },
    ],
    hero: {
      src: img("majorlink", "hero"),
      alt: "Majorlink wallet and gift card exchange interface",
      device: "phone",
    },
    gallery: [
      { src: img("majorlink", "shot-1"), alt: "Majorlink crypto conversion screen", device: "phone" },
      { src: img("majorlink", "shot-2"), alt: "Majorlink rates and bill payment screen", device: "phone" },
      { src: img("majorlink", "shot-3"), alt: "Majorlink marketing site", device: "browser" },
    ],
    featured: true,
    accent: "#4b5dff",
    status: "verified",
  },

  /* ─────────────────────────  REPORTAM  ───────────────────────── */
  {
    slug: "reportam",
    title: "ReportAm",
    tagline: "Community problems in Oyo State, made visible and trackable",
    group: "PRODUCT / STARTUPS",
    disciplines: ["PRODUCT", "WEB"],
    typeLine: "CIVIC / WEB / FULL-STACK",
    year: "2026",
    role: "Full-stack engineering",
    platform: "Web",
    description:
      "A web app where residents report a community problem with a photo and a location, and anyone can see and track it. Built to make problems in Oyo State, Nigeria visible, reportable and trackable rather than lost in group chats.",
    problem:
      "A broken streetlight or a collapsed drain gets reported into a group chat and disappears. There is no shared record, no status, and no way for a resident to know whether anything happened.",
    solution:
      "One public record per report — photo, location, status — with a separate admin dashboard for the people triaging them, so a report has a visible lifecycle instead of an inbox.",
    features: [
      "Photo + geolocation capture at report time",
      "Public feed of reports, open to anyone",
      "Status tracking through the life of a report",
      "Separate admin dashboard for triage and resolution",
    ],
    stack: ["Next.js", "React", "Node.js", "MongoDB", "Cloudinary", "Vercel", "Render"],
    outcome:
      "Deployed across three surfaces: user app and admin dashboard on Vercel, API on Render.",
    links: [
      { label: "reportam.vercel.app", href: "https://reportam.vercel.app/" },
      { label: "Admin dashboard", href: "https://reportam-admin.vercel.app/" },
    ],
    hero: { src: img("reportam", "hero"), alt: "ReportAm map of community reports", device: "browser" },
    gallery: [
      { src: img("reportam", "shot-1"), alt: "Report submission with photo and location", device: "phone" },
      { src: img("reportam", "shot-2"), alt: "Admin triage dashboard", device: "browser" },
    ],
    featured: true,
    accent: "#35c4a8",
    status: "verified",
  },

  /* ──────────────────────  REPORTUS BACKEND  ─────────────────── */
  {
    slug: "reportus-backend",
    title: "ReportUs Backend",
    tagline: "The API and data layer under the reporting platform",
    group: "PRODUCT / STARTUPS",
    disciplines: ["BACKEND"],
    typeLine: "BACKEND / API / INFRASTRUCTURE",
    year: "2026",
    role: "Backend engineering",
    platform: "Node.js service",
    description:
      "The service layer behind the reporting product: an Express API over MongoDB handling authentication, report ingestion, image upload and rate limiting, with an integration test suite that runs against an in-memory database.",
    problem:
      "Reports arrive with photographs from mobile connections, which means uploads have to be streamed off the API process, and a public submission endpoint has to survive abuse.",
    solution:
      "Multer streams uploads straight into Cloudinary rather than through local disk, JWT sessions gate the write paths, and express-rate-limit fronts the public endpoints. Jest and Supertest run the whole surface against mongodb-memory-server so the suite needs no live database.",
    features: [
      "JWT authentication with bcrypt password hashing",
      "Direct-to-Cloudinary media pipeline via multer storage adapter",
      "Rate limiting on public submission endpoints",
      "Mongoose schema and index layer over MongoDB",
      "Integration tests against an ephemeral in-memory MongoDB",
      "Postman collection maintained alongside the API",
    ],
    stack: [
      "Node.js",
      "Express 5",
      "MongoDB",
      "Mongoose",
      "JWT",
      "bcrypt",
      "Cloudinary",
      "Multer",
      "Jest",
      "Supertest",
    ],
    hero: {
      src: img("reportus-backend", "hero"),
      alt: "API architecture and request flow diagram",
      device: "flat",
    },
    gallery: [{ src: img("reportus-backend", "shot-1"), alt: "Endpoint map and data flow", device: "flat" }],
    featured: false,
    accent: "#7d8b9c",
    status: "verified",
  },

  /* ─────────────────────────  CONNECTUS  ──────────────────────── */
  {
    slug: "connectus",
    title: "ConnectUS",
    tagline: "Watch a film together, in sync, from anywhere",
    group: "PRODUCT / STARTUPS",
    disciplines: ["PRODUCT", "WEB", "BACKEND"],
    typeLine: "REAL-TIME / WEB / FULL-STACK",
    year: "2026",
    role: "Full-stack engineering",
    platform: "Web",
    description:
      "A real-time synchronised watch-party platform. Users create a room, invite friends by code or link, and watch a film together with host-controlled playback, live chat and peer-to-peer video chat.",
    problem:
      "Watching something with someone remotely means counting down over a call and drifting out of sync within minutes. Playback state has to be authoritative somewhere.",
    solution:
      "The host owns playback. Play, pause and seek propagate over Socket.io to every participant, while WebRTC carries the faces and Mux carries the stream — so the heavy video path never runs through the sync channel.",
    features: [
      "Rooms with unique codes, privacy settings and participant caps",
      "Host-authoritative synchronised playback across all participants",
      "Live chat with message history and real-time emoji reactions",
      "WebRTC peer-to-peer video and audio with a participant grid",
      "Friend system with requests and online status",
      "Movie library with search and category filtering",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Express",
      "MongoDB",
      "Socket.io",
      "Mux",
      "WebRTC",
      "JWT",
    ],
    challenges:
      "Keeping playback authoritative under variable latency without letting a late joiner yank the room back to their own position.",
    hero: { src: img("connectus", "hero"), alt: "ConnectUS synchronised watch room", device: "browser" },
    gallery: [
      { src: img("connectus", "shot-1"), alt: "Watch room with participant video grid and chat", device: "browser" },
      { src: img("connectus", "shot-2"), alt: "Room creation and invite flow", device: "phone" },
    ],
    featured: true,
    accent: "#e4483f",
    status: "verified",
  },

  /* ───────────────────────  EASILYPROMOTE  ────────────────────── */
  {
    slug: "easilypromote",
    title: "EasilyPromote",
    tagline: "A creator marketing marketplace that pays on delivered results",
    group: "PRODUCT / STARTUPS",
    disciplines: ["PRODUCT", "WEB", "BACKEND"],
    typeLine: "MARKETPLACE / SAAS / FULL-STACK",
    year: "2026",
    role: "Product architecture & full-stack engineering",
    platform: "Web · Brand, Creator and Admin platforms",
    description:
      "A marketplace where brands run campaigns with creators and pay against delivered reach rather than promises. Three separate products — Brand, Creator and Admin — sit on one shared marketplace core so campaign, slot and wallet logic exists in exactly one place.",
    problem:
      "Creator marketing runs on trust and screenshots. Brands cannot verify what they paid for, creators chase payment after delivery, and every platform that tries to fix this ends up with three apps each holding their own copy of the campaign rules.",
    solution:
      "One shared services layer — campaign, slot, rank, verification, escrow, wallet, analytics, fraud, notification, media, search, audit — with the three front-ends reduced to presentation. Nothing consequential is duplicated, so the apps stay consistent by construction rather than by discipline.",
    features: [
      "Brand platform: campaign creation, slot allocation, budget and performance",
      "Creator platform: discovery, applications, delivery and payouts",
      "Admin console: verification, fraud review, disputes and audit",
      "Escrow and wallet services holding funds until delivery is verified",
      "Ranking and verification services driving creator discovery",
      "Analytics on reach and engagement per campaign slot",
    ],
    stack: ["React", "TypeScript", "Vite", "Node.js", "Express", "MongoDB", "Queue workers", "Object storage"],
    challenges:
      "Designing the state machines — campaign, slot, escrow — so three products could act on the same entity without racing each other.",
    outcome:
      "Product architecture specification written alongside the build; the marketing site is live on a waitlist.",
    links: [{ label: "easilypromote.com", href: "https://easilypromote.com" }],
    hero: {
      src: img("easilypromote", "hero"),
      alt: "EasilyPromote campaign performance dashboard",
      device: "browser",
    },
    gallery: [
      { src: img("easilypromote", "shot-1"), alt: "Creator analytics and reach breakdown", device: "browser" },
      { src: img("easilypromote", "shot-2"), alt: "Campaign slot management", device: "browser" },
      { src: img("easilypromote", "shot-3"), alt: "Creator mobile delivery flow", device: "phone" },
    ],
    featured: true,
    accent: "#feb604",
    status: "verified",
  },

  /* ───────────────────────────  ILESURE  ──────────────────────── */
  {
    slug: "ilesure",
    title: "iléSure",
    tagline: "Student housing and roommate matching, verified end to end",
    group: "PRODUCT / STARTUPS",
    disciplines: ["PRODUCT", "MOBILE", "WEB", "FINTECH", "BACKEND"],
    typeLine: "MARKETPLACE / MOBILE / WEB / PAYMENTS",
    year: "2026",
    role: "Full-stack engineering & security audit",
    platform: "iOS · Android · four web apps · API",
    description:
      "A Nigerian student-housing marketplace. Agents, landlords and companies list properties; students book, pay in Naira, verify identity, sign a tenancy agreement and match with roommates. The name is Yoruba for “safe home”, which is also the product requirement.",
    problem:
      "Off-campus housing around Nigerian universities runs on word of mouth and forwarded messages. Students cannot tell a real listing from a fake one, roommate arrangements are made blind, and landlords have no signal of actual demand.",
    solution:
      "Verification as the spine of the product: agents clear NIN, BVN, proof of ownership and a live selfie before a listing goes live; companies additionally clear CAC and TIN. Payment amounts are computed server-side in every flow, and tenancy agreements are signed and issued as PDFs.",
    features: [
      "Tiered verification for agents, landlords and registered companies",
      "Listings, applications, waitlists and bookings",
      "Paystack payments in NGN with server-computed amounts",
      "Dojah identity verification",
      "E-signature tenancy agreements issued as PDFs",
      "Roommate compatibility matching and shared bookings",
      "In-app chat between students, agents and companies",
    ],
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "React",
      "Vite",
      "Node.js",
      "Express",
      "MongoDB",
      "Paystack",
      "Dojah",
    ],
    challenges:
      "I ran a full read-only security and correctness audit across all six repositories — backend, mobile and four web front-ends — writing up every finding against a file and line reference. The recurring pattern was trust boundaries enforced in one place instead of every place: refresh tokens honoured as access tokens, an admin gate that was a client-side boolean, and two shared-booking flows whose split paid the landlord twice. The audit is the deliverable I am proudest of here.",
    hero: { src: img("ilesure", "hero"), alt: "iléSure listing detail on mobile", device: "phone" },
    gallery: [
      { src: img("ilesure", "shot-1"), alt: "Property listing browse and filters", device: "phone" },
      { src: img("ilesure", "shot-2"), alt: "Booking and payment flow", device: "phone" },
      { src: img("ilesure", "shot-3"), alt: "Agent verification console", device: "browser" },
    ],
    featured: true,
    accent: "#f0894b",
    status: "verified",
  },

  /* ──────────────────────────  STOCKPEDIA  ─────────────────────── */
  {
    slug: "stockpedia",
    title: "Stockpedia",
    tagline: "Nigerian Exchange research, explained in plain language",
    group: "PRODUCT / STARTUPS",
    disciplines: ["PRODUCT", "WEB", "FINTECH"],
    typeLine: "FINTECH / RESEARCH / WEB",
    year: "2026",
    role: "Full-stack engineering",
    platform: "Web",
    description:
      "A stock research platform for companies listed on the Nigerian Exchange. Company profiles, prices, financial trends and educational content that explains each financial term in plain language with a worked example — aimed at first-time investors as much as active traders.",
    problem:
      "Nigerian retail investors research across the NGX site, broker platforms and news sites, in language written for professionals. Most tools prioritise US and EU markets, and metrics are shown with no indication of what good or bad looks like.",
    solution:
      "One place for NGX company data, with every metric carrying an explanation and a reference range, so a beginner and a seasoned trader can use the same screen at different depths.",
    features: [
      "NGX company profiles with prices and financial trends",
      "Plain-language explanations attached to financial terminology",
      "Sector comparison and trend analysis",
      "Progressive depth for beginner, intermediate and seasoned users",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    hero: { src: img("stockpedia", "hero"), alt: "Stockpedia company profile with price chart", device: "browser" },
    gallery: [
      { src: img("stockpedia", "shot-1"), alt: "Financial trend charts and sector comparison", device: "browser" },
      { src: img("stockpedia", "shot-2"), alt: "Plain-language term explanation panel", device: "phone" },
    ],
    featured: true,
    accent: "#2ecc8f",
    status: "verified",
  },

  /* ───────────────────────  RAF MOBILE APP  ───────────────────── */
  {
    slug: "raf-mobile",
    title: "RAF Mobile App",
    tagline: "Target savings and financial education, on mobile",
    group: "FINTECH / FINANCIAL SYSTEMS",
    disciplines: ["MOBILE", "FINTECH"],
    typeLine: "FINTECH / MOBILE / SAVINGS",
    year: "2026",
    role: "Mobile engineering",
    platform: "iOS · Android",
    description:
      "The RAF mobile app: a savings product built around goal-based plans, locked savings and community target savings, with a financial-education surface alongside it. Shipped through EAS.",
    features: [
      "Goal-based savings plans with system-calculated contribution schedules",
      "Locked savings and community / target savings",
      "Total savings balance with a per-plan breakdown",
      "Financial education and literacy content in-app",
      "Support surface inside the app",
    ],
    stack: ["React Native", "Expo", "EAS", "NativeWind", "Firebase"],
    hero: { src: img("raf-mobile", "hero"), alt: "RAF savings balance and plan breakdown", device: "phone" },
    gallery: [
      { src: img("raf-mobile", "shot-1"), alt: "Savings plan creation flow", device: "phone" },
      { src: img("raf-mobile", "shot-2"), alt: "Financial education library", device: "phone" },
    ],
    featured: false,
    accent: "#c9a227",
    status: "verified",
  },

  /* ──────────────────  RICH AUNTY FINANCE WEBSITE  ────────────── */
  {
    slug: "rich-aunty-finance",
    title: "Rich Aunty Finance",
    tagline: "The savings and financial-literacy web platform",
    group: "FINTECH / FINANCIAL SYSTEMS",
    disciplines: ["WEB", "FINTECH"],
    typeLine: "FINTECH / WEB / CONTENT",
    year: "2025 — 2026",
    role: "Frontend engineering",
    platform: "Web",
    description:
      "The public web platform for RAF: savings plans, financial-literacy articles and classes, and community tools. Content runs through a headless CMS so the education library can be maintained without a deploy.",
    features: [
      "Plan selection framed around a savings goal and a timeframe",
      "Financial literacy articles, classes and community tools",
      "CMS-driven blog and education library",
      "Beta access capture",
    ],
    stack: ["Next.js", "TypeScript", "Sanity CMS", "Vercel"],
    hero: {
      src: img("rich-aunty-finance", "hero"),
      alt: "Rich Aunty Finance savings plans page",
      device: "browser",
    },
    gallery: [
      { src: img("rich-aunty-finance", "shot-1"), alt: "Financial literacy article library", device: "browser" },
    ],
    featured: false,
    accent: "#c9a227",
    status: "verified",
  },

  /* ──────────────────────────  GRATEBRIDGE  ───────────────────── */
  {
    slug: "gratebridge",
    title: "Gratebridge Compliance",
    tagline: "Cross-border incorporation, licensing and market entry",
    group: "BUSINESS / ENTERPRISE",
    disciplines: ["PRODUCT", "WEB"],
    typeLine: "ENTERPRISE / COMPLIANCE / WEB",
    year: "2026",
    role: "Frontend engineering",
    platform: "Web",
    description:
      "A compliance platform for companies expanding across jurisdictions — incorporation, licensing and market entry presented as a tracked process rather than a services brochure.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    note: "Structure is built and wired to the data model. Feature detail and copy stay thin until the product material and screenshots are supplied.",
    hero: { src: img("gratebridge", "hero"), alt: "Gratebridge jurisdiction and licensing overview", device: "browser" },
    gallery: [
      { src: img("gratebridge", "shot-1"), alt: "Licensing stage tracker", device: "browser" },
      { src: img("gratebridge", "shot-2"), alt: "Market entry roadmap", device: "browser" },
    ],
    featured: false,
    accent: "#3e7bfa",
    status: "awaiting-assets",
  },

  /* ────────────────────────────  OLYVES  ──────────────────────── */
  {
    slug: "olyves",
    title: "Olyves",
    tagline: "A task marketplace where vendors bid for posted work",
    group: "BUSINESS / ENTERPRISE",
    disciplines: ["PRODUCT", "MOBILE"],
    typeLine: "MARKETPLACE / MOBILE / CROSS-PLATFORM",
    year: "2025 — 2026",
    role: "Mobile engineering",
    platform: "iOS · Android",
    description:
      "A cross-platform task marketplace connecting clients who post jobs with vendors who offer services. Vendors submit proposals against a posted task, including price negotiation and supplementary terms.",
    features: [
      "Task posting by clients and service offering by vendors",
      "Bidding system with vendor proposals",
      "Price negotiation and supplementary terms on a bid",
      "Push notification and auth infrastructure via Firebase",
    ],
    stack: ["React Native", "Expo", "TypeScript", "NativeWind", "Firebase"],
    hero: { src: img("olyves", "hero"), alt: "Olyves task feed and bid list", device: "phone" },
    gallery: [
      { src: img("olyves", "shot-1"), alt: "Task posting flow", device: "phone" },
      { src: img("olyves", "shot-2"), alt: "Vendor proposal and negotiation screen", device: "phone" },
    ],
    featured: false,
    accent: "#16c79a",
    status: "verified",
  },

  /* ────────────────────────────  HERMES  ──────────────────────── */
  {
    slug: "hermes",
    title: "Hermes",
    tagline: "Transactional email system for the Olyves platform",
    group: "BUSINESS / ENTERPRISE",
    disciplines: ["BACKEND", "TOOLS"],
    typeLine: "INFRASTRUCTURE / EMAIL / DESIGN SYSTEM",
    year: "2025",
    role: "Engineering",
    platform: "Component library · build pipeline",
    description:
      "The transactional email layer for Olyves — templates authored as React components, previewed in the browser during development and compiled to the table-based HTML that email clients actually render.",
    stack: ["React Email", "React", "Node.js"],
    note: "Version 01 of the email system. Detail expands when the template inventory is supplied.",
    hero: { src: img("hermes", "hero"), alt: "Hermes email template preview", device: "browser" },
    gallery: [{ src: img("hermes", "shot-1"), alt: "Compiled transactional email", device: "flat" }],
    featured: false,
    accent: "#5b8def",
    status: "awaiting-assets",
  },

  /* ───────────────────────────  HERMES 2  ─────────────────────── */
  {
    slug: "hermes2",
    title: "Hermes 02",
    tagline: "The second iteration of the Olyves email system",
    group: "BUSINESS / ENTERPRISE",
    disciplines: ["BACKEND", "TOOLS"],
    typeLine: "INFRASTRUCTURE / EMAIL / ITERATION",
    year: "2026",
    role: "Engineering",
    platform: "Component library · build pipeline",
    description:
      "A rebuild of the Hermes email system, presented alongside version 01 as an evolution rather than a separate product.",
    stack: ["React Email", "React", "Node.js"],
    note: "Version 02. The comparison against version 01 fills in once both template sets are supplied.",
    hero: { src: img("hermes2", "hero"), alt: "Hermes 02 email template preview", device: "browser" },
    gallery: [{ src: img("hermes2", "shot-1"), alt: "Version 01 and version 02 side by side", device: "flat" }],
    featured: false,
    accent: "#5b8def",
    status: "awaiting-assets",
  },

  /* ─────────────────────────  EL.AY BEAUTY  ───────────────────── */
  {
    slug: "elay-beauty",
    title: "EL.AY Beauty",
    tagline: "Booking and service management for a beauty studio",
    group: "OTHER PRODUCTS",
    disciplines: ["PRODUCT", "WEB"],
    typeLine: "LIFESTYLE / BOOKING / WEB",
    year: "2026",
    role: "Full-stack engineering",
    platform: "Web",
    description:
      "A booking platform for a beauty studio — services with size and duration variants, a gallery, and calendar-backed appointments. Built on Postgres through Prisma, with the visual layer given more expression than the technical projects in this portfolio.",
    features: [
      "Service catalogue with size variants and per-service galleries",
      "Appointment booking backed by a relational schema",
      "Cloudinary media pipeline",
      "Google APIs integration for calendar-side scheduling",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Tailwind CSS",
      "GSAP",
      "Framer Motion",
      "React Three Fiber",
      "Cloudinary",
    ],
    hero: { src: img("elay-beauty", "hero"), alt: "EL.AY Beauty service catalogue", device: "browser" },
    gallery: [
      { src: img("elay-beauty", "shot-1"), alt: "Booking calendar and time selection", device: "phone" },
      { src: img("elay-beauty", "shot-2"), alt: "Service gallery", device: "browser" },
    ],
    featured: false,
    accent: "#e8a0b8",
    status: "verified",
  },

  /* ────────────────  DISEASE OUTBREAK PREDICTION  ──────────────── */
  {
    slug: "disease-outbreak-prediction",
    title: "Disease Outbreak Prediction",
    tagline: "Forecasting outbreak signal from Nigerian surveillance data",
    group: "AI / MACHINE LEARNING",
    disciplines: ["AI / ML", "BACKEND"],
    typeLine: "MACHINE LEARNING / RESEARCH / API",
    year: "2025 — 2026",
    role: "ML engineering & research",
    platform: "Python pipeline · FastAPI service",
    description:
      "A machine-learning pipeline over Nigerian disease-surveillance data. NCDC outbreak records are cleaned and merged across inconsistent schemas, joined against climate, population and hospital features, and used to train both regression and deep sequence models, served through a FastAPI backend.",
    problem:
      "Surveillance data arrives in different schemas from year to year, with inconsistent naming against WHO references — most of the work is upstream of the model.",
    solution:
      "A reproducible pipeline: schema merge, WHO mapping audit and fill, feature build, versioned datasets, then training and evaluation as separate stages so a model can be rebuilt from raw sources.",
    features: [
      "NCDC outbreak record cleaning and cross-year schema merge",
      "WHO mapping audit and fill step",
      "Feature engineering over climate, population and hospital signals",
      "Regression and deep sequence model training paths",
      "Dataset versioning and a separate evaluation stage",
      "TensorBoard instrumentation during training",
      "FastAPI service exposing predictions, climate, population, hospital and insight routes",
    ],
    stack: ["Python", "FastAPI", "TensorFlow", "scikit-learn", "pandas", "TensorBoard"],
    challenges:
      "Reconciling NCDC schemas that change between reporting years, and auditing the WHO name mapping rather than trusting a fuzzy join.",
    outcome:
      "A research pipeline and API. This is a modelling project — it is not a clinically validated or deployed public-health system, and its outputs are not medical guidance.",
    hero: {
      src: img("disease-outbreak-prediction", "hero"),
      alt: "Outbreak prediction map and time series",
      device: "browser",
    },
    gallery: [
      { src: img("disease-outbreak-prediction", "shot-1"), alt: "Model pipeline: data to prediction", device: "flat" },
      {
        src: img("disease-outbreak-prediction", "shot-2"),
        alt: "Prediction timeline and evaluation charts",
        device: "browser",
      },
    ],
    featured: true,
    accent: "#45b0e3",
    status: "verified",
  },

  /* ─────────────────────  STOCK MARKET PREDICTOR  ──────────────── */
  {
    slug: "stock-market-predictor",
    title: "Stock Market Predictor",
    tagline: "Time-series forecasting over historical market data",
    group: "AI / MACHINE LEARNING",
    disciplines: ["AI / ML"],
    typeLine: "MACHINE LEARNING / TIME SERIES",
    year: "2025",
    role: "ML engineering",
    platform: "Python",
    description:
      "A time-series modelling project over historical market data, covering the pipeline from data through feature construction to evaluation.",
    stack: ["Python"],
    note: "The local project directory is currently empty, so nothing here is derived from source. Structure and placeholders are in place — supply the code or screenshots and this case study fills in. Model output is a forecast, not a guarantee.",
    hero: { src: img("stock-market-predictor", "hero"), alt: "Time series forecast chart", device: "browser" },
    gallery: [{ src: img("stock-market-predictor", "shot-1"), alt: "Model evaluation metrics", device: "flat" }],
    featured: false,
    accent: "#7bd389",
    status: "awaiting-assets",
  },

  /* ───────────────────────  MACHINE LEARNING  ──────────────────── */
  {
    slug: "machine-learning",
    title: "Machine Learning Archive",
    tagline: "Four applied experiments in vision and forecasting",
    group: "AI / MACHINE LEARNING",
    disciplines: ["AI / ML"],
    typeLine: "MACHINE LEARNING / ARCHIVE",
    year: "2024 — 2026",
    role: "ML engineering",
    platform: "Python · notebooks · services",
    description:
      "A working archive rather than a single product: four applied machine-learning builds kept together because each one exists to learn a technique end to end.",
    features: [
      "Crypto Price Prediction — forecasting service with its own backend, frontend, Docker compose setup and feature-importance analysis",
      "Image Classification with Neural Networks — CNN built with TensorFlow and Keras, with OpenCV preprocessing and augmentation",
      "Cats & Dogs Classification — 64×3 convolutional architecture trained from pickled feature tensors, instrumented with TensorBoard",
      "Real-Time Face Recognition — live recognition against a Firebase-backed database with a pre-computed encoding file",
    ],
    stack: ["Python", "TensorFlow", "Keras", "OpenCV", "scikit-learn", "FastAPI", "Docker", "Firebase"],
    hero: { src: img("machine-learning", "hero"), alt: "Machine learning experiment archive", device: "browser" },
    gallery: [{ src: img("machine-learning", "shot-1"), alt: "Training curves and feature importance", device: "flat" }],
    featured: false,
    accent: "#9aa5b1",
    status: "verified",
  },

  /* ──────────────────────────  CI GUARDIAN  ───────────────────── */
  {
    slug: "ci-guardian",
    title: "CI Guardian",
    tagline: "Pipeline risk scoring and failure diagnosis inside GitLab Duo",
    group: "AI / MACHINE LEARNING",
    disciplines: ["TOOLS", "BACKEND", "AI / ML"],
    typeLine: "DEVELOPER TOOLING / CI-CD / MCP",
    year: "2026",
    role: "Engineering",
    platform: "GitLab Duo agent · FastAPI service",
    description:
      "A developer-tooling agent for the GitLab Duo Agent Platform. It scores a .gitlab-ci.yml for risk before it merges, and when a pipeline does fail it reads the job logs and reports a root cause with a copy-pasteable fix. Built for the GitLab AI Hackathon.",
    problem:
      "A failed pipeline tells you it is broken, not why. CI configuration problems — undefined stages, missing caches, over-permissive jobs — are usually visible before the merge, and nobody looks.",
    solution:
      "Expose the analysis as Model Context Protocol tools so the Duo engine calls them natively rather than through a chatbot wrapper, and keep a history of analyses so pipeline health is trackable over time.",
    features: [
      "Risk score (0–100) across structural integrity, performance and security posture",
      "Structural validation: syntax errors, undefined stages, conflicting logic",
      "Performance checks: missing caches, redundant steps, inefficient job ordering",
      "Failure diagnosis from job logs with an identified root cause",
      "MCP tools — analyze_ci_yaml, get_structural_rules — exposed natively to Duo",
      "Analysis history tracking pipeline health over time",
    ],
    stack: ["Python", "FastAPI", "Model Context Protocol", "SQLAlchemy", "SQLite", "Docker", "GitLab Duo"],
    hero: { src: img("ci-guardian", "hero"), alt: "CI Guardian risk score and pipeline analysis", device: "browser" },
    gallery: [
      { src: img("ci-guardian", "shot-1"), alt: "Terminal output of a pipeline risk analysis", device: "flat" },
      { src: img("ci-guardian", "shot-2"), alt: "Failure diagnosis with root cause and fix", device: "browser" },
    ],
    featured: false,
    accent: "#ff8a3d",
    status: "verified",
  },

  /* ──────────────────────────  ELEEMOSY  ──────────────────────── */
  {
    slug: "eleemosy",
    title: "Eleemosy",
    tagline: "A foundation's platform for education, community and relief",
    group: "OTHER PRODUCTS",
    disciplines: ["PRODUCT", "WEB"],
    typeLine: "NON-PROFIT / WEB / CMS",
    year: "2026",
    role: "Full-stack engineering",
    platform: "Web",
    description:
      "The digital platform for Eleemosy, a foundation working across education, community development and relief programmes in Nigeria. Programme content and donation surfaces run through a headless CMS so the team publishes without an engineer.",
    features: [
      "Programme and initiative pages across education, community development and relief",
      "Donation surface with contextual detail",
      "CMS-driven content for a non-technical team",
    ],
    stack: ["Next.js", "TypeScript", "Sanity CMS", "Tailwind CSS"],
    hero: { src: img("eleemosy", "hero"), alt: "Eleemosy programmes overview", device: "browser" },
    gallery: [
      { src: img("eleemosy", "shot-1"), alt: "Initiative detail page", device: "browser" },
      { src: img("eleemosy", "shot-2"), alt: "Donation flow", device: "phone" },
    ],
    featured: false,
    accent: "#e9a03b",
    status: "verified",
  },

  /* ────────────────────────  TONA APP MODEL  ──────────────────── */
  {
    slug: "tona-app-model",
    title: "Tona App Model",
    tagline: "Two CNN classifiers for skin tone and undertone",
    group: "AI / MACHINE LEARNING",
    disciplines: ["AI / ML"],
    typeLine: "COMPUTER VISION / DEEP LEARNING",
    year: "2026",
    role: "ML engineering",
    platform: "PyTorch models",
    description:
      "Two deep convolutional classifiers for skin analysis: a four-class skin-tone model on ResNet50, and a six-class undertone model on EfficientNet-B3, trained on separate datasets with a shared training and evaluation harness.",
    features: [
      "Skin tone classifier — ResNet50, four classes, 36,417 images",
      "Undertone classifier — EfficientNet-B3, six classes, 4,808 images",
      "Shared data loader, trainer and inference modules across both models",
      "Evaluation on accuracy, F1, precision, recall and confusion matrix",
    ],
    stack: ["Python", "PyTorch", "ResNet50", "EfficientNet-B3", "torchvision"],
    outcome:
      "Target set at ≥85% test accuracy. Trained weights for both models are checked into the project; measured results are pending write-up.",
    challenges:
      "The two datasets are very different sizes — 36k images against 4.8k — so the undertone model needed a different regularisation posture than the tone model.",
    hero: { src: img("tona-app-model", "hero"), alt: "Skin tone and undertone classification output", device: "browser" },
    gallery: [{ src: img("tona-app-model", "shot-1"), alt: "Confusion matrix and training curves", device: "flat" }],
    featured: false,
    accent: "#d98e6a",
    status: "verified",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const getNextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};

export const FILTERS = ["ALL", "PRODUCT", "MOBILE", "WEB", "FINTECH", "AI / ML", "BACKEND", "TOOLS"] as const;

export type Filter = (typeof FILTERS)[number];
