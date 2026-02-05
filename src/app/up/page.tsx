import { isAuthenticated } from '@/lib/auth'
import { LoginForm } from '@/app/up/LoginForm'
import { FileManager } from '@/app/up/FileManager'

export default async function UploadPage() {
  const authenticated = await isAuthenticated()

  return (
    <div className="min-h-screen bg-background">
      {authenticated ? <FileManager /> : (
        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Up</h1>
              <p className="text-muted-foreground">Sign in to access your files</p>
            </div>
            <LoginForm />
          </div>
        </div>
      )}
    </div>
  )
}
