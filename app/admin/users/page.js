import ConnectToDB from '@/app/lib/mongodb'
import Adminlayout from '@/components/templates/Admin/adminlayout/Adminlayout'
import Adminuserswrapper from '@/components/templates/Admin/adminuserswrapper/Adminuserswrapper'
import { getAuthFromCookies } from '@/components/utils/authServer'
import Usermodel from '@/model/Usermodel'
import React from 'react'

export default async function page () {
  const auth=await getAuthFromCookies()
  
  
  let users
  try {
    await ConnectToDB()
    users = await Usermodel.find({}).lean()
  } catch (error) {}
  return (
    <Adminlayout>
      <Adminuserswrapper adminRole={auth?.user.role} initialUsers={JSON.parse(JSON.stringify(users))} />
    </Adminlayout>
  )
}
