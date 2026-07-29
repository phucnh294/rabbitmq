# RabbitMQ Patterns — Roadmap

Tracks which messaging patterns have been implemented in this repo and which are still planned. Update the status column as folders are added.

## Status

| # | Folder | Pattern | Exchange type | Status |
|---|---|---|---|---|
| 1 | `01.hello-rabbitmq/` | Simple queue, single producer → single consumer | (default/direct, no exchange) | ✅ Done |
| 2 | `02.direct-exchange/` | Routing by exact routing key | `direct` | ✅ Done |
| 3 | `03.competing-consumer/` | Work queue, load-balanced across consumers | (default) | ✅ Done |
| 4 | `04.pub-sub/` | Broadcast to all bound queues | `fanout` | ✅ Done |
| 5 | `05.topic-exchange/` | Routing by wildcard pattern (`*`, `#`) on routing key | `topic` | ✅ Done |
| 6 | `06.header-exchange/` | Routing by message header match instead of routing key | `headers` | 🟡 Partial (consumer2.js stub) |
| 7 | `07.rpc/` | Request/reply over RabbitMQ using a correlation ID + reply-to queue | `direct` (default) | ⬜ Planned |
| 8 | `08.publisher-confirms/` | Reliable publishing — confirm broker received the message before moving on | any | ⬜ Planned |
| 9 | `09.manual-ack-retry/` | Manual ack/nack, requeue vs. reject, consumer-side retry | any | ⬜ Planned |
| 10 | `10.dead-letter-exchange/` | Failed/rejected/expired messages routed to a DLX for inspection or reprocessing | `direct`/`fanout` (as DLX) | ⬜ Planned |
| 11 | `11.ttl-delayed-messages/` | Per-message / per-queue TTL, delayed delivery | any | ⬜ Planned |
| 12 | `12.priority-queue/` | Higher-priority messages consumed first | any | ⬜ Planned |
| 13 | `13.prefetch-qos/` | `channel.prefetch()` tuning to control how many unacked messages a consumer holds | any | ⬜ Planned |

## Notes per upcoming folder

- **05.topic-exchange** — like `02.direct-exchange` but routing keys are dot-separated words (e.g. `order.created.us`) and bindings use `*`/`#` wildcards. Good follow-up to pub-sub since it sits between direct and fanout in specificity.
- **06.header-exchange** — routing key is ignored; binding matches on a headers table (`x-match: all` vs `any`). Niche but worth one example for completeness. Gotcha found while building it: `bindQueue`'s args table must be the flat header-match object directly (`{gender: "male", "x-match": "all"}`), not wrapped in `{headers: {...}}` like `publish`'s options — the wrapped form silently matches nothing. `consumer2.js` still needs to bind `female.queue`.
- **07.rpc** — client publishes a request with a `replyTo` queue and `correlationId`, server replies on that queue; demonstrates synchronous-style request/response over async messaging.
- **08.publisher-confirms** — switch channel to confirm mode (`channel.confirmSelect()`), await broker ack per message; contrast with default fire-and-forget `channel.publish()` used so far.
- **09.manual-ack-retry** — turn off `noAck: true` (used in every example so far), demonstrate `ack`/`nack`/`reject`, and a basic retry-with-limit before dead-lettering.
- **10.dead-letter-exchange** — pairs with #9: rejected/expired/queue-full messages get routed via `x-dead-letter-exchange` queue argument to a holding queue for inspection.
- **11.ttl-delayed-messages** — per-message `expiration` and per-queue `x-message-ttl`; combine with DLX from #10 to build a basic delayed-retry pipeline.
- **12.priority-queue** — queue declared with `x-max-priority`, messages published with a `priority` property.
- **13.prefetch-qos** — revisit `03.competing-consumer` with `channel.prefetch(n)` to show fair dispatch vs. round-robin-only behavior.

## Conventions to keep consistent

- Each folder gets its own `config.js` reading shared root `.env` (see existing folders for the pattern).
- README.md gets a new table row + subsection + mermaid diagram for every folder, added as soon as the folder is implemented (see `04.pub-sub` entry for the template to copy).
- Prefer one concern per folder — don't fold multiple patterns (e.g. RPC + confirms) into a single example.
