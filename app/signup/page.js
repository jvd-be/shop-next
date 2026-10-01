import AuthPage from '@/components/templates/authpage/Authpage'
import { getAuthFromCookies } from '@/components/utils/authServer'
import React from 'react'

export default async function page () {
  const auth = await getAuthFromCookies()

  return (
    <div>
      <AuthPage isLoggedIn={auth.isLoggedIn} />
    </div>
  )
}
