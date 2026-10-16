---
title: Updating Confluent
tags:
  - installation
---

## Online repositories

With an online Lenovo HPC repository configured, Confluent updates are included in normal package-manager updates.
Updates come from the repository stream configured on your server. See the [download page](../downloads.md) for
repository setup.

!!! warning "Upgrading to Confluent 4"
    Confluent 4 requires opting into the `four` repository stream instead of `latest`. Read the
    [4.0.0 breaking changes](../release_notes/posts/2026-10-14-400release.md#breaking-changes) before switching streams.
    Updating packages alone does not complete all required migration steps.

To restrict a DNF update to packages from the Lenovo HPC repository:

```bash
dnf --disablerepo='*' --enablerepo=lenovo-hpc upgrade
```

## Offline repositories

Download and unpack an updated repository archive appropriate for your OS and Confluent version, then run its
`mklocalrepo.sh` script. Follow the [local repository setup instructions](../downloads.md#adding-local-repository).
Once the repository is configured, use your package manager to update Confluent from it.

## Restart after updating

Restarting Confluent after an update may be necessary for all updated dependencies to take effect:

```bash
systemctl restart confluent
```

For a collective, all members must run the same versions of Confluent and pyghmi. See the
[collective limitations](../advanced_topics/collective.md#limitations).
