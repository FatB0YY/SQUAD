import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
<<<<<<< 0b51373e31c38a57eb141136a728779c974b0f4c
const nextConfig = {}
=======
const nextConfig = {
  images: {
    domains: ['uploadthing.com', 'utfs.io']
  }
}
>>>>>>> Environment setup. Folders setup. Dark & Light Theme setup. Initial modal UI. UploadThing setup. Update prisma.schema. env2

export default withNextIntl(nextConfig)
