/**
 * Formats a Unix timestamp (in seconds) into a readable date string.
 * @param {number|string} timestamp
 * @returns {string}
 */
function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Builds the HTML table from query-index.json data.
 * @param {Array} items
 * @returns {HTMLTableElement}
 */
function buildTable(items) {
  const table = document.createElement('table');
  table.className = 'article-feed-table';

  // Table Header
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Thumbnail</th>
      <th>Title & Path</th>
      <th>Description</th>
      <th>Last Modified</th>
    </tr>
  `;
  table.append(thead);

  // Table Body
  const tbody = document.createElement('tbody');

  items.forEach((item) => {
    const tr = document.createElement('tr');

    // 1. Image Cell
    const imgTd = document.createElement('td');
    imgTd.className = 'col-image';
    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.title || 'Article thumbnail';
      img.loading = 'lazy';
      imgTd.append(img);
    }

    // 2. Title & Path Cell (clickable link)
    const titleTd = document.createElement('td');
    titleTd.className = 'col-title';
    const link = document.createElement('a');
    link.href = item.path || '#';
    link.textContent = item.title || item.path;
    
    const pathSpan = document.createElement('span');
    pathSpan.className = 'item-path';
    pathSpan.textContent = item.path || '';
    
    titleTd.append(link, pathSpan);

    // 3. Description Cell
    const descTd = document.createElement('td');
    descTd.className = 'col-description';
    descTd.textContent = item.description || '';

    // 4. Last Modified Cell
    const dateTd = document.createElement('td');
    dateTd.className = 'col-date';
    dateTd.textContent = formatDate(item.lastModified);

    tr.append(imgTd, titleTd, descTd, dateTd);
    tbody.append(tr);
  });

  table.append(tbody);
  return table;
}

export default async function decorate(block) {
  // Check if a link to query-index.json was authored inside the block, otherwise use default
  const link = block.querySelector('a');
  const feedUrl = link ? new URL(link.href).pathname : '/query-index.json';

  block.innerHTML = '<p class="loading-state">Loading articles...</p>';

  try {
    const response = await fetch(feedUrl);
    if (!response.ok) throw new Error(`Failed to fetch index: ${response.status}`);

    const json = await response.json();
    const items = json.data || [];

    if (items.length === 0) {
      block.innerHTML = '<p class="empty-state">No articles found.</p>';
      return;
    }

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-responsive-wrapper';
    tableWrapper.append(buildTable(items));

    block.replaceChildren(tableWrapper);
  } catch (error) {
    console.error('Error loading article feed:', error);
    block.innerHTML = '<p class="error-state">Unable to load feed content.</p>';
  }
}