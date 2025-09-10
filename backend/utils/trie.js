class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
    this.freq = 0; // how many times this full phrase was inserted
  }
}

export default class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // normalize text: lowercase and trim
  _normalize(s) {
    return s.trim().toLowerCase();
  }

  insert(phrase) {
    if (!phrase || !phrase.trim()) return;
    const normalized = this._normalize(phrase);
    let node = this.root;
    for (const ch of normalized) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.isEnd = true;
    node.freq = (node.freq || 0) + 1;
  }

  // DFS from node to collect phrases (with freq)
  _collect(node, prefix, results) {
    if (node.isEnd) results.push({ phrase: prefix, freq: node.freq });
    for (const [ch, child] of node.children) {
      this._collect(child, prefix + ch, results);
    }
  }

  // return top K suggestions for prefix
  getTopK(prefix, k = 10) {
    const normalized = this._normalize(prefix);
    let node = this.root;
    for (const ch of normalized) {
      if (!node.children.has(ch)) return []; // no match
      node = node.children.get(ch);
    }
    const results = [];
    this._collect(node, normalized, results);
    // sort by freq desc, then by phrase length or lexicographically
    results.sort((a, b) => b.freq - a.freq || a.phrase.localeCompare(b.phrase));
    return results.slice(0, k).map(r => r.phrase);
  }
}
