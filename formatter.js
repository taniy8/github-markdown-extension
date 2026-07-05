function formatText(raw) {
  if (!raw.trim()) return "";

  const lines = raw.split("\n");

  const expanded = [];
  for (const line of lines) {
    const parts = splitIssueRefs(line.trim());
    expanded.push(...parts);
  }

  const formatted = expanded.map((line) => formatLine(line.trim()));
  const cleaned = formatted.filter(Boolean);

  const spaced = [];
  for (let i = 0; i < cleaned.length; i++) {
    const prev = cleaned[i - 1];
    const curr = cleaned[i];

    const isBullet = (l) => l.startsWith("-");
    const isIssueRef = (l) => /^(Fixes|Closes|Related)/.test(l);

    if (prev && isBullet(prev) && isIssueRef(curr)) spaced.push("");
    if (prev && isIssueRef(prev) && isIssueRef(curr)) spaced.push("");
    if (prev && isIssueRef(prev) && !isIssueRef(curr) && !isBullet(curr)) spaced.push("");

    spaced.push(curr);
  }

  return spaced.join("\n");
}

function splitIssueRefs(line) {
  const issuePattern = /\b(fixes|closes|related to)\s+#?(\d+)/gi;
  const matches = [];
  let match;

  while ((match = issuePattern.exec(line)) !== null) {
    matches.push(match[0]);
  }

  if (matches.length <= 1) return [line];
  return matches;
}

function formatLine(line) {
  if (!line) return "";
  line = fixIssueReferences(line);
  line = wrapCodeIdentifiers(line);
  line = convertToBullet(line);
  line = capitalizeSentence(line);
  return line;
}

function fixIssueReferences(line) {
  return line.replace(
    /(fixes|closes|related to)\s+#?(\d+)/gi,
    (_, keyword, number) => {
      const capitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
      return `${capitalized} #${number}`;
    }
  );
}

function wrapCodeIdentifiers(line) {
  if (line.startsWith("-") || /^(Fixes|Closes|Related)/.test(line)) return line;
  return line.replace(
    /\b([a-z][a-zA-Z0-9]*(?:_[a-zA-Z0-9]+)+|[A-Z][a-zA-Z0-9]*(?:[A-Z][a-z]+)+|\w+\(\)|\w+\.\w+|\w+\.[a-z]{2,4})\b/g,
    "`$1`"
  );
}

function convertToBullet(line) {
  const actionVerbs = [
    "added", "updated", "fixed", "removed", "changed", "passed",
    "implemented", "refactored", "created", "moved", "renamed",
    "improved", "replaced", "deleted", "migrated", "extracted",
    "simplified", "optimized", "resolved", "handled", "wrapped",
  ];

  const verbPattern = new RegExp(`^(${actionVerbs.join("|")})\\s+(.+)`, "i");
  const match = line.match(verbPattern);

  if (match) {
    const verb = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
    return `- ${verb} ${match[2]}`;
  }

  return line;
}

function capitalizeSentence(line) {
  if (!line) return "";
  if (line.startsWith("-") || /^(Fixes|Closes|Related)/.test(line)) return line;
  return line.charAt(0).toUpperCase() + line.slice(1);
}