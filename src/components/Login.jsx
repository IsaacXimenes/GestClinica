import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Usuários mockados para demonstração
  const mockUsers = [
    { email: 'admin@clinica.com', password: 'admin123', role: 'Administrador', nome: 'Dr. João Silva' },
    { email: 'usuario@clinica.com', password: 'user123', role: 'Usuario Padrão', nome: 'Maria Santos' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Verificar credenciais
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (user) {
      onLogin(user)
    } else {
      setError('Email ou senha incorretos. Tente novamente.')
    }
    
    setIsLoading(false)
  }

  const handleDemoLogin = (userType) => {
    const user = mockUsers.find(u => u.role === userType)
    setEmail(user.email)
    setPassword(user.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">CG</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clínica Gest</h1>
          <p className="text-gray-600">Sistema de Gestão para Clínica de Estética</p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Entrar</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Botão de Login */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Divisor */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Para demonstração</span>
              </div>
            </div>

            {/* Botões de Demo */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleDemoLogin('Administrador')}
                type="button"
              >
                Demo - Administrador
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleDemoLogin('Usuario Padrão')}
                type="button"
              >
                Demo - Usuário Padrão
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Demo */}
        <div className="mt-6 p-4 bg-white/50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-gray-900 mb-2">Credenciais para Teste:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>Administrador:</strong> admin@clinica.com / admin123</div>
            <div><strong>Usuário Padrão:</strong> usuario@clinica.com / user123</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Clínica Gest. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
