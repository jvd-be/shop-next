let refreshPromise = null

export default async function Customfetch (url, options = {}) {
  let response = await fetch(url, {
    ...options,
    credentials: 'include'
  })

  if (response.status !== 401) {
    return response
  }

  try {
    if (!refreshPromise) {
      refreshPromise = fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      }).finally(() => {
        refreshPromise = null
      })
    }

    const refreshResponse = await refreshPromise

    if (!refreshResponse.ok) {
      setTimeout(() => {
        window.location.href = '/login'
      }, 4000)
      return response
    }

    response = await fetch(url, {
      ...options,
      credentials: 'include'
    })

    return response
  } catch (error) {
    window.location.href = '/login'
    return response
  }
}
