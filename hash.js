// a simple hash function to differentiate script versions, ID telemetry, etc.
// Output: 16-digit hex string
// sha256, md5, etc are all async, and wayyy overkill. This will do the job
function hash(str) {
  str = str.toString() + "kairoscloud"; // salt to ensure minimum length is met
  let hash1 = 0xdeadbeef; // Seed for first part of the hash
  let hash2 = 0xcafebabe; // Seed for second part of the hash

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    // First hash part
    hash1 = Math.imul(hash1 ^ char, 0x85ebca6b);
    hash1 = (hash1 << 13) | (hash1 >>> 19);

    // Second hash part
    hash2 = Math.imul(hash2 ^ char, 0xc2b2ae35);
    hash2 = (hash2 << 11) | (hash2 >>> 21);
  }
  // Combine the two hashes and return a 16-digit hex string
  const combinedHash = (
    (hash1 >>> 0).toString(16) + (hash2 >>> 0).toString(16)
  ).padStart(16, "0");
  return combinedHash.slice(0, 16); // Ensure exactly 16 digits
}
