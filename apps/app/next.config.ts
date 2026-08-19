import type { NextConfig } from 'next'

/**
 * ONDA 1: shell autenticavel, sem telas de produto.
 * Nenhuma chamada de rede, nenhuma variavel de ambiente, nenhum backend.
 */
const nextConfig: NextConfig = {
  transpilePackages: ['@faro/core'],
}

export default nextConfig
