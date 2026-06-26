# Changelog

All notable changes to the confluent documentation are recorded here.

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
