#!/usr/bin/env bash
# Builds a static web preview (demo mode) that can be hosted under any path.
# Usage: scripts/build-web-preview.sh [output-dir]
set -euo pipefail
OUT="${1:-dist-web}"
rm -rf "$OUT"
npx expo export --platform web --output-dir "$OUT"
# Expo writes absolute paths; make them relative so the build works in a subfolder.
sed -i 's#src="/_expo#src="./_expo#g' "$OUT/index.html"
sed -i 's#"/assets/#"./assets/#g; s#"/_expo/#"./_expo/#g' "$OUT"/_expo/static/js/web/*.js
# Lazy chunks are forced to the site root ('/' + path); keep them relative to the page instead.
node -e '
const fs = require("fs");
for (const f of process.argv.slice(1)) {
  const src = fs.readFileSync(f, "utf8");
  const out = src.replace(/return'"'"'\/'"'"'\+(\w+)\.replace\(\/\^\\\/\+\/,'"'"''"'"'\)/, "return $1");
  if (out === src) { console.error("warning: chunk path patch did not apply"); process.exitCode = 1; }
  fs.writeFileSync(f, out);
}' "$OUT"/_expo/static/js/web/index-*.js
# Phone-width frame when opened on a desktop browser.
sed -i 's#</style>#  @media (min-width: 500px) { body { background: \#222; } \#root { max-width: 430px; margin: 0 auto; } }\n    </style>#' "$OUT/index.html"
echo "Web preview in $OUT"
