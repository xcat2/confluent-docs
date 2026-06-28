# Changelog

All notable changes to the confluent documentation are recorded here.

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
