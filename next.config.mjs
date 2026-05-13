import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const isGithubPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isGithubPages && {
    output: "export",
    basePath: "/mitake-eat",
    assetPrefix: "/mitake-eat/",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default withNextIntl(nextConfig);
