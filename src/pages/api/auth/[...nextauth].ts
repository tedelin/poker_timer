import NextAuth from 'next-auth'
import FortyTwoProvider from 'next-auth/providers/42-school'

// Function to refresh OAuth access token
async function refreshAccessToken(token) {
  try {
    const response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        clientId: process.env.NEXT_PUBLIC_FORTY_TWO_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_FORTY_TWO_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    })

    const refreshedTokens = await response.json()
    if (!response.ok) throw refreshedTokens

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000, // New expiration time
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}

export default NextAuth({
  providers: [
    FortyTwoProvider({
      clientId: process.env.NEXT_PUBLIC_FORTY_TWO_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_FORTY_TWO_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Store access & refresh tokens when user logs in
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = Date.now() + account.expires_in * 1000 // Convert expires_in to milliseconds
      }

      // Refresh token if expired
      if (Date.now() > token.expiresAt) {
        console.log('Access token expired, refreshing...')
        return await refreshAccessToken(token)
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.error = token.error
      return session
    },
  },
})
