#!/usr/bin/env bash
# verify-content.sh — automated truthfulness/leftover-content gate for the VIVA site.
# Exits 1 (fail) if known-fake demo content or removed e-commerce features are still
# present, or if required real business facts are missing from the config layer.
# Run from the repo root: ./scripts/verify-content.sh

set -uo pipefail
FAIL=0

pass() { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; FAIL=1; }

echo "== Checking for banned/leftover fake content in src/ =="
BANNED_TERMS=(
  "SynthLab"
  "synthlab"
  "Portland"
  "555-012"
  "since 2016"
  "2-year warranty"
  "free standard shipping"
  "support@synthlab"
  "440 Signal Path"
  "Arturia KeyLab"
  "SynthLab Pro"
  "30-day returns"
)
for term in "${BANNED_TERMS[@]}"; do
  hits=$(grep -ril -- "$term" src/ 2>/dev/null | grep -v node_modules || true)
  if [ -n "$hits" ]; then
    fail "banned/leftover term '$term' found in: $hits"
  fi
done
[ "$FAIL" -eq 0 ] && pass "no banned demo content found in src/"

echo ""
echo "== Checking removed e-commerce routes/features are gone =="
if [ -f src/router.tsx ]; then
  for route in '"/cart"' '"/checkout"' '"/account"'; do
    if grep -q -- "$route" src/router.tsx 2>/dev/null; then
      fail "e-commerce route $route still present in src/router.tsx"
    fi
  done
fi
for leftover_dir in src/store/cartStore.ts src/store/wishlistStore.ts src/pages/CartPage.tsx src/pages/CheckoutPage.tsx src/pages/AccountPage.tsx src/components/shop/CartSheet.tsx; do
  if [ -e "$leftover_dir" ]; then
    fail "leftover e-commerce file still exists: $leftover_dir"
  fi
done
[ "$FAIL" -eq 0 ] && pass "no leftover cart/checkout/account/wishlist code found"

echo ""
echo "== Checking required real business facts exist in the config layer =="
CONFIG_GLOB="src/config"
REQUIRED_FACTS=(
  "9633334786"
  "9995880059"
  "Kottakkal"
)
if [ -d "$CONFIG_GLOB" ]; then
  for fact in "${REQUIRED_FACTS[@]}"; do
    if ! grep -rq -- "$fact" "$CONFIG_GLOB" 2>/dev/null; then
      fail "required real fact '$fact' not found anywhere under $CONFIG_GLOB/"
    fi
  done
  [ "$FAIL" -eq 0 ] && pass "required real business facts present in $CONFIG_GLOB/"
else
  fail "$CONFIG_GLOB/ does not exist yet — business config layer (Phase 1) not built"
fi

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "RESULT: PASS — no known fake content, no leftover e-commerce code, required facts present."
else
  echo "RESULT: FAIL — see above. Fix each FAIL line before calling this phase done."
fi
exit $FAIL
