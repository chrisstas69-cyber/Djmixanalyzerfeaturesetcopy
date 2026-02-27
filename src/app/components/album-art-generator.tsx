// Album Art Generator - Creates unique SVG artwork based on track metadata
export function generateAlbumArtwork(
  title: string,
  bpm: number,
  key: string,
  energy: string,
  version: "A" | "B" | "C"
): string {
  // Use metadata to create deterministic but unique artwork
  const seed = title.charCodeAt(0) + bpm + key.charCodeAt(0) + energy.length + version.charCodeAt(0);
  
  // Determine genre/style based on energy and BPM
  let genreStyle: "deep-house" | "house-techno" | "dark-aggressive";
  if (energy === "Chill" || energy === "Deep" || energy === "Steady" || (bpm < 125 && (energy === "Rising" || energy === "Groove"))) {
    genreStyle = "deep-house"; // Warm colors, smooth circles
  } else if (energy === "Peak" || energy === "Building" || (bpm > 130 && energy !== "Chill")) {
    genreStyle = "dark-aggressive"; // Dark colors, jagged patterns
  } else {
    genreStyle = "house-techno"; // Bright colors, sharp lines
  }
  
  // Color palettes based on genre style
  const genrePalettes = {
    "deep-house": {
      primary: ["#f97316", "#ec4899", "#f59e0b", "#d97706"], // Orange, Pink, Gold
      secondary: ["#fb923c", "#f472b6", "#fbbf24", "#f59e0b"],
      accent: ["#fdba74", "#f9a8d4", "#fde047", "#fcd34d"],
      bg: ["#1f1f1f", "#2a1f1f", "#1f1f2a"], // Dark warm backgrounds
    },
    "house-techno": {
      primary: ["#06b6d4", "#8b5cf6", "#ffffff", "#3b82f6"], // Cyan, Purple, White
      secondary: ["#22d3ee", "#a78bfa", "#e0e0e0", "#60a5fa"],
      accent: ["#67e8f9", "#c4b5fd", "#ffffff", "#93c5fd"],
      bg: ["#0a0a0f", "#0f0a1a", "#0a0f1a"], // Dark cool backgrounds
    },
    "dark-aggressive": {
      primary: ["#000000", "#ef4444", "#10b981", "#f59e0b"], // Black, Red, Green, Yellow (neon)
      secondary: ["#1a1a1a", "#dc2626", "#059669", "#d97706"],
      accent: ["#ffffff", "#f87171", "#34d399", "#fbbf24"],
      bg: ["#000000", "#0a0000", "#000a00"], // Pure black backgrounds
    },
  };
  
  const palette = genrePalettes[genreStyle];
  const primaryColor = palette.primary[seed % palette.primary.length];
  const secondaryColor = palette.secondary[seed % palette.secondary.length];
  const accentColor = palette.accent[seed % palette.accent.length];
  const bgColor = palette.bg[seed % palette.bg.length];
  
  // Pattern type based on genre
  const patternType = genreStyle === "deep-house" ? "smooth-circles" : 
                     genreStyle === "house-techno" ? "sharp-lines" : 
                     "jagged-patterns";
  
  // Version-specific variations
  const versionOffset = version === "A" ? 0 : version === "B" ? 30 : 60;
  const versionScale = version === "A" ? 1 : version === "B" ? 0.9 : 0.8;
  
  // Generate SVG based on genre style
  let svg = '';
  
  if (patternType === "smooth-circles") {
    // Deep House: Smooth circles + gradients
    svg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%">
            <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:${bgColor};stop-opacity:1" />
          </radialGradient>
          <radialGradient id="grad2" cx="30%" cy="30%">
            <stop offset="0%" style="stop-color:${secondaryColor};stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
          </radialGradient>
          <radialGradient id="grad3" cx="70%" cy="70%">
            <stop offset="0%" style="stop-color:${accentColor};stop-opacity:0.6" />
            <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
          </radialGradient>
        </defs>
        
        <!-- Background -->
        <rect width="400" height="400" fill="${bgColor}" />
        
        <!-- Large smooth circles -->
        <circle cx="200" cy="200" r="${120 * versionScale}" fill="url(#grad1)" opacity="0.8" />
        <circle cx="${180 + (seed % 40)}" cy="${180 + (seed % 40)}" r="${80 * versionScale}" fill="url(#grad2)" opacity="0.7" transform="rotate(${versionOffset} 200 200)" />
        <circle cx="${220 - (seed % 40)}" cy="${220 - (seed % 40)}" r="${60 * versionScale}" fill="url(#grad3)" opacity="0.6" transform="rotate(${-versionOffset} 200 200)" />
        
        <!-- Overlapping circles for depth -->
        <circle cx="200" cy="200" r="${100 * versionScale}" fill="none" stroke="${primaryColor}" stroke-width="2" opacity="0.4" />
        <circle cx="200" cy="200" r="${140 * versionScale}" fill="none" stroke="${secondaryColor}" stroke-width="1.5" opacity="0.3" />
        
        <!-- Version indicator -->
        <text x="350" y="50" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" opacity="0.9">${version}</text>
      </svg>
    `.trim();
  } else if (patternType === "sharp-lines") {
    // House/Techno: Sharp lines + angles
    svg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
            <stop offset="50%" style="stop-color:${secondaryColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${accentColor};stop-opacity:1" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${accentColor};stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:${primaryColor};stop-opacity:0.8" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="400" height="400" fill="${bgColor}" />
        
        <!-- Sharp geometric shapes -->
        <polygon points="200,50 350,${150 + (seed % 50)} 200,350 50,${150 + (seed % 50)}" fill="url(#grad1)" opacity="0.7" transform="rotate(${versionOffset} 200 200)" />
        <polygon points="200,100 300,${180 + (seed % 40)} 200,300 100,${180 + (seed % 40)}" fill="url(#grad2)" opacity="0.6" transform="rotate(${-versionOffset} 200 200) scale(${versionScale})" />
        
        <!-- Diagonal lines -->
        <line x1="0" y1="0" x2="400" y2="400" stroke="${primaryColor}" stroke-width="3" opacity="0.5" transform="rotate(${versionOffset * 0.5} 200 200)" />
        <line x1="400" y1="0" x2="0" y2="400" stroke="${secondaryColor}" stroke-width="2" opacity="0.5" transform="rotate(${-versionOffset * 0.5} 200 200)" />
        <line x1="0" y1="200" x2="400" y2="200" stroke="${accentColor}" stroke-width="2" opacity="0.4" transform="rotate(${versionOffset} 200 200)" />
        
        <!-- Version indicator -->
        <text x="350" y="50" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" opacity="0.9">${version}</text>
      </svg>
    `.trim();
  } else {
    // Dark/Aggressive: Jagged patterns + contrast
    svg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${bgColor};stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="400" height="400" fill="${bgColor}" />
        
        <!-- Jagged lightning-like patterns -->
        <path d="M ${100 + (seed % 50)},${50 + (seed % 50)} L ${150 + (seed % 50)},${100 + (seed % 50)} L ${120 + (seed % 50)},${150 + (seed % 50)} L ${200 + (seed % 50)},${200 + (seed % 50)} L ${180 + (seed % 50)},${250 + (seed % 50)} L ${250 + (seed % 50)},${300 + (seed % 50)} L ${300 + (seed % 50)},${350 + (seed % 50)}" 
              stroke="${primaryColor}" stroke-width="4" fill="none" opacity="0.8" transform="rotate(${versionOffset} 200 200)" />
        <path d="M ${200 - (seed % 50)},${100 - (seed % 50)} L ${250 - (seed % 50)},${150 - (seed % 50)} L ${220 - (seed % 50)},${200 - (seed % 50)} L ${300 - (seed % 50)},${250 - (seed % 50)} L ${280 - (seed % 50)},${300 - (seed % 50)}" 
              stroke="${accentColor}" stroke-width="3" fill="none" opacity="0.7" transform="rotate(${-versionOffset} 200 200)" />
        
        <!-- Sharp triangles -->
        <polygon points="200,${50 + (seed % 30)} ${250 + (seed % 30)},${150 + (seed % 30)} ${150 - (seed % 30)},${150 + (seed % 30)}" fill="${primaryColor}" opacity="0.6" transform="rotate(${versionOffset * 2} 200 200)" />
        <polygon points="200,${350 - (seed % 30)} ${250 + (seed % 30)},${250 - (seed % 30)} ${150 - (seed % 30)},${250 - (seed % 30)}" fill="${accentColor}" opacity="0.5" transform="rotate(${-versionOffset * 2} 200 200)" />
        
        <!-- High contrast lines -->
        <rect x="${150 + (seed % 20)}" y="0" width="4" height="400" fill="${primaryColor}" opacity="0.8" transform="rotate(${versionOffset} 200 200)" />
        <rect x="0" y="${150 + (seed % 20)}" width="400" height="4" fill="${accentColor}" opacity="0.7" transform="rotate(${-versionOffset} 200 200)" />
        
        <!-- Version indicator -->
        <text x="350" y="50" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${accentColor}" opacity="0.9">${version}</text>
      </svg>
    `.trim();
  }
  
  // Convert to data URL
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

