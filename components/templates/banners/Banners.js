import Topbanner from '@/components/modules/banners/topbanner/Topbanner'
import React from 'react'

export default function Banners ({ banners, bannerKey }) {
  const banner = banners.find(item => item.key === bannerKey)
    
  if (!banner) return null

  switch (banner.key) {
    case 'Top-banner':
      return <Topbanner banner={banner} />

    default:
      return null
  }
}
