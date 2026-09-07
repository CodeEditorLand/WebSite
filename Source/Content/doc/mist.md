---
title: Mist
section: "Elements"
order: 6
description:
    Mist is a local DNS isolation server that intercepts all DNS queries for the
    editor.land zone, resolving private subdomains to loopback and blocking
    external access by allowlist.
---

Mist runs an authoritative Hickory DNS server for the `editor.land` zone,
binding exclusively on `127.0.0.1` so that every `*.editor.land` subdomain
resolves to `127.0.0.1` instead of reaching the public internet. It acts as a
network policy enforcement point: sidecar processes such as Cocoon and Air can
only resolve domains that appear on an explicit allowlist, and every other
external query receives `NXDOMAIN`. The zone is signed with ECDSA P-256 keys so
that DNSSEC-aware clients can verify the authenticity of every response.

## Why DNS isolation

VS Code extensions run arbitrary code. Without a network boundary a compromised
or buggy extension can resolve any hostname and exfiltrate data through DNS.
Mist closes that vector by becoming the sole resolver that Cocoon and Air are
allowed to use. Those processes are spawned with a DNS override pointing to
`127.0.0.1:5380`, so extension code cannot bypass the server regardless of which
port it attempts to use for its own UDP traffic.

DNS isolation also means that `*.editor.land` names never leave the machine.
gRPC addresses like `cocoon.editor.land` are private implementation details
that resolve only within the running editor process.

## Architecture

Mist is organised into five core modules:

<img src="/Mermaid/a08c62373866bebb.svg" alt="Mermaid diagram" />
### Module Map

| Path                        | Purpose                                                |
| --------------------------- | ------------------------------------------------------ |
| `Source/Server.rs`          | UDP and TCP DNS listener, query dispatch               |
| `Source/Zone.rs`            | `editor.land` zone configuration and record generation |
| `Source/Resolver.rs`        | External DNS forwarding for allowlisted domains        |
| `Source/ForwardSecurity.rs` | DNSSEC signing with ECDSA P-256                        |
| `Source/WebSocket.rs`       | WebSocket transport for `Sky`↔`Cocoon` communication   |
| `Source/lib.rs`             | Library root                                           |

## Hickory DNS

Mist is built on Hickory DNS (formerly Trust-DNS), a pure-Rust async DNS
library. The server exposes both UDP and TCP listeners on port 5380. All query
handling runs on Tokio so no thread is ever blocked waiting for I/O.

| Dependency       | Version | Role                                        |
| ---------------- | ------- | ------------------------------------------- |
| `hickory-server` | 0.24    | DNS server and catalog management           |
| `hickory-proto`  | 0.24    | Wire-protocol encoding and decoding         |
| `hickory-client` | 0.24    | DNS client for the forwarding resolver path |
| `ring`           | 0.17    | ECDSA P-256 key generation and signing      |
| `tokio`          | 1.49    | Async runtime                               |

## Zone configuration

The authoritative zone covers `editor.land` and all subdomains. The SOA
record is generated in memory at startup; no zone file on disk is required.

```
editor.land.  IN SOA  localhost. root.editor.land. (
    2026010100 ; serial
    3600       ; refresh
    900        ; retry
    86400      ; expire
    60         ; minimum TTL
)

*.editor.land.  IN A  127.0.0.1
```

All `*.editor.land` subdomains resolve to `127.0.0.1`:

- Ensures sidecar processes communicate only over localhost
- Prevents any sidecar process from exfiltrating data through DNS
- Provides a first line of defence against compromised extension code

### Resolution Rules

| Query Pattern      | Response                | Behavior                        |
| ------------------ | ----------------------- | ------------------------------- |
| `*.editor.land`    | `A 127.0.0.1`           | Authoritative answer from zone  |
| Allowlisted domain | Forward to upstream DNS | Pass-through to system resolver |
| All other domains  | `NXDOMAIN`              | Refused                         |

## Forward allowlist

External queries are forwarded to the upstream resolver only for domains that
appear in the allowlist. The default set:

| Domain                         | Purpose                         | Status              |
| ------------------------------ | ------------------------------- | ------------------- |
| `marketplace.visualstudio.com` | Extension marketplace downloads | Allowlisted         |
| `update.editor.land`           | Application update server       | Allowlisted         |
| `api.posthog.com`              | Telemetry (when enabled)        | Allowlisted         |
| `www.google-analytics.com`     | Usage analytics (when enabled)  | Allowlisted         |
| All unlisted domains           | Blocked                         | `NXDOMAIN` response |

The allowlist is loaded from configuration at startup and can be updated at
runtime without restarting the server.

> [!IMPORTANT] The allowlist is the complete set of external hosts that all
> extensions can contact. Adding a domain grants network access to every
> extension, not only one. Treat allowlist changes as a security-sensitive
> operation.

## DNSSEC

The zone is signed with ECDSA P-256 (algorithm 13). On first run Mist generates
a key pair and writes it to the application data directory. Subsequent starts
load the cached keys and sign all zone records before the server begins
accepting queries.

| Aspect         | Detail                                                  |
| -------------- | ------------------------------------------------------- |
| Algorithm      | ECDSA P-256 (algorithm 13)                              |
| Key generation | Automatic on first run, persisted to app data directory |
| RRSIG records  | Generated in memory on zone load                        |
| Validation     | N/A (authoritative server)                              |

## WebSocket Transport

Mist includes a `WebSocket.rs` layer that serves `*.editor.land` WebSocket
endpoints for Sky to Cocoon communication. Under this transport, Sky
communicates with Cocoon over a local WebSocket connection routed through Mist's
DNS zone rather than through Tauri IPC, reducing per-call overhead from ~5 ms to
under 1 ms for the high-frequency calls that dominate a session. This transport
is used when gRPC is unavailable or inappropriate for the communication pattern.

<img src="/Mermaid/8f7ee38f7b61f2ef.svg" alt="Mermaid diagram" />
## Integration with Mountain and Air

Mountain calls `Mist::start(5380)` during application initialisation and
receives the bound port as its return value. That port is forwarded to:

- **Cocoon** - spawned with an environment variable that overrides its DNS
  resolver to `127.0.0.1:{DnsPort}`, preventing the Node.js extension host from
  reaching arbitrary external hosts.
- **Air** - configures its `LandDnsResolver` so that all outbound HTTP requests
  from the background daemon pass through the same policy enforcement point.
- **SideCar** - uses the resolver when fetching runtime binaries during build
  setup.

## Startup Sequence

```
1. Mountain spawns Mist binary
   - Port 5380 is bound (UDP + TCP)
   - System DNS configuration may be updated to point to loopback

2. Mist opens UDP and TCP listeners on port 5380
   - Hickory DNS server initialises
   - editor.land zone is loaded from configuration
   - DNSSEC signing keys are loaded or generated

3. DNS resolution begins
   - *.editor.land queries answered authoritatively
   - Allowlisted domains forwarded to system resolver
   - All other domains return NXDOMAIN

4. WebSocket server starts (optional)
   - Bound to configured WebSocket port
   - Accepts connections from Sky and Cocoon
```

## Usage

```rust
// Start on preferred port 5380
let port = Mist::start(5380)?;

println!("DNS server running on 127.0.0.1:{}", port);
```

```rust
// Build a resolver for use in HTTP clients
let resolver = Mist::resolver::land_resolver(Mist::dns_port());
```

## Related Documentation

- [Mist Deep Dive](/Doc/deep-dive-mist)
- [Mountain](/Doc/mountain)
- [Air](/Doc/air)
- [SideCar](/Doc/sidecar)
- [Source Code](https://github.com/CodeEditorLand/Mist)
