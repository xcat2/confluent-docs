# Changelog

All notable changes to the confluent documentation are recorded here.

## Developer section merged into Miscellaneous

### Changed
- Moved `developer/api.md` to `miscellaneous/api.md` and removed the
  now-empty Developer top-level section from the navigation. Internal links
  (`index.md`, `user_reference/thermalpowerconfluent.md`) were updated and a
  redirect from the old URL was added in `properdocs.yml`.

## Migration-artifact cleanup and build validation

A repo-wide pass removing the remaining formatting artifacts from the Jekyll
migration, plus build validation so regressions are caught in CI.

### Fixed
- Replaced invalid ` ```xcat ` / ` ```confluent ` fence tags with ` ```bash `
  (`user_reference/switchportattribs.md`).
- Converted all remaining indented code blocks to fenced blocks (17 pages,
  including release-notes posts), and tagged every remaining bare fence with a
  language hint (`bash` for commands/console sessions, `text` for output and
  config file content) - 133 fences across 34 files.
- Fixed shell-prompt rendering in code blocks: with the `bash` lexer, a
  leading `# ` root prompt made the whole command render as a comment.
  Command-only blocks (101) had their prompts stripped so the copy button
  yields runnable commands; transcript blocks mixing commands with output
  (144) were retagged to ` ```console `, whose lexer understands prompts.
  Genuine comment lines inside blocks were preserved.
- Removed a leftover Liquid `{% raw %}...{% endraw %}` wrapper in
  `user_reference/attributeexpressions.md`.
- Replaced the Benefits/Drawbacks tables in `user_reference/osdeploy.md`
  (which held broken `<ul>`/`<li>` HTML in their cells) with side-by-side
  Material grid cards containing plain Markdown lists.
- Rewrote three dead `taurus.labs.lenovo.com` links to the local
  "Preparing for Operating System Deployment" page
  (`advanced_topics/confluentosdeploy.md`).
- Replaced raw `<b>`/`<i>` HTML with Markdown emphasis
  (`user_reference/ubuntudeploy.md`, `troubleshooting/confluentupdatesles.md`).
- Removed stray inline-code backticks inside fenced blocks in
  `advanced_topics/driverupdatemedia.md`.
- Stripped a one-space indent artifact from the DOCA/NVIDIA/BF3 guides; this
  also fixed a heredoc in `nvidiagpudriverinstall.md` whose ` EOF` terminator
  was indented and would not have worked when copy-pasted.
- Trailing whitespace (91 files), tab indentation in code blocks, mis-indented
  nested lists (`developer/api.md`) and 1-space-indented lists, curly quotes,
  needless backslash escapes, and redundant `[url](url "url")` link syntax.

### Changed
- Wrapped inline code in backticks across all hand-written pages (~290 lines
  in 89 files): commands (single and multi-word, e.g. `osdeploy initialize`),
  file paths, IP addresses, attribute names (incl. `key=value` forms),
  known attribute values, package/service/kernel-module names, and example
  node/group names. Conservative pass - prose only, existing code spans,
  links, and fences untouched.
- Fenced the previously unfenced command and Apache-config lines in
  `miscellaneous/makelimitedtls.md` (a missed migration artifact - its raw
  `<VirtualHost>` lines were being swallowed as HTML).
- `developer/api.md`: removed redundant `**bold**` wrappers inside headings.
- `miscellaneous/doca2-10-intstall.md`: replaced 22 single-step H2 headings
  with the bold lead-in + H3 phase-grouping structure used by its sibling
  `doca3-0-install.md`, decluttering the page TOC.
- Converted remaining standalone "Note that ..." paragraphs to `!!! note`
  (and two to `!!! warning`) admonitions across 11 pages.
- `downloads.md`: RHEL repo instructions now use content tabs
  (RHEL 10/9/8); redundant link titles removed; front matter added.

### Added
- Targeted cross-references from discovery/collective/attribute-expression
  sub-pages to their main reference pages (8 pages).
- **Redrawn architecture diagrams**: the four collective topology diagrams in
  `miscellaneous/collective_arch.md` (flat, hierarchy, redundant hierarchy,
  segmented) were re-authored as clean hand-written SVGs
  (`assets/collective_*.svg`), replacing the old Inkscape exports. They keep
  the original arrangements (triangles, pentagon mesh, cascaded node stacks)
  and add labeled "confluent collective" / "managed nodes" containers and
  numbered nodes, styled in the site's Material red palette; text is readable
  in both light and dark themes. (Mermaid was evaluated for these first but
  its auto-layout cannot express this fixed geometry.)
- **Merged install page**: `installconfluent_{rhel,suse,ubuntu}.md` are now a
  single `getting_started/installconfluent.md` using content tabs for the
  distro-specific steps (shared steps - service enablement, Web UI login,
  discovery firewall rules - appear once). Old URLs keep working via
  `mkdocs-redirects` (new dependency in `requirements.txt`); nav and inbound
  links (landing page cards, xCAT install pages) updated.
- **Merged IB/OPA install pages**: the four near-identical xCAT-based fabric
  install walkthroughs (`rh8installib`, `sle152ibinstall`, `rhinstallib`,
  `rhinstallopa` - previously split across `advanced_topics/` and
  `miscellaneous/`) are now one tabbed page,
  `advanced_topics/ibinstallxcat.md`; the two confluent-native pages
  (`ibinstallconfluentrhel8`, `ibinstallconfluentsle152`) are now
  `getting_started/ibinstallconfluent.md`, with its duplicated driver-update
  procedure replaced by a link to the canonical
  `advanced_topics/driverupdatemedia.md`. All six old URLs redirect.
- **PR builds in CI**: the workflow now also triggers on `pull_request`,
  running the strict build without deploying, so link/nav regressions are
  caught before merge.
- **Tags completed**: all hand-written pages now carry `tags:` front matter
  (61 pages added; new tags `xcat`, `troubleshooting`, `drivers`).

### Fixed (follow-up)
- Renamed `miscellaneous/doca2-10-intstall.md` (filename typo) to
  `doca2-10-install.md`, with a redirect from the old URL.
- Removed a stray trailing period from the nodeattribute-expressions
  troubleshooting page title.
- `validation:` block in `properdocs.yml` (omitted files, absolute links,
  unrecognized links, anchors all warn) and `--strict` on the CI
  `gh-deploy`, so any new warning fails the build.

## Site feature modernization

Enabled several Material for MkDocs capabilities.

### Added
- **Tags**: a tag taxonomy with a `tags.md` index page, seeded across key pages
  (deployment, installation, discovery, networking, hardware, diskless,
  security, collective, reference, api).
- **RSS feed** for the release-notes blog (`mkdocs-rss-plugin`).
- **Image zoom** on screenshots via `mkdocs-glightbox`.
- **Mermaid diagram support** via a `pymdownx.superfences` custom fence
  (` ```mermaid ` blocks now render as diagrams).
- **Social cards**: the Material `social` plugin, configured but dormant
  (`enabled: !ENV [SOCIAL_CARDS, false]`). It activates only when the
  `SOCIAL_CARDS` env var is set, so local and CI builds are unaffected until a
  maintainer opts in. Enabling also requires the Cairo system libraries and the
  `pillow` + `cairosvg` packages (already in `requirements.txt`).

### Notes
- The four architecture diagrams currently shipped as SVGs
  (`hierarchy`, `redundant_hierarchy`, `segmented`, `flat`) could be migrated
  to inline Mermaid now that the capability is enabled; left as a follow-up
  since it requires re-authoring the diagram source.
- Enabling social cards needs a small CI change (install Cairo libs + set
  `SOCIAL_CARDS`); not made here because the access token used lacked the
  `workflow` scope to modify `.github/workflows/`.

## Heading and prose cleanup

### Changed
- Normalized heading levels so each page has a single H1 (the page title) with
  sections at H2 and below, fixing pages that used multiple H1 headings for
  sections (which broke the on-page table of contents).
- Converted legacy setext (`====` / `----`) headings to ATX (`#` / `##`).

### Added
- Converted standalone "Note that ..." paragraphs to Material `!!! note`
  admonitions for better scannability.

### Fixed
- Spelling typos (pseudo, governed, existence, consumption, arbitrarily,
  supported, minimum, Subiquity).

## Code-block modernization

Completed the code-block conversion begun in the documentation revamp.

### Changed
- Converted indented code blocks to fenced blocks with a language hint across
  the remaining hand-written pages in `advanced_topics/` (13 pages),
  `miscellaneous/` (9 pages), `developer/api.md`, and `downloads.md` - enabling
  syntax highlighting and the copy-to-clipboard button to match the rest of the
  site. Pages whose indentation is prose/list layout (e.g.
  `miscellaneous/samplepostscripts.md`) and the generated `manuals/` pages were
  intentionally left unchanged.

## Code-verified content updates

A pass cross-checking the documentation against the confluent source code
(`xcat2/confluent`) and correcting stale or missing content. Every change below
was verified against the code.

### Added
- `user_reference/osdeploy.md`: a "Supported operating systems" section
  reflecting the OS families and versions the current code recognizes (Enterprise
  Linux 7-10, SUSE/openSUSE 12/15/16, Ubuntu, Debian 12+, VMware ESXi, RHV-H,
  Red Hat/Fedora CoreOS, Windows 2019/2022/2025, openEuler, Fedora, NVIDIA
  BlueField), based on `confluent_server/confluent/osimage.py` and the
  `confluent_osdeploy` profile directories.
- `developer/api.md`: a top-level collections overview matching the API root in
  `core.py`, a real discovery section (replacing a commented-out stub), and
  documentation for previously undocumented resources (PDU power inlets/outlets,
  graphical/iKVM console, per-node deployment, storage configuration, management
  controller licenses/certificates, firmware subcategories, support servicedata).
- Man pages (in the `confluent` source repo, `confluent_client/doc/man/`) for
  seven client commands that shipped without documentation: `noderename`,
  `nodegrouprename`, `confluent2ansible`, `confluent2xcat`, `confluent2lxca`,
  `dir2img`, and `nodecertutil`.

### Fixed
- `developer/api.md`: corrected the remote HTTP API port from `14005` to `4005`,
  the actual default bind port in `confluent_server` `httpapi.py`, and removed
  author-only TODO and scratch comments left in the published page.

## Documentation revamp

A repo-wide modernization of the MkDocs Material documentation. No source
content was lost; the site builds cleanly (`mkdocs build`, 142 pages).

### Added
- Modern Material landing page (`docs/index.md`) with action buttons and
  card-grid entry points (Get started / Install / Deploy / Reference /
  Discover / API), replacing the previous flat feature list.
- Curated navigation via new `.nav.yml` files for `user_reference`,
  `troubleshooting`, `advanced_topics`, and `miscellaneous`, with titled
  root-level sections. Sections are now ordered by logical flow instead of
  alphabetically; the advanced topics group leads with confluent-native
  material and follows with xCAT/legacy topics.
- Page titles for pages that previously had none
  (`miscellaneous/makelimitedtls.md`, `user_reference/diskless_memory_usage.md`).

### Changed
- Removed dead Jekyll front matter (`layout:`, `permalink:`, `toc:`) from
  89 pages, leaving a clean `title:`. Blog/release-note front matter
  (`date:`, `draft:`) was preserved so the release-notes blog keeps working.
- Converted indented code blocks to fenced blocks with a language hint across
  the `getting_started`, `user_reference`, and `troubleshooting` sections,
  enabling syntax highlighting and the copy-to-clipboard button.

### Fixed
- Corrected 12 broken image links in `miscellaneous/proxmoxguide.md`
  (`../../assets/` -> `../assets/`).
- Fixed a link missing its `.md` extension in
  `getting_started/installconfluent_rhel.md` (link to `switchtonginx`).
- Fixed a release-note link to `nokia-confignotes.md` that resolved one
  directory too high (`../` -> `../../`).
- Fixed spelling typos across the docs (`confluennt`, `documentaion`,
  `accomodate`, `occured`).

### Removed
- Deleted two empty 0-byte stub pages
  (`miscellaneous/setupconfluent.md`, `miscellaneous/setupxcat.md`) and
  removed them from navigation.
