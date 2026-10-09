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
  await prisma.review.deleteMany();
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
      name: process.env.ADMIN_NAME || "Shehjad Sindhi",
      email: process.env.ADMIN_EMAIL || "shehjadsindhi95@gmail.com",
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
      supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Z Flip8", "Galaxy Buds3 Pro"]),
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
      supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Tab S12 Ultra", "Galaxy Book4 Ultra"]),
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
      supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Tab S12 Ultra"]),
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
      supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Tab S12 Ultra"]),
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
      supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Tab S12 Ultra"]),
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
      supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Fold8", "Galaxy Z Flip8", "Galaxy Watch Ultra2"]),
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
      supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Z Flip8", "Galaxy Z Fold8", "Galaxy Buds3 Pro"]),
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
      supportedDevicesJson: JSON.stringify(["Galaxy S26 Ultra", "Galaxy Tab S12 Ultra", "Galaxy Z Fold8"]),
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

  // 4. Create Products — 2026 Galaxy lineup with factual specifications
  const products = [
    {
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
      aiFeaturesJson: JSON.stringify(["circle-to-search", "live-translate", "writing-assist", "generative-edit", "note-assist", "transcript-assist", "ai-photo-editor", "sketch-to-image"]),
      stock: 45,
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    }
  ];

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }
  console.log(`📱 Seeded ${products.length} Galaxy Devices.`);

  // 5. Create Learning Articles
  const articles = [
    {
      slug: "mastering-galaxy-ai-complete-guide",
      title: "Mastering Galaxy AI: 10 Hidden Features & Productivity Shortcuts",
      category: "AI Guides",
      author: "Dr. Elena Vance, AI Research Lead",
      readTime: "6 min read",
      excerpt: "Discover advanced S-Pen shortcuts, instant PDF translations, dual-screen interpreter configurations, and custom prompt templates.",
      content: `## The Next Evolution of On-Device Intelligence

Galaxy AI is built directly into One UI 9, so intelligent capabilities activate exactly where you work — no switching apps, no cloud round-trips for core tasks.

### 1. Multimodal Circle to Search Techniques
While most users know they can circle images, long-pressing text allows you to instant-translate entire paragraphs without taking screenshots. Furthermore, adding text queries after circling lets you perform complex research like: "Find where to buy this outfit near me".

### 2. Custom S-Pen Sketch to Image
Draw a quick rough sketch over any photo in Samsung Notes or Gallery. Select 'Sketch to Image' and choose between 3D Cartoon, Watercolor, Pop Art, or Illustration styles to bring your ideas to life instantly.

### 3. Offline On-Device Privacy Toggle
For users handling confidential business communications or medical records, navigate to Settings -> Advanced Features -> Galaxy AI, and enable 'Process Data Only on Device'.`,
      image: "/images/nova_ultra.jpg",
      tagsJson: JSON.stringify(["Galaxy AI", "Productivity", "S26 Ultra", "Tutorials"]),
      isFeatured: true,
    },
    {
      slug: "on-device-vs-cloud-ai-privacy-deep-dive",
      title: "Your AI. Your Privacy: On-Device NPU vs Cloud Processing",
      category: "AI Tips",
      author: "Marcus Chen, Knox Security Architect",
      readTime: "8 min read",
      excerpt: "An in-depth look at how Samsung Knox Vault and Galaxy Quantum NPUs keep your sensitive conversational and biometric data protected.",
      content: `## The Philosophy of Hybrid AI Privacy

Modern artificial intelligence requires substantial computational throughput, but your private conversations, personal notes, and intimate photos should never be compromised. Galaxy AI utilizes a hybrid architecture designed around granular user autonomy.

### The On-Device Neural Engine
On-device models run directly on the Snapdragon 8 Elite Gen 5 and Exynos 2600 neural processing units. Operations like **Live Translate**, **Interpreter Mode**, and **Smart Tone Correction** execute 100% within the encrypted hardware perimeter of your phone. No audio packets, transcripts, or keystrokes ever leave the device.

### Knox Vault Hardware Isolation
Biometric keys, credentials, and cryptographic certificates for on-device AI models are isolated inside **Samsung Knox Vault**, an EAL5+ certified hardware enclave physically segregated from the primary Android processor. Even if the system OS is tampered with, your encryption keys remain inaccessible.

### The Cloud AI Privacy Toggle
For complex generative workflows (such as Generative Edit fill and 50-page document synthesis), Galaxy AI offers a master switch in Settings:
- **Process Data Only on Device**: When toggled ON, any feature requiring cloud servers is automatically restricted or uses lightweight local models.
- **Zero Data Retention**: When cloud processing is utilized, partner servers immediately discard query inputs upon response delivery without training external models.`,
      image: "/images/flex_5.jpg",
      tagsJson: JSON.stringify(["Privacy", "Knox Security", "NPU", "Architecture"]),
      isFeatured: true,
    },
    {
      slug: "generative-edit-photo-masterclass",
      title: "Generative Photo Edit Masterclass: Transform Any Shot",
      category: "Tutorials",
      author: "Sarah Jenkins, Creative Director",
      readTime: "7 min read",
      excerpt: "Learn how photographers use Galaxy Generative Edit and AI Remaster to rescue imperfect shots, remove photobombers, and extend horizons.",
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
- On the Galaxy Z Fold8 or Z Flip8, enable **Cover Screen View**. Place the phone in half-folded Flex Mode between you and the other person.
- You see their speech translated into your language facing you; they see your speech translated into their language on the outer screen!`,
      image: "/images/flex_5.jpg",
      tagsJson: JSON.stringify(["Travel", "Translation", "Interpreter", "Offline"]),
      isFeatured: false,
    },
    {
      slug: "galaxy-buds-and-watch-health-ai-ecosystem",
      title: "Biometric Harmony: Galaxy Watch Ultra2 & Buds3 Pro AI Health Ecosystem",
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
While running or cycling with Galaxy Buds3 Pro, the AI monitors your heart rate zones from Galaxy Watch Ultra2 and whispers personalized pacing cues directly into your ears, helping you stay in optimal fat-burning or endurance thresholds.`,
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
    },
    {
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
    },
    {
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
    },
    {
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
  const phone = createdProducts.find((p) => p.slug === "galaxy-s26-ultra") || createdProducts[0];
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
      subtotal: 1649.98,
      discount: 150.00,
      shipping: 0.00,
      tax: 119.99,
      total: 1619.97,
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
            unitPrice: 1399.99,
            quantity: 1,
            totalPrice: 1399.99,
          },
          {
            productId: buds.id,
            productName: buds.name,
            productImage: buds.image,
            selectedColor: "Silver Blade",
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
      subtotal: 749.99,
      discount: 50.00,
      shipping: 0.00,
      tax: 56.25,
      total: 756.24,
      notes: "Express signature delivery",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      items: {
        create: [
          {
            productId: createdProducts.find((p) => p.slug === "galaxy-watch-ultra2")?.id || phone.id,
            productName: "Galaxy Watch Ultra2",
            productImage: "/images/watch_7_pro.jpg",
            selectedColor: "Titanium Gray",
            selectedStorage: "47mm LTE",
            unitPrice: 749.99,
            quantity: 1,
            totalPrice: 749.99,
          },
        ],
      },
    },
  });

  console.log(`📦 Seeded sample customer orders (${order1.orderNumber}, ${order2.orderNumber}).`);

  // 8. Create original demo reviews for the 2026 lineup
  const reviews = [
    {
      productId: phone.id,
      userId: demoUser.id,
      rating: 5,
      title: "Privacy Display is a game changer",
      comment: "The built-in Privacy Display hides the screen from side views instantly — perfect for commuting. The 200 MP Wide camera with ProVisual Engine captures incredible detail in low light, and Snapdragon 8 Elite Gen 5 keeps everything fluid. Battery easily lasts my full workday.",
      verified: true,
    },
    {
      productId: createdProducts.find((p) => p.slug === "galaxy-z-fold8")?.id || phone.id,
      userId: demoUser.id,
      rating: 5,
      title: "Lightest fold I have owned",
      comment: "At 201 g it finally feels pocketable. The flatter crease on the main screen is nearly invisible and the Armor FlexHinge opens with a satisfying snap. Dual 50 MP cameras cover all my everyday shots. Note: FlexMode is not supported on this generation, but split-screen multitasking works great.",
      verified: true,
    },
    {
      productId: createdProducts.find((p) => p.slug === "galaxy-z-flip8")?.id || phone.id,
      rating: 4,
      title: "FlexWindow is genuinely useful now",
      comment: "The larger FlexWindow with Now Brief shows weather, calendar and health cards without unfolding. Mirror view at up to 120 fps is smooth. Exynos 2600 handles Galaxy AI features quickly. Wish the battery were slightly larger, but 31 hours of video playback is solid.",
      verified: true,
    },
    {
      productId: createdProducts.find((p) => p.slug === "galaxy-tab-s12-ultra")?.id || phone.id,
      userId: demoUser.id,
      rating: 5,
      title: "The ultimate study canvas",
      comment: "The 14.6-inch Dynamic AMOLED 2X WQXGA+ display is stunning for PDFs and lecture slides. S Pen in the box is a must for note-taking, and Note Assist turns my messy handwriting into clean summaries. The 11,600 mAh battery lasted an entire two-day conference.",
      verified: true,
    },
    {
      productId: createdProducts.find((p) => p.slug === "galaxy-watch-ultra2")?.id || phone.id,
      userId: demoUser.id,
      rating: 5,
      title: "Brightest watch display, week-long confidence",
      comment: "The 5,000-nit display is readable in direct sunlight and the 800 mAh battery lasts 60 hours with always-on display. Fast Charging got me 40% in 30 minutes. Sleep Apnea 2.0 tracking and the full sensor suite make it a serious health device. EN13319 dive certification is a great bonus.",
      verified: true,
    },
    {
      productId: buds.id,
      userId: demoUser.id,
      rating: 4,
      title: "Great translation audio quality",
      comment: "24-bit Hi-Fi audio is crisp and ANC handles café noise well. Interpreter mode translations stream clearly into the buds. Comfortable for long calls, and the 30-hour case battery covers my week.",
      verified: true,
    },
  ];

  for (const rev of reviews) {
    await prisma.review.create({ data: rev });
  }
  console.log(`⭐ Seeded ${reviews.length} original demo reviews.`);

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
