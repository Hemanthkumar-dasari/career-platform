import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential)
      toast.success('Successfully logged in with Google!')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Google authentication failed. Please try again.')
    }
  }

  const handleError = () => {
    toast.error('Google Login Error')
  }

  return (
    <div className="flex justify-center w-full mt-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="filled_blue"
        shape="pill"
        width="300"
        text="continue_with"
      />
    </div>
  )
}
