import ConnectToDB from '@/app/lib/mongodb'
import Admincommentswrapper from '@/components/templates/Admin/admincommentswrapper/Admincommentswrapper'
import Adminlayout from '@/components/templates/Admin/adminlayout/Adminlayout'
import Reviewmodel from '@/model/Reviewmodel'
import React from 'react'

export default async function page () {
  let commentsData = null
  try {
    await ConnectToDB()
    commentsData = await Reviewmodel.find()
      .populate('user product', 'title name phone')
      .lean()
  } catch {}
  const comments = JSON.parse(JSON.stringify(commentsData))
  return (
    <Adminlayout>
      <Admincommentswrapper commentsList={comments} />
    </Adminlayout>
  )
}
