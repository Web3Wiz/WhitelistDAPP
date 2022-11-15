import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Web3Modal from 'web3modal';
import { providers, Contract } from 'ethers';
import { useState, useRef, useEffect } from 'react';
import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constants';
import { recoverAddress } from 'ethers/lib/utils';

export default function Home() {

  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  //Lets create web3Modal Reference on page load and on state of change walletConnected
  useEffect(() => {

    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'goerli',
        providerOptions: {},
        disabledInjectedProvider: false
      });
    }
    connectWallet();
  }, [walletConnected]);

  //Connects a MetaMask wallet
  const connectWallet = async () => {
    try {

      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();

    }
    catch (err) {
      console.error(err);
    }
  }

  //Establish provider or signer connection with the wallet
  const getProviderOrSigner = async (needSigner = false) => {
    const currentProvider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(currentProvider);

    const { chainId } = await web3Provider.getNetwork();
    console.log('Chain ID', chainId);
    if (chainId !== 5) {
      window.alert("Please change the network to Goreli");
      throw new Error("Please change the network to Goreli");
    }

    if (needSigner) {
      return web3Provider.getSigner();
    }

    return web3Provider;
  }

  //Check if sender's address is in the whitelist or not
  const checkIfAddressInWhitelist = (async () => {
    try {

      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer,
      );

      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelist(address);


      setJoinedWhitelist(_joinedWhitelist);
    }
    catch (err) {
      console.error(err);
    }
  });

  //Get number of whitelisted addresses so far
  const getNumberOfWhitelisted = async () => {

    try {

      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );

      const _numOfWhitelisted = await whitelistContract.numAddressesWhitelisted();

      setNumberOfWhitelisted(_numOfWhitelisted);
    }
    catch (err) {
      console.error(err);
    }

  }

  //Whitelist the sender's address
  const addAddressToWhitelist = async () => {
    try {

      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
      const tx = await whitelistContract.add();
      setLoading(true);
      await tx.wait();
      setLoading(false);

      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    }
    catch (err) {
      console.error(err);
    }

  }




  //Renders a button on basis of a state
  const renderButton = () => {

    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>Thanks for joining the whitelist!</div>
        );
      }
      else if (loading) {
        return (
          <button className={styles.button}>Adding ... Please wait!</button>
        );
      }
      else {
        return (
          <button className={styles.button} onClick={addAddressToWhitelist}>Join the Whitelist</button>
        );
      }
    }
    else {
      return (
        <button className={styles.button} onClick={connectWallet}>Connect your Wallet!</button>
      );
    }

  }

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist DAPP By Kazim" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Kazim&#169;
      </footer>
    </div>
  )
}
