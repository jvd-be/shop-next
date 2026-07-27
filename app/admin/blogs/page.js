import ConnectToDB from '@/app/lib/mongodb'
import Adminblogpagewrapper from '@/components/templates/Admin/adminblogpagewrapper/Adminblogpagewrapper'
import Adminlayout from '@/components/templates/Admin/adminlayout/Adminlayout'
import Blogmodel from '@/model/Blogmodel'
import React from 'react'

export default async function Adminblogpage () {
  let blogs = null
  try {
    await ConnectToDB()

    blogs = await Blogmodel.find({}).lean()
  } catch (error) {
    return false
  }
let initialblogs=JSON.parse(JSON.stringify(blogs))
  
  return (
    <Adminlayout>
      <Adminblogpagewrapper initialblogs={initialblogs} />
    </Adminlayout>
  )
}
