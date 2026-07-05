/**
 * portfolio.js — load site data, render printable portfolio, paginate with Paged.js
 */
(function () {
  'use strict';

  var DATA_FILES = {
    profile: '../data/profile.json',
    links: '../data/links.json',
    installations: '../data/installations.json',
    performance: '../data/performance.json',
    visual: '../data/visual.json',
    exhibitions: '../data/exhibitions.json',
  };

  function esc(s) {
    if (s == null || s === '') return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function assetPath(path) {
    if (!path || typeof path !== 'string') return '';
    if (/^https?:\/\//i.test(path)) return path;
    if (path.indexOf('./') === 0) return '../' + path.slice(2);
    return path;
  }

  function items(obj) {
    return obj && Array.isArray(obj.items) ? obj.items : [];
  }

  function parseExhibitionSortKey(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return 0;

    var lower = dateStr.toLowerCase();
    var yearMatch = dateStr.match(/(20\d{2})/);
    var year = yearMatch ? parseInt(yearMatch[1], 10) : 0;
    if (!year) return 0;

    var months = {
      january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
      july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
    };
    var month = 0;
    Object.keys(months).forEach(function (name) {
      if (lower.indexOf(name) !== -1) month = months[name];
    });

    var day = 1;
    var dayBeforeMonth = dateStr.match(/(\d{1,2})\s*[–—-]?\s*\d{0,2}\s+[A-Za-z]+/);
    var dayAfterMonth = dateStr.match(/[A-Za-z]+\s+(\d{1,2})(?!\d)/);
    if (dayBeforeMonth) day = parseInt(dayBeforeMonth[1], 10);
    else if (dayAfterMonth) day = parseInt(dayAfterMonth[1], 10);

    if (!month) month = 1;
    return year * 10000 + month * 100 + day;
  }

  function fetchJson(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error('Failed to load ' + url + ' (' + res.status + ')');
      return res.json();
    });
  }

  function loadPartsFromScript() {
    return new Promise(function (resolve, reject) {
      if (window.__PORTFOLIO_PRINT_PARTS__) {
        resolve(window.__PORTFOLIO_PRINT_PARTS__);
        return;
      }
      var script = document.createElement('script');
      script.src = new URL('portfolioData.parts.js', window.location.href).href;
      script.onload = function () {
        if (window.__PORTFOLIO_PRINT_PARTS__) {
          resolve(window.__PORTFOLIO_PRINT_PARTS__);
        } else {
          reject(new Error('Portfolio print parts bundle is empty'));
        }
      };
      script.onerror = function () {
        reject(
          new Error(
            'Failed to load portfolioData.parts.js. Run: npm run build-data'
          )
        );
      };
      document.head.appendChild(script);
    });
  }

  function loadAllFromFetch() {
    return Promise.all([
      fetchJson('config.json'),
      fetchJson(DATA_FILES.profile),
      fetchJson(DATA_FILES.links),
      fetchJson(DATA_FILES.installations),
      fetchJson(DATA_FILES.performance),
      fetchJson(DATA_FILES.visual),
      fetchJson(DATA_FILES.exhibitions),
    ]).then(function (results) {
      return {
        config: results[0],
        profile: results[1],
        links: results[2],
        installations: results[3],
        performance: results[4],
        visual: results[5],
        exhibitions: results[6],
      };
    });
  }

  function loadAllFromParts(parts) {
    return {
      config: parts.config,
      profile: parts.profile,
      links: parts.links,
      installations: parts.installations,
      performance: parts.performance,
      visual: parts.visual,
      exhibitions: parts.exhibitions,
    };
  }

  function loadAll() {
    if (window.location.protocol === 'file:') {
      return loadPartsFromScript().then(loadAllFromParts);
    }
    return loadAllFromFetch();
  }

  function collectWorks(data) {
    var map = {};
    var sources = [
      items(data.installations),
      items(data.performance),
      items(data.visual),
    ];
    sources.forEach(function (list) {
      list.forEach(function (item) {
        if (item && item.id) map[item.id] = item;
      });
    });
    return map;
  }

  function normalizeExhibitions(raw) {
    return items(raw).map(function (ex) {
      var copy = {};
      Object.keys(ex).forEach(function (k) { copy[k] = ex[k]; });
      if (ex.date && typeof ex.date === 'string') {
        var yearMatch = ex.date.match(/(20\d{2})/);
        copy.year = yearMatch ? parseInt(yearMatch[1], 10) : null;
        copy.sortDate = parseExhibitionSortKey(ex.date);
      } else {
        copy.year = null;
        copy.sortDate = 0;
      }
      return copy;
    }).sort(function (a, b) {
      return (b.sortDate || 0) - (a.sortDate || 0);
    });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderCover(container, profile) {
    var home = profile.home || {};
    var about = profile.about || {};
    var section = el('section', 'portfolio-cover');

    if (about.image) {
      var photo = document.createElement('img');
      photo.className = 'portfolio-cover__photo';
      photo.src = assetPath(about.image);
      photo.alt = 'Atharva Gupta';
      section.appendChild(photo);
    }

    section.appendChild(el('h1', 'portfolio-cover__name', 'Atharva Gupta'));
    if (home.title) {
      section.appendChild(el('p', 'portfolio-cover__tagline', home.title));
    }
    if (home.subtitle) {
      section.appendChild(el('p', 'portfolio-cover__byline', home.subtitle));
    }

    container.appendChild(section);
  }

  function renderBio(container, profile, links) {
    var about = profile.about || {};
    var social = items(links);
    var section = el('section', 'portfolio-bio portfolio-section');

    section.appendChild(el('p', 'portfolio-section__label', 'About'));
    section.appendChild(el('h2', 'portfolio-section__title', about.title || 'About Me'));

    if (about.description) {
      section.appendChild(el('p', 'portfolio-bio__text', about.description));
    }

    if (social.length > 0) {
      var linksWrap = el('div', 'portfolio-bio__links');
      social.forEach(function (s) {
        var a = document.createElement('a');
        a.className = 'portfolio-bio__link';
        a.href = s.url || '#';
        a.textContent = s.name || '';
        linksWrap.appendChild(a);
      });
      section.appendChild(linksWrap);
    }

    container.appendChild(section);
  }

  function renderCV(container, profile, config) {
    var cv = profile.cv || {};
    var section = el('section', 'portfolio-cv portfolio-section');

    section.appendChild(el('p', 'portfolio-section__label', 'Curriculum Vitae'));
    section.appendChild(el('h2', 'portfolio-section__title', 'CV'));

    var hasEdu = cv.education && cv.education.length > 0;
    var hasWork = cv.workExperience && cv.workExperience.length > 0;

    if (hasEdu || hasWork) {
      var columns = el('div', 'portfolio-cv__columns');

      if (hasEdu) {
        var eduBlock = el('div', 'portfolio-cv__block');
        eduBlock.appendChild(el('h3', 'portfolio-cv__block-title', 'Education'));
        cv.education.forEach(function (row) {
          var entry = el('div', 'portfolio-cv__entry');
          var header = el('div', 'portfolio-cv__entry-header');
          header.appendChild(el('span', 'portfolio-cv__entry-title', row.degree || ''));
          header.appendChild(el('span', 'portfolio-cv__entry-period', row.period || ''));
          entry.appendChild(header);
          var sub = [row.institution, row.location].filter(Boolean).join(' · ');
          if (sub) entry.appendChild(el('p', 'portfolio-cv__entry-sub', sub));
          eduBlock.appendChild(entry);
        });
        columns.appendChild(eduBlock);
      }

      if (hasWork) {
        var workBlock = el('div', 'portfolio-cv__block');
        workBlock.appendChild(el('h3', 'portfolio-cv__block-title', 'Work Experience'));
        cv.workExperience.forEach(function (job) {
          var entry = el('div', 'portfolio-cv__entry');
          var header = el('div', 'portfolio-cv__entry-header');
          header.appendChild(el('span', 'portfolio-cv__entry-title', job.title || ''));
          header.appendChild(el('span', 'portfolio-cv__entry-period', job.period || ''));
          entry.appendChild(header);
          var sub = [job.company, job.location].filter(Boolean).join(' · ');
          if (sub) entry.appendChild(el('p', 'portfolio-cv__entry-sub', sub));
          workBlock.appendChild(entry);
        });
        columns.appendChild(workBlock);
      }

      section.appendChild(columns);
    }

    if (config.includeSkills !== false && cv.skills) {
      var skillsBlock = el('div', 'portfolio-cv__block');
      skillsBlock.appendChild(el('h3', 'portfolio-cv__block-title', 'Skills & Interests'));
      var grid = el('div', 'portfolio-cv__skills-grid');

      [['General', cv.skills.general], ['Technologies', cv.skills.technologies], ['Interests', cv.skills.interests]].forEach(function (pair) {
        if (!pair[1] || !pair[1].length) return;
        var col = el('div', 'portfolio-cv__skills-col');
        col.appendChild(el('p', 'portfolio-section__subtitle', pair[0]));
        var ul = el('ul', 'portfolio-cv__skills-list');
        pair[1].forEach(function (skill) {
          ul.appendChild(el('li', null, skill));
        });
        col.appendChild(ul);
        grid.appendChild(col);
      });

      if (grid.childNodes.length > 0) {
        skillsBlock.appendChild(grid);
        section.appendChild(skillsBlock);
      }
    }

    container.appendChild(section);
  }

  function renderWork(container, work, config, options) {
    options = options || {};
    var maxImages = config.maxImagesPerWork || 3;
    var images = (Array.isArray(work.images) ? work.images : []).slice(0, maxImages);

    var classNames = 'portfolio-work portfolio-section';
    if (options.compact) classNames += ' portfolio-work--compact';
    if (options.newPage) classNames += ' portfolio-work--new-page';
    var section = el('section', classNames);

    if (!options.compact) {
      section.appendChild(el('p', 'portfolio-section__label', 'Selected Work'));
    }

    section.appendChild(el('h2', 'portfolio-section__title', work.title || ''));

    if (work.category) {
      section.appendChild(el('p', 'portfolio-work__category', work.category));
    }

    if (images.length > 0) {
      var gridClass = 'portfolio-work__images';
      if (images.length === 1) gridClass += ' portfolio-work__images--single';
      else if (images.length === 2) gridClass += ' portfolio-work__images--two';
      var grid = el('div', gridClass);
      images.forEach(function (src) {
        var img = document.createElement('img');
        img.src = assetPath(src);
        img.alt = work.title || '';
        img.loading = 'eager';
        grid.appendChild(img);
      });
      section.appendChild(grid);
    }

    var desc = work.fullDescription || work.description;
    if (desc) {
      section.appendChild(el('p', 'portfolio-work__desc', desc));
    }

    var metaRow = el('div', 'portfolio-work__meta-row');
    var hasMeta = false;

    if (work.medium) {
      var medium = el('p', 'portfolio-work__meta');
      medium.innerHTML = '<strong>Medium</strong> ' + esc(work.medium);
      metaRow.appendChild(medium);
      hasMeta = true;
    }
    if (work.dimensions) {
      var dims = el('p', 'portfolio-work__meta');
      dims.innerHTML = '<strong>Dimensions</strong> ' + esc(work.dimensions);
      metaRow.appendChild(dims);
      hasMeta = true;
    }
    if (work.themes) {
      var themes = el('p', 'portfolio-work__meta');
      themes.innerHTML = '<strong>Themes</strong> ' + esc(work.themes);
      metaRow.appendChild(themes);
      hasMeta = true;
    }
    if (hasMeta) section.appendChild(metaRow);

    container.appendChild(section);
  }

  function groupExhibitionsByYear(list) {
    var buckets = [];
    var current = null;
    list.forEach(function (ex) {
      var year = ex.year != null ? ex.year : 0;
      var label = year ? String(year) : 'Other';
      if (!current || current.label !== label) {
        current = { label: label, items: [] };
        buckets.push(current);
      }
      current.items.push(ex);
    });
    return buckets;
  }

  function renderExhibitions(container, exhibitions, config) {
    var opts = config.exhibitions || {};
    var list = exhibitions;
    if (opts.maxItems && typeof opts.maxItems === 'number') {
      list = list.slice(0, opts.maxItems);
    }

    var section = el('section', 'portfolio-exhibitions portfolio-section');
    section.appendChild(el('p', 'portfolio-section__label', 'Exhibitions & Presentations'));
    section.appendChild(el('h2', 'portfolio-section__title', 'Exhibitions'));

    var showRole = opts.showRole !== false;
    var showLocation = opts.showLocation !== false;
    var colCount = 3 + (showLocation ? 1 : 0) + (showRole ? 1 : 0);
    var yearGroups = groupExhibitionsByYear(list);

    var table = document.createElement('table');
    table.className = 'portfolio-exhibitions__table';

    var thead = document.createElement('thead');
    var headRow = document.createElement('tr');
    ['Date', 'Title', 'Venue'].concat(showLocation ? ['Location'] : [], showRole ? ['Role'] : [])
      .forEach(function (heading) {
        var th = document.createElement('th');
        th.textContent = heading;
        th.className = 'portfolio-exhibitions__col-' + heading.toLowerCase();
        headRow.appendChild(th);
      });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    yearGroups.forEach(function (group) {
      var yearRow = document.createElement('tr');
      yearRow.className = 'portfolio-exhibitions__year-row';
      var yearCell = document.createElement('td');
      yearCell.colSpan = colCount;
      yearCell.className = 'portfolio-exhibitions__year';
      yearCell.textContent = group.label;
      yearRow.appendChild(yearCell);
      tbody.appendChild(yearRow);

      group.items.forEach(function (ex) {
        var row = document.createElement('tr');
        row.appendChild(el('td', 'portfolio-exhibitions__col-date', ex.date || ''));
        row.appendChild(el('td', 'portfolio-exhibitions__col-title', ex.title || ''));
        row.appendChild(el('td', 'portfolio-exhibitions__col-venue', ex.venue || ''));
        if (showLocation) {
          row.appendChild(el('td', 'portfolio-exhibitions__col-location', ex.location || ''));
        }
        if (showRole) {
          row.appendChild(el('td', 'portfolio-exhibitions__col-role', ex.role || ''));
        }
        tbody.appendChild(row);
      });
    });
    table.appendChild(tbody);
    section.appendChild(table);
    container.appendChild(section);
  }

  function buildDocument(data) {
    var container = document.getElementById('portfolio-source');
    if (!container) return;

    var config = data.config || {};
    var workMap = collectWorks(data);
    var workIds = Array.isArray(config.workIds) ? config.workIds : [];
    var exhibitions = normalizeExhibitions(data.exhibitions);

    container.innerHTML = '';
    container.setAttribute('aria-busy', 'true');

    renderCover(container, data.profile);
    renderBio(container, data.profile, data.links);
    renderCV(container, data.profile, config);

    workIds.forEach(function (id, index) {
      var work = workMap[id];
      if (!work) return;
      renderWork(container, work, config, {
        compact: index > 0,
        newPage: index === 1,
      });
    });

    renderExhibitions(container, exhibitions, config);
  }

  function setStatus(text) {
    var el = document.getElementById('portfolio-status');
    if (el) el.textContent = text;
  }

  function markReady(statusText) {
    var container = document.getElementById('portfolio-source');
    if (container) {
      container.classList.add('is-ready');
      container.setAttribute('aria-busy', 'false');
    }
    setStatus(statusText);
  }

  function loadPagedScript() {
    return new Promise(function (resolve, reject) {
      if (window.PagedPolyfill) {
        resolve();
        return;
      }
      window.PagedConfig = { auto: false };
      var script = document.createElement('script');
      script.src = new URL(
        '../thesis/cityfab-livre-print/pagedjs-polyfill.min.js',
        window.location.href
      ).href;
      script.onload = function () {
        if (window.PagedPolyfill) resolve();
        else reject(new Error('PagedPolyfill missing after load'));
      };
      script.onerror = function () {
        reject(new Error('Failed to load Paged.js'));
      };
      document.head.appendChild(script);
    });
  }

  function initNativePrint() {
    document.documentElement.classList.add('portfolio-root--native');
    markReady('Ready — Print / Save PDF (local preview)');
    return Promise.resolve();
  }

  function initPaged() {
    return loadPagedScript().then(function () {
      var previewer = window.PagedPolyfill;
      if (!previewer || typeof previewer.preview !== 'function') {
        throw new Error('PagedPolyfill missing');
      }
      return previewer.preview();
    }).then(function () {
      markReady(
        document.querySelectorAll('.pagedjs_page').length +
          ' page' +
          (document.querySelectorAll('.pagedjs_page').length === 1 ? '' : 's')
      );
    });
  }

  function initLayout() {
    if (window.location.protocol === 'file:') {
      return initNativePrint();
    }
    setStatus('Paginating…');
    return initPaged();
  }

  function init() {
    var printBtn = document.getElementById('portfolio-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
      });
    }

    setStatus('Loading data…');

    loadAll()
      .then(function (data) {
        buildDocument(data);
        return initLayout();
      })
      .catch(function (err) {
        console.error('Portfolio error:', err);
        var message = err && err.message ? err.message : 'failed to load';
        setStatus('Error: ' + message);
        var container = document.getElementById('portfolio-source');
        if (container && !container.querySelector('.portfolio-cover')) {
          var hint = window.location.protocol === 'file:'
            ? ' Run npm run build-data for offline data, or use python -m http.server for full preview.'
            : ' Please refresh.';
          container.innerHTML =
            '<p style="padding:2em;color:#e4e4e4;">Failed to load portfolio.' +
            esc(hint) +
            '</p>';
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
