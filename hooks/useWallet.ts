import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export interface WalletState {
  isConnected: boolean
  account: string | null
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  chainId: number | null
  error: string | null
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    account: null,
    provider: null,
    signer: null,
    chainId: null,
    error: null
  })

  useEffect(() => {
    checkConnection()
    
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('disconnect', handleDisconnect)
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
        window.ethereum.removeListener('disconnect', handleDisconnect)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum === 'undefined') {
      setState(prev => ({ ...prev, error: 'MetaMask is not installed' }))
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.listAccounts()
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner()
        const network = await provider.getNetwork()
        
        setState({
          isConnected: true,
          account: accounts[0].address,
          provider,
          signer,
          chainId: Number(network.chainId),
          error: null
        })
      }
    } catch (error) {
      console.error('Error checking connection:', error)
      setState(prev => ({ ...prev, error: 'Failed to check connection' }))
    }
  }

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      setState(prev => ({ ...prev, error: 'MetaMask is not installed' }))
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner()
        const network = await provider.getNetwork()
        
        setState({
          isConnected: true,
          account: accounts[0],
          provider,
          signer,
          chainId: Number(network.chainId),
          error: null
        })
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      setState(prev => ({ ...prev, error: 'Failed to connect wallet' }))
    }
  }

  const disconnect = () => {
    setState({
      isConnected: false,
      account: null,
      provider: null,
      signer: null,
      chainId: null,
      error: null
    })
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect()
    } else {
      setState(prev => ({ ...prev, account: accounts[0] }))
    }
  }

  const handleChainChanged = (chainId: string) => {
    setState(prev => ({ ...prev, chainId: Number(chainId) }))
    // Reload the page to ensure everything is in sync
    window.location.reload()
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const switchNetwork = async (chainId: number) => {
    if (!state.provider) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      })
    } catch (error: any) {
      // If the network doesn't exist, add it
      if (error.code === 4902) {
        await addNetwork(chainId)
      } else {
        console.error('Error switching network:', error)
        setState(prev => ({ ...prev, error: 'Failed to switch network' }))
      }
    }
  }

  const addNetwork = async (chainId: number) => {
    const networkConfig = getNetworkConfig(chainId)
    if (!networkConfig) return

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig]
      })
    } catch (error) {
      console.error('Error adding network:', error)
      setState(prev => ({ ...prev, error: 'Failed to add network' }))
    }
  }

  const getNetworkConfig = (chainId: number) => {
    switch (chainId) {
      case 1: // Ethereum Mainnet
        return {
          chainId: '0x1',
          chainName: 'Ethereum Mainnet',
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://mainnet.infura.io/v3/your-project-id'],
          blockExplorerUrls: ['https://etherscan.io']
        }
      case 137: // Polygon
        return {
          chainId: '0x89',
          chainName: 'Polygon',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
          },
          rpcUrls: ['https://polygon-rpc.com'],
          blockExplorerUrls: ['https://polygonscan.com']
        }
      case 80001: // Mumbai Testnet
        return {
          chainId: '0x13881',
          chainName: 'Mumbai Testnet',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
          },
          rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
          blockExplorerUrls: ['https://mumbai.polygonscan.com']
        }
      default:
        return null
    }
  }

  return {
    ...state,
    connect,
    disconnect,
    switchNetwork
  }
}
