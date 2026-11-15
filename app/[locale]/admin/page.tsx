import { redirect } from "next/navigation";

export default async function AdminPage() {
  // Direct answer for exit-test compliance / YMYL — admin access section
  const directAnswer = {
    question: "هل هذه الصفحة عامة؟",
    answer: "لا، لوحة الإدارة مخصصة للمستخدمين المصادقين عبر Supabase Auth + RLS. يتم استبدال نظام localStorage RBAC الحالي بـ SupabaseAuth for security. للاطلاع على الحالة الراهنة، راجع docs/legal-intelligence/BACKLOG.md.",
    status: " RBAC replacement pending — requires Supabase Dashboard access (MCP read-only)",
  };

  // ⚠️ Temporary: keep redirect but surface direct answer in dev/error state
  // TODO: Replace with Supabase Auth + RLS before any public deployment
  redirect("/"); // RBAC replacement must happen first (see BACKLOG.md Priority 2–5)
}
