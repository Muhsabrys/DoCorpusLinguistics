let corpusText = "";
let stopWords = [];

document.getElementById('corpusInput').addEventListener('change', function() {
    const reader = new FileReader();
    reader.onload = () => {
        corpusText = reader.result.toLowerCase();
        document.getElementById('actions').hidden = false;
    };
    reader.readAsText(this.files[0], 'UTF-8');  // explicitly UTF-8
});


document.getElementById('stopwordsInput').addEventListener('change', function() {
    const reader = new FileReader();
    reader.onload = () => {
        stopWords = reader.result.toLowerCase().split(/\r?\n/).filter(Boolean);
    };
    reader.readAsText(this.files[0]);
});

// Word Frequency
function getWordFrequency() {
    const topX = parseInt(document.getElementById('topX').value);
    const tokens = corpusText.match(/\b\w+\b/g).filter(word => !stopWords.includes(word));
    const freq = {};
    tokens.forEach(word => freq[word] = (freq[word] || 0) + 1);
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, topX);
    displayResults(sorted.map(([word, count]) => `${word}: ${count}`).join('<br>'));
}

// Concordance Search
function getConcordance() {
    const word = document.getElementById('searchWord').value.toLowerCase();
    const regex = new RegExp(`(.{0,30})\\b${word}\\b(.{0,30})`, 'g');
    const matches = [...corpusText.matchAll(regex)].slice(0,50);
    const results = matches.map(m => `...${m[1]}<b>${word}</b>${m[2]}...`).join('<br><br>');
    displayResults(results || "No matches found.");
}

// Collocations Extraction (Simplified PMI)
function extractCollocations() {
    const tokens = corpusText.match(/\b\w+\b/g).filter(word => !stopWords.includes(word));
    const bigrams = {};
    for(let i = 0; i < tokens.length - 1; i++) {
        const pair = tokens[i] + ' ' + tokens[i+1];
        bigrams[pair] = (bigrams[pair] || 0) + 1;
    }
    const sorted = Object.entries(bigrams).sort((a, b) => b[1] - a[1]).slice(0,20);
    displayResults(sorted.map(([bigram, freq]) => `${bigram}: ${freq}`).join('<br>'));
}

// Word Cloud Generation
function generateWordCloud() {
    const tokens = corpusText.match(/\b\w+\b/g).filter(word => !stopWords.includes(word));
    const freq = {};
    tokens.forEach(word => freq[word] = (freq[word] || 0) + 1);
    const list = Object.entries(freq);
    WordCloud(document.getElementById('wordCloudCanvas'), { list });
}

// Principal Component Analysis (Dummy example)
function performPCA() {
    const sentences = corpusText.split(/[\.\?\!]/).filter(Boolean);
    const vectors = sentences.map(s => s.match(/\b\w+\b/g)?.length || 0).map(len => [len]);
    const pca = new ML.PCA(vectors);
    displayResults(`Explained Variance: ${pca.getExplainedVariance().join(', ')}`);
}

// Simplified Topic Modeling (Word clusters via Compromise.js)
function performTopicModeling() {
    let nlpDoc = nlp(corpusText);
    let nouns = nlpDoc.nouns().out('frequency').slice(0, 10);
    displayResults(nouns.map(n => `${n.normal}: ${n.count}`).join('<br>'));
}

// Display helper
function displayResults(html) {
    document.getElementById('results').innerHTML = html;
}
