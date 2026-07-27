import Footer from '@/components/templates/footer/Footer'
import Girlswrapper from '@/components/templates/girlswrapper/Girlswrapper'
import Menumobile from '@/components/templates/menuMoblie/Menumobile'
import Navbar from '@/components/templates/navbar/Navbar'
import React from 'react'

export default function Girls () {
  return (
    <div>
      <Navbar />
      <Menumobile />
      <Girlswrapper />
      <Footer />
    </div>
  )
}
