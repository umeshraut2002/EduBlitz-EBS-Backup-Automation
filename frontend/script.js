// IMPORTANT: Use your API Gateway URL here, NOT your CloudFront URL.
// - API Gateway URL looks like: https://abc123xyz.execute-api.us-east-1.amazonaws.com
// - CloudFront URL looks like: https://d1234abcd.cloudfront.net  (do NOT use this for the button)
const API_GATEWAY_URL = 'https://nwwl98fglh.execute-api.us-east-1.amazonaws.com';

function getStatusEl() {
    return document.getElementById('statusMessage');
}

function getButtonEl() {
    return document.getElementById('createBackupBtn');
}

function showStatus(message, type) {
    const el = getStatusEl();
    el.textContent = '';
    el.className = 'status-message ' + (type || '');
    el.appendChild(document.createTextNode(message));
}

function showSnapshotResult(snapshotId) {
    const el = getStatusEl();
    el.textContent = '';
    el.className = 'status-message success';
    el.appendChild(document.createTextNode('Snapshot Created Successfully'));
    const idLine = document.createElement('span');
    idLine.className = 'snapshot-id';
    idLine.textContent = 'Snapshot ID: ' + snapshotId;
    el.appendChild(document.createElement('br'));
    el.appendChild(idLine);
}

function createSnapshot() {
    const btn = getButtonEl();
    btn.disabled = true;
    showStatus('Creating snapshot...', 'loading');

    // Avoid preflight by using a simple POST without custom headers (if CORS not configured)
    fetch(API_GATEWAY_URL + '/backup', {
        method: 'POST',
        mode: 'cors'
    })
        .then(function (response) {
            if (!response.ok) {
                return response.text().then(function (text) {
                    throw new Error(text || 'Request failed');
                });
            }
            return response.text();
        })
        .then(function (text) {
            // API may return plain "snap-xxx" or JSON { body: "snap-xxx" }
            let snapshotId = text;
            try {
                const data = JSON.parse(text);
                snapshotId = data.body || data.snapshotId || data.SnapshotId || text;
            } catch (_) {
                snapshotId = text;
            }
            showSnapshotResult(snapshotId);
        })
        .catch(function (err) {
            showStatus('Error: ' + (err.message || 'Could not create snapshot'), 'error');
        })
        .finally(function () {
            btn.disabled = false;
        });
}
