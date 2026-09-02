export const FALLBACK_PRODUCTS = [
  {
    id: "ca7bea88-b14b-4e40-81de-077d622f149a",
    slug: "galaxy-s25-ultra",
    name: "Galaxy S25 Ultra",
    category: "Smartphones",
    price: 1299.99,
    originalPrice: 1419.99,
    discount: 8,
    rating: 4.9,
    reviewCount: 342,
    isFeatured: true,
    badge: "Flagship AI Titan",
    description: "The definitive Galaxy AI flagship. Powered by Snapdragon 8 Elite with upgraded Neural Processing Unit, built-in Titanium S-Pen, 200MP quad-telephoto optical zoom, and groundbreaking on-device generative intelligence.",
    image: "/images/nova_ultra.jpg",
    galleryJson: JSON.stringify(["/images/nova_ultra.jpg", "/images/nova_pro.jpg", "/images/flex_5.jpg"]),
    colorsJson: JSON.stringify([
      { name: "Titanium Silver", hex: "#94a3b8", inStock: true },
      { name: "Titanium Black", hex: "#0f172a", inStock: true },
      { name: "Titanium Jade", hex: "#0d9488", inStock: true },
      { name: "Titanium Blue", hex: "#0284c7", inStock: true }
    ]),
    storageJson: JSON.stringify([
      { size: "256GB", priceOffset: 0 },
      { size: "512GB", priceOffset: 120 },
      { size: "1TB", priceOffset: 340 }
    ]),
    specsJson: JSON.stringify({
      "Display": "6.8\" Dynamic AMOLED 2X, QHD+, 1-120Hz LTPO, 2600 nits",
      "Processor": "Snapdragon 8 Elite Mobile Platform for Galaxy (3nm)",
      "NPU": "Quantum NPU with 45 TOPS AI Performance",
      "Main Camera": "200MP Wide + 50MP Periscope (5x) + 10MP Tele (3x) + 50MP Ultra-Wide",
      "Battery": "5,000 mAh with 45W Super Fast Charging 2.0 & Fast Wireless 2.0",
      "Build": "Titanium Frame with Corning Gorilla Armor Glass",
      "Security": "Samsung Knox Vault with EAL5+ Hardware Protection",
      "OS Updates": "7 Generations of Android OS upgrades & 7 Years of Security"
    }),
    aiFeaturesJson: JSON.stringify([
      "circle-to-search",
      "live-translate",
      "writing-assist",
      "generative-edit",
      "note-assist",
      "transcript-assist",
      "ai-photo-editor",
      "sketch-to-image"
    ]),
    stock: 45,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "acb9f3eb-7211-4ebe-a6cd-6dc615bd695f",
    slug: "galaxy-s25-plus",
    name: "Galaxy S25+",
    category: "Smartphones",
    price: 999.99,
    originalPrice: 1099.99,
    discount: 9,
    rating: 4.7,
    reviewCount: 215,
    isFeatured: true,
    badge: "Best Value Flagship",
    description: "The sweet spot of flagship performance. Featuring a 6.7\" QHD+ Dynamic AMOLED 2X display, pro-grade 50MP triple lens photo system, and full Galaxy AI suite.",
    image: "/images/nova_pro.jpg",
    galleryJson: JSON.stringify(["/images/nova_pro.jpg", "/images/nova_ultra.jpg"]),
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
      "Display": "6.7\" QHD+ Dynamic AMOLED 2X, 120Hz, 2600 nits",
      "Processor": "Snapdragon 8 Elite Mobile Platform for Galaxy",
      "NPU": "Quantum NPU with On-Device AI Acceleration",
      "Main Camera": "50MP Main + 12MP Ultra-Wide + 10MP Telephoto (3x)",
      "Battery": "4,900 mAh with 45W Fast Charging",
      "Security": "Samsung Knox Vault Protection"
    }),
    aiFeaturesJson: JSON.stringify(["circle-to-search", "live-translate", "writing-assist", "generative-edit", "note-assist"]),
    stock: 60,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "acfa473e-6af2-4723-aac1-25933bace250",
    slug: "galaxy-z-fold-6",
    name: "Galaxy Z Fold 6",
    category: "Smartphones",
    price: 1899.99,
    originalPrice: 1999.99,
    discount: 5,
    rating: 4.8,
    reviewCount: 189,
    isFeatured: true,
    badge: "Dual-Screen AI Workstation",
    description: "Unfold a 7.6\" immersive tablet screen with dual-window Interpreter mode, split-screen Note Assist, and precision S-Pen Sketch to Image.",
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
      "Main Display": "7.6\" Dynamic AMOLED 2X Foldable, 1-120Hz, 2600 nits",
      "Cover Display": "6.3\" Dynamic AMOLED 2X, 120Hz",
      "Processor": "Snapdragon 8 Gen 3 for Galaxy",
      "NPU": "Dual-Core AI Engine for Foldable Multi-Window",
      "Durability": "Enhanced Armor Aluminum & IP48 Water Resistance",
      "Weight": "239g ultra-light hinge design"
    }),
    aiFeaturesJson: JSON.stringify(["interpreter", "note-assist", "circle-to-search", "sketch-to-image", "writing-assist"]),
    stock: 28,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "59273dcb-6d23-46dd-87e8-9b27b5499853",
    slug: "galaxy-z-flip-6",
    name: "Galaxy Z Flip 6",
    category: "Smartphones",
    price: 1099.99,
    originalPrice: 1199.99,
    discount: 8,
    rating: 4.7,
    reviewCount: 165,
    isFeatured: false,
    badge: "Compact Flex AI",
    description: "Pocket-sized foldable with 3.4\" FlexWindow cover screen, Auto Zoom FlexCam, and hands-free Interpreter conversation mode.",
    image: "/images/flex_5.jpg",
    galleryJson: JSON.stringify(["/images/flex_5.jpg"]),
    colorsJson: JSON.stringify([
      { name: "Silver Shadow", hex: "#94a3b8", inStock: true },
      { name: "Mint", hex: "#a7f3d0", inStock: true },
      { name: "Yellow", hex: "#fde047", inStock: true },
      { name: "Blue", hex: "#93c5fd", inStock: true }
    ]),
    storageJson: JSON.stringify([
      { size: "256GB", priceOffset: 0 },
      { size: "512GB", priceOffset: 120 }
    ]),
    specsJson: JSON.stringify({
      "Main Display": "6.7\" Dynamic AMOLED 2X Foldable, 120Hz",
      "Cover Display": "3.4\" Super AMOLED FlexWindow",
      "Processor": "Snapdragon 8 Gen 3 for Galaxy",
      "Camera": "50MP Wide + 12MP Ultra-Wide with ProVisual Engine",
      "Battery": "4,000 mAh with 25W Fast Charging"
    }),
    aiFeaturesJson: JSON.stringify(["interpreter", "ai-photo-editor", "generative-edit", "writing-assist"]),
    stock: 35,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "856a056d-c7ed-4974-b198-d65423472f6a",
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
      "Display": "14.6\" Dynamic AMOLED 2X, Anti-Reflective, 120Hz",
      "Processor": "MediaTek Dimensity 9300+ (4nm Flagship AI Engine)",
      "Included": "S-Pen in Box with Bluetooth Air Actions",
      "Battery": "11,200 mAh with 45W Fast Charging",
      "Durability": "Enhanced Armor Aluminum & IP68 Dust/Water Resistance"
    }),
    aiFeaturesJson: JSON.stringify(["note-assist", "sketch-to-image", "circle-to-search", "transcript-assist"]),
    stock: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "f604bf10-73ca-41cc-aa67-02e1cf4f2eca",
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
      "Material": "Grade 4 Titanium Case with Sapphire Crystal Glass",
      "Processor": "3nm 5-Core Exynos W1000",
      "Water Rating": "10ATM / IP68 / MIL-STD-810H Military Standard",
      "Sensors": "BioActive Sensor (ECG, Heart Rate, BIA, Sleep Apnea)"
    }),
    aiFeaturesJson: JSON.stringify(["writing-assist"]),
    stock: 35,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "6b758448-82f0-404a-9828-3c181ea0c6a2",
    slug: "galaxy-buds3-pro",
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
      "Audio": "24-bit / 96kHz Hi-Fi Audio with Dual 2-Way Amplifiers",
      "AI ANC": "Adaptive Noise Control + Siren & Voice Detect",
      "Battery": "Up to 30 hours with charging case",
      "Connectivity": "Bluetooth 5.4 with Auto Switch"
    }),
    aiFeaturesJson: JSON.stringify(["interpreter", "live-translate"]),
    stock: 90,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "a64375c4-ce0a-4b19-9145-6f23f970f565",
    slug: "galaxy-book4-ultra",
    name: "Galaxy Book4 Ultra",
    category: "Accessories",
    price: 2399.99,
    originalPrice: 2599.99,
    discount: 8,
    rating: 4.8,
    reviewCount: 94,
    isFeatured: false,
    badge: "AI Laptop Workstation",
    description: "Next-gen laptop workstation with Intel Core Ultra 9, NVIDIA RTX 4070, Dynamic AMOLED 2X touch display, and Microsoft Copilot+ Galaxy AI cross-device synergy.",
    image: "/images/tab_ultra.jpg",
    galleryJson: JSON.stringify(["/images/tab_ultra.jpg"]),
    colorsJson: JSON.stringify([
      { name: "Moonstone Gray", hex: "#475569", inStock: true }
    ]),
    storageJson: JSON.stringify([
      { size: "1TB SSD / 32GB RAM", priceOffset: 0 },
      { size: "2TB SSD / 64GB RAM", priceOffset: 350 }
    ]),
    specsJson: JSON.stringify({
      "Display": "16\" Dynamic AMOLED 2X, 3K (2880x1800), 120Hz Touch",
      "Processor": "Intel Core Ultra 9 185H with Integrated NPU",
      "GPU": "NVIDIA GeForce RTX 4070 Laptop GPU (8GB GDDR6)",
      "Battery": "76Wh with 140W USB-C Super Fast Charging"
    }),
    aiFeaturesJson: JSON.stringify(["writing-assist", "note-assist", "generative-edit"]),
    stock: 15,
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
      "On-device processing via Quantum NPU for privacy and low latency",
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
    supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy Z Fold 6", "Galaxy Tab S10 Ultra", "Galaxy Book4 Ultra"]),
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
  },
  {
    id: "feat-ai-photo-editor",
    slug: "ai-photo-editor",
    name: "AI Photo Editor & Remaster",
    category: "Creativity",
    icon: "Sliders",
    badge: "Studio Suite",
    shortDesc: "Remaster dynamic range, upscale resolution, eliminate glare, and studio-relight portraits in seconds.",
    fullDesc: "An intelligent photo enhancement suite. Automatically detects flaws like backlighting, glass reflections, and motion blur, offering one-tap remediation.",
    demoTab: "photo",
    supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy Z Fold 6", "Galaxy Z Flip 6"]),
    benefitsJson: JSON.stringify([
      "One-tap remastering enhances sharpness, color saturation, and dynamic range",
      "Reflection and shadow eraser tools restore obscured details",
      "Portrait studio relighting adjusts virtual light sources"
    ]),
    howItWorksJson: JSON.stringify([
      "Open any photo in Gallery and swipe up to view AI suggestions",
      "Tap Remaster, Erase Reflections, or Erase Shadows",
      "Compare before and after with the interactive split-slider"
    ]),
    faqsJson: JSON.stringify([
      { q: "Can it remaster old, low-resolution photos?", a: "Yes, the AI upscales and sharpens legacy compressed photos." }
    ]),
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "feat-interpreter",
    slug: "interpreter",
    name: "Interpreter Mode",
    category: "Communication",
    icon: "MessageSquare",
    badge: "Dual-Screen",
    shortDesc: "Face-to-face conversational translation with dual-screen view for foldable phones and wireless earbud audio sync.",
    fullDesc: "Hold seamless in-person conversations across different languages. On foldable devices like Galaxy Z Fold 6 or Flip 6, both parties can view live translated text facing them simultaneously on inner and cover screens.",
    demoTab: "translation",
    supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy Z Fold 6", "Galaxy Z Flip 6", "Galaxy Buds3 Pro"]),
    benefitsJson: JSON.stringify([
      "Dual-screen interface allows natural eye contact while reading translations",
      "Operates 100% offline with downloaded language packages",
      "Simultaneous audio playback through Galaxy Buds3 Pro"
    ]),
    howItWorksJson: JSON.stringify([
      "Open Quick Settings and tap Interpreter",
      "Select the two spoken languages",
      "Tap the Dual-Screen icon to display the translation on the cover display"
    ]),
    faqsJson: JSON.stringify([
      { q: "Does Interpreter work without internet?", a: "Yes, it runs locally on the on-device NPU." }
    ]),
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "feat-sketch-to-image",
    slug: "sketch-to-image",
    name: "Sketch to Image",
    category: "Creativity",
    icon: "Palette",
    badge: "S-Pen AI",
    shortDesc: "Turn simple sketches and doodles into stunning artworks, 3D objects, and photorealistic elements using generative AI.",
    fullDesc: "Bring rough concepts to life. Draw a simple sketch with your S-Pen or finger over a photo or blank canvas, choose a style (Watercolor, Illustration, 3D Cartoon, Pop Art), and watch Galaxy AI transform it into a masterpiece.",
    demoTab: "photo",
    supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy Z Fold 6", "Galaxy Tab S10 Ultra"]),
    benefitsJson: JSON.stringify([
      "Transforms rough doodles into high-resolution rendered graphics",
      "Multiple aesthetic styles: 3D Cartoon, Watercolor, Sketch, Pop Art",
      "Overlay generated elements directly onto real photos"
    ]),
    howItWorksJson: JSON.stringify([
      "Open Samsung Notes or Gallery and activate Sketch to Image",
      "Draw a rough outline of an object or scenery",
      "Select your preferred rendering style and tap Generate"
    ]),
    faqsJson: JSON.stringify([
      { q: "Does Sketch to Image require an S-Pen?", a: "No, you can also sketch with your finger, though S-Pen provides greater precision." }
    ]),
    isFeatured: false,
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
    author: "Dr. Elena Rostova, Senior AI Research Lead",
    readTime: "6 min read",
    excerpt: "Discover advanced S-Pen shortcuts, instant PDF translations, dual-screen interpreter configurations, and custom prompt templates.",
    content: `Galaxy AI 2.0 represents a massive leap forward in personal computing. Built directly into One UI, these intelligent capabilities allow users to automate complex everyday tasks without sacrificing privacy.

### 1. Multimodal Circle to Search Techniques
While most users know they can circle images, long-pressing text allows you to instant-translate entire paragraphs without taking screenshots. Furthermore, adding text queries after circling lets you perform complex research like: "Find where to buy this outfit near me".

### 2. Custom S-Pen Sketch to Image
Draw a quick rough sketch over any photo in Samsung Notes or Gallery. Select 'Sketch to Image' and choose between 3D Cartoon, Watercolor, Pop Art, or Illustration styles to bring your ideas to life instantly.

### 3. Offline On-Device Privacy Toggle
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
    content: `In an era where digital privacy is paramount, Galaxy AI was engineered with a privacy-first hybrid architecture.

### Hardware Isolation via Knox Vault
Sensitive biometric templates, cryptographic keys, and local AI voice embeddings are stored inside a dedicated secure hardware enclave isolated from the main Android OS.

### Zero-Knowledge Cloud Encryption
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

### Eliminating Window Glare
When taking photos through train or plane windows, open the image in Gallery, tap the 'i' Info button, and select 'Erase Reflections'. Galaxy AI analyzes light diffraction to restore deep clarity.

### Studio Relighting
Adjust virtual studio spotlights after taking a portrait to highlight your subject from any angle.`,
    image: "/images/nova_pro.jpg",
    tagsJson: JSON.stringify(["Camera", "Photography", "Generative Edit", "S25 Ultra"]),
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "art-note-assist-guide",
    slug: "10x-productivity-with-note-assist-and-s-pen",
    title: "10x Your Meeting & Lecture Productivity with Note Assist & S-Pen",
    category: "Tutorials",
    author: "David Chen, Enterprise Workflow Architect",
    readTime: "7 min read",
    excerpt: "Step-by-step masterclass on auto-formatting handwriting, generating executive bullet points, and translating PDFs.",
    content: `Taking messy notes during high-speed meetings or university lectures is inevitable. Galaxy Note Assist bridges the gap between chaotic scribbles and actionable executive summaries.

### 1. S-Pen Handwriting Recognition & Alignment
Write freely on the Galaxy Tab S10 Ultra or S25 Ultra screen. Note Assist automatically straightens uneven handwriting and converts cursive notes into editable digital text with high OCR accuracy.

### 2. Auto-Format Meeting Minutes
Tap Note Assist on any multi-page document to automatically insert structured headers, bulleted takeaways, and to-do checkboxes with assigned deadlines.`,
    image: "/images/tab_ultra.jpg",
    tagsJson: JSON.stringify(["Productivity", "Notes", "S-Pen", "Business"]),
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "art-travel-guide",
    slug: "travelers-guide-to-live-translate-and-interpreter",
    title: "The Ultimate Traveler's Guide to Live Translate & Offline Interpreter",
    category: "Device Guides",
    author: "Amira Patel, Global Travel Journalist",
    readTime: "5 min read",
    excerpt: "How to navigate foreign airports, book train tickets, and dine in remote villages with zero language barriers using Galaxy AI.",
    content: `Traveling internationally is exhilarating until you need to explain a food allergy to a chef in Tokyo or negotiate a taxi in Rome. Here is how Galaxy AI solves international communication.

### Pre-Trip Preparation: Download Offline Language Packs
1. Go to **Settings > Galaxy AI > Live Translate > Language Packs**.
2. Download your destination languages (e.g., Japanese, Italian, Spanish, Korean, Mandarin).
3. Once downloaded, all speech synthesis and translation execute 100% offline without requiring international roaming data.

### Face-to-Face with Interpreter Mode
When conversing with a local resident, activate Interpreter mode. On foldable devices like Galaxy Z Fold 6, enable Cover Screen View so both parties see translated speech facing them simultaneously.`,
    image: "/images/flex_5.jpg",
    tagsJson: JSON.stringify(["Travel", "Translation", "Interpreter", "Offline"]),
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "art-health-ecosystem",
    slug: "galaxy-buds-and-watch-health-ai-ecosystem",
    title: "Biometric Harmony: Galaxy Watch Ultra & Buds3 Pro AI Health Ecosystem",
    category: "News",
    author: "Dr. Jonathan Hayes, Sports Medicine Specialist",
    readTime: "4 min read",
    excerpt: "Explore how Galaxy AI computes your daily Energy Score and delivers real-time voice coaching through your earbuds.",
    content: `Wearable technology has evolved from tracking passive step counts to predicting cognitive readiness and metabolic strain.

### The Galaxy AI Energy Score
Every morning, Galaxy AI evaluates your previous day's physical exertion, sleep stages, sleeping heart rate variability (HRV), and breathing stability to compute a holistic Energy Score from 1 to 100.

### Real-Time In-Ear Audio Coaching
While running or cycling with Galaxy Buds3 Pro, the AI monitors your heart rate zones from Galaxy Watch Ultra and whispers personalized pacing cues directly into your ears.`,
    image: "/images/buds_pro.jpg",
    tagsJson: JSON.stringify(["Health", "Wearables", "Audio", "Fitness"]),
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "art-circle-search-guide",
    slug: "mastering-circle-to-search-complete-guide",
    title: "Mastering Circle to Search: 10 Hidden Gestures & Multimodal Techniques",
    category: "AI Guides",
    author: "Dr. Elena Rostova, Senior AI Research Lead",
    readTime: "5 min read",
    excerpt: "Unlock on-screen math problem solving, live text translation overlays, and product shopping without taking screenshots.",
    content: `Circle to Search created in collaboration with Google enables effortless discovery.

### 1. Instant Text Highlighting & Translation
Rather than only circling images, dragging your finger across foreign language paragraphs translates the text directly in place over the original viewport.

### 2. Multimodal Follow-Up Prompts
Circle an object and immediately type: "How do I style this?" or "Where can I find recipes with this ingredient?" for structured AI overview summaries.`,
    image: "/images/nova_ultra.jpg",
    tagsJson: JSON.stringify(["Search", "Google AI", "Tutorials", "Gesture"]),
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "art-privacy-deep-dive",
    slug: "on-device-vs-cloud-ai-privacy-deep-dive",
    title: "Your AI. Your Privacy: On-Device NPU vs Cloud Processing Deep Dive",
    category: "AI Tips",
    author: "Marcus Vance, CyberSecurity Director",
    readTime: "6 min read",
    excerpt: "Understand how Galaxy AI dynamically balances sub-15ms on-device latency with cloud neural cluster computational power.",
    content: `Modern mobile AI requires balancing latency, power consumption, and data privacy.

### The On-Device Neural Engine
Functions like Live Translate, Voice Recorder transcription, and Keyboard tone styling execute directly on the phone's Neural Processing Unit without transmitting data to external servers.

### Cloud Neural Assistance
Complex generative photo expansions and document synthesis are handled by cloud clusters with zero persistent user profiling and explicit opt-in controls.`,
    image: "/images/flex_5.jpg",
    tagsJson: JSON.stringify(["Privacy", "NPU", "Cloud AI", "Security"]),
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "art-photo-masterclass",
    slug: "generative-edit-photo-masterclass",
    title: "Generative Photo Edit Masterclass: Transform Any Shot",
    category: "Tutorials",
    author: "Sarah Lin, Computational Photography Lead",
    readTime: "5 min read",
    excerpt: "Learn professional subject relocation, reflection removal, and horizon expansion workflows.",
    content: `Turn imperfect snapshots into studio-grade photography with Generative Edit.

### 1. Erasing Unwanted Photobombers
Tap Edit in the Gallery, tap the AI sparkles, draw a loose boundary around any background distraction, and tap Delete. Generative AI seamlessly reconstructs the background texture.

### 2. Straightening Tilted Horizons
When rotating a photo, the AI automatically synthesizes the missing corner pixels so you don't lose any of your original image canvas to cropping.`,
    image: "/images/nova_pro.jpg",
    tagsJson: JSON.stringify(["Photography", "Generative Edit", "Tutorials", "Studio"]),
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const FALLBACK_OFFERS = [
  {
    id: "offer-launch-special",
    title: "Galaxy AI Launch Special: Free Storage Upgrade",
    description: "Get double the storage on Galaxy S25 Ultra or Galaxy S25+ for the price of the base tier plus $150 trade-in credit.",
    code: "GALAXYAI2025",
    discountPercent: 15,
    discountAmount: 150,
    minSpend: 900,
    validUntil: new Date("2026-12-31"),
    eligibleCategory: "Smartphones",
    badge: "Exclusive Launch Offer",
    image: "/images/nova_ultra.jpg",
    isActive: true,
    createdAt: new Date()
  },
  {
    id: "offer-foldable-deal",
    title: "Foldable Revolution: 10% Off Galaxy Z Fold 6",
    description: "Experience the ultimate foldable AI productivity powerhouse with free S-Pen Pro case included.",
    code: "FOLD6AI",
    discountPercent: 10,
    discountAmount: 190,
    minSpend: 1500,
    validUntil: new Date("2026-11-30"),
    eligibleCategory: "Smartphones",
    badge: "Flagship Deal",
    image: "/images/flex_5.jpg",
    isActive: true,
    createdAt: new Date()
  },
  {
    id: "offer-student-pass",
    title: "Student & Educator AI Tech Bundle",
    description: "Save 12% on Galaxy Tab S10 Ultra and Galaxy Book4 Ultra with verified student discount.",
    code: "STUDENTAI12",
    discountPercent: 12,
    discountAmount: 140,
    minSpend: 700,
    validUntil: new Date("2026-10-31"),
    eligibleCategory: "Tablets",
    badge: "Education Discount",
    image: "/images/tab_ultra.jpg",
    isActive: true,
    createdAt: new Date()
  },
  {
    id: "offer-wearables-bundle",
    title: "Wearables & Audio Bundle Savings",
    description: "Buy any Galaxy flagship smartphone and get Galaxy Watch Ultra or Galaxy Buds3 Pro at 25% off.",
    code: "ECOSYSTEM25",
    discountPercent: 25,
    discountAmount: 60,
    minSpend: 240,
    validUntil: new Date("2026-12-15"),
    eligibleCategory: "Audio",
    badge: "Bundle & Save",
    image: "/images/buds_pro.jpg",
    isActive: true,
    createdAt: new Date()
  },
  {
    id: "offer-welcome-50",
    title: "VIP Welcome Discount",
    description: "Enjoy $50 off your first purchase on any Galaxy AI device or accessory storewide.",
    code: "WELCOME50",
    discountPercent: 0,
    discountAmount: 50,
    minSpend: 200,
    validUntil: new Date("2027-01-01"),
    eligibleCategory: "All",
    badge: "First Order",
    image: "/images/watch_7_pro.jpg",
    isActive: true,
    createdAt: new Date()
  }
];
