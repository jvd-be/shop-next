import React from 'react'
import Menumobilewrapper from '../menumobilewrapper/Menumobilewrapper'
import { getAuthFromCookies } from '@/components/utils/authServer'

export default async function Menumobile() {
  const auth=await getAuthFromCookies()
  return (
    <>
      <Menumobilewrapper auth={auth}/> 
    </>
  )
}
