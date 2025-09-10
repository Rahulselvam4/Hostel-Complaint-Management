import Trie from "../utils/trie.js";
import Complaint from "../models/Complaint.js";

const trie = new Trie();
let loaded = false;

export async function buildTrieFromDB() {
  // load descriptions and insert; you can limit or aggregate duplicates for freq
  const cursor = Complaint.find({}, { description: 1 }).cursor();
  for await (const doc of cursor) {
    if (doc.description) trie.insert(doc.description);
  }
  loaded = true;
  console.log("Trie built from DB");
}

export function insertIntoTrie(phrase) {
  trie.insert(phrase);
}

export function getSuggestions(prefix, k = 10) {
  if (!loaded) return []; // or build on demand
  return trie.getTopK(prefix, k);
}
