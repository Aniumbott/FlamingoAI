import { SignIn } from '@clerk/nextjs'
import React from 'react'

const signIn = () => {
  return (
    <div>
        <SignIn routing='path' redirectUrl={'/'} signUpUrl='/signup' path='/signin' />
    </div>
  )
}

export default signIn