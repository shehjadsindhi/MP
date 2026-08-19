const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding for Galaxy AI Hub...");

  // 1. Clean existing records safely
  await prisma.aIInteraction.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.aIFeature.deleteMany();
  await prisma.article.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123456", 10);
  const userPasswordHash = await bcrypt.hash("User@123456", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Galaxy Admin",
      email: process.env.ADMIN_EMAIL || "admin@galaxyai.hub",
      password: adminPasswordHash,
      role: "ADMIN",
      phone: "+1 (555) 019-2831",
      address: "100 Innovation Way, Tech Park",
      city: "San Jose",
      postalCode: "95110",
      country: "United States",
      savedPersona: "Professional",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "Alex Mercer",
      email: "user@galaxyai.hub",
      password: userPasswordHash,
      role: "USER",
      phone: "+1 (555) 392-8471",
      address: "742 Evergreen Terrace",
      city: "Springfield",
      postalCode: "97477",
      country: "United States",
      savedPersona: "Creator",
    },
  });

  console.log("👤 Created Admin and Demo Users.");

  // 3. Create AI Features
  const aiFeatures = [
    {
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
    },
    {
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
        "100% on-device processing via Quantum NPU for absolute privacy",
        "Works across cellular calls and compatible third-party VoIP apps"
      ]),
      howItWorksJson: JSON.stringify([
        "Tap Call Assist when initiating or receiving a phone call",
        "Select Live Translate and choose your language and the caller's language",
        "Speak normally — the phone translates and speaks aloud in real-time",
        "Read the live dual-language transcript on your screen"
      ]),
      faqsJson: JSON.stringify([
        { q: "Does Live Translate work offline?", a: "Yes! Once you download your desired language pack, translations occur completely on-device without data." },
        { q: "Does the other caller need a Galaxy device?", a: "No! The translation happens on your Galaxy device and speaks directly into the audio call." }
      ]),
      isFeatured: true,
    },
    {
      slug: "writing-assist",
      name: "Writing Assist",
      category: "Productivity",
      icon: "PenTool",
      badge: "Tone Changer",
      shortDesc: "Instantly adjust tone from professional to casual, generate concise message summaries, and correct grammar inside any chat app.",
      fullDesc: "Perfect your tone before hitting send. Whether crafting a polite email to a client, an engaging social post with relevant hashtags, or translating a chat message in real time, Writing Assist ensures your message conveys the exact right emotion and precision.",
      demoTab: "writing",
      supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy Z Fold 6", "Galaxy Tab S10 Ultra", "Galaxy Book4 Ultra"]),
      benefitsJson: JSON.stringify([
        "5 tone transformations: Professional, Casual, Polite, Social, and Concise",
        "Real-time spelling, punctuation, and contextual grammar corrections",
        "Built directly into Samsung Keyboard — works in WhatsApp, Slack, Gmail, and Instagram",
        "Instant foreign message translation inside active chat bubbles"
      ]),
      howItWorksJson: JSON.stringify([
        "Type your draft message in any application using Samsung Keyboard",
        "Tap the Galaxy AI sparkle icon on the keyboard toolbar",
        "Select 'Writing Tone' or 'Spelling and Grammar'",
        "Preview the AI-generated variations and tap to insert your favorite"
      ]),
      faqsJson: JSON.stringify([
        { q: "Can Writing Assist write full emails from scratch?", a: "Yes, you can provide a bulleted prompt and Writing Assist will compose a complete formatted email." },
        { q: "Which languages are supported?", a: "Over 16 major languages with dialect support are currently enabled." }
      ]),
      isFeatured: true,
    },
    {
      slug: "generative-edit",
      name: "Generative Edit",
      category: "Creativity",
      icon: "Wand2",
      badge: "Creative Studio",
      shortDesc: "Relocate subjects, resize people, remove unwanted reflections, and seamlessly fill background borders with generative AI.",
      fullDesc: "Reimagine every photograph. Straighten crooked horizons while AI generates missing background details, move a person closer to center stage, or eliminate photobombers and reflections with a single tap.",
      demoTab: "photo",
      supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy Z Fold 6", "Galaxy Tab S10 Ultra"]),
      benefitsJson: JSON.stringify([
        "Move, resize, or erase people and objects with smart edge detection",
        "Auto-fill background borders when rotating or expanding crop boundaries",
        "Erase shadows and window reflections from glass surfaces",
        "Invisible watermarks and metadata tagging for responsible AI transparency"
      ]),
      howItWorksJson: JSON.stringify([
        "Open any photo in Samsung Gallery and tap the Edit (pencil) icon",
        "Tap the Galaxy AI sparkle button to enter Generative Edit mode",
        "Circle or hold down on the object you want to move or remove",
        "Drag the object or tap the eraser, then tap 'Generate' to blend"
      ]),
      faqsJson: JSON.stringify([
        { q: "How long does generation take?", a: "Generative filling typically completes in 2 to 4 seconds using cloud neural clusters." },
        { q: "Are edited photos labeled as AI-generated?", a: "Yes, an subtle AI watermark is added to the corner and embedded in EXIF metadata." }
      ]),
      isFeatured: true,
    },
    {
      slug: "note-assist",
      name: "Note Assist",
      category: "Productivity",
      icon: "FileCheck",
      badge: "Smart Format",
      shortDesc: "Transforms chaotic meeting notes and lectures into structured executive summaries, formatted bullet points, and actionable checklists.",
      fullDesc: "Take raw thoughts, lecture scribbles, or messy meeting notes in Samsung Notes and let Galaxy AI format them with clean headers, bulleted takeaways, grammar polish, and auto-generated cover thumbnails for effortless organization.",
      demoTab: "notes",
      supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy Tab S10 Ultra", "Galaxy Z Fold 6"]),
      benefitsJson: JSON.stringify([
        "One-tap auto-formatting with aesthetic headers, dividers, and bullet hierarchies",
        "Executive summaries highlighting key decisions and action items",
        "Real-time handwriting alignment and spell check for S-Pen users",
        "Cover page generation with icons and color-coded tags"
      ]),
      howItWorksJson: JSON.stringify([
        "Write or paste your notes inside Samsung Notes",
        "Tap the Galaxy AI sparkle icon on the bottom toolbar",
        "Choose 'Auto Format', 'Summarize', 'Correct Spelling', or 'Translate'",
        "Select your preferred formatting style and replace or add as a new page"
      ]),
      faqsJson: JSON.stringify([
        { q: "Does Note Assist support handwritten notes?", a: "Yes! S-Pen handwritten notes are first recognized via OCR and then formatted." }
      ]),
      isFeatured: true,
    },
    {
      slug: "transcript-assist",
      name: "Transcript Assist",
      category: "Productivity",
      icon: "Mic",
      badge: "Multi-Speaker",
      shortDesc: "Records multi-speaker meetings, transcribes audio to text with speaker separation, and generates concise takeaway summaries.",
      fullDesc: "Never miss a meeting detail. Using advanced speech-to-text and on-device voice recognition, Transcript Assist labels Speaker 1, Speaker 2, translates into different languages, and creates instant executive summaries with key actionable tasks.",
      demoTab: "notes",
      supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy Z Fold 6", "Galaxy Tab S10 Ultra"]),
      benefitsJson: JSON.stringify([
        "Automatic speaker diarization (separates up to 10 distinct voices)",
        "Time-synced transcripts with tap-to-listen playback",
        "Instant bulleted meeting summary with assigned action items",
        "Full transcript translation into 16+ languages"
      ]),
      howItWorksJson: JSON.stringify([
        "Open Voice Recorder and record your meeting, interview, or lecture",
        "Tap 'Transcribe' when recording finishes",
        "Galaxy AI identifies individual speakers and generates a clean script",
        "Tap 'Summary' to generate a high-level executive takeaway"
      ]),
      faqsJson: JSON.stringify([
        { q: "What is the maximum audio length?", a: "Recordings up to 3 hours can be transcribed in a single session." }
      ]),
      isFeatured: false,
    },
    {
      slug: "ai-photo-editor",
      name: "AI Photo Editor & Remaster",
      category: "Creativity",
      icon: "Sliders",
      badge: "Optics AI",
      shortDesc: "Intelligently analyzes photos to suggest optimal remastering: eliminate glass reflections, enhance dynamic range, and add studio lighting.",
      fullDesc: "Edit Suggestion scans each capture and offers tailored single-touch optimizations. Turn standard photos into long exposures, remove shadow glare from museum exhibits, and remaster vintage low-res photos with AI depth generation.",
      demoTab: "photo",
      supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy Z Flip 6", "Galaxy Watch Ultra"]),
      benefitsJson: JSON.stringify([
        "Context-aware recommendations: Remaster, Erase Shadows, Erase Reflections",
        "Instant portrait background blur with 24-bit depth map simulation",
        "Low-light detail enhancement and noise suppression",
        "Instant 24fps to 120fps Instant Slow-Mo on any video"
      ]),
      howItWorksJson: JSON.stringify([
        "Swipe up on any photo in the Gallery to open Details",
        "Review the AI-generated Edit Suggestions tailored specifically to that shot",
        "Tap 'Remaster' or 'Erase Reflections' to apply changes instantly",
        "Use the split slider to compare before and after"
      ]),
      faqsJson: JSON.stringify([
        { q: "Can it remaster old scanned photos?", a: "Yes, the AI upscaler enhances clarity, sharpens textures, and removes compression artifacts." }
      ]),
      isFeatured: true,
    },
    {
      slug: "interpreter",
      name: "Interpreter Mode",
      category: "Communication",
      icon: "MessageSquare",
      badge: "Dual Screen",
      shortDesc: "Split-screen dual conversation interface that translates face-to-face interactions live without requiring cellular data.",
      fullDesc: "Traveling abroad? Place your Galaxy phone between you and a local speaker. The screen splits so each person reads the translated transcript facing them, while audio plays naturally in real time.",
      demoTab: "translation",
      supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy Z Flip 6", "Galaxy Z Fold 6", "Galaxy Buds3 Pro"]),
      benefitsJson: JSON.stringify([
        "Dual-screen view utilizing Cover Screen on foldable devices for natural eye contact",
        "Hands-free listening mode with Galaxy Buds3 Pro real-time whisper translation",
        "100% offline functionality with downloadable language modules",
        "Mic sensitivity beamforming for noisy café and street environments"
      ]),
      howItWorksJson: JSON.stringify([
        "Swipe down the Quick Settings panel and tap 'Interpreter'",
        "Set your native language and the conversation partner's language",
        "Select Flex Mode or Dual Screen layout if using a Foldable",
        "Tap the mic button and begin speaking naturally"
      ]),
      faqsJson: JSON.stringify([
        { q: "How does it work with Galaxy Buds?", a: "Your voice is translated and played through the phone speaker while their response plays directly in your earbuds." }
      ]),
      isFeatured: true,
    },
    {
      slug: "sketch-to-image",
      name: "Sketch to Image",
      category: "Creativity",
      icon: "Palette",
      badge: "S-Pen Power",
      shortDesc: "Doodle a quick sketch on any photo or canvas with your S-Pen, and watch Galaxy AI turn it into a photorealistic 3D element.",
      fullDesc: "Add a butterfly to a portrait, a stylish hat, sunglasses, or futuristic architecture to a landscape. Sketch to Image interprets your basic pencil outline and generates high-fidelity art that matches the lighting, shadows, and textures of the scene.",
      demoTab: "photo",
      supportedDevicesJson: JSON.stringify(["Galaxy S25 Ultra", "Galaxy Tab S10 Ultra", "Galaxy Z Fold 6"]),
      benefitsJson: JSON.stringify([
        "Transforms simple outlines into realistic 3D textures in seconds",
        "Matches background lighting, reflections, and perspective automatically",
        "Multiple rendering styles: Photorealistic, Watercolor, Illustration, 3D Cartoon",
        "Generates 4 distinct options per sketch for easy selection"
      ]),
      howItWorksJson: JSON.stringify([
        "Open Air Command or tap the Sketch to Image icon in Samsung Gallery / Notes",
        "Draw any rough sketch over the photo or blank canvas",
        "Select your preferred artistic style and tap 'Generate'",
        "Browse the 4 AI-rendered variations and save your favorite"
      ]),
      faqsJson: JSON.stringify([
        { q: "Do I need artistic skills?", a: "Not at all! Even simple stick figures or basic geometric shapes generate beautiful details." }
      ]),
      isFeatured: false,
    },
  ];

  for (const feat of aiFeatures) {
    await prisma.aIFeature.create({ data: feat });
  }
  console.log(`✨ Seeded ${aiFeatures.length} AI Features.`);

  // 4. Create Products
  const products = [
    {
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
      aiFeaturesJson: JSON.stringify(["circle-to-search", "live-translate", "writing-assist", "generative-edit", "note-assist", "transcript-assist", "ai-photo-editor", "sketch-to-image"]),
      stock: 45,
    },
    {
      slug: "galaxy-s25-plus",
      name: "Galaxy S25+",
      category: "Smartphones",
      price: 999.99,
      originalPrice: 1099.99,
      discount: 9,
      rating: 4.8,
      reviewCount: 218,
      isFeatured: true,
      badge: "Sleek Powerhouse",
      description: "Streamlined elegance with expansive 6.7-inch QHD+ display, full suite of Galaxy AI tools, lightning-fast charging, and Armor Aluminum durability.",
      image: "/images/nova_pro.jpg",
      galleryJson: JSON.stringify(["/images/nova_pro.jpg", "/images/nova_ultra.jpg"]),
      colorsJson: JSON.stringify([
        { name: "Cobalt Violet", hex: "#6366f1", inStock: true },
        { name: "Onyx Black", hex: "#1e293b", inStock: true },
        { name: "Marble Gray", hex: "#cbd5e1", inStock: true },
        { name: "Amber Yellow", hex: "#fbbf24", inStock: true }
      ]),
      storageJson: JSON.stringify([
        { size: "256GB", priceOffset: 0 },
        { size: "512GB", priceOffset: 120 }
      ]),
      specsJson: JSON.stringify({
        "Display": "6.7\" Dynamic AMOLED 2X, QHD+, 1-120Hz, 2600 nits",
        "Processor": "Snapdragon 8 Elite / Exynos 2500 Dual Architecture",
        "NPU": "High-Efficiency 38 TOPS Neural Engine",
        "Main Camera": "50MP Dual Pixel Wide + 10MP Tele (3x) + 12MP Ultra-Wide",
        "Battery": "4,900 mAh with 45W Super Fast Charging",
        "Build": "Enhanced Armor Aluminum & Gorilla Glass Victus 2",
        "Security": "Knox Vault Hardware Protection",
        "OS Updates": "7 Years OS & Security Updates"
      }),
      aiFeaturesJson: JSON.stringify(["circle-to-search", "live-translate", "writing-assist", "generative-edit", "note-assist", "ai-photo-editor"]),
      stock: 60,
    },
    {
      slug: "galaxy-z-fold-6",
      name: "Galaxy Z Fold 6",
      category: "Smartphones",
      price: 1899.99,
      originalPrice: 1999.99,
      discount: 5,
      rating: 4.9,
      reviewCount: 184,
      isFeatured: true,
      badge: "Next-Gen Foldable AI",
      description: "Unfold a tablet-sized AI workstation that fits in your pocket. Dual-screen Interpreter mode, S-Pen Sketch to Image, Side-by-Side Note Assist multitasking, and ultra-durable Dual-Rail Flex Hinge.",
      image: "/images/flex_5.jpg",
      galleryJson: JSON.stringify(["/images/flex_5.jpg", "/images/nova_ultra.jpg"]),
      colorsJson: JSON.stringify([
        { name: "Silver Shadow", hex: "#94a3b8", inStock: true },
        { name: "Navy Blue", hex: "#1e3a8a", inStock: true },
        { name: "Crafted Black", hex: "#09090b", inStock: true },
        { name: "Pink Gold", hex: "#f472b6", inStock: false }
      ]),
      storageJson: JSON.stringify([
        { size: "256GB", priceOffset: 0 },
        { size: "512GB", priceOffset: 120 },
        { size: "1TB", priceOffset: 350 }
      ]),
      specsJson: JSON.stringify({
        "Main Display": "7.6\" Dynamic AMOLED 2X Infinity Flex, QXGA+, 1-120Hz, 2600 nits",
        "Cover Display": "6.3\" Dynamic AMOLED 2X, HD+, 1-120Hz",
        "Processor": "Snapdragon 8 Gen 3 for Galaxy (4nm)",
        "NPU": "Dual-Core Hexagon NPU for Foldable Multitasking",
        "Main Camera": "50MP Wide + 10MP Tele (3x) + 12MP Ultra-Wide + 4MP Under-Display Camera",
        "Battery": "4,400 mAh with 25W Fast Charge & Wireless PowerShare",
        "Build": "Dual-Rail Flex Hinge & Enhanced Armor Aluminum",
        "Water Resistance": "IP48 Water & Dust Resistant"
      }),
      aiFeaturesJson: JSON.stringify(["circle-to-search", "live-translate", "writing-assist", "generative-edit", "note-assist", "transcript-assist", "interpreter", "sketch-to-image"]),
      stock: 28,
    },
    {
      slug: "galaxy-tab-s10-ultra",
      name: "Galaxy Tab S10 Ultra",
      category: "Tablets",
      price: 1199.99,
      originalPrice: 1299.99,
      discount: 8,
      rating: 4.9,
      reviewCount: 156,
      isFeatured: true,
      badge: "Ultimate Creator Tablet",
      description: "14.6-inch anti-reflective Dynamic AMOLED 2X canvas with MediaTek Dimensity 9300+ AI silicon, bundled S-Pen, PDF Overlay Translation, and multi-window Note Assist.",
      image: "/images/tab_ultra.jpg",
      galleryJson: JSON.stringify(["/images/tab_ultra.jpg", "/images/nova_ultra.jpg"]),
      colorsJson: JSON.stringify([
        { name: "Moonstone Gray", hex: "#475569", inStock: true },
        { name: "Platinum Silver", hex: "#cbd5e1", inStock: true }
      ]),
      storageJson: JSON.stringify([
        { size: "256GB / 12GB RAM", priceOffset: 0 },
        { size: "512GB / 12GB RAM", priceOffset: 130 },
        { size: "1TB / 16GB RAM", priceOffset: 380 }
      ]),
      specsJson: JSON.stringify({
        "Display": "14.6\" Dynamic AMOLED 2X, WQXGA+ (2960 x 1848), 120Hz, Anti-Reflective Coating",
        "Processor": "MediaTek Dimensity 9300+ (4nm Octa-Core)",
        "NPU": "APU 790 with Generative AI Acceleration",
        "Sound": "Quad Stereo Speakers tuned by AKG with Dolby Atmos",
        "Battery": "11,200 mAh with 45W Super Fast Charging",
        "Included Accessory": "Low-Latency S-Pen with Air Actions in Box",
        "Protection": "IP68 Water & Dust Resistance"
      }),
      aiFeaturesJson: JSON.stringify(["circle-to-search", "writing-assist", "generative-edit", "note-assist", "sketch-to-image", "ai-photo-editor"]),
      stock: 35,
    },
    {
      slug: "galaxy-watch-ultra",
      name: "Galaxy Watch Ultra",
      category: "Watches",
      price: 649.99,
      originalPrice: 699.99,
      discount: 7,
      rating: 4.8,
      reviewCount: 260,
      isFeatured: true,
      badge: "Rugged Health AI",
      description: "Grade 4 Titanium cushion case, 100-hour battery life in power save mode, Dual-Frequency GPS, and BioActive sensor with Galaxy AI Energy Score and personalized fitness coaching.",
      image: "/images/watch_7_pro.jpg",
      galleryJson: JSON.stringify(["/images/watch_7_pro.jpg"]),
      colorsJson: JSON.stringify([
        { name: "Titanium Gray with Marine Orange", hex: "#f97316", inStock: true },
        { name: "Titanium White", hex: "#e2e8f0", inStock: true },
        { name: "Titanium Silver", hex: "#64748b", inStock: true }
      ]),
      storageJson: JSON.stringify([
        { size: "47mm LTE", priceOffset: 0 }
      ]),
      specsJson: JSON.stringify({
        "Display": "1.5\" Super AMOLED (480 x 480), Sapphire Crystal, 3000 nits Peak",
        "Processor": "Exynos W1000 (3nm Penta-Core)",
        "Sensors": "BioActive 2.0 (Heart Rate, ECG, BIA Body Composition), Dual GPS",
        "AI Features": "Galaxy AI Energy Score, Sleep Apnea Detection, Personalized HR Zones",
        "Battery": "590 mAh (Up to 100 Hours in Power Saving Mode)",
        "Durability": "10ATM / IP68 / MIL-STD-810H Grade 4 Titanium"
      }),
      aiFeaturesJson: JSON.stringify(["writing-assist", "ai-photo-editor"]),
      stock: 50,
    },
    {
      slug: "galaxy-buds3-pro",
      name: "Galaxy Buds3 Pro",
      category: "Audio",
      price: 249.99,
      originalPrice: 279.99,
      discount: 11,
      rating: 4.7,
      reviewCount: 410,
      isFeatured: true,
      badge: "Real-Time Voice AI",
      description: "Blade design with interactive LED Blade Lights, 24-bit/96kHz Hi-Fi audio, Adaptive Noise Control with Voice Detect, and hands-free real-time Interpreter integration.",
      image: "/images/buds_pro.jpg",
      galleryJson: JSON.stringify(["/images/buds_pro.jpg"]),
      colorsJson: JSON.stringify([
        { name: "Silver Titanium", hex: "#94a3b8", inStock: true },
        { name: "White Ceramic", hex: "#f8fafc", inStock: true }
      ]),
      storageJson: JSON.stringify([
        { size: "Standard Wireless Charging Case", priceOffset: 0 }
      ]),
      specsJson: JSON.stringify({
        "Speaker": "Enhanced 2-Way with Planar Tweeter & Dynamic Woofer",
        "Audio Codec": "Samsung Seamless Codec (SSC) Hi-Fi 24-bit / 96kHz",
        "ANC": "Adaptive ANC with Siren / Voice Detect & Ambient Sound",
        "Microphones": "6 Mics with VPU (Voice Pickup Unit) & Deep Neural Network Call Clarity",
        "Battery": "Up to 30 Hours with Charging Case (ANC Off)",
        "Water Resistance": "IP57 Sweat & Rain Resistance"
      }),
      aiFeaturesJson: JSON.stringify(["live-translate", "interpreter"]),
      stock: 80,
    },
    {
      slug: "galaxy-z-flip-6",
      name: "Galaxy Z Flip 6",
      category: "Smartphones",
      price: 1099.99,
      originalPrice: 1199.99,
      discount: 8,
      rating: 4.8,
      reviewCount: 195,
      isFeatured: false,
      badge: "Pocket Studio AI",
      description: "Iconic compact flip form factor featuring 3.4-inch FlexWindow with AI Suggested Replies, 50MP FlexCam with Auto Zoom, and 4,000 mAh all-day battery.",
      image: "/images/flex_5.jpg",
      galleryJson: JSON.stringify(["/images/flex_5.jpg", "/images/nova_pro.jpg"]),
      colorsJson: JSON.stringify([
        { name: "Mint Green", hex: "#a7f3d0", inStock: true },
        { name: "Silver Shadow", hex: "#94a3b8", inStock: true },
        { name: "Yellow", hex: "#fef08a", inStock: true },
        { name: "Blue", hex: "#93c5fd", inStock: true }
      ]),
      storageJson: JSON.stringify([
        { size: "256GB", priceOffset: 0 },
        { size: "512GB", priceOffset: 120 }
      ]),
      specsJson: JSON.stringify({
        "Main Display": "6.7\" Dynamic AMOLED 2X, FHD+, 1-120Hz LTPO, 2600 nits",
        "Cover Screen": "3.4\" Super AMOLED FlexWindow (60Hz)",
        "Processor": "Snapdragon 8 Gen 3 for Galaxy (4nm)",
        "Main Camera": "50MP Dual Pixel Wide + 12MP Ultra-Wide with Auto Zoom AI",
        "Battery": "4,000 mAh with Vapor Chamber Cooling System",
        "Durability": "Armor Aluminum & Gorilla Glass Victus 2"
      }),
      aiFeaturesJson: JSON.stringify(["circle-to-search", "live-translate", "writing-assist", "generative-edit", "interpreter", "ai-photo-editor"]),
      stock: 40,
    },
    {
      slug: "galaxy-book4-ultra",
      name: "Galaxy Book4 Ultra",
      category: "Accessories",
      price: 2399.99,
      originalPrice: 2599.99,
      discount: 8,
      rating: 4.9,
      reviewCount: 88,
      isFeatured: false,
      badge: "AI Studio Laptop",
      description: "Intel Core Ultra 9 with dedicated NPU, NVIDIA GeForce RTX 4070 Laptop GPU, 16-inch 3K Dynamic AMOLED 2X touchscreen with Anti-Reflective coating, and Galaxy Connected Experience.",
      image: "/images/tab_ultra.jpg",
      galleryJson: JSON.stringify(["/images/tab_ultra.jpg"]),
      colorsJson: JSON.stringify([
        { name: "Moonstone Gray", hex: "#334155", inStock: true }
      ]),
      storageJson: JSON.stringify([
        { size: "1TB SSD / 32GB LPDDR5X", priceOffset: 0 },
        { size: "2TB SSD / 64GB LPDDR5X", priceOffset: 450 }
      ]),
      specsJson: JSON.stringify({
        "Display": "16\" 3K Dynamic AMOLED 2X (2880 x 1800), 120Hz Touchscreen, Anti-Reflective",
        "Processor": "Intel Core Ultra 9 185H with Integrated NPU",
        "Graphics": "NVIDIA GeForce RTX 4070 (8GB GDDR6)",
        "Audio": "AKG Quad Speakers with Dolby Atmos & Studio Mics",
        "Battery": "76 Wh with 140W USB-C Fast Charger"
      }),
      aiFeaturesJson: JSON.stringify(["writing-assist", "note-assist", "generative-edit"]),
      stock: 20,
    }
  ];

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }
  console.log(`📱 Seeded ${products.length} Galaxy Devices.`);

  // 5. Create Learning Articles
  const articles = [
    {
      slug: "mastering-circle-to-search-complete-guide",
      title: "Mastering Circle to Search: 10 Hidden Gestures & Pro Tips",
      category: "AI Guides",
      author: "Dr. Elena Vance, AI Research Lead",
      readTime: "6 min read",
      excerpt: "Discover how to unlock the full potential of Google Circle to Search on Galaxy devices, from solving mathematical formulas to instant price matching.",
      content: `## The Next Evolution of Visual Search

Circle to Search on Galaxy isn't just a simple image lookup — it is a multimodal reasoning pipeline directly integrated into your system UI. By leveraging deep optical character recognition and semantic image embedding, you can query anything visible on your display without switching apps.

### 1. Instant Homework & Equation Solving
When reading digital textbooks or PDF problem sets, draw a clean circle around complex calculus, quadratic equations, or physics problems. Circle to Search detects mathematical notation and returns step-by-step solutions, interactive graphs, and theorem explanations.

### 2. Multi-Language On-Screen Text Translation
Instead of copying and pasting foreign captions into a translation app:
- Activate Circle to Search.
- Tap the **Translate** icon located on the lower right corner of the search overlay.
- All foreign text on the screen is instantaneously replaced with clean in-place English translations.

### 3. Combining Image with Text Context (Multimodal)
Spot a jacket you love in a social post, but want to see it in a different fabric or color? Circle the jacket, then type "in brown corduroy" in the search box. Galaxy AI synthesizes the image texture with your textual modifier to return exact matches.

### 4. Background Sound & Song Recognition
Tapping the music note icon while Circle to Search is active allows the on-device acoustic model to identify songs playing nearby or humming in background videos with zero latency.`,
      image: "/images/nova_ultra.jpg",
      tagsJson: JSON.stringify(["Search", "Productivity", "S-Pen", "Beginners"]),
      isFeatured: true,
    },
    {
      slug: "on-device-vs-cloud-ai-privacy-deep-dive",
      title: "Your AI. Your Privacy: On-Device NPU vs Cloud Processing",
      category: "AI Guides",
      author: "Marcus Chen, Knox Security Architect",
      readTime: "8 min read",
      excerpt: "An in-depth look at how Samsung Knox Vault and Galaxy Quantum NPUs keep your sensitive conversational and biometric data protected.",
      content: `## The Philosophy of Hybrid AI Privacy

Modern artificial intelligence requires substantial computational throughput, but your private conversations, personal notes, and intimate photos should never be compromised. Galaxy AI utilizes a hybrid architecture designed around granular user autonomy.

### The Quantum NPU Engine
On-device models run directly on the Snapdragon 8 Elite and Exynos neural processing units. Operations like **Live Translate**, **Interpreter Mode**, and **Smart Tone Correction** execute 100% within the encrypted hardware perimeter of your phone. No audio packets, transcripts, or keystrokes ever leave the device.

### Knox Vault Hardware Isolation
Biometric keys, credentials, and cryptographic certificates for on-device AI models are isolated inside **Samsung Knox Vault**, an EAL5+ certified hardware enclave physically segregated from the primary Android processor. Even if the system OS is tampered with, your encryption keys remain inaccessible.

### The Cloud AI Privacy Toggle
For complex generative workflows (such as Generative Edit fill and 50-page document synthesis), Galaxy AI offers a master switch in Settings:
- **Process Data Only on Device**: When toggled ON, any feature requiring cloud servers is automatically restricted or uses lightweight local models.
- **Zero Data Retention**: When cloud processing is utilized, Samsung and partner servers immediately discard query inputs upon response delivery without training external models.`,
      image: "/images/watch_7_pro.jpg",
      tagsJson: JSON.stringify(["Privacy", "Knox Security", "NPU", "Architecture"]),
      isFeatured: true,
    },
    {
      slug: "generative-edit-photo-masterclass",
      title: "Generative Photo Edit Masterclass: Transform Any Shot",
      category: "Tutorials",
      author: "Sarah Jenkins, Creative Director",
      readTime: "7 min read",
      excerpt: "Learn how professional photographers use Galaxy Generative Edit and AI Remaster to rescue imperfect shots, remove photobombers, and extend horizons.",
      content: `## Transforming Every Capture with Generative AI

We have all taken a photo where the lighting was glorious, but a passing tourist stepped into the frame, or the horizon was tilted 15 degrees. In the past, this required complex desktop retouching. With Galaxy Generative Edit, it takes under 10 seconds.

### Step 1: Intelligent Subject Relocation
1. Open any photo in Samsung Gallery and tap the pencil Edit icon.
2. Tap the blue Galaxy AI sparkle button.
3. Tap or circle the person you want to move. The AI automatically creates a clean magnetic mask around their silhouette.
4. Drag them to your desired position. You can also pinch to resize them to match perspective.
5. Tap **Generate**. Galaxy AI fills the vacated background realistically while harmonizing lighting on the relocated subject.

### Step 2: Leveling Horizons Without Losing Canvas Size
Normally, rotating a crooked photo crops into the frame, discarding vital landscape details. When you rotate in Generative Edit mode, the blank triangular corners are automatically synthesized by AI, matching trees, sky, or cobblestone pavements seamlessly.

### Step 3: Removing Glass & Window Glare
When shooting through aquarium glass, airplane windows, or museum display cases, swipe up on the photo to access **Edit Suggestions** and tap **Erase Reflections**. Galaxy AI computes the polarization angle and strips away specular highlights.`,
      image: "/images/nova_pro.jpg",
      tagsJson: JSON.stringify(["Creativity", "Photography", "Tutorial", "Generative Edit"]),
      isFeatured: true,
    },
    {
      slug: "10x-productivity-with-note-assist-and-s-pen",
      title: "10x Your Meeting Productivity with Note Assist & Transcript Assist",
      category: "AI Tips",
      author: "David Ross, Executive Tech Consultant",
      readTime: "5 min read",
      excerpt: "Step-by-step workflow for turning 60-minute chaotic brainstorming sessions into executive action items in under 30 seconds.",
      content: `## Streamlining Meeting Workflows with Galaxy AI

Productivity isn't about typing faster; it's about eliminating manual transcription and synthesis. Here is how modern teams leverage Galaxy AI during team standups and client calls.

### 1. Record & Multi-Speaker Separation
Launch Voice Recorder during your meeting. Transcript Assist uses spatial mic arrays and neural voice print embeddings to label each participant (Speaker 1, Speaker 2, Speaker 3).

### 2. Instant Actionable Takeaways
Tap the **Summary** tab right after ending the recording. Galaxy AI extracts:
- Core agenda points discussed
- Key decisions finalized
- Action items assigned with participant names

### 3. One-Tap Formatting in Samsung Notes
Export the transcript straight to Samsung Notes. Tap Note Assist to automatically apply:
- Clean colored header banners
- Bulleted hierarchies
- To-do checklists with checkboxes you can check off as work progresses.`,
      image: "/images/tab_ultra.jpg",
      tagsJson: JSON.stringify(["Productivity", "Notes", "Business", "Audio"]),
      isFeatured: false,
    },
    {
      slug: "travelers-guide-to-live-translate-and-interpreter",
      title: "The Ultimate Traveler's Guide to Live Translate & Offline Interpreter",
      category: "Device Guides",
      author: "Amira Patel, Global Travel Journalist",
      readTime: "5 min read",
      excerpt: "How to navigate foreign airports, book train tickets, and dine in remote villages with zero language barriers using Galaxy AI.",
      content: `## Traveling Without Language Barriers

Traveling internationally is exhilarating until you need to explain a food allergy to a chef in Tokyo or negotiate a taxi in Rome. Here is how Galaxy AI solves international communication.

### Pre-Trip Preparation: Download Offline Language Packs
1. Go to **Settings > Galaxy AI > Live Translate > Language Packs**.
2. Download your destination languages (e.g., Japanese, Italian, Spanish, Korean, Mandarin).
3. Once downloaded, all speech synthesis and translation execute 100% offline without requiring international roaming data.

### Face-to-Face with Interpreter Mode
When conversing with a local resident:
- Pull down Quick Settings and activate **Interpreter**.
- On Galaxy Z Flip 6 or Z Fold 6, enable **Cover Screen View**. Place the phone in half-folded Flex Mode between you and the other person.
- You see their speech translated into your language facing you; they see your speech translated into their language on the outer screen!`,
      image: "/images/flex_5.jpg",
      tagsJson: JSON.stringify(["Travel", "Translation", "Interpreter", "Offline"]),
      isFeatured: false,
    },
    {
      slug: "galaxy-buds-and-watch-health-ai-ecosystem",
      title: "Biometric Harmony: Galaxy Watch Ultra & Buds3 Pro AI Health Ecosystem",
      category: "News",
      author: "Dr. Jonathan Hayes, Sports Medicine",
      readTime: "4 min read",
      excerpt: "Explore how Galaxy AI computes your daily Energy Score and delivers real-time voice coaching through your earbuds.",
      content: `## Continuous Health Intelligence

Wearable technology has evolved from tracking passive step counts to predicting cognitive readiness and metabolic strain.

### The Galaxy AI Energy Score
Every morning, Galaxy AI evaluates your previous day's physical exertion, sleep stages, sleeping heart rate variability (HRV), and breathing stability to compute a holistic **Energy Score** from 1 to 100.
- If your score is high, it suggests pushing for personal records during your workout.
- If your score indicates physiological fatigue, it suggests restorative yoga or active recovery.

### Real-Time In-Ear Audio Coaching
While running or cycling with Galaxy Buds3 Pro, the AI monitors your heart rate zones from Galaxy Watch Ultra and whispers personalized pacing cues directly into your ears, helping you stay in optimal fat-burning or endurance thresholds.`,
      image: "/images/buds_pro.jpg",
      tagsJson: JSON.stringify(["Health", "Wearables", "Audio", "Fitness"]),
      isFeatured: false,
    },
  ];

  for (const art of articles) {
    await prisma.article.create({ data: art });
  }
  console.log(`📚 Seeded ${articles.length} Learning Articles.`);

  // 6. Create Offers
  const offers = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
  ];

  for (const off of offers) {
    await prisma.offer.create({ data: off });
  }
  console.log(`🎁 Seeded ${offers.length} Promotional Offers.`);

  // 7. Create Demo Orders for the Demo User
  const createdProducts = await prisma.product.findMany();
  const phone = createdProducts.find((p) => p.slug === "galaxy-s25-ultra") || createdProducts[0];
  const buds = createdProducts.find((p) => p.slug === "galaxy-buds3-pro") || createdProducts[1];

  const order1 = await prisma.order.create({
    data: {
      orderNumber: "ORD-GALAXY-8921",
      userId: demoUser.id,
      customerName: demoUser.name,
      customerEmail: demoUser.email,
      customerPhone: demoUser.phone,
      shippingAddress: "742 Evergreen Terrace, Springfield, OR 97477",
      city: "Springfield",
      postalCode: "97477",
      country: "United States",
      paymentMethod: "Demo Card (•••• 4242)",
      paymentStatus: "Paid",
      orderStatus: "Delivered",
      subtotal: 1549.98,
      discount: 150.00,
      shipping: 0.00,
      tax: 111.99,
      total: 1511.97,
      notes: "Please leave at front door ring bell.",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      items: {
        create: [
          {
            productId: phone.id,
            productName: phone.name,
            productImage: phone.image,
            selectedColor: "Titanium Silver",
            selectedStorage: "512GB",
            unitPrice: 1299.99,
            quantity: 1,
            totalPrice: 1299.99,
          },
          {
            productId: buds.id,
            productName: buds.name,
            productImage: buds.image,
            selectedColor: "Silver Titanium",
            selectedStorage: "Standard",
            unitPrice: 249.99,
            quantity: 1,
            totalPrice: 249.99,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: "ORD-GALAXY-9402",
      userId: demoUser.id,
      customerName: demoUser.name,
      customerEmail: demoUser.email,
      customerPhone: demoUser.phone,
      shippingAddress: "742 Evergreen Terrace, Springfield, OR 97477",
      city: "Springfield",
      postalCode: "97477",
      country: "United States",
      paymentMethod: "Demo Apple Pay",
      paymentStatus: "Paid",
      orderStatus: "Processing",
      subtotal: 649.99,
      discount: 50.00,
      shipping: 0.00,
      tax: 48.00,
      total: 647.99,
      notes: "Express signature delivery",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      items: {
        create: [
          {
            productId: createdProducts.find((p) => p.slug === "galaxy-watch-ultra")?.id || phone.id,
            productName: "Galaxy Watch Ultra",
            productImage: "/images/watch_7_pro.jpg",
            selectedColor: "Titanium Gray with Marine Orange",
            selectedStorage: "47mm LTE",
            unitPrice: 649.99,
            quantity: 1,
            totalPrice: 649.99,
          },
        ],
      },
    },
  });

  console.log(`📦 Seeded sample customer orders (${order1.orderNumber}, ${order2.orderNumber}).`);
  console.log("✅ Galaxy AI Hub database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
