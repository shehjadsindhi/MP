export const FALLBACK_PRODUCTS = [
  {
    id: "s26u-2026-0001-4e40-81de-077d622f149a",
    slug: "galaxy-s26-ultra",
    name: "Galaxy S26 Ultra",
    category: "Smartphones",
    price: 1399.99,
    originalPrice: 1519.99,
    discount: 8,
    rating: 4.9,
    reviewCount: 356,
    isFeatured: true,
    badge: "Flagship AI Titan",
    description: "The definitive Galaxy AI flagship. Powered by Snapdragon 8 Elite Gen 5 for Galaxy, the world's first built-in Privacy Display on mobile, a 200 MP Wide F1.4 camera with ProVisual Engine, and a 5,000 mAh all-day battery.",
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
      "Display": "17.49 cm (6.9\") Dynamic AMOLED 2X with built-in Privacy Display",
      "Processor": "Snapdragon 8 Elite Gen 5 for Galaxy",
      "NPU": "Next-generation on-device NPU for Galaxy AI",
      "Main Camera": "200 MP Wide F1.4 + 50 MP Ultra Wide F1.9 + 50 MP Telephoto F2.9",
      "Battery": "5,000 mAh ultra-long lasting all-day battery",
      "Camera Engine": "ProVisual Engine with 47% improved brightness on the 200 MP Wide camera",
      "Cooling": "New Vapor Chamber design — 21% greater thermal performance",
      "OS": "One UI 9 with Galaxy AI"
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
    id: "zfold8-2026-0002-4ebe-a6cd-6dc615bd695f",
    slug: "galaxy-z-fold8",
    name: "Galaxy Z Fold8",
    category: "Smartphones",
    price: 1999.99,
    originalPrice: 2099.99,
    discount: 5,
    rating: 4.8,
    reviewCount: 212,
    isFeatured: true,
    badge: "World's Lightest Fold",
    description: "At just 201 g, the world's lightest fold. Unfold a large immersive screen powered by Snapdragon 8 Elite Gen 5 for Galaxy, with a flatter Armor FlexHinge and dual 50 MP Wide and Ultra Wide cameras.",
    image: "/images/flex_5.jpg",
    galleryJson: JSON.stringify(["/images/flex_5.jpg", "/images/nova_ultra.jpg"]),
    colorsJson: JSON.stringify([
      { name: "Silver Shadow", hex: "#b8bcbe", inStock: true },
      { name: "Navy", hex: "#1e293b", inStock: true },
      { name: "Crafted Black", hex: "#09090b", inStock: true },
      { name: "Pink Gold", hex: "#f472b6", inStock: false }
    ]),
    storageJson: JSON.stringify([
      { size: "256GB", priceOffset: 0 },
      { size: "512GB", priceOffset: 140 },
      { size: "1TB", priceOffset: 400 }
    ]),
    specsJson: JSON.stringify({
      "Main Display": "Large unfoldable Dynamic AMOLED 2X, 1-120Hz, nearly invisible crease",
      "Cover Display": "Cover display with 10 MP cover screen camera",
      "Processor": "Snapdragon 8 Elite Gen 5 for Galaxy (next-gen CPU, GPU, NPU)",
      "Camera": "50 MP Wide F1.8 + 50 MP Ultra Wide F1.9",
      "Battery": "4,800 mAh (typ.) — up to 26 hours of video playback",
      "Weight": "201 g — the world's lightest fold",
      "Build": "Corning Gorilla Glass Ceramic 3 (front) & Gorilla Glass Victus 2 (back), durable Armor FlexHinge",
      "Durability": "IP48 water & dust resistant",
      "OS": "One UI 9 (optimized for fully open or fully closed; FlexMode not supported)"
    }),
    aiFeaturesJson: JSON.stringify(["circle-to-search", "live-translate", "writing-assist", "generative-edit", "note-assist", "transcript-assist", "interpreter", "sketch-to-image"]),
    stock: 28,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "zfold8u-2026-0003-aac1-25933bace250",
    slug: "galaxy-z-fold8-ultra",
    name: "Galaxy Z Fold8 Ultra",
    category: "Smartphones",
    price: 2399.99,
    originalPrice: 2499.99,
    discount: 4,
    rating: 4.9,
    reviewCount: 168,
    isFeatured: false,
    badge: "Ultimate Fold",
    description: "The largest and most powerful Fold yet — bigger 4,854 mAh rated battery, Snapdragon 8 Elite Gen 5 for Galaxy, and the flattest Armor FlexHinge Samsung has engineered.",
    image: "/images/flex_5.jpg",
    galleryJson: JSON.stringify(["/images/flex_5.jpg", "/images/nova_ultra.jpg"]),
    colorsJson: JSON.stringify([
      { name: "Titanium Gray", hex: "#475569", inStock: true },
      { name: "Whiteshore", hex: "#e2e8f0", inStock: true }
    ]),
    storageJson: JSON.stringify([
      { size: "512GB", priceOffset: 0 },
      { size: "1TB", priceOffset: 220 }
    ]),
    specsJson: JSON.stringify({
      "Processor": "Snapdragon 8 Elite Gen 5 for Galaxy",
      "Battery": "4,854 mAh rated capacity — the largest in the Fold8 series",
      "Build": "Armor FlexHinge with flatter main screen, Gorilla Glass Ceramic 3 & Victus 2",
      "Durability": "IP48 water & dust resistant",
      "OS": "One UI 9"
    }),
    aiFeaturesJson: JSON.stringify(["circle-to-search", "live-translate", "writing-assist", "generative-edit", "note-assist", "transcript-assist", "interpreter", "sketch-to-image"]),
    stock: 18,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "zflip8-2026-0004-6d23-46dd-87e8-9b27b5499853",
    slug: "galaxy-z-flip8",
    name: "Galaxy Z Flip8",
    category: "Smartphones",
    price: 1199.99,
    originalPrice: 1299.99,
    discount: 8,
    rating: 4.8,
    reviewCount: 187,
    isFeatured: true,
    badge: "Pocket Studio AI",
    description: "The thinnest, lightest Flip yet. All-new larger FlexWindow with Now Brief, FlexCam powered by ProVisual Engine, Super Steady Video, and Exynos 2600 for Galaxy.",
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
      "Main Display": "Unfoldable Dynamic AMOLED 2X, 120Hz",
      "Cover Display": "All-new larger FlexWindow with real-time Mirror view up to 120 fps",
      "Processor": "Exynos 2600 for Galaxy (faster NPU, GPU, CPU)",
      "Camera": "50 MP Wide FlexCam + 12 MP Ultra Wide, 10 MP main screen camera",
      "Battery": "4,300 mAh (typ.) — up to 31 hours of video playback",
      "Build": "Durable Armor FlexHinge, Corning Gorilla Glass Victus 2 (front)",
      "Durability": "IP48 water & dust resistant",
      "AI Highlights": "Now Brief on FlexWindow, Super Steady Video with Horizontal Lock, Gemini Notebook",
      "OS": "One UI 9 with customizable FlexWindow home & app tray"
    }),
    aiFeaturesJson: JSON.stringify(["interpreter", "ai-photo-editor", "generative-edit", "writing-assist", "circle-to-search"]),
    stock: 40,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "tabs12u-2026-0005-c7ed-4974-b198-d65423472f6a",
    slug: "galaxy-tab-s12-ultra",
    name: "Galaxy Tab S12 Ultra",
    category: "Tablets",
    price: 1299.99,
    originalPrice: 1399.99,
    discount: 7,
    rating: 4.9,
    reviewCount: 98,
    isFeatured: true,
    badge: "14.6\" Creator Canvas",
    description: "A 36.99 cm (14.6\") Dynamic AMOLED 2X WQXGA+ canvas with an 11,600 mAh battery delivering up to 23 hours of video, in-box S Pen, and Personalized Now Brief.",
    image: "/images/tab_ultra.jpg",
    galleryJson: JSON.stringify(["/images/tab_ultra.jpg"]),
    colorsJson: JSON.stringify([
      { name: "Memory Gray", hex: "#64748b", inStock: true },
      { name: "Platinum Silver", hex: "#e2e8f0", inStock: true }
    ]),
    storageJson: JSON.stringify([
      { size: "256GB / 12GB RAM", priceOffset: 0 },
      { size: "512GB / 12GB RAM", priceOffset: 150 },
      { size: "1TB / 16GB RAM", priceOffset: 450 }
    ]),
    specsJson: JSON.stringify({
      "Display": "36.99 cm (14.6\") Dynamic AMOLED 2X, 2960 x 1848 (WQXGA+), 16M colours",
      "Processor": "Octa-core (4.21 GHz / 3.5 GHz / 2.7 GHz)",
      "Camera": "13 MP + 8 MP rear with AF, 12 MP front, UHD 4K (3840 x 2160) @60fps",
      "Battery": "11,600 mAh — up to 23 hours video playback, Super Fast Charging 2.0",
      "Memory & Storage": "Up to 16 GB RAM and 1 TB storage, microSD expansion up to 2 TB",
      "Included": "S Pen in box",
      "Connectivity": "Wi-Fi 7 (802.11be), Bluetooth v6.0, USB 3.2 Gen 1",
      "AI": "Personalized Now Brief with customizable content cards",
      "Dimensions": "208.5 x 326.3 x 5.1 mm, 692 g (Wi-Fi) / 695 g (5G)"
    }),
    aiFeaturesJson: JSON.stringify(["note-assist", "sketch-to-image", "circle-to-search", "transcript-assist", "writing-assist"]),
    stock: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "wcu2-2026-0006-73ca-41cc-aa67-02e1cf4f2eca",
    slug: "galaxy-watch-ultra2",
    name: "Galaxy Watch Ultra2",
    category: "Watches",
    price: 749.99,
    originalPrice: 799.99,
    discount: 6,
    rating: 4.9,
    reviewCount: 312,
    isFeatured: true,
    badge: "Dive-Ready Titanium",
    description: "Rugged titanium body with the world's first up-to-5,000-nit display on a smartwatch, the largest 800 mAh battery on a Galaxy Watch (up to 60 hours), Snapdragon Wear Elite, and EN13319 dive certification.",
    image: "/images/watch_7_pro.jpg",
    galleryJson: JSON.stringify(["/images/watch_7_pro.jpg"]),
    colorsJson: JSON.stringify([
      { name: "Titanium Silver", hex: "#cbd5e1", inStock: true },
      { name: "Titanium Gray", hex: "#475569", inStock: true }
    ]),
    storageJson: JSON.stringify([{ size: "47mm LTE", priceOffset: 0 }]),
    specsJson: JSON.stringify({
      "Display": "3.85 cm, 498 x 498, up to 5,000 nits — the brightest ever on a Galaxy Watch",
      "Processor": "Snapdragon Wear Elite Platform (2.1 GHz / 1.95 GHz, penta-core)",
      "Battery": "800 mAh — up to 60 hrs with AOD on / 80 hrs AOD off; Fast Charging up to 40% in ~30 mins",
      "Durability": "Titanium body, IP69K, 10 ATM, EN13319-certified dive-ready to 40 m",
      "Sensors": "Accelerometer, Barometer, BIA, Electrical Heart (ECG), Gyro, Geomagnetic, Light, Optical HR, Temperature",
      "Connectivity": "Bluetooth v6.0, NFC, GPS / Glonass / Beidou / Galileo / QZSS, Wi-Fi",
      "OS": "Wear OS powered by Samsung",
      "Health": "Sleep Apnea 2.0 tracking, continuous health monitoring",
      "Size": "47.4 x 47.1 x 10.7 mm, 61.5 g — 47mm, Titanium Silver & Titanium Gray"
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
    supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Tab S12 Ultra"]),
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
    supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Z Flip8", "Galaxy Buds3 Pro"]),
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
    supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Tab S12 Ultra", "Galaxy Book4 Ultra"]),
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
    supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Tab S12 Ultra"]),
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
    supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Tab S12 Ultra"]),
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
    supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Tab S12 Ultra"]),
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
    supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Z Flip8", "Galaxy Watch Ultra2"]),
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
    fullDesc: "Hold seamless in-person conversations across different languages. On foldable devices like Galaxy Z Fold8 or Z Flip8, both parties can view live translated text facing them simultaneously on inner and cover screens.",
    demoTab: "translation",
    supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Z Flip8", "Galaxy Buds3 Pro"]),
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
    supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Tab S12 Ultra", "Galaxy Z Fold8"]),
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
    tagsJson: JSON.stringify(["Galaxy AI", "Productivity", "S26 Ultra", "Tutorials"]),
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
    slug: "s26-ultra-generative-photography-guide",
    title: "The Ultimate Guide to Galaxy S26 Ultra Generative Photography",
    category: "Device Guides",
    author: "Sarah Lin, Computational Photography Lead",
    readTime: "5 min read",
    excerpt: "Learn how to eliminate glare, fix motion blur, remaster low-light Nightography shots, and composite subjects with Generative Edit.",
    content: `The camera on the Galaxy S26 Ultra isn't just optics — it's an intelligent vision engine built around the 200 MP Wide F1.4 sensor and ProVisual Engine.

### Eliminating Window Glare
When taking photos through train or plane windows, open the image in Gallery, tap the 'i' Info button, and select 'Erase Reflections'. Galaxy AI analyzes light diffraction to restore deep clarity.

### Studio Relighting
Adjust virtual studio spotlights after taking a portrait to highlight your subject from any angle.`,
    image: "/images/nova_pro.jpg",
    tagsJson: JSON.stringify(["Camera", "Photography", "Generative Edit", "S26 Ultra"]),
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
Write freely on the Galaxy Tab S12 Ultra or S26 Ultra screen. Note Assist automatically straightens uneven handwriting and converts cursive notes into editable digital text with high OCR accuracy.

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
When conversing with a local resident, activate Interpreter mode. On foldables like the Galaxy Z Fold8, enable Cover Screen View so both parties see translated speech facing them simultaneously.`,
    image: "/images/flex_5.jpg",
    tagsJson: JSON.stringify(["Travel", "Translation", "Interpreter", "Offline"]),
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "art-health-ecosystem",
    slug: "galaxy-buds-and-watch-health-ai-ecosystem",
    title: "Biometric Harmony: Galaxy Watch Ultra2 & Buds3 Pro AI Health Ecosystem",
    category: "News",
    author: "Dr. Jonathan Hayes, Sports Medicine Specialist",
    readTime: "4 min read",
    excerpt: "Explore how Galaxy AI computes your daily Energy Score and delivers real-time voice coaching through your earbuds.",
    content: `Wearable technology has evolved from tracking passive step counts to predicting cognitive readiness and metabolic strain.

### The Galaxy AI Energy Score
Every morning, Galaxy AI evaluates your previous day's physical exertion, sleep stages, sleeping heart rate variability (HRV), and breathing stability to compute a holistic Energy Score from 1 to 100.

### Real-Time In-Ear Audio Coaching
While running or cycling with Galaxy Buds3 Pro, the AI monitors your heart rate zones from Galaxy Watch Ultra2 and whispers personalized pacing cues directly into your ears.`,
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
    description: "Get double the storage on Galaxy S26 Ultra for the price of the base tier plus $150 trade-in credit.",
    code: "GALAXYAI2026",
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
    title: "Foldable Revolution: 10% Off Galaxy Z Fold8",
    description: "Experience the ultimate foldable AI productivity powerhouse with free S-Pen Pro case included.",
    code: "FOLD8AI",
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
    description: "Save 12% on Galaxy Tab S12 Ultra and Galaxy Book4 Ultra with verified student discount.",
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
    description: "Buy any Galaxy flagship smartphone and get Galaxy Watch Ultra2 or Galaxy Buds3 Pro at 25% off.",
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
