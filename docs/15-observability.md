# Observability

## 1. Purpose

This document defines logs, metrics, traces, health checks, dashboards, alerts, and operational response for Estetica Plus.

Observability must help answer:

- is the website available;
- are customers able to book;
- are resources being double-booked or conflicting;
- are emails being delivered;
- is the database healthy;
- did deployment succeed;
- did backups run and restore;
- which release introduced a problem;
- what action is required.

## 2. Principles

- instrument important user and business journeys;
- use structured, queryable data;
- correlate requests across Next.js and NestJS;
- minimize personal data;
- alert on actionable symptoms;
- distinguish expected conflicts from system failures;
- include release/environment identity;
- retain only what is needed;
- verify alerts through controlled tests.

## 3. Signals

```text
Logs
Metrics
Traces
Health checks
Audit events
Deployment events
Real-user Web Vitals
Backup results
```

Audit is related to observability but remains a protected business/security record.

## 4. Correlation

Each incoming request receives or validates an opaque correlation/request ID.

Flow:

```text
Nginx → Next.js → NestJS → database/external provider
```

Rules:

- accept only safe bounded incoming ID format or generate a new one;
- propagate through internal calls;
- include in logs and error reports;
- return a safe correlation ID for support-worthy errors;
- do not encode user/customer data in IDs.

Appointments and jobs may have internal IDs, but public logs do not need full customer context.

## 5. Structured Log Shape

Conceptual fields:

```text
timestamp
level
service
environment
release
event
message
requestId
routeTemplate
method
statusCode
durationMs
actorType
safeEntityType
safeEntityId when approved
errorCode
```

Use route templates rather than raw URLs containing IDs/query data where possible.

## 6. Log Levels

```text
debug — local/temporary diagnosis
info  — normal meaningful lifecycle event
warn  — degraded or suspicious recoverable condition
error — failed operation requiring investigation
fatal — process cannot continue safely
```

Do not log every normal low-value database call at production `info`.

## 7. Forbidden Log Data

Never log:

- passwords;
- raw access/refresh/reset/verification tokens;
- cookies;
- authorization headers;
- secret/API keys;
- full password-reset URLs;
- payment data if introduced;
- full internal customer notes;
- unnecessary treatment/health details;
- full request bodies by default;
- uploaded image bytes.

Mask or omit:

- email;
- phone;
- IP where privacy/retention requires;
- names;
- appointment references.

## 8. Application Events

Safe event names:

```text
auth.login_succeeded
auth.login_failed
auth.refresh_reuse_detected
booking.availability_requested
booking.hold_created
booking.hold_expired
booking.hold_released
booking.hold_converted
booking.created
booking.conflict
booking.cancelled
booking.rescheduled
booking.status_changed
media.upload_completed
media.upload_failed
content.published
notification.sent
notification.failed
admin.authorization_denied
```

Events use stable vocabulary and safe structured fields.

## 9. Expected Conflicts vs Errors

Examples:

- `SLOT_NO_LONGER_AVAILABLE` is an expected business conflict;
- invalid user input is not an infrastructure failure;
- PostgreSQL unavailable is an error;
- exclusion constraint conflict increments booking-conflict metrics but does not create an alarming stack trace for every normal race;
- repeated unusual conflict rate may trigger investigation.

This distinction keeps alerts useful.

## 10. Error Tracking

Capture unhandled and selected handled exceptions from web/API.

Include:

- environment;
- release/commit;
- service;
- route template;
- request ID;
- safe error code;
- stack trace server-side;
- breadcrumbs scrubbed of personal data.

Rules:

- source maps protected as appropriate;
- client and server errors separated;
- duplicate noise grouped;
- expected validation/conflict errors excluded or sampled;
- sensitive payloads scrubbed before sending to any provider.

Provider selection is deferred; the abstraction and privacy rules are not.

## 11. Metrics

### HTTP

- request count;
- duration histogram;
- status codes;
- error rate;
- request size where useful;
- rate-limit rejections.

### Process/container

- CPU;
- memory;
- event-loop delay when instrumented;
- restarts;
- disk usage;
- uptime.

### Database

- connection-pool usage;
- query duration;
- slow-query count;
- errors/timeouts;
- database size;
- backup duration/result;
- migration result.

### Booking

- availability request latency;
- slots returned;
- active holds;
- hold creation/conflict/expiry/release;
- hold-to-appointment conversion rate;
- expired-hold cleanup failures and oldest unreleased expired hold;
- suspected slot-hoarding rate-limit events;
- creation success;
- pending/confirmed;
- conflict count/rate;
- cancellation/reschedule;
- no-show/completed;
- idempotency reuse/conflict;
- exclusion constraint rejection.

Hold metrics contain no raw hold token or customer details.

### Notifications

- queued;
- sent;
- failed;
- retry count;
- oldest pending age;
- provider latency.

### Media

- signed-upload requests;
- completed/failed uploads;
- metadata-save failures;
- broken delivery reports;
- provider usage alerts where available.

## 12. Business Metrics and Privacy

Useful aggregate metrics:

- booking funnel step completion;
- bookings by service/category;
- lead time between booking and appointment;
- cancellation/no-show rate;
- locale distribution;
- device/room utilization.

Rules:

- aggregate where possible;
- do not use metrics as a second customer database;
- do not attach raw notes or contact data;
- define purpose and retention;
- analytics/marketing consent remains separate from operational telemetry.

## 13. Tracing

Distributed tracing may use OpenTelemetry-compatible instrumentation.

Trace important flows:

- public service page data request;
- availability calculation;
- appointment creation transaction;
- reschedule;
- image metadata completion;
- notification processing.

Rules:

- sample deliberately;
- always consider retaining failed/slow traces according to provider capability;
- do not put sensitive request data in span attributes;
- name spans by operation/route template;
- connect trace ID to logs.

## 14. Health Checks

Endpoints:

```text
GET /health/live
GET /health/ready
```

Liveness:

- process responds;
- cheap;
- no external dependency chain.

Readiness:

- essential database connectivity;
- required startup configuration/state;
- strict timeout;
- safe minimal response.

Do not include:

- connection strings;
- host credentials;
- detailed internal topology;
- provider secrets.

## 15. Synthetic Availability Checks

External monitor checks:

- `https://esteticaplus.bg/bg`;
- `https://esteticaplus.bg/en`;
- API readiness;
- representative published service route;
- TLS/canonical redirects.

Optional booking synthetic checks must avoid creating real appointments unless a dedicated isolated mechanism is approved.

## 16. Real User Monitoring

Collect privacy-reviewed:

- LCP;
- INP;
- CLS;
- route/page type;
- device class;
- locale;
- release.

Do not attach:

- customer identity;
- booking form contents;
- appointment ID;
- sensitive URL/query data.

Use field data to validate `docs/11-seo-performance.md`.

## 17. Dashboards

### Operations

- uptime;
- request rate/error/latency;
- container CPU/memory/restarts;
- database health/storage;
- current release.

### Booking

- availability latency;
- success/conflict;
- pending manual requests;
- notification queue/failures;
- status distribution.

### Web Performance

- LCP/INP/CLS by route type;
- mobile vs desktop;
- BG vs EN;
- JS/image regressions.

### Deployment and Backup

- latest deployment;
- health/smoke result;
- latest backup;
- backup age;
- latest restore drill;
- certificate expiry/renewal.

## 18. Service-Level Objectives

Initial SLOs are finalized after baseline measurement.

Candidate indicators:

- public site successful request availability;
- API availability;
- booking creation success excluding valid user/business conflicts;
- availability latency;
- notification processing time;
- backup freshness.

Do not promise arbitrary enterprise numbers before VPS capacity and real traffic are known.

## 19. Alerts

Page/urgent:

- public site/API unavailable;
- readiness continuously failing;
- database unavailable;
- disk critically full;
- backup missing beyond allowed age;
- certificate near expiry after renewal failure;
- severe authentication/security event pattern.

Investigate during working hours:

- elevated error rate;
- slow booking availability;
- repeated notification failures;
- rising conflict anomaly;
- Cloudinary usage/failed uploads;
- Web Vitals regression;
- database storage/connection pressure.

Every alert defines:

```text
condition
window
severity
owner
notification channel
runbook
resolution signal
```

## 20. Alert Quality

- alert on user-visible symptoms and exhausted capacity;
- avoid alerting on one transient request;
- use time windows;
- suppress duplicates;
- connect related deployment events;
- review false positives;
- test routing;
- remove alerts nobody acts on.

## 21. Deployment Observability

Record:

- commit SHA/release;
- actor/workflow;
- start/end;
- migration result;
- container health;
- smoke test;
- rollback if performed.

Correlate error/performance charts with release markers.

GitHub Actions failure must notify an owner; success is not inferred only from command exit before health checks.

## 22. Backup Observability

Track:

- last successful backup timestamp;
- backup size;
- duration;
- checksum/integrity result;
- offsite transfer result;
- retention cleanup;
- latest restore-test result and duration.

Alert when:

- backup fails;
- backup becomes stale;
- size changes unexpectedly;
- offsite copy fails;
- storage approaches limit.

## 23. Notification Queue Observability

- queue depth;
- oldest age;
- attempts;
- provider result;
- permanent failure;
- event/template/locale;
- appointment status recheck for reminders.

Do not expose recipient address in general dashboards.

## 24. Security Monitoring

Monitor:

- repeated login/reset failures;
- refresh-token reuse;
- role changes;
- repeated authorization denials;
- upload-signature abuse;
- abnormal availability/booking rates;
- admin access from unexpected patterns where lawful/useful;
- disabled-account attempts;
- secret/dependency scan failures.

Security events have restricted access and retention.

## 25. Audit vs Logs

Audit:

- durable record of who changed sensitive business state;
- database-backed;
- restricted;
- uses safe before/after summary.

Operational logs:

- diagnosis and performance;
- rotating retention;
- not the sole legal/business history.

Do not use general logs as the only appointment status history.

## 26. Retention

Define per signal:

```text
application logs
security logs
audit records
metrics
traces
error events
analytics
backups
```

Retention balances:

- operational need;
- privacy;
- storage;
- security investigation;
- legal requirements.

Default forever retention is not acceptable.

## 27. Local and CI Behavior

Local:

- readable structured/pretty logs;
- debug only when requested;
- deterministic test output.

CI:

- concise failure context;
- test reports/artifacts;
- no production secrets;
- no full sensitive env dumps.

Production:

- structured logs;
- info baseline;
- debug disabled by default;
- sampling where appropriate;
- rotation and shipping/storage configured.

## 28. Incident Workflow

1. acknowledge alert;
2. confirm user impact;
3. identify release/service;
4. use request/trace correlation;
5. contain;
6. rollback or recover safely;
7. verify with health and business checks;
8. communicate to responsible parties;
9. document timeline/root cause;
10. add regression control.

## 29. Runbooks

Required runbooks:

- website/API down;
- database unavailable;
- disk full;
- failed deployment;
- failed migration;
- failed/stale backup;
- restore;
- certificate renewal failure;
- notification provider outage;
- Cloudinary delivery/upload issue;
- suspected account/token compromise;
- elevated booking conflicts.

Runbooks use commands/placeholders safely and identify escalation contacts.

## 30. Testing Observability

Test:

- request ID propagation;
- log redaction;
- error scrub;
- metric emission;
- health ready/live behavior;
- alert rule with synthetic condition;
- deployment marker;
- backup failure alert;
- notification failure/retry;
- Web Vitals reception without sensitive data.

## 31. Implementation Order

1. structured logger and request ID;
2. health endpoints;
3. error tracking with scrubbing;
4. HTTP/process/database metrics;
5. booking and notification metrics;
6. external uptime checks;
7. dashboards;
8. backup/deployment alerts;
9. real-user Web Vitals;
10. tracing where it provides value;
11. runbooks and alert tests.

## 32. Acceptance Criteria

- a failed booking can be traced by correlation ID without exposing customer data;
- expected slot conflicts are distinguishable from server errors;
- uptime and readiness are externally monitored;
- booking/API latency and error rate are visible;
- notification failures are actionable;
- deployment release is visible in errors/metrics;
- backup freshness and restore test are visible;
- disk/database capacity has alerts;
- logs contain no raw secrets/tokens;
- Web Vitals are measured by route/device/locale safely;
- every critical alert has an owner and runbook.

## 33. Official References

- NestJS health checks: <https://docs.nestjs.com/recipes/terminus>
- OpenTelemetry JavaScript: <https://opentelemetry.io/docs/languages/js/>
- Prometheus alerting practices: <https://prometheus.io/docs/practices/alerting/>
- OWASP Logging: <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>
- Next.js Web Vitals reporting: <https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals>
