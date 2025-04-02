# Confluent documentation

[![Build Status](https://github.com/Obihoernchen/confluent-docs/workflows/build/badge.svg)](https://github.com/Obihoernchen/confluent-docs/actions) [![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/Obihoernchen/confluent-docs/blob/mkdocs/LICENSE)

The [confluent documentation](https://obihoernchen.github.io/confluent-docs/) is built using [MkDocs](https://www.mkdocs.org/). All **Markdown** files in the `docs` directory are automatically added to the documentation.  
Navigation can be customized using `.nav.yml` files located in each directory.

Since Markdown is supported by most Git web hosting platforms, you can also view or edit the documentation online without using MkDocs.

## Prerequisites

To generate the documentation you need the Python package [mkdocs-material](https://squidfunk.github.io/mkdocs-material/) along with some additional plugins. To install the required dependencies, run:

```bash
pip3 install -r requirements.txt --user
```

Alternatively, you can install these within a Python virtual environment.

Furthermore, you should have the [confluent repository](https://github.com/xcat2/confluent) cloned to `../confluent`.

## Viewing and editing live documentation

For development purposes, you can use the following command to start a local web server that watches the files in the `docs` directory and updates the documentation on changes:

```bash
mkdocs serve
```

Then, access the live documentation at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

## Building HTML documentation

To build static HTML pages, use either:

```bash
./makeattribdoc   # generate node_attributes.md from ../confluent
./makeman         # generate man pages from ../confluent
mkdocs build      # build HTML pages
```

or

```bash
make all
```

The generated HTML pages will be placed in the `_site` directory. You can copy this directory to a web server or open it directly in a web browser.
