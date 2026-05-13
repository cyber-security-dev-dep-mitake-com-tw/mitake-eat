"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const next = locale === "zh-TW" ? "en" : "zh-TW";
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-1.5 font-medium transition-colors disabled:opacity-50"
    >
      {locale === "zh-TW" ? "EN" : "中文"}
    </button>
  );
}
