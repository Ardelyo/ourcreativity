# Implementation Checklist - Performance Optimization

## 📋 Overview
Complete step-by-step checklist for implementing all performance fixes. Estimated total time: **2-4 hours** for full implementation.

---

## Phase 1: Database Optimization (30 minutes)

### Step 1.1: Apply Missing Indexes
- [ ] Open Supabase dashboard → SQL Editor
- [ ] Copy entire content from: `supabase/migrations/20251227_add_missing_performance_indexes.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Wait for success message (should see "executed successfully")
- [ ] Expected output: 15+ indexes created

**Verification:**
```sql
-- Run this query to verify indexes were created:
SELECT schemaname, tablename, indexname 
FROM pg_stat_user_indexes 
WHERE tablename IN ('works', 'likes', 'comments', 'profiles', 'announcements')
ORDER BY tablename, indexname;

-- Should return ~20 indexes
```

- [ ] Record the count of indexes created
- [ ] Screenshot for documentation

**Time:** 10 minutes  
**Expected Gain:** 3-5x faster queries

---

### Step 1.2: Analyze Tables for Query Planning
- [ ] Run ANALYZE on modified tables:

```sql
ANALYZE works;
ANALYZE profiles;
ANALYZE likes;
ANALYZE comments;
ANALYZE announcements;
ANALYZE follows;
```

- [ ] Wait for completion (should be instant)
- [ ] These updates PostgreSQL's statistics for better query planning

**Time:** 5 minutes  
**Impact:** Ensures query optimizer uses new indexes

---

### Step 1.3: Baseline Performance Measurement
- [ ] Take screenshots of current page load times
  - [ ] Karya page (DevTools → Network → Measure total time)
  - [ ] Profile page (same)
  - [ ] Admin Dashboard (same)
- [ ] Note the number of requests
- [ ] Save baseline for comparison

**Tools:**
- Chrome DevTools: Press F12 → Network tab
- Measure: "DOMContentLoaded" and "Finish" times

- [ ] Create document: `BASELINE_METRICS.txt` with:
  - Karya page: ___ ms, ___ requests
  - Profile page: ___ ms, ___ requests
  - Admin Dashboard: ___ ms, ___ requests

**Time:** 5 minutes

---

### Step 1.4: Test Index Effectiveness
- [ ] Go to Karya page
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Open DevTools → Network tab
- [ ] Note page load time (should be slightly faster now)
- [ ] Try filtering by division (should be faster)
- [ ] Try sorting by newest/oldest (should be fast)

**Expected Improvement:** Page should load noticeably faster

- [ ] Document first impression: Faster? ☐ Yes ☐ No ☐ Minimal

**Time:** 5 minutes

---

## Phase 2: React Query Configuration (10 minutes)

### Step 2.1: Back Up Current Config
- [ ] Copy `lib/react-query.ts` to `lib/react-query.ts.backup`
- [ ] Reason: Safe rollback if needed

```bash
cp lib/react-query.ts lib/react-query.ts.backup
```

- [ ] Verify backup created: ☐ Yes

**Time:** 2 minutes

---

### Step 2.2: Apply Optimized Configuration
Choose one approach:

#### Option A: Copy Optimized File (Easiest)
- [ ] Copy entire content from: `lib/react-query-optimized.ts`
- [ ] Paste into: `lib/react-query.ts`
- [ ] Save file (Ctrl+S)

#### Option B: Manual Edit (if you want to understand changes)
- [ ] Open: `lib/react-query.ts`
- [ ] Find line with: `refetchOnMount: true,`
- [ ] Change to: `refetchOnMount: 'stale',`
- [ ] Find line with: `staleTime: 1000 * 60 * 10,`
- [ ] Change to: `staleTime: 1000 * 60 * 15,`
- [ ] Find line with: `gcTime: 1000 * 60 * 30,`
- [ ] Change to: `gcTime: 1000 * 60 * 60 * 2,`
- [ ] Save file

**Key Changes:**
```typescript
// BEFORE:
staleTime: 1000 * 60 * 10,        // 10 minutes
gcTime: 1000 * 60 * 30,           // 30 minutes
refetchOnMount: true,             // Always refetch

// AFTER:
staleTime: 1000 * 60 * 15,        // 15 minutes (+50%)
gcTime: 1000 * 60 * 60 * 2,       // 2 hours (4x more caching)
refetchOnMount: 'stale',          // Only if stale (KEY FIX)
```

- [ ] Verify changes saved

**Time:** 5 minutes

---

### Step 2.3: Test React Query Changes
- [ ] Clear browser cache: DevTools → Application → Clear storage
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Go to Karya page
- [ ] Wait for data to load
- [ ] Click on a work to view details
- [ ] Click "Back" to return to Karya page
- [ ] **IMPORTANT:** Page should load INSTANTLY from cache
  - [ ] If it was ~8s before, should be <100ms now (INSTANT!)
- [ ] Try this with other pages (Profile, Announcements, etc.)

**Expected Behavior:**
- First visit: Normal loading (5-8s)
- Going to other page: Smooth navigation
- Returning to page: INSTANT (no loading spinner)

- [ ] Verify instant navigation: ☐ Works ☐ Partial ☐ Not working

**Troubleshooting:**
- If still slow: Clear browser storage completely
- If cache not working: Check DevTools → Application → Cookies

**Time:** 5 minutes

---

## Phase 3: Query Refactoring (60 minutes)

### Step 3.1: Choose Optimization Approach

Read the guide: `docs/QUERY_OPTIMIZATION_GUIDE.md`

**Options:**
1. **Option 1 - Split Queries** (Recommended for speed)
   - Effort: 1 hour
   - Performance gain: 5-10x
   - Complexity: Low
   - Status: ☐ Choose this

2. **Option 2 - Materialized View** (Better long-term)
   - Effort: 2 hours
   - Performance gain: 20x
   - Complexity: Medium
   - Status: ☐ Choose this

3. **Option 3 - RPC Function** (Best practice)
   - Effort: 3 hours
   - Performance gain: 20x
   - Complexity: High
   - Status: ☐ Choose this

**Recommendation:** Start with Option 1, then upgrade to Option 2 or 3 later.

- [ ] Decision made: Option ___ selected

**Time:** 5 minutes (decision only)

---

### Step 3.2: Implement Option 1 - Split Queries (IF CHOSEN)

**File to modify:** `pages/Karya.tsx` lines 237-289

#### Step 3.2.1: Backup Original
```bash
cp pages/Karya.tsx pages/Karya.tsx.backup
```
- [ ] Backup created

#### Step 3.2.2: Understand Current Code
- [ ] Read current query in Karya.tsx (lines 237-289)
- [ ] Understand it fetches works with nested relationships
- [ ] Understand the problem: nested data causes N+1 queries

**Time:** 10 minutes

#### Step 3.2.3: Implement Split Query
Follow the detailed guide in: `docs/QUERY_OPTIMIZATION_GUIDE.md` → "Option 1: Split into 2 Queries"

Key steps:
1. Fetch works separately (without nested data)
2. Fetch likes counts separately
3. Fetch comments counts separately
4. Fetch author profiles separately
5. Combine in frontend

- [ ] Query refactored
- [ ] Code compiles (npm run build or check for errors)
- [ ] No TypeScript errors: ☐ Yes ☐ No (fix if needed)

**Time:** 40 minutes

#### Step 3.2.4: Test the Changes
- [ ] Hard refresh page (Ctrl+Shift+R)
- [ ] Karya page loads
- [ ] Check DevTools → Network:
  - [ ] Count requests: Should be 4-5 instead of 60+
  - [ ] Page load time: Should be 1-3s instead of 8-12s
- [ ] Test filter by division:
  - [ ] Should still work
  - [ ] Should be fast
- [ ] Test sorting (newest, oldest, likes, comments):
  - [ ] Should still work
  - [ ] Should be fast
- [ ] Test pagination:
  - [ ] Page 1 loads fast
  - [ ] Page 2 loads fast
  - [ ] Navigate back to page 1 (should use cache, instant)
- [ ] Test modal (click on a work):
  - [ ] Modal opens with likes/comments/author info
  - [ ] Like/unlike button works
  - [ ] Information displays correctly

**Verification Checklist:**
- [ ] Page loads faster (visibly noticeable)
- [ ] Filter works correctly
- [ ] Sorting works correctly
- [ ] Pagination works correctly
- [ ] Modal works correctly
- [ ] No console errors
- [ ] No TypeScript warnings

**Time:** 15 minutes

---

### Step 3.3: Implement for Profile.tsx (IF CHOSEN)

**File to modify:** `pages/Profile.tsx` lines 126-207

#### Step 3.3.1: Backup Original
```bash
cp pages/Profile.tsx pages/Profile.tsx.backup
```
- [ ] Backup created

#### Step 3.3.2: Apply Same Pattern
- [ ] Modify query for user's works (lines 142-172)
  - [ ] Split into: fetch works + fetch counts + fetch profiles
- [ ] Modify query for liked works (lines 175-207)
  - [ ] Split into: fetch likes + fetch work details + fetch counts + fetch profiles

**Reference:** Use the same pattern as Karya.tsx

- [ ] Query refactored
- [ ] No errors

**Time:** 30 minutes

#### Step 3.3.3: Test the Changes
- [ ] Go to any user's profile
- [ ] Profile loads
- [ ] User's works section loads (should be fast)
- [ ] Liked works section loads (should be fast)
- [ ] Click on a work to see details (should open modal with correct info)
- [ ] Like/unlike button works
- [ ] No console errors

- [ ] All tests passed: ☐ Yes ☐ No (debug if needed)

**Time:** 10 minutes

---

## Phase 4: Advanced Optimizations (Optional - 60+ minutes)

### Step 4.1: Implement Materialized View (IF CHOSEN)

**File to create:** `supabase/migrations/20251227_create_works_enhanced_view.sql`

(Reference: `docs/QUERY_OPTIMIZATION_GUIDE.md` → "Option 2")

- [ ] Create migration file
- [ ] Copy SQL code from guide
- [ ] Deploy to Supabase
- [ ] Verify view created in Supabase dashboard
- [ ] Update Karya.tsx to use view instead of table
- [ ] Test all functionality

**Expected:** Page loads in <1s, 1 query instead of 4

**Time:** 60 minutes

---

### Step 4.2: Implement RPC Function (IF CHOSEN)

**File to create:** `supabase/migrations/20251227_create_get_works_rpc.sql`

(Reference: `docs/QUERY_OPTIMIZATION_GUIDE.md` → "Option 3")

- [ ] Create migration file
- [ ] Copy SQL code from guide
- [ ] Deploy to Supabase
- [ ] Verify function in Supabase dashboard
- [ ] Update Karya.tsx to call RPC instead of table select
- [ ] Test all functionality

**Expected:** Page loads in <1s, 1 RPC call instead of 4 queries

**Time:** 90 minutes

---

## Phase 5: Comprehensive Testing (30 minutes)

### Step 5.1: Performance Measurement - After Changes
- [ ] Clear cache completely
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Measure page load times:
  - [ ] Karya page: ___ ms (before: ___ ms)
  - [ ] Profile page: ___ ms (before: ___ ms)
  - [ ] Admin Dashboard: ___ ms (before: ___ ms)
  - [ ] Announcements page: ___ ms (before: ___ ms)
- [ ] Count network requests:
  - [ ] Karya page: ___ requests (before: ___ requests)
  - [ ] Profile page: ___ requests (before: ___ requests)

**Compare with baseline:**
- [ ] Improvement percentage:
  - Karya: ___% faster
  - Profile: ___% faster
  - Admin: ___% faster

**Expected:** 5-10x faster overall

**Time:** 10 minutes

---

### Step 5.2: Functionality Testing
- [ ] User Authentication:
  - [ ] Login works
  - [ ] Logout works
  - [ ] Register works
- [ ] Navigation:
  - [ ] All pages accessible
  - [ ] Navigation is smooth
  - [ ] No console errors
- [ ] Data Operations:
  - [ ] Can create/edit/delete works (Studio)
  - [ ] Can like/unlike works
  - [ ] Can comment on works
  - [ ] Admin can moderate content
  - [ ] Admin can approve users
- [ ] Real-time Features:
  - [ ] Like counts update
  - [ ] Comment counts update
  - [ ] Follow button works (if exists)
- [ ] Sorting/Filtering:
  - [ ] Filter by division works (Karya)
  - [ ] Sort by newest/oldest works
  - [ ] Search works (Admin Content)
  - [ ] Pagination works correctly
- [ ] Caching Behavior:
  - [ ] First visit: Normal load
  - [ ] Navigate away and back: INSTANT load
  - [ ] Data is up-to-date: ☐ Yes

**Time:** 15 minutes

---

### Step 5.3: Browser Compatibility Testing
- [ ] Chrome: ☐ Tested
- [ ] Firefox: ☐ Tested
- [ ] Safari: ☐ Tested (if macOS available)
- [ ] Mobile (responsive): ☐ Tested

**Time:** 5 minutes

---

## Phase 6: Monitoring & Maintenance (Ongoing)

### Step 6.1: Set Up Performance Monitoring

**File to create:** `docs/PERFORMANCE_MONITORING.sql`

```sql
-- Query to run weekly to check performance
SELECT 
  query,
  calls,
  mean_exec_time,
  total_time
FROM pg_stat_statements
WHERE query LIKE '%works%' OR query LIKE '%likes%' OR query LIKE '%comments%'
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check index usage
SELECT 
  tablename,
  indexname,
  idx_scan as scans,
  idx_tup_read as rows_read,
  idx_tup_fetch as rows_fetched
FROM pg_stat_user_indexes
WHERE tablename IN ('works', 'likes', 'comments', 'profiles')
ORDER BY idx_scan DESC;
```

- [ ] Save monitoring SQL queries
- [ ] Schedule weekly review
- [ ] Set alert thresholds (e.g., if mean_exec_time > 100ms)

**Time:** 10 minutes

---

### Step 6.2: Create Performance Dashboard (Optional)

**Tools:**
- Supabase Observability Dashboard (built-in)
- Grafana with Supabase (advanced)

- [ ] Check Supabase dashboard → Observability
- [ ] Enable performance insights
- [ ] Set up alerts for slow queries

**Time:** 10 minutes

---

### Step 6.3: Document All Changes

**Create file:** `OPTIMIZATION_LOG.md`

```markdown
# Performance Optimization Log

## Changes Made

### Database Level
- Added 15+ missing indexes for likes, comments, profiles, announcements
- Created partial indexes for is_approved filtering
- Created composite indexes for common filter+sort patterns

### Application Level
- Updated React Query config: refetchOnMount to 'stale'
- Increased staleTime from 10min to 15min
- Increased gcTime from 30min to 2 hours

### Query Level
- Refactored Karya.tsx to split N+1 query into 4 queries
- Refactored Profile.tsx to split N+1 query into 3 queries
- Optional: Created materialized view/RPC function

## Performance Results

Before:
- Karya page: 8-12s, 61 requests
- Profile page: 6-8s, 40+ requests
- Admin Dashboard: 2-3s, 10+ requests

After:
- Karya page: 1.5-2.5s, 4 requests
- Profile page: 1-1.5s, 3 requests
- Admin Dashboard: 0.8-1.2s, 2 requests

Improvement: 5-10x faster

## Recommendations for Future

1. Implement full-text search for better search performance
2. Add Redis caching for frequently accessed data
3. Consider connection pooling (Supavisor)
4. Monitor query performance monthly
```

- [ ] Document created and saved

**Time:** 15 minutes

---

## Final Verification Checklist

### ✅ All Code Changes Committed
- [ ] All modified files saved
- [ ] All new files created
- [ ] No uncommitted changes
- [ ] Ready to commit: `git status`

### ✅ Performance Targets Met
- [ ] Karya page: < 2.5s load time ✓
- [ ] Profile page: < 1.5s load time ✓
- [ ] Admin pages: < 1.2s load time ✓
- [ ] Navigation: Instant (cached) ✓
- [ ] No manual refresh needed ✓
- [ ] Database queries: < 5 per page ✓

### ✅ Quality Assurance
- [ ] No console errors ✓
- [ ] No TypeScript errors ✓
- [ ] All features working ✓
- [ ] Responsive design intact ✓
- [ ] Mobile experience good ✓

### ✅ Documentation Complete
- [ ] PERFORMANCE_INVESTIGATION.md created ✓
- [ ] QUERY_OPTIMIZATION_GUIDE.md created ✓
- [ ] PERFORMANCE_FIX_SUMMARY.md created ✓
- [ ] PERFORMANCE_VISUAL_GUIDE.md created ✓
- [ ] OPTIMIZATION_LOG.md created ✓
- [ ] All code comments added ✓

---

## Rollback Plan (If Issues Occur)

**If something breaks:**

```bash
# Restore files from backup
cp pages/Karya.tsx.backup pages/Karya.tsx
cp pages/Profile.tsx.backup pages/Profile.tsx
cp lib/react-query.ts.backup lib/react-query.ts

# Revert database changes in Supabase
# (Drop indexes if needed, restore from backup)
DROP INDEX IF EXISTS idx_likes_work_id;
DROP INDEX IF EXISTS idx_likes_user_id;
-- ... etc

# Reload browser
# Clear cache and test
```

- [ ] Backup files are safe (stored in backup directory)
- [ ] Rollback plan documented
- [ ] Team aware of rollback procedure

---

## Success Criteria

✅ **Phase 1 Complete:** Database indexes added, 3-5x faster  
✅ **Phase 2 Complete:** React Query optimized, 30-40% less requests  
✅ **Phase 3 Complete:** N+1 queries fixed, 5-10x faster  
✅ **Phase 4 Complete:** Advanced optimization (optional), 20x faster  
✅ **Phase 5 Complete:** All testing passed, no regressions  
✅ **Phase 6 Complete:** Monitoring in place, team aware  

**Total Expected Improvement: 5-50x faster depending on implementation depth**

---

## Time Summary

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Database | 30 min | ☐ Complete |
| Phase 2: React Query | 10 min | ☐ Complete |
| Phase 3: Queries | 60 min | ☐ Complete |
| Phase 4: Advanced | 60+ min | ☐ Complete (optional) |
| Phase 5: Testing | 30 min | ☐ Complete |
| Phase 6: Monitoring | 20 min | ☐ Complete |
| **TOTAL** | **2-3 hours** | ☐ **DONE** |

---

**Checklist Created:** December 27, 2025  
**Status:** Ready for implementation  
**Last Updated:** 2025-12-27  
**Next Review:** After Phase 1 completion
