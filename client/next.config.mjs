import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['uploadthing.com', 'utfs.io']
  }
}

export default withNextIntl(nextConfig)
