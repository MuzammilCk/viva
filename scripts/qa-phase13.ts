import { PROJECTS } from "../src/data/projects.ts"
import { SERVICES } from "../src/data/services.ts"
import { PRODUCTS } from "../src/data/products.ts"
import { BUSINESS_CONFIG } from "../src/config/business.ts"
import * as fs from "fs"
import * as path from "path"

let failures = 0
function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`)
    failures++
  } else {
    console.log(`PASS: ${message}`)
  }
}

console.log("=== 1. Business Config & Identity Truth Checks ===")
assert(BUSINESS_CONFIG.contact.phone.number === "9633334786", "Phone number is exactly 9633334786")
assert(BUSINESS_CONFIG.contact.whatsapp.number === "9995880059", "WhatsApp number is exactly 9995880059")
assert(BUSINESS_CONFIG.contact.phone.number !== BUSINESS_CONFIG.contact.whatsapp.number, "Phone and WhatsApp numbers are distinct")
assert(BUSINESS_CONFIG.contact.address.town === "Kottakkal", "Town is Kottakkal")
assert(BUSINESS_CONFIG.legalName === "RIMS", "Legal name is RIMS")
assert(BUSINESS_CONFIG.name === "VIVA Business Team", "Brand name is VIVA Business Team")

console.log("\n=== 2. Project Data & Cross-Reference Integrity ===")
assert(PROJECTS.length > 0, `Loaded ${PROJECTS.length} projects`)
const productIds = new Set(PRODUCTS.map(p => p.id))
const projectIds = new Set(PROJECTS.map(p => p.id))

for (const project of PROJECTS) {
  assert(project.title.startsWith("PLACEHOLDER —"), `Project ${project.slug} is unmistakably labeled as placeholder`)
  assert(project.media.length === 0, `Project ${project.slug} has no fake stock photography (empty media array)`)
  if (project.relatedProductIds) {
    for (const prodId of project.relatedProductIds) {
      assert(productIds.has(prodId), `Project ${project.slug} related product '${prodId}' exists in product catalog`)
    }
  }
}

console.log("\n=== 3. Product Catalog & Pricing Truthfulness ===")
assert(PRODUCTS.length > 0, `Loaded ${PRODUCTS.length} products`)
for (const product of PRODUCTS) {
  assert(product.name.startsWith("PLACEHOLDER —"), `Product ${product.slug} is unmistakably labeled as placeholder`)
  assert(product.images.length === 0, `Product ${product.slug} has no fake stock photography (empty images array)`)
  assert(product.price === null, `Product ${product.slug} has price null (renders 'Contact for price', no fabricated INR prices)`)
  assert(!('inStock' in product) && !('stock' in product), `Product ${product.slug} has no fake stock/inventory field`)
  assert(!('rating' in product) && !('reviews' in product), `Product ${product.slug} has no synthetic review/rating field`)
}

console.log("\n=== 4. Services Architecture & Mapping ===")
assert(SERVICES.length === 6, `Exact 6 core services defined (found ${SERVICES.length})`)
const serviceSlugs = SERVICES.map(s => s.slug)
assert(serviceSlugs.includes("complete-audio-solutions"), "Service: complete-audio-solutions exists")
assert(serviceSlugs.includes("product-recommendation-supply"), "Service: product-recommendation-supply exists")
assert(serviceSlugs.includes("installation-integration"), "Service: installation-integration exists")
assert(serviceSlugs.includes("repair-diagnosis"), "Service: repair-diagnosis exists")
assert(serviceSlugs.includes("custom-solutions"), "Service: custom-solutions exists")
assert(serviceSlugs.includes("tuning-upgrades-maintenance"), "Service: tuning-upgrades-maintenance exists")

console.log("\n=== 5. Codebase Scan for Hardcoded Numbers or Banned Patterns ===")
function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== "dist" && entry.name !== ".git") {
        scanDir(fullPath)
      }
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      const content = fs.readFileSync(fullPath, "utf-8")
      // Check for <form> tags or enquiry forms
      if (content.includes("<form") && !fullPath.includes("scripts")) {
        assert(false, `Found unexpected <form> tag in ${fullPath}`)
      }
      // Check for hardcoded phone numbers (should come from config/business.ts)
      if (!fullPath.includes("business.ts") && !fullPath.includes("verify-content") && !fullPath.includes("qa-")) {
        if (content.includes("9633334786") || content.includes("9995880059")) {
          assert(false, `Hardcoded phone number found in ${fullPath} — must use BUSINESS_CONFIG!`)
        }
      }
    }
  }
}
scanDir(path.resolve("src"))
console.log("PASS: Verified no hardcoded phone numbers in src/ (all consume BUSINESS_CONFIG)")
console.log("PASS: Verified no enquiry forms in src/ (strictly Call / WhatsApp actions)")

console.log("\n=== SUMMARY ===")
if (failures === 0) {
  console.log("ALL AUTOMATED INTEGRITY CHECKS PASSED (0 failures)")
  process.exit(0)
} else {
  console.error(`FAILED with ${failures} errors`)
  process.exit(1)
}
