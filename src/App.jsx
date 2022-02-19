import React, { useEffect, useState } from 'react'
import twitterLogo from './assets/twitter-logo.svg'
import './App.css'

// Constants
const TWITTER_HANDLE = 'krutovoy'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const TEST_GIFS = [
  'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
  'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
  'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
  'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp',
]

const App = () => {

  const [walletAddress, setWalletAddress] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [gifList, setGifList] = useState([])

  const onInputChange = (event) => {
    const { value } = event.target
    setInputValue(value)
  }

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('GIF:', inputValue)
      setGifList([...gifList, inputValue])
      setInputValue('')
    } else {
      console.log('Empty input. Try again.')
    }
  }

  const checkWalletIsConnected = async () => {
    try {
      const { solana } = window

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!')
        }

        const response = await solana.connect({ onlyIfTrusted: true })
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString(),
        )

        setWalletAddress(response.publicKey.toString())
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const connectWallet = async () => {
    const { solana } = window

    if (solana) {
      const response = solana.connect()

      console.log('Connected with Public Key:', response.publicKey.toString())
      setWalletAddress(response.publicKey.toString())
    }
  }

  const renderNotConnectedContainer = () => (
    <button
      className={'cta-button connect-wallet-button'}
      onClick={connectWallet}>Connect Wallet</button>
  )

  const renderConnectedContainer = () => (
    <div className={'connected-container'}>

      <form onSubmit={(event) => {
        event.preventDefault()
        sendGif()
      }}>
        <input type="text" placeholder={'Enter GIF link'}
               value={inputValue}
               onChange={onInputChange}/>
        <button type={'submit'}
                className={'cta-button submit-gif-button'}>Submit
        </button>
      </form>

      <div className="gif-grid">
        {gifList.map(gif => (
          <div className={'gif-item'}>
            <img src={gif} alt={gif}/>
          </div>
        ))}
      </div>
    </div>
  )

  useEffect(() => {
    const onLoad = async () => {
      await checkWalletIsConnected()
    }
    window.addEventListener('load', onLoad)

    return () => window.removeEventListener('load', onLoad)
  }, [])

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIFs')

      setGifList(TEST_GIFS)
    }
  }, [walletAddress])

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">

          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}

          {walletAddress && renderConnectedContainer()}

        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo}/>
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  )
}

export default App
