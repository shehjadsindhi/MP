export const FALLBACK_PRODUCTS = [
  {
    id: "prod-s25-ultra",
    slug: "galaxy-s25-ultra",
    name: "Galaxy S25 Ultra",
    category: "Smartphones",
    price: 1299.99,
    originalPrice: 1399.99,
    discount: 7,
    rating: 4.9,
    reviewCount: 342,
    isFeatured: true,
    badge: "Flagship NPU",
    description: "The ultimate Galaxy AI smartphone crafted with Titanium frame, 200MP Quad Telephoto camera system, S-Pen precision, and Snapdragon 8 Gen 4 AI Engine.",
    image: "/images/nova_ultra.jpg",
    galleryJson: JSON.stringify(["/images/nova_ultra.jpg", "/images/nova_pro.jpg"]),
    colorsJson: JSON.stringify([
      { name: "Titanium Gray", hex: "#7d7f7d", inStock: true },
      { name: "Titanium Black", hex: "#22252a", inStock: true },
      { name: "Titanium Violet", hex: "#4c4863", inStock: true },
      { name: "Titanium Yellow", hex: "#d5c398", inStock: true }
    ]),
    storageJson: JSON.stringify([
      { size: "256GB", priceOffset: 0 },
      { size: "512GB", priceOffset: 120 },
      { size: "1TB", priceOffset: 360 }
    ]),
    specsJson: JSON.stringify({
      "Processor": "Snapdragon 8 Gen 4 for Galaxy (3nm)",
      "NPU": "Quantum Neural Engine (45 TOPS)",
      "Display": "6.8\" Dynamic AMOLED 2X, 1-120Hz, 2600 nits",
      "Camera": "200MP Main + 50MP Periscope (5x) + 50MP Tele (3x) + 50MP Ultra-Wide",
      "Battery": "5000 mAh with 45W Fast Charging",
      "Frame": "Grade 5 Titanium Armor Frame",
      "Security": "Knox Vault Hardware Security"
    }),
    aiFeaturesJson: JSON.stringify(["circle-to-search", "live-translate", "generative-edit", "note-assist", "transcript-assist", "ai-photo-editor"]),
    stock: 45,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod-fold-6",
    slug: "galaxy-z-fold-6",
    name: "Galaxy Z Fold 6",
    category: "Smartphones",
    price: 1899.99,
    originalPrice: 1999.99,
    discount: 5,
    rating: 4.8,
    reviewCount: 189,
    isFeatured: true,
    badge: "Dual-Screen AI",
    description: "Unfold a 7.6\" immersive tablet screen with dual-window Interpreter translation, multi-document Note Assist, and S-Pen Sketch to Image.",
    image: "/images/flex_5.jpg",
    galleryJson: JSON.stringify(["/images/flex_5.jpg", "/images/nova_ultra.jpg"]),
    colorsJson: JSON.stringify([
      { name: "Silver Shadow", hex: "#b8bcbe", inStock: true },
      { name: "Navy", hex: "#1e293b", inStock: true },
      { name: "Pink", hex: "#e2b8c2", inStock: true }
    ]),
    storageJson: JSON.stringify([
      { size: "256GB", priceOffset: 0 },
      { size: "512GB", priceOffset: 140 },
      { size: "1TB", priceOffset: 400 }
    ]),
    specsJson: JSON.stringify({
      "Main Display": "7.6\" Dynamic AMOLED 2X Foldable, 2600 nits",
      "Cover Display": "6.3\" Dynamic AMOLED 2X",
      "Processor": "Snapdragon 8 Gen 3 for Galaxy",
      "NPU": "Dual-Core NPU",
      "Weight": "239g ultra-light hinge",
      "Durability": "Armor Aluminum + IP48 Water Resistance"
    }),
    aiFeaturesJson: JSON.stringify(["interpreter", "note-assist", "circle-to-search", "sketch-to-image", "writing-assist"]),
    stock: 28,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod-s25-plus",
    slug: "galaxy-s25-plus",
    name: "Galaxy S25+",
    category: "Smartphones",
    price: 999.99,
    originalPrice: 1099.99,
    discount: 9,
    rating: 4.7,
    reviewCount: 215,
    isFeatured: true,
    badge: "Best Value",
    description: "Sleek 6.7\" QHD+ display with complete Galaxy AI suite, 4900mAh battery, and pro-grade 50MP triple lens photo system.",
    image: "/images/nova_pro.jpg",
    galleryJson: JSON.stringify(["/images/nova_pro.jpg"]),
    colorsJson: JSON.stringify([
      { name: "Onyx Black", hex: "#1c1d21", inStock: true },
      { name: "Marble Gray", hex: "#d1d5db", inStock: true },
      { name: "Cobalt Violet", hex: "#3b3355", inStock: true }
    ]),
    storageJson: JSON.stringify([
      { size: "256GB", priceOffset: 0 },
      { size: "512GB", priceOffset: 120 }
    ]),
    specsJson: JSON.stringify({
      "Display": "6.7\" QHD+ Dynamic AMOLED 2X, 120Hz",
      "Processor": "Snapdragon 8 Gen 4 for Galaxy",
      "Battery": "4900 mAh",
      "Camera": "50MP Main + 12MP Ultra-Wide + 10MP Telephoto (3x)"
    }),
    aiFeaturesJson: JSON.stringify(["circle-to-search", "live-translate", "writing-assist", "generative-edit"]),
    stock: 60,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod-tab-s10-ultra",
    slug: "galaxy-tab-s10-ultra",
    name: "Galaxy Tab S10 Ultra",
    category: "Tablets",
    price: 1199.99,
    originalPrice: 1299.99,
    discount: 8,
    rating: 4.9,
    reviewCount: 142,
    isFeatured: true,
    badge: "14.6\" Canvas",
    description: "Massive 14.6\" Dynamic AMOLED canvas built for multi-window AI productivity, PDF document overlay translation, and S-Pen handwriting OCR.",
    image: "/images/tab_ultra.jpg",
    galleryJson: JSON.stringify(["/images/tab_ultra.jpg"]),
    colorsJson: JSON.stringify([
      { name: "Moonstone Gray", hex: "#64748b", inStock: true },
      { name: "Platinum Silver", hex: "#e2e8f0", inStock: true }
    ]),
    storageJson: JSON.stringify([
      { size: "256GB", priceOffset: 0 },
      { size: "512GB", priceOffset: 150 },
      { size: "1TB", priceOffset: 450 }
    ]),
    specsJson: JSON.stringify({
      "Display": "14.6\" Dynamic AMOLED 2X, Anti-Reflective",
      "Processor": "MediaTek Dimensity 9300+ (4nm AI Engine)",
      "Included": "S-Pen in Box with Air Actions",
      "Battery": "11,200 mAh with 45W Charging"
    }),
    aiFeaturesJson: JSON.stringify(["note-assist", "sketch-to-image", "circle-to-search", "transcript-assist"]),
    stock: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod-buds-3-pro",
    slug: "galaxy-buds-3-pro",
    name: "Galaxy Buds3 Pro",
    category: "Audio",
    price: 249.99,
    originalPrice: 279.99,
    discount: 11,
    rating: 4.8,
    reviewCount: 512,
    isFeatured: false,
    badge: "Interpreter Earbuds",
    description: "Real-time voice translation streamed directly into your ears with Blade design LED light controls and 24-bit Hi-Fi audio output.",
    image: "/images/buds_pro.jpg",
    galleryJson: JSON.stringify(["/images/buds_pro.jpg"]),
    colorsJson: JSON.stringify([
      { name: "Silver Blade", hex: "#94a3b8", inStock: true },
      { name: "White Blade", hex: "#ffffff", inStock: true }
    ]),
    storageJson: JSON.stringify([{ size: "Standard", priceOffset: 0 }]),
    specsJson: JSON.stringify({
      "Audio": "24-bit / 96kHz Hi-Fi Audio with Dual Amplifiers",
      "AI ANC": "Adaptive Noise Control + Siren & Voice Detect",
      "Battery": "Up to 30 hours with charging case"
    }),
    aiFeaturesJson: JSON.stringify(["interpreter", "live-translate"]),
    stock: 90,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod-watch-ultra",
    slug: "galaxy-watch-ultra",
    name: "Galaxy Watch Ultra",
    category: "Watches",
    price: 649.99,
    originalPrice: 699.99,
    discount: 7,
    rating: 4.9,
    reviewCount: 280,
    isFeatured: false,
    badge: "Titanium 100m",
    description: "Rugged Grade 4 Titanium smartwatch with AI Energy Score, dual-frequency GPS, 100m water resistance, and multi-day battery endurance.",
    image: "/images/watch_7_pro.jpg",
    galleryJson: JSON.stringify(["/images/watch_7_pro.jpg"]),
    colorsJson: JSON.stringify([
      { name: "Titanium Gray", hex: "#475569", inStock: true },
      { name: "Titanium White", hex: "#f8fafc", inStock: true },
      { name: "Titanium Silver", hex: "#cbd5e1", inStock: true }
    ]),
    storageJson: JSON.stringify([{ size: "47mm LTE", priceOffset: 0 }]),
    specsJson: JSON.stringify({
      "Material": "Grade 4 Titanium Case with Sapphire Crystal",
      "Processor": "3nm 5-Core Exynos W1000",
      "Water Rating": "10ATM / IP68 / MIL-STD-810H"
    }),
    aiFeaturesJson: JSON.stringify(["writing-assist"]),
    stock: 35,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const FALLBACK_AI_FEATURES = [
  {
    id: "feat-circle-search",
    slug: "circle-to-search",
    name: "Circle to Search",
    category: "Search & Vision",
    icon: "Search",
    badge: "Most Popular",
    shortDesc: "Simply circle, highlight, or tap any image, video, or text on your screen to instantly get Google AI search results without switching apps.",
    fullDesc: "A groundbreaking search gesture created with Google. Whether you spot a pair of boots in a social feed, iconic architecture in a travel vlog, or a complex math equation, just circle it on screen with your finger or S-Pen for instant multimodal insights, price comparisons, and location context.",
    demoTab: "search",
    supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy Z Fold 6", "Galaxy Tab S10 Ultra"]),
    benefitsJson: JSON.stringify([
      "Instant visual lookup without taking screenshots or switching apps",
      "Deep AI overview summaries alongside real-time web results",
      "Multimodal query support — circle an item and type a follow-up question",
      "Works seamlessly across social media, YouTube, PDFs, and browser apps"
    ]),
    howItWorksJson: JSON.stringify([
      "Long-press the home button or navigation handle on your Galaxy device",
      "Use your finger or S-Pen to circle, highlight, or tap any object or text",
      "Galaxy AI analyzes the viewport and overlays rich Google AI search results",
      "Tap related suggestions or ask complex follow-up questions"
    ]),
    faqsJson: JSON.stringify([
      { q: "Does Circle to Search require an internet connection?", a: "Yes, Circle to Search utilizes Google's cloud AI infrastructure to return real-time web results and deep summaries." },
      { q: "Can I circle text in a foreign language to translate it?", a: "Yes! Circling foreign text offers instant on-screen translation overlays." },
      { q: "Is my screen content stored permanently?", a: "No, queries are processed securely per Google and Samsung privacy guidelines." }
    ]),
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "feat-live-translate",
    slug: "live-translate",
    name: "Live Translate",
    category: "Communication",
    icon: "Languages",
    badge: "On-Device NPU",
    shortDesc: "Two-way, real-time voice and text translations during phone calls in 16+ languages with zero lag and on-device privacy.",
    fullDesc: "Break language barriers effortlessly. Speak naturally in your native language, and the person on the other end hears your words translated in real-time. Works directly inside the native Phone app without needing external apps or cloud streaming.",
    demoTab: "translation",
    supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy Z Fold 6", "Galaxy Z Flip 6", "Galaxy Buds3 Pro"]),
    benefitsJson: JSON.stringify([
      "Live voice-to-voice translation in both directions simultaneously",
      "Real-time text transcript displayed on screen during the call",
      "100% on-device processing guarantees total privacy for sensitive conversations",
      "Supports 16+ global languages including Spanish, Korean, Japanese, French, German, and Hindi"
    ]),
    howItWorksJson: JSON.stringify([
      "Initiate or receive a call in the native Galaxy Phone app",
      "Tap the Call Assist button and select Live Translate",
      "Choose the target languages for caller and receiver",
      "Speak naturally — Galaxy AI translates your voice instantly"
    ]),
    faqsJson: JSON.stringify([
      { q: "Does Live Translate require mobile data?", a: "No! Language packs are stored locally on your device for fast offline processing." },
      { q: "Can the person on the other end use any smartphone brand?", a: "Yes! Live Translate converts your voice before sending audio over the cellular network." }
    ]),
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "feat-writing-assist",
    slug: "writing-assist",
    name: "Writing Assist",
    category: "Productivity",
    icon: "PenTool",
    badge: "Tone Changer",
    shortDesc: "Instantly adjust tone from professional to casual, generate concise message summaries, and correct grammar inside any chat app.",
    fullDesc: "Ensure your messages hit the exact right tone whether messaging a colleague, emailing a manager, or posting on social media. Built into the Samsung Keyboard for universal compatibility across all applications.",
    demoTab: "writing",
    supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy Z Fold 6", "Galaxy Tab S10 Ultra"]),
    benefitsJson: JSON.stringify([
      "5 distinct tone options: Professional, Casual, Polite, Social Emoji, and Concise",
      "Real-time grammar and spell-checking with stylistic suggestions",
      "Instant translation of typed messages in messaging apps"
    ]),
    howItWorksJson: JSON.stringify([
      "Type text into any app using the Samsung Keyboard",
      "Tap the Galaxy AI Sparkles icon on the keyboard toolbar",
      "Select Writing Style to view alternative rewritten versions",
      "Tap insert to replace your text with the selected tone"
    ]),
    faqsJson: JSON.stringify([
      { q: "Which messaging apps support Writing Assist?", a: "All apps that utilize the Samsung Keyboard support Writing Assist natively." }
    ]),
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "feat-generative-edit",
    slug: "generative-edit",
    name: "Generative Edit",
    category: "Creativity",
    icon: "Wand2",
    badge: "Creative Studio",
    shortDesc: "Relocate subjects, resize people, remove unwanted reflections, and seamlessly fill background borders with generative AI.",
    fullDesc: "Transform good shots into professional masterpieces. Select any person, pet, or object in a photo to move, enlarge, or remove them completely while AI intelligently reconstructs the background.",
    demoTab: "photo",
    supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy Z Fold 6", "Galaxy Tab S10 Ultra"]),
    benefitsJson: JSON.stringify([
      "Move or resize objects and people easily",
      "Remove reflections, shadows, and photobombers with one tap",
      "Generative canvas expansion to straighten tilted horizons"
    ]),
    howItWorksJson: JSON.stringify([
      "Open any photo in the Gallery app and tap Edit -> AI Sparkles",
      "Tap or draw around the subject you wish to move or remove",
      "Drag the subject to a new spot or tap the trash icon",
      "Tap Generate to synthesise seamless background details"
    ]),
    faqsJson: JSON.stringify([
      { q: "Does Generative Edit leave a watermark?", a: "Yes, edited photos include an invisible metadata tag and subtle Galaxy AI watermark." }
    ]),
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "feat-note-assist",
    slug: "note-assist",
    name: "Note Assist",
    category: "Productivity",
    icon: "FileCheck",
    badge: "Smart Format",
    shortDesc: "Transforms chaotic meeting notes and lectures into structured executive summaries, formatted bullet points, and actionable checklists.",
    fullDesc: "Streamline your study and work workflow. Auto-format long meeting notes, generate clean bulleted summaries, translate entire note documents, and auto-generate preview covers.",
    demoTab: "notes",
    supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy Z Fold 6", "Galaxy Tab S10 Ultra"]),
    benefitsJson: JSON.stringify([
      "Auto-format messy handwriting or raw text into organized headers",
      "Executive summary extraction in seconds",
      "PDF overlay translation directly onto original documents"
    ]),
    howItWorksJson: JSON.stringify([
      "Open any note in Samsung Notes",
      "Tap the Galaxy AI icon at the bottom toolbar",
      "Choose Auto Format, Summarize, Correct Spelling, or Translate",
      "Save the generated overview directly into your note folder"
    ]),
    faqsJson: JSON.stringify([
      { q: "Can Note Assist handle handwritten notes?", a: "Yes, S-Pen handwriting is recognized and summarized." }
    ]),
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "feat-transcript-assist",
    slug: "transcript-assist",
    name: "Transcript Assist",
    category: "Productivity",
    icon: "Mic",
    badge: "Multi-Speaker",
    shortDesc: "Records multi-speaker meetings, transcribes audio to text with speaker separation, and generates concise takeaway summaries.",
    fullDesc: "Never miss a key detail during lectures or meetings. Voice Recorder uses AI speech-to-text to separate up to 10 distinct speakers, generate complete text transcripts, and output bulleted meeting minutes.",
    demoTab: "notes",
    supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy Z Fold 6", "Galaxy Tab S10 Ultra"]),
    benefitsJson: JSON.stringify([
      "Multi-speaker diarization isolates individual voices accurately",
      "Full voice recording transcription in 16+ languages",
      "One-tap summary generation for quick catch-ups"
    ]),
    howItWorksJson: JSON.stringify([
      "Record a lecture or meeting using Voice Recorder app",
      "Tap Transcribe and select the spoken language",
      "View speaker-tagged transcript and tap Summarize for key takeaways"
    ]),
    faqsJson: JSON.stringify([
      { q: "How many speakers can Transcript Assist identify?", a: "It accurately distinguishes up to 10 unique speakers per recording." }
    ]),
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const FALLBACK_ARTICLES = [
  {
    id: "art-mastering-galaxy-ai",
    slug: "mastering-galaxy-ai-2-0",
    title: "Mastering Galaxy AI 2.0: 10 Hidden Features & Productivity Shortcuts",
    category: "AI Guides",
    author: "Dr. Elena Rostova, Senior AI Engineer",
    readTime: "6 min read",
    excerpt: "Discover advanced S-Pen shortcuts, instant PDF translations, dual-screen interpreter configurations, and custom prompt templates.",
    content: `Galaxy AI 2.0 represents a massive leap forward in personal computing. Built directly into One UI 6.1 and One UI 7, these intelligent capabilities allow users to automate complex everyday tasks without sacrificing security.

1. Multimodal Circle to Search Techniques
While most users know they can circle images, long-pressing text allows you to instant-translate entire paragraphs without taking screenshots. Furthermore, adding text queries after circling lets you perform complex research like: "Find where to buy this outfit near me".

2. Custom S-Pen Sketch to Image
Draw a quick rough sketch over any photo in Samsung Notes or Gallery. Select 'Sketch to Image' and choose between 3D Cartoon, Watercolor, Pop Art, or Illustration styles to bring your ideas to life instantly.

3. Offline On-Device Privacy Toggle
For users handling confidential business communications or medical records, navigate to Settings -> Advanced Features -> Galaxy AI, and enable 'Process Data Only on Device'.`,
    image: "/images/nova_ultra.jpg",
    tagsJson: JSON.stringify(["Galaxy AI", "Productivity", "S25 Ultra", "Tutorials"]),
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "art-knox-security-whitepaper",
    slug: "knox-vault-ai-privacy-whitepaper",
    title: "Knox Vault & Galaxy AI: How On-Device NPUs Guard Your Personal Data",
    category: "AI Tips",
    author: "Marcus Vance, CyberSecurity Director",
    readTime: "8 min read",
    excerpt: "An architectural overview of hardware-isolated enclaves, zero-knowledge cloud processing, and local vector embeddings.",
    content: `In an era where digital privacy is paramount, Samsung engineered Galaxy AI with a privacy-first architecture.

Hardware Isolation via Knox Vault
Sensitive biometric templates, cryptographic keys, and local AI voice embeddings are stored inside a dedicated secure hardware enclave isolated from the main Android OS.

Zero-Knowledge Cloud Encryption
When cloud-assisted tasks like complex Generative Edit background fills are performed, sensitive data is encrypted end-to-end, processed in memory, and immediately discarded without user profile indexing.`,
    image: "/images/flex_5.jpg",
    tagsJson: JSON.stringify(["Security", "Knox Vault", "On-Device", "Privacy"]),
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "art-camera-ai-guide",
    slug: "s25-ultra-generative-photography-guide",
    title: "The Ultimate Guide to Galaxy S25 Ultra Generative Photography",
    category: "Device Guides",
    author: "Sarah Lin, Computational Photography Lead",
    readTime: "5 min read",
    excerpt: "Learn how to eliminate glare, fix motion blur, remaster low-light Nightography shots, and composite subjects with Generative Edit.",
    content: `The camera on the Galaxy S25 Ultra isn't just optics — it's an intelligent vision engine.

Eliminating Window Glare
When taking photos through train or plane windows, open the image in Gallery, tap the 'i' Info button, and select 'Erase Reflections'. Galaxy AI analyzes light diffraction to restore deep clarity.

Studio Relighting
Adjust virtual studio spotlights after taking a portrait to highlight your subject from any angle.`,
    image: "/images/nova_pro.jpg",
    tagsJson: JSON.stringify(["Camera", "Photography", "Generative Edit", "S25 Ultra"]),
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const FALLBACK_OFFERS = [
  {
    id: "offer-student-pass",
    title: "Galaxy AI Student Pass",
    description: "Get up to 20% instant educational discount on Galaxy S25 Ultra, Tab S10 Ultra & Galaxy Buds3 Pro with verified student email.",
    code: "STUDENT2025",
    discountPercent: 15,
    discountAmount: 0,
    minSpend: 500,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    eligibleCategory: "All",
    badge: "Exclusive Student Deal",
    image: "/images/tab_ultra.jpg",
    isActive: true,
    createdAt: new Date()
  },
  {
    id: "offer-tradein-credit",
    title: "Guaranteed $800 Trade-in Credit",
    description: "Trade in any eligible flagship smartphone and receive up to $800 trade-in value towards Galaxy S25 Ultra or Galaxy Z Fold 6.",
    code: "TRADEIN800",
    discountPercent: 0,
    discountAmount: 200,
    minSpend: 999,
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    eligibleCategory: "Smartphones",
    badge: "Limited Time Trade-in",
    image: "/images/nova_ultra.jpg",
    isActive: true,
    createdAt: new Date()
  }
];
