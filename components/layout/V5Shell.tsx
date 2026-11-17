import type { ReactNode } from "react";
import { getMessages } from "@/lib/i18n/getMessages";
import Footer from "@/components/layout/Footer";
import HomeHeader from "@/components/home-moroccan/HomeHeader";
import HomeInteractions from "@/components/HomeInteractions";
import AnswerAnimator from "@/components/AnswerAnimator";

/**
 * Shared v5 page frame: warm Moroccan palette, the homepage header, the
 * scroll/progress interactions and the site footer. Inner pages keep their
 * own <main> content so every feature stays untouched.
 */
export default async function V5Shell({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const messages = await getMessages(locale);
  return (
    <div id="v-home" className="mh-page flex min-h-screen flex-col">
      <div className="bar" id="bar" />
      <HomeInteractions locale={locale} />
      <AnswerAnimator />
      <HomeHeader locale={locale} />
      {children}
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
