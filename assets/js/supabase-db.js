// AADALA.MA — Supabase read client (public-read legal reference data)
// ---------------------------------------------------------------------------
// Uses ONLY the publishable (anon-level) key. Row Level Security on the
// Supabase project decides what is readable:
//   legal_documents.status in ('published','reference')  -> public metadata
//   legal_document_versions of those documents           -> public file refs
//   legal_articles of 'published' documents only         -> public text
// No service-role key is ever shipped to the browser.
//
// The page renders instantly from the bundled local index
// (assets/js/sources-db.js) and then upgrades itself with live data.
(function () {
  const SUPABASE_URL = 'https://pvoenvxinkipgpnddumt.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_LzPJfmm_c3MdycX4DTvajQ_eCWdiFB1';
  const REST = SUPABASE_URL + '/rest/v1';
  const HEADERS = {
    apikey: SUPABASE_KEY,
    Authorization: 'Bearer ' + SUPABASE_KEY,
  };

  const FIELDS = [
    'slug', 'official_title', 'doc_type', 'number', 'issue_date',
    'publication_source', 'status', 'category', 'page_count', 'summary',
    'usage_rights', 'source_url', 'last_verified_at',
    'legal_document_versions(version_label,is_original,source_file,notes)',
  ].join(',');

  // Older schema (before the 2026-11-13 migration) lacks the extra metadata
  // columns. Retry with this subset so the page still reads live rows instead
  // of falling back to local data for a missing-column error.
  const FIELDS_BASE = [
    'slug', 'official_title', 'doc_type', 'number', 'issue_date',
    'publication_source', 'status', 'source_url', 'last_verified_at',
    'legal_document_versions(version_label,is_original,source_file,notes)',
  ].join(',');

  const TYPE_LABEL = {
    constitution: 'دستور',
    loi: 'قانون',
    dahir: 'ظهير',
    code: 'مدونة/قانون',
    'dahir/loi': 'ظهير/قانون',
    bulletin_officiel: 'الجريدة الرسمية',
    decret: 'مرسوم',
    arrete: 'قرار',
  };

  const state = {
    status: 'idle',       // idle | loading | live | fallback
    error: null,
    docs: [],
    syncedAt: null,
    source: 'local',
    degraded: false,
  };

  function statusLabel(doc) {
    if (doc.status === 'published') {
      return doc.last_verified_at ? 'منشور — مدقق' : 'منشور';
    }
    // 'reference' = metadata only, text not verified
    return 'مرجع عام — تحقق مطلوب';
  }

  function mapDoc(row) {
    const versions = Array.isArray(row.legal_document_versions) ? row.legal_document_versions : [];
    const primary = versions.find(v => v.is_original) || versions[0] || {};
    return {
      id: row.slug,
      title: row.official_title,
      type: TYPE_LABEL[row.doc_type] || row.doc_type || '',
      doc_type: row.doc_type,
      number: row.number || null,
      date: row.issue_date || null,
      category: row.category || 'autre',
      source: row.publication_source || 'Supabase — مصدر قيد التحقق',
      file: primary.source_file || '',
      pages: row.page_count == null ? null : row.page_count,
      status: statusLabel(row),
      db_status: row.status,
      note: row.summary || '',
      usage_rights: row.usage_rights || '',
      source_url: row.source_url || '',
      last_verified: row.last_verified_at || null,
      versions: versions.map(v => ({
        label: v.version_label,
        file: v.source_file,
        is_original: !!v.is_original,
        notes: v.notes || '',
      })),
      origin: 'supabase',
    };
  }

  async function rest(path) {
    const res = await fetch(REST + path, {
      headers: HEADERS,
      // Public reference data changes rarely; a short cache keeps navigation snappy.
      cache: 'no-cache',
    });
    if (!res.ok) {
      let detail = '';
      try { detail = (await res.text()).slice(0, 200); } catch (_) {}
      throw new Error('Supabase HTTP ' + res.status + (detail ? ' — ' + detail : ''));
    }
    return res.json();
  }

  function mergeIntoLocal(mapped) {
    const local = window.SourcesDB && Array.isArray(window.SourcesDB.documents)
      ? window.SourcesDB.documents
      : [];
    const byId = new Map(local.map(d => [d.id, d]));
    mapped.forEach(d => byId.set(d.id, d));
    const merged = Array.from(byId.values());
    // Supabase-backed documents first, then local-only duplicates.
    merged.sort((a, b) => {
      if (a.origin === 'supabase' && b.origin !== 'supabase') return -1;
      if (b.origin === 'supabase' && a.origin !== 'supabase') return 1;
      return String(a.title || '').localeCompare(String(b.title || ''), 'ar');
    });
    if (window.SourcesDB) {
      window.SourcesDB.documents = merged;
      window.SourcesDB.meta = Object.assign({}, window.SourcesDB.meta, {
        source: 'supabase',
        syncedAt: new Date().toISOString(),
        remoteCount: mapped.length,
      });
    }
    return merged;
  }

  async function load() {
    if (state.status === 'loading') return state;
    state.status = 'loading';
    dispatch('loading');
    try {
      let rows;
      try {
        rows = await rest(
          '/legal_documents?select=' + encodeURIComponent(FIELDS) +
          '&status=in.(published,reference)&order=official_title.asc'
        );
        state.degraded = false;
      } catch (err) {
        // Column missing because the migration has not been applied yet:
        // fall back to the columns that exist in the original schema.
        if (String(err && err.message).indexOf('42703') === -1 &&
            String(err && err.message).indexOf('does not exist') === -1) throw err;
        rows = await rest(
          '/legal_documents?select=' + encodeURIComponent(FIELDS_BASE) +
          '&status=in.(published,reference)&order=official_title.asc'
        );
        state.degraded = true;
      }
      const mapped = (Array.isArray(rows) ? rows : []).map(mapDoc);
      state.docs = mapped;
      state.status = 'live';
      state.error = null;
      state.syncedAt = new Date().toISOString();
      state.source = 'supabase';
      mergeIntoLocal(mapped);
    } catch (err) {
      state.status = 'fallback';
      state.error = err && err.message ? err.message : String(err);
      state.source = 'local';
    }
    dispatch('updated');
    return state;
  }

  function dispatch(kind) {
    try {
      window.dispatchEvent(new CustomEvent('aadala:sources-' + kind, { detail: { ...state } }));
    } catch (_) { /* no-op */ }
  }

  window.SupabaseDB = {
    url: SUPABASE_URL,
    state,
    load,
    get docs() { return state.docs; },
  };
})();
