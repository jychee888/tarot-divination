const fs = require("fs");
const path = require("path");

/**
 * Mappings from kebab-case SVG attributes to camelCase React props.
 * Reference: https://reactjs.org/docs/dom-elements.html#all-supported-attributes
 */
const MAPPINGS = {
  "accent-height": "accentHeight",
  "alignment-baseline": "alignmentBaseline",
  "arabic-form": "arabicForm",
  "baseline-shift": "baselineShift",
  "cap-height": "capHeight",
  "clip-path": "clipPath",
  "clip-rule": "clipRule",
  "color-interpolation": "colorInterpolation",
  "color-interpolation-filters": "colorInterpolationFilters",
  "color-profile": "colorProfile",
  "color-rendering": "colorRendering",
  "dominant-baseline": "dominantBaseline",
  "enable-background": "enableBackground",
  "fill-opacity": "fillOpacity",
  "fill-rule": "fillRule",
  "flood-color": "floodColor",
  "flood-opacity": "floodOpacity",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-size-adjust": "fontSizeAdjust",
  "font-stretch": "fontStretch",
  "font-style": "fontStyle",
  "font-variant": "fontVariant",
  "font-weight": "fontWeight",
  "glyph-name": "glyphName",
  "glyph-orientation-horizontal": "glyphOrientationHorizontal",
  "glyph-orientation-vertical": "glyphOrientationVertical",
  "horiz-ads": "horizAdvX",
  "horiz-origin-x": "horizOriginX",
  "image-rendering": "imageRendering",
  "letter-spacing": "letterSpacing",
  "lighting-color": "lightingColor",
  "marker-end": "markerEnd",
  "marker-mid": "markerMid",
  "marker-start": "markerStart",
  "overline-position": "overlinePosition",
  "overline-thickness": "overlineThickness",
  "paint-order": "paintOrder",
  "panose-1": "panose1",
  "pointer-events": "pointerEvents",
  "rendering-intent": "renderingIntent",
  "shape-rendering": "shapeRendering",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "strikethrough-position": "strikethroughPosition",
  "strikethrough-thickness": "strikethroughThickness",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "stroke-width": "strokeWidth",
  "text-anchor": "textAnchor",
  "text-decoration": "textDecoration",
  "text-rendering": "textRendering",
  "underline-position": "underlinePosition",
  "underline-thickness": "underlineThickness",
  "unicode-bidi": "unicodeBidi",
  "unicode-range": "unicodeRange",
  "units-per-em": "unitsPerEm",
  "v-alphabetic": "vAlphabetic",
  "v-hanging": "vHanging",
  "v-ideographic": "vIdeographic",
  "v-mathematical": "vMathematical",
  "vector-effect": "vectorEffect",
  "vert-adv-y": "vertAdvY",
  "vert-origin-x": "vertOriginX",
  "vert-origin-y": "vertOriginY",
  "word-spacing": "wordSpacing",
  "writing-mode": "writingMode",
  "x-height": "xHeight",
  "xlink:actuate": "xlinkActuate",
  "xlink:arcrole": "xlinkArcrole",
  "xlink:href": "xlinkHref",
  "xlink:role": "xlinkRole",
  "xlink:show": "xlinkShow",
  "xlink:type": "xlinkType",
  "xml:base": "xmlBase",
  "xml:lang": "xmlLang",
  "xml:space": "xmlSpace",
  "xmlns:xlink": "xmlnsXlink",
};

const EXTENSIONS = [".tsx", ".jsx", ".ts", ".js"];
const IGNORE_DIRS = ["node_modules", ".next", ".git"];

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        walk(filePath, callback);
      }
    } else {
      if (EXTENSIONS.includes(path.extname(file))) {
        callback(filePath);
      }
    }
  });
}

function fixSvgAttributes(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;

  // 1. Fix common kebab-case attributes
  for (const [kebab, camel] of Object.entries(MAPPINGS)) {
    // Look for the attribute followed by =
    // Using \b to ensure we match whole words
    const regex = new RegExp(`\\b${kebab}=`, "g");
    if (regex.test(content)) {
      content = content.replace(regex, `${camel}=`);
      changed = true;
    }
  }

  // 2. Fix 'class=' to 'className=' inside SVG-like contexts
  // We use a simplified regex that looks for class= not preceded by a dot (to avoid CSS selectors)
  // and likely inside a JSX tag.
  const classRegex = /(?<!\.)\bclass=/g;
  if (classRegex.test(content)) {
    // Only replace in .tsx and .jsx files as it's most likely a JSX prop error
    if (filePath.endsWith(".tsx") || filePath.endsWith(".jsx")) {
      content = content.replace(classRegex, "className=");
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Fixed: ${filePath}`);
  }
}

// Default to components directory, but allow override via CLI
const targetDir = process.argv[2] || path.join(process.cwd(), "components");
console.log(`🔍 Scanning directory: ${targetDir}`);

walk(targetDir, (filePath) => {
  fixSvgAttributes(filePath);
});

console.log("✨ SVG attribute conversion complete!");
