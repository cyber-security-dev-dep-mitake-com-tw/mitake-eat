import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "./globals.css";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

const messages = {
  "zh-TW": () => import("../../../messages/zh-TW.json"),
  en: () => import("../../../messages/en.json"),
} as const;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;
  if (!routing.locales.includes(locale as "zh-TW" | "en")) notFound();
  unstable_setRequestLocale(locale);

  const msg = (await messages[locale as keyof typeof messages]()).default;

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <NextIntlClientProvider locale={locale} messages={msg}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
