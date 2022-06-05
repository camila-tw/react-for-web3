import React from "react";
import { ethers } from "ethers";

export const BlockchainContext = React.createContext({
  currentAccount: null,
  provider: null,
  messageTip: null
});

const BlockchainContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = React.useState(null);
  const [provider, setProvider] = React.useState(null);
  const [messageTip, setMessageTip] = React.useState("");
  const RINKEBY_CHAIN_ID = '0x4';

  React.useEffect(() => {
    /*
     * 使用 window.ethereum 來透過 Metamask 來取得錢包地址
     * 參考資料: https://docs.metamask.io/guide/rpc-api.html
     * 並且將錢包地址設定在上方事先寫好的 currentAccount state
     * 加分項目1: 使用 window.ethereum 偵測換錢包地址事件，並且切換 currentAccount 值
     * 加分項目2: 使用 window.ethereum 偵測目前的鏈是否為 Rinkeby，如果不是，則透過 window.ethereum 跳出換鏈提示
     * 提示: Rinkeby chain ID 為 0x4
     */

    //是否安裝MetaMask
    const isInstallMetamask = () => {
      return (window.ethereum && window.ethereum.isMetaMask);
    }

    //是否在Rinkeby鏈
    const isInRinkeby = () => {
      if (isInstallMetamask()) {
        const chainID = window.ethereum?.networkVersion;
        return (chainID == RINKEBY_CHAIN_ID || chainID == 4)
      }
      return false;
    };

    //處理帳號切換callback
    const accountsChangedHandler = (newAccount) => {
      setCurrentAccount(isInRinkeby() ? newAccount : "");
      setMessageTip(isInRinkeby() ? "" : "Please switch the network to Rinkeby.")
    };

    const requestAccount = async () => {
        window.ethereum?.request({ method: "eth_requestAccounts" })
      .then(accountsChangedHandler)
      .catch((error) => {
        window.alert('Request ETH account failed:' + error.message);
      });
    };

     //處理切鏈callback
    function switchChainChangedHandler(chainID) {
      if (isInRinkeby()) {
        requestAccount();
      }
    }

    const requestSwitchChain = async () => {
      window.ethereum?.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: RINKEBY_CHAIN_ID }], // chainId must be in hexadecimal numbers
      }).then(switchChainChangedHandler)
      .catch((error) => {
        if (error) {
          accountsChangedHandler("unknown");
          setMessageTip("Please change chain to Rinkeby.")
        }
      });
    };

    const addEthereumEventsListener = () => {
      window.ethereum?.on('accountsChanged', accountsChangedHandler);
      window.ethereum?.on("chainChanged", () => {
        window.location.reload();
      });
    };

    if (isInstallMetamask()) {

      //新增監聽事件
      addEthereumEventsListener();
      
      //判斷是否在 Rinkeby
      if (isInRinkeby()) {
        requestAccount();
      }
      else {
        requestSwitchChain();
      }
    }
    else {
      window.alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    }
      
  }, []);

  React.useEffect(() => {
    /*
     * 使用 ethers.js
     * 透過 Web3Provider 將 window.ethereum 做為參數建立一個新的 web3 provider
     * 並將這個新的 web3 provider 設定成 provider 的 state
     */
   
    if (!provider) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider);
    }
  }, []);

  return (
    <BlockchainContext.Provider value={{ currentAccount, provider, messageTip }}>
      {children}
    </BlockchainContext.Provider>
  );
};

export default BlockchainContextProvider;
