/**
 * IFB web reading — lightweight init without Paged.js.
 * Builds a folding side navigation from the book TOC for screen reading.
 */
(function () {
  var STRIP_RE = /[\u00AD\u200B-\u200D\u2060\uFEFF\uFFFE\uFFFF]/g;
  var PINNED_NAV_MQ = "(min-width: 768px)";
  var siteBarHeightTimer;
  var lastSiteBarHeight = 0;

  function stripArtifacts(root) {
    if (!root || !root.ownerDocument) return;
    var skip = /^(script|style)$/i;
    var w = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) {
      var p = n.parentElement;
      if (!p || skip.test(p.tagName)) continue;
      var cleaned = n.textContent.replace(STRIP_RE, "");
      if (cleaned !== n.textContent) n.textContent = cleaned;
    }
  }

  function sweepEmptyPlates(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll(".ifb-plate-droite").forEach(function (plate) {
      var imgs = plate.querySelectorAll("img");
      if (!imgs.length) {
        plate.remove();
        return;
      }
      var allDone = true;
      var anyGood = false;
      for (var i = 0; i < imgs.length; i++) {
        var im = imgs[i];
        if (!im.complete) {
          allDone = false;
          break;
        }
        if (im.naturalWidth > 0 && im.naturalHeight > 0) anyGood = true;
      }
      if (allDone && !anyGood) plate.remove();
    });
  }

  function cleanNavLabel(text) {
    return (text || "")
      .replace(/__/g, "")
      .replace(/\s*\/\/\s*/g, " ")
      .replace(/^[\s\-–—_]+/, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function syncSiteBarHeight(immediate) {
    function apply() {
      var bar = document.querySelector(".ifb-site-bar");
      if (!bar) return;
      var height = bar.offsetHeight;
      if (!immediate && lastSiteBarHeight > 0 && Math.abs(height - lastSiteBarHeight) < 2) {
        return;
      }
      lastSiteBarHeight = height;
      document.documentElement.style.setProperty("--ifb-site-bar-h", height + "px");
    }

    clearTimeout(siteBarHeightTimer);
    if (immediate) {
      apply();
      return;
    }
    siteBarHeightTimer = setTimeout(apply, 150);
  }

  function isPinnedNav() {
    return window.matchMedia(PINNED_NAV_MQ).matches;
  }

  function attachChapterSections(groups) {
    groups.forEach(function (group) {
      group.chapters.forEach(function (chapter) {
        chapter.sections = [];
        var href = chapter.href;
        if (!href || href.charAt(0) !== "#") return;
        var chapterEl = document.getElementById(href.slice(1));
        if (!chapterEl) return;
        var node = chapterEl.nextElementSibling;
        while (node) {
          if (
            node.classList &&
            (node.classList.contains("projet") || node.classList.contains("partie_droite"))
          ) {
            break;
          }
          if (node.tagName === "H4" && node.id) {
            chapter.sections.push({
              href: "#" + node.id,
              label: cleanNavLabel(node.textContent),
            });
          }
          node = node.nextElementSibling;
        }
      });
    });
  }

  function setAccordionOpen(btn, panel, open) {
    if (!btn || !panel) return;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    panel.hidden = !open;
    var host = btn.closest(".ifb-side-nav__group, .ifb-side-nav__chapter-item");
    if (host) host.classList.toggle("is-expanded", open);
  }

  function expandAncestorsOfLink(link) {
    if (!link) return;
    var group = link.closest(".ifb-side-nav__group");
    if (group) {
      var partBtn = group.querySelector(".ifb-side-nav__part-toggle");
      var panelId = partBtn && partBtn.getAttribute("aria-controls");
      var panel = panelId && document.getElementById(panelId);
      if (partBtn && panel) setAccordionOpen(partBtn, panel, true);
    }
    var chapterItem = link.closest(".ifb-side-nav__chapter-item");
    if (chapterItem) {
      var chBtn = chapterItem.querySelector(".ifb-side-nav__chapter-toggle");
      var secId = chBtn && chBtn.getAttribute("aria-controls");
      var secPanel = secId && document.getElementById(secId);
      if (chBtn && secPanel) setAccordionOpen(chBtn, secPanel, true);
    }
  }

  function buildSideNav() {
    var toc = document.querySelector(".part.ifb-toc-start");
    var main = document.getElementById("ifb-web-document");
    if (!toc || !main || document.getElementById("ifb-side-nav")) return null;

    var shell = document.createElement("div");
    shell.className = "ifb-web-shell";

    var aside = document.createElement("aside");
    aside.className = "ifb-side-nav";
    aside.id = "ifb-side-nav";
    aside.setAttribute("aria-label", "Contents");

    var tocBox = document.createElement("div");
    tocBox.className = "ifb-side-nav__toc-box";

    var inner = document.createElement("nav");
    inner.className = "ifb-side-nav__inner";
    inner.setAttribute("aria-label", "Thesis table of contents");

    var groups = [];
    var currentGroup = null;

    Array.from(toc.children).forEach(function (child) {
      if (child.id === "sommaire") return;

      if (child.tagName === "SPAN") {
        var partAnchor = child.querySelector("a");
        if (!partAnchor) return;
        var partLabel = cleanNavLabel(partAnchor.textContent);
        var partHref = partAnchor.getAttribute("href") || "";
        var isPart = /^part\s/i.test(partLabel);
        currentGroup = {
          label: partLabel,
          href: partHref,
          kind: isPart ? "part" : "back",
          chapters: [],
        };
        groups.push(currentGroup);
        return;
      }

      if (child.classList.contains("proj")) {
        if (!currentGroup) {
          currentGroup = {
            label: "Contents",
            href: "",
            kind: "part",
            chapters: [],
          };
          groups.push(currentGroup);
        }
        currentGroup.chapters.push({
          href: child.getAttribute("href") || "",
          label: cleanNavLabel(child.textContent),
          sections: [],
        });
      }
    });

    attachChapterSections(groups);

    groups.forEach(function (group, groupIndex) {
      var groupEl = document.createElement("div");
      groupEl.className = "ifb-side-nav__group";
      if (group.kind === "back") {
        groupEl.classList.add("ifb-side-nav__group--back");
      }

      var hasChapters = group.chapters.length > 0;
      var panelId = "ifb-nav-panel-" + groupIndex;

      if (hasChapters) {
        var partToggle = document.createElement("button");
        partToggle.type = "button";
        partToggle.className = "ifb-side-nav__part-toggle";
        partToggle.setAttribute("aria-expanded", "false");
        partToggle.setAttribute("aria-controls", panelId);

        var partLabel = document.createElement("span");
        partLabel.className = "ifb-side-nav__toggle-label";
        partLabel.textContent = group.label;

        var chevron = document.createElement("span");
        chevron.className = "ifb-side-nav__chevron";
        chevron.setAttribute("aria-hidden", "true");

        partToggle.appendChild(partLabel);
        partToggle.appendChild(chevron);
        groupEl.appendChild(partToggle);

        var panel = document.createElement("div");
        panel.className = "ifb-side-nav__panel";
        panel.id = panelId;
        panel.hidden = true;

        var list = document.createElement("ul");
        list.className = "ifb-side-nav__chapters";

        group.chapters.forEach(function (chapter, chapterIndex) {
          var li = document.createElement("li");
          li.className = "ifb-side-nav__chapter-item";

          var hasSections = chapter.sections && chapter.sections.length > 0;
          var secPanelId = panelId + "-sec-" + chapterIndex;

          if (hasSections) {
            var chapterRow = document.createElement("div");
            chapterRow.className = "ifb-side-nav__chapter-row";

            var link = document.createElement("a");
            link.className = "ifb-side-nav__chapter";
            link.href = chapter.href;
            link.textContent = chapter.label;

            var chToggle = document.createElement("button");
            chToggle.type = "button";
            chToggle.className = "ifb-side-nav__chapter-toggle";
            chToggle.setAttribute("aria-expanded", "false");
            chToggle.setAttribute("aria-controls", secPanelId);
            chToggle.setAttribute("aria-label", "Show subsections for " + chapter.label);

            var chChevron = document.createElement("span");
            chChevron.className = "ifb-side-nav__chevron";
            chChevron.setAttribute("aria-hidden", "true");
            chToggle.appendChild(chChevron);

            chapterRow.appendChild(link);
            chapterRow.appendChild(chToggle);
            li.appendChild(chapterRow);

            var sectionList = document.createElement("ul");
            sectionList.className = "ifb-side-nav__sections";
            sectionList.id = secPanelId;
            sectionList.hidden = true;

            chapter.sections.forEach(function (section) {
              var sectionLi = document.createElement("li");
              var sectionLink = document.createElement("a");
              sectionLink.className = "ifb-side-nav__section";
              sectionLink.href = section.href;
              sectionLink.textContent = section.label;
              sectionLi.appendChild(sectionLink);
              sectionList.appendChild(sectionLi);
            });
            li.appendChild(sectionList);
          } else {
            var chapterLink = document.createElement("a");
            chapterLink.className = "ifb-side-nav__chapter";
            chapterLink.href = chapter.href;
            chapterLink.textContent = chapter.label;
            li.appendChild(chapterLink);
          }

          list.appendChild(li);
        });

        panel.appendChild(list);
        groupEl.appendChild(panel);
      } else if (group.href) {
        var backLink = document.createElement("a");
        backLink.className = "ifb-side-nav__part ifb-side-nav__part--solo";
        backLink.href = group.href;
        backLink.textContent = group.label;
        groupEl.appendChild(backLink);
      }

      inner.appendChild(groupEl);
    });

    tocBox.appendChild(inner);
    aside.appendChild(tocBox);

    var backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "ifb-side-nav-backdrop";
    backdrop.setAttribute("aria-label", "Close contents");
    backdrop.hidden = true;

    main.parentNode.insertBefore(shell, main);
    shell.appendChild(main);
    document.body.insertBefore(aside, shell);
    document.body.appendChild(backdrop);

    toc.hidden = true;
    toc.setAttribute("aria-hidden", "true");

    return { aside: aside, inner: inner, backdrop: backdrop };
  }

  function initNavAccordion(navRoot) {
    if (!navRoot) return;

    navRoot.querySelectorAll(".ifb-side-nav__part-toggle").forEach(function (btn) {
      var panelId = btn.getAttribute("aria-controls");
      var panel = panelId && document.getElementById(panelId);
      if (!panel) return;
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") !== "true";
        setAccordionOpen(btn, panel, open);
      });
    });

    navRoot.querySelectorAll(".ifb-side-nav__chapter-toggle").forEach(function (btn) {
      var panelId = btn.getAttribute("aria-controls");
      var panel = panelId && document.getElementById(panelId);
      if (!panel) return;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = btn.getAttribute("aria-expanded") !== "true";
        setAccordionOpen(btn, panel, open);
      });
    });

    var firstToggle = navRoot.querySelector(".ifb-side-nav__part-toggle");
    if (firstToggle) {
      var firstPanelId = firstToggle.getAttribute("aria-controls");
      var firstPanel = firstPanelId && document.getElementById(firstPanelId);
      if (firstPanel) setAccordionOpen(firstToggle, firstPanel, true);
    }
  }

  function updateAsideVisibility(aside, open) {
    if (!aside) return;
    if (isPinnedNav()) {
      aside.removeAttribute("aria-hidden");
      aside.removeAttribute("inert");
      return;
    }
    if (open) {
      aside.setAttribute("aria-hidden", "false");
      aside.removeAttribute("inert");
    } else {
      aside.setAttribute("aria-hidden", "true");
      aside.setAttribute("inert", "");
    }
  }

  function initSideNavToggle(aside, backdrop) {
    var siteBar = document.querySelector(".ifb-site-bar");
    if (!siteBar || !aside) return null;

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "ifb-side-nav-toggle";
    toggle.setAttribute("aria-controls", "ifb-side-nav");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open thesis contents");
    toggle.textContent = "Contents";

    var actions = siteBar.querySelector(".ifb-site-bar__actions");
    if (actions) {
      actions.appendChild(toggle);
    } else {
      siteBar.appendChild(toggle);
    }

    function setOpen(open) {
      if (isPinnedNav()) return;
      document.documentElement.classList.toggle("ifb-side-nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close thesis contents" : "Open thesis contents");
      backdrop.hidden = !open;
      updateAsideVisibility(aside, open);
      if (open) {
        var firstToggle = aside.querySelector(".ifb-side-nav__part-toggle");
        if (firstToggle) firstToggle.focus();
      } else {
        toggle.focus();
      }
    }

    updateAsideVisibility(aside, false);

    toggle.addEventListener("click", function () {
      if (isPinnedNav()) return;
      setOpen(!document.documentElement.classList.contains("ifb-side-nav-open"));
    });

    backdrop.addEventListener("click", function () {
      setOpen(false);
    });

    aside.addEventListener("click", function (e) {
      var link = e.target.closest("a[href^='#']");
      if (link && !isPinnedNav()) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !isPinnedNav() && document.documentElement.classList.contains("ifb-side-nav-open")) {
        setOpen(false);
      }
    });

    return setOpen;
  }

  function initSideNavPin(aside, setOpen) {
    function applyPin() {
      var root = document.documentElement;
      if (isPinnedNav()) {
        root.classList.add("ifb-side-nav-pinned");
        root.classList.remove("ifb-side-nav-open");
        if (setOpen) setOpen(false);
        updateAsideVisibility(aside, true);
      } else {
        root.classList.remove("ifb-side-nav-pinned");
        root.classList.remove("ifb-side-nav-open");
        if (setOpen) setOpen(false);
        updateAsideVisibility(aside, false);
      }
    }

    applyPin();
    window.addEventListener("resize", applyPin);
    if (window.matchMedia) {
      window.matchMedia(PINNED_NAV_MQ).addEventListener("change", applyPin);
    }
  }

  function initBackToTop() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ifb-back-to-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = "<span aria-hidden=\"true\">↑</span>";
    btn.setAttribute("aria-hidden", "true");
    btn.tabIndex = -1;
    document.body.appendChild(btn);

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function updateVisibility() {
      var show = window.scrollY > 480;
      btn.classList.toggle("is-visible", show);
      btn.setAttribute("aria-hidden", show ? "false" : "true");
      btn.tabIndex = show ? 0 : -1;
    }

    btn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
      btn.blur();
    });

    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();
  }

  function initScrollSpy(navRoot) {
    if (!navRoot) return;
    var links = navRoot.querySelectorAll('a[href^="#"]');
    var sections = [];

    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href || href.length < 2) return;
      var el = document.getElementById(href.slice(1));
      if (el) sections.push({ link: link, el: el });
    });

    if (!sections.length) return;

    function setActive(link) {
      links.forEach(function (l) {
        l.removeAttribute("aria-current");
      });
      if (link) {
        link.setAttribute("aria-current", "location");
        expandAncestorsOfLink(link);
      }
    }

    if ("IntersectionObserver" in window) {
      var visible = new Map();
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              visible.set(entry.target, entry.intersectionRatio);
            } else {
              visible.delete(entry.target);
            }
          });

          var best = null;
          var bestRatio = -1;
          sections.forEach(function (section) {
            var ratio = visible.get(section.el);
            if (ratio !== undefined && ratio >= bestRatio) {
              bestRatio = ratio;
              best = section.link;
            }
          });

          if (best) setActive(best);
        },
        { rootMargin: "-12% 0px -50% 0px", threshold: [0, 0.1, 0.25, 0.5, 1] }
      );

      sections.forEach(function (section) {
        observer.observe(section.el);
      });
    } else {
      setActive(sections[0].link);
    }
  }

  function init() {
    var root = document.body;
    stripArtifacts(root);
    if (typeof ifbFixPossessiveApostrophesInRoot === "function") {
      ifbFixPossessiveApostrophesInRoot(root);
    }
    if (typeof ifbMarkPlateLandscapeImages === "function") {
      ifbMarkPlateLandscapeImages(root);
    }
    sweepEmptyPlates(root);

    var navParts = buildSideNav();
    if (navParts) {
      initNavAccordion(navParts.inner);
      var setOpen = initSideNavToggle(navParts.aside, navParts.backdrop);
      initSideNavPin(navParts.aside, setOpen);
      initScrollSpy(navParts.inner);
    }

    initBackToTop();
    syncSiteBarHeight(true);
    window.addEventListener("resize", function () {
      syncSiteBarHeight(false);
    });

    if (typeof ifbInitAuthorQRCodes === "function") {
      ifbInitAuthorQRCodes(root);
    } else if (typeof ifbInitAuthorQRCodesOnPages === "function") {
      ifbInitAuthorQRCodesOnPages([root]);
    }
    document.documentElement.classList.add("ifb-web-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("load", function () {
    if (typeof ifbMarkPlateLandscapeImages === "function") {
      ifbMarkPlateLandscapeImages(document.body);
    }
    sweepEmptyPlates(document.body);
    syncSiteBarHeight(true);
  });
})();
