---
layout: page
title: Confluent Database backup and restore
permalink: /documentation/backup.html
---

Confluent maintains its database in /etc/confluent/cfg

For a plain text backup and restore capability, the `confluentdbutil` utility is provided.

# Backing up the database

The recommended approach is to do at least one interactive backup:

    # confluentdbutil -p BackupPassw0rd dump /tmp/backup/

This will encrypt the encryption keys used to protect passwords that may need
to be retained using a password that will be required to restore. The backup
consists of some .json files:

    # ls /tmp/backup/
    collective.json  keys.json  main.json

As an interactive backup is incompatible with a regular backup scheme, once
you have one backup as above with a password protected keys.json file, the -s
option may be used to skip keys.json for an unattended backup:

    # confluentdbutil -s dump /tmp/unattended/
    # ls /tmp/unattended/
    collective.json  main.json

This backup is a full backup, but lacks a keys.json file to decrypt the content, and thus
cannot be restored by itself.  

# Restoring from backup

If following the example above, and desiring to restore from the '/tmp/unattended/' backup, first
copy in a keys.json file from the interactive backup:

    # cp /tmp/backup/keys.json /tmp/unattended

This will turn the backup in /tmp/unattended into a password protected backup that can be restored.

With this, /tmp/unattended may be restored:

    # confluentdbutil -p BackupPassw0rd restore /tmp/unattended

If running the restore as root, then you may need to change ownership back to confluent user:

    # chown confluent /etc/confluent/cfg/*


# Redacting configuration

Additionally, `confluentdbutil dump -r` will generate a dump that redacts the
potentially sensitive material, if wanting to share for diagnostic purposes.

    # confluentdbutil -r dump /tmp/redacted

See confluentdbutil [man page]({{ site.baseurl }}/documentation/man/confluentdbutil.html) for more detail.



