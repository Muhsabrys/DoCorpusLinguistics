document.getElementById('analyzeBtn').addEventListener('click', function() {
    const corpusFile = document.getElementById('corpusFile').files[0];
    const stopwordsFile = document.getElementById('stopwordsFile').files[0];
    if (!corpusFile) {
        alert('Please upload a corpus file.');
        return;
    }
    
    let formData = new FormData();
    formData.append('corpus', corpusFile);
    if (stopwordsFile) formData.append('stopwords', stopwordsFile);
    
    let selectedOptions = [];
    document.querySelectorAll('#options input[type="checkbox"]:checked').forEach(el => {
        selectedOptions.push(el.value);
    });
    
    formData.append('options', selectedOptions);
    formData.append('topX', document.getElementById('topX').value);
    formData.append('targetWord', document.getElementById('targetWord').value);
    
    fetch('/analyze', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('results').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    })
    .catch(err => alert(err));
});
