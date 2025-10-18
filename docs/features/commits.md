# Git-Like Commits Feature

**Status**: Phase 1 (Auto-commits) → Phase 4 (Premium on-demand)  
**Last Updated**: 2025-10-18

## Overview

Zenoter implements a Git-like commit system that automatically saves snapshots of your notes daily, allowing you to "time travel" back to any previous version. Premium users can create unlimited on-demand commits with custom messages.

## Feature Summary

### Free Tier (Auto-Commits)

- **Daily automatic commits** at midnight (local time)
- **30-day retention** of commit history
- **Automatic commit messages**: "Auto-save: {date}"
- **1 on-demand commit per month** (trial premium feature)

### Premium Tier (On-Demand Commits)

- **Unlimited manual commits** anytime
- **1-year retention** (or longer, configurable)
- **Custom commit messages**: "Fixed bug in auth logic", "Refactored database schema"
- **Pre-commit diff preview**: See exactly what changed
- **Restore options**: Merge or replace current notes
- **Priority restore speed**: Faster Cloud Storage access

## Architecture

### Data Model

```typescript
// Firestore: users/{uid}/commits/{commitId}
interface CommitMetadata {
  id: string; // UUID
  timestamp: Timestamp;
  message: string; // "Auto-save: 2025-10-18" or custom
  commitType: 'auto' | 'on-demand';
  sizeBytes: number;
  storagePath: string; // Cloud Storage path
  checksum: string; // SHA256 for integrity
  notes: Array<{
    // Index of included notes
    noteId: string;
    path: string;
    title: string;
  }>;
}

// Cloud Storage: commits/{uid}/{YYYY}/{MM}/{DD}/{timestamp}_{commitId}.json.gz
interface CommitBlob {
  version: string; // Schema version (for migrations)
  timestamp: number;
  notes: Note[]; // Full note snapshots
  metadata: {
    deviceId: string;
    appVersion: string;
    platform: string;
  };
}
```

### Storage Strategy

**Why separate metadata and blobs?**

1. **Fast queries**: Firestore for commit history timeline (sorted by timestamp)
2. **Cost efficiency**: Cloud Storage cheaper for large blobs ($0.026/GB vs $0.18/GB)
3. **Scalability**: Cloud Storage handles large files better
4. **Compression**: Gzip text notes (50-90% reduction)

**Path structure**:

```
commits/
  {userId}/
    2025/
      10/
        18/
          1729267200_abc123-def456.json.gz
          1729353600_xyz789-uvw012.json.gz
```

### Entitlement System

**Server-side enforcement** (critical for security):

```typescript
// Cloud Function: callable from client
export const createCommit = functions.https.onCall(async (data, context) => {
  // 1. Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const uid = context.auth.uid;
  const { notes, message, commitType } = data;

  // 2. Check entitlement for on-demand commits
  if (commitType === 'on-demand') {
    const entitlement = await checkPremiumEntitlement(uid);
    if (!entitlement.hasPremium) {
      // Check if user has free on-demand commit left this month
      const freeCommitsUsed = await countFreeOnDemandCommits(uid);
      if (freeCommitsUsed >= 1) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Upgrade to Premium for unlimited on-demand commits'
        );
      }
    }
  }

  // 3. Create commit blob and metadata
  const commitId = generateUUID();
  const blob = { version: '1.0', timestamp: Date.now(), notes };
  const gzipped = await gzip(JSON.stringify(blob));

  // 4. Upload to Cloud Storage
  const storagePath = `commits/${uid}/${getDatePath()}/${Date.now()}_${commitId}.json.gz`;
  await bucket.file(storagePath).save(gzipped);

  // 5. Create Firestore metadata
  await db
    .collection(`users/${uid}/commits`)
    .doc(commitId)
    .set({
      id: commitId,
      timestamp: admin.firestore.Timestamp.now(),
      message: message || `Auto-save: ${new Date().toLocaleDateString()}`,
      commitType,
      sizeBytes: gzipped.length,
      storagePath,
      checksum: sha256(gzipped),
      notes: notes.map((n) => ({ noteId: n.id, path: n.path, title: n.title })),
    });

  return { commitId, storagePath };
});
```

### Entitlement Check

**Option 1: Firebase Custom Claims** (recommended for simple setup):

```typescript
// Set custom claim when user subscribes
await admin.auth().setCustomUserClaims(uid, { premium: true });

// Check in Cloud Function
if (context.auth.token.premium) {
  // Allow unlimited on-demand commits
}
```

**Option 2: Firestore Subscription Doc** (recommended for complex tiers):

```typescript
// Collection: subscriptions/{uid}
interface Subscription {
  userId: string;
  tier: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  expiresAt: Timestamp;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}

// Check in Cloud Function
const sub = await db.collection('subscriptions').doc(uid).get();
if (sub.exists && sub.data().tier === 'premium' && sub.data().status === 'active') {
  // Allow unlimited
}
```

### Billing Integration (Stripe)

```typescript
// Stripe webhook handler
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await activateSubscription(session.client_reference_id, session.subscription);
      break;
    case 'customer.subscription.deleted':
      await deactivateSubscription(event.data.object.metadata.userId);
      break;
  }

  res.json({ received: true });
});
```

## Cost Analysis

### Storage Costs (per 1,000 users)

**Assumptions**:

- Average note size: 5 KB (plain text)
- Gzip compression: 70% reduction → 1.5 KB per commit
- Free users: 1 auto-daily commit × 30 days = 45 KB/user
- Premium users (10% adoption): 10 on-demand/month = 15 KB/user

**Monthly costs**:

- Free tier storage: 1,000 × 45 KB = 45 MB
- Premium storage: 100 × (45 KB + 15 KB) = 6 MB
- **Total storage**: 51 MB/month
- **Cloud Storage cost**: 51 MB × $0.000026/MB = **$0.0013/month** (negligible)

### Bandwidth Costs

**Assumptions**:

- Each user restores 2 commits/month (average)
- Each restore downloads 1.5 KB

**Monthly costs**:

- Free tier: 1,000 × 2 × 1.5 KB = 3 MB
- Premium: 100 × 5 × 1.5 KB = 0.75 MB
- **Total bandwidth**: 3.75 MB/month
- **Cloud Storage egress**: 3.75 MB × $0.00012/MB = **$0.00045/month** (negligible)

### Firestore Costs

**Reads** (listing commits):

- Each user views history 5 times/month
- Each view reads 30 commit metadata docs (1 KB each)
- Total: 1,100 users × 5 × 30 = 165,000 reads/month
- **Cost**: 165k reads × $0.06/100k = **$0.10/month**

**Writes** (creating commits):

- Free: 1,000 × 1/day × 30 = 30,000 writes
- Premium: 100 × 10/month = 1,000 writes
- Total: 31,000 writes/month
- **Cost**: 31k writes × $0.18/100k = **$0.06/month**

### Total Cost (1,000 users, 10% premium)

- Storage: $0.0013
- Bandwidth: $0.0005
- Firestore reads: $0.10
- Firestore writes: $0.06
- **Total: ~$0.16/month** or **$0.00016 per user**

**Revenue** (10% premium at $5/month): $500/month  
**Profit margin**: 99.97% (infrastructure costs negligible)

## User Experience

### UI Components

**1. Commit History Panel**

```tsx
<CommitHistory>
  <TimelineView>
    {commits.map((commit) => (
      <CommitItem key={commit.id}>
        <CommitIcon type={commit.commitType} />
        <CommitDetails>
          <CommitMessage>{commit.message}</CommitMessage>
          <CommitMeta>
            {formatDate(commit.timestamp)} • {formatSize(commit.sizeBytes)}
          </CommitMeta>
        </CommitDetails>
        <CommitActions>
          <Button onClick={() => previewDiff(commit.id)}>Preview</Button>
          <Button onClick={() => restore(commit.id)}>Restore</Button>
        </CommitActions>
      </CommitItem>
    ))}
  </TimelineView>
</CommitHistory>
```

**2. Commit Now Button (Premium)**

```tsx
<EditorToolbar>
  <CommitButton
    disabled={!hasUnsavedChanges}
    onClick={() => {
      if (!isPremium) {
        showPremiumModal();
      } else {
        showCommitDialog();
      }
    }}
  >
    <GitCommitIcon />
    Commit Now
  </CommitButton>
</EditorToolbar>
```

**3. Premium Upsell Modal**

```tsx
<Modal>
  <ModalHeader>Unlock On-Demand Commits</ModalHeader>
  <ModalBody>
    <FeatureList>
      <Feature>✓ Unlimited manual commits</Feature>
      <Feature>✓ Custom commit messages</Feature>
      <Feature>✓ 1-year retention (vs 30 days)</Feature>
      <Feature>✓ Pre-commit diff preview</Feature>
      <Feature>✓ Priority restore speed</Feature>
    </FeatureList>
    <PricingCard>
      <Price>$5/month</Price>
      <Trial>Try free for 14 days</Trial>
    </PricingCard>
  </ModalBody>
  <ModalActions>
    <Button variant="primary" onClick={startTrial}>
      Start Free Trial
    </Button>
    <Button variant="ghost" onClick={close}>
      Maybe Later
    </Button>
  </ModalActions>
</Modal>
```

**4. Restore Confirmation Dialog**

```tsx
<ConfirmDialog>
  <DialogTitle>Restore commit?</DialogTitle>
  <DialogBody>
    <DiffPreview commit={selectedCommit} current={currentNotes} />
    <Warning>
      Current notes will be replaced. A pre-restore commit will be created automatically.
    </Warning>
  </DialogBody>
  <DialogActions>
    <Button onClick={() => restore('replace')}>Replace</Button>
    <Button onClick={() => restore('merge')}>Merge</Button>
    <Button variant="ghost" onClick={cancel}>
      Cancel
    </Button>
  </DialogActions>
</ConfirmDialog>
```

### Workflows

**Auto-commit (Free users)**:

1. Daily at midnight (local time)
2. Background service creates commit silently
3. Notification: "Daily backup created"
4. User can browse/restore anytime

**On-demand commit (Premium)**:

1. User clicks "Commit Now" button
2. If not premium → show upsell modal
3. If premium → show commit dialog
4. User enters custom message (optional)
5. Preview diff (optional)
6. Confirm → create commit
7. Toast: "Commit created successfully"

**Restore workflow**:

1. User opens commit history panel
2. Select commit → "Preview" button
3. Diff view shows changes
4. "Restore" button → confirmation dialog
5. Choose "Replace" or "Merge"
6. Auto-create pre-restore commit (safety net)
7. Apply restore
8. Toast: "Restored to {commit.message}"

## Implementation Plan

### Phase 1: Auto-Commits (Week 3, Nov 1-7)

**Goal**: Basic commit system for free users

1. **Day 1-2: Schema & Storage**
   - Define Firestore schema
   - Create Cloud Storage bucket
   - Implement gzip compression
   - Write metadata CRUD

2. **Day 3-4: Auto-Commit Service**
   - Background scheduler (daily at midnight)
   - Create commit blob
   - Upload to Cloud Storage
   - Create Firestore metadata
   - Handle errors & retries

3. **Day 5: History UI**
   - Timeline view component
   - List commits with metadata
   - Date/time formatting
   - Size display

4. **Day 6: Restore Functionality**
   - Download commit blob
   - Parse & decompress
   - Replace current notes
   - Pre-restore safety commit

5. **Day 7: Tests & Polish**
   - Unit tests (storage, compression)
   - Integration tests (end-to-end)
   - E2E tests (UI flows)
   - Error handling & edge cases

### Phase 4: On-Demand Commits (Q2 2026)

**Goal**: Premium feature with billing integration

1. **Week 1: Entitlement System**
   - Cloud Function: createCommit
   - Entitlement checks (custom claims or Firestore)
   - Rate limiting (free tier)
   - Security rules

2. **Week 2: Billing Integration**
   - Stripe account setup
   - Checkout flow
   - Webhook handler
   - Subscription management

3. **Week 3: Premium UI**
   - "Commit Now" button
   - Commit dialog (custom message)
   - Pre-commit diff preview
   - Upsell modal

4. **Week 4: Testing & Rollout**
   - End-to-end tests
   - Beta testing (50 users)
   - Analytics (conversion tracking)
   - Documentation

## Success Metrics

### Phase 1 (Auto-Commits)

- [ ] 90%+ users have ≥1 commit after 7 days
- [ ] <1% commit creation errors
- [ ] <2s average restore time
- [ ] 50+ restores/month (shows feature usage)

### Phase 4 (Premium)

- [ ] 10%+ conversion rate (free → premium trial)
- [ ] 5%+ paid conversion (trial → paid)
- [ ] 50+ premium subscribers after 3 months
- [ ] $500+ MRR (50 subs × $10/month)
- [ ] <0.5% churn rate

## Security Considerations

1. **Server-side validation**: Never trust client for entitlement checks
2. **Firestore rules**: Restrict commit reads/writes to owner only
3. **Signed URLs**: Short-lived (15 min) for Cloud Storage downloads
4. **Rate limiting**: Prevent abuse (1 on-demand/minute for premium)
5. **Checksum validation**: SHA256 to detect corruption
6. **Optional E2E encryption**: Encrypt blobs client-side before upload

## FAQ

**Q: Why not use Git directly?**  
A: Git is too complex for average users and heavy for client-side operations. Our approach is simpler and optimized for cloud storage.

**Q: Why gzip instead of delta/diff?**  
A: Gzip is simpler and sufficient for text notes (70% compression). Delta storage adds complexity for marginal gains at our scale.

**Q: What happens to commits when a user cancels premium?**  
A: Commits are retained but on-demand creation is disabled. User can still restore existing commits.

**Q: Can users export commit history?**  
A: Yes, via "Download all commits" button in settings (exports as .zip with JSON files).

**Q: What about GDPR / data deletion?**  
A: Account deletion triggers Cloud Function to delete all commits (Firestore metadata + Cloud Storage blobs).

---

**Implementation Status**: Documented, ready for Week 3 (Phase 1) and Q2 2026 (Phase 4).
