import { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import Layout from "../components/Layout";
import { BlockchainContext } from "../contexts/BlockchainContext";

// 請至 Rinkeby Etherscan 找到合約 ABI
const contractAddress = "0x388256be6bdce27de101d592859a7205e58d0074";
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"mintPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const ERC721Assignment = () => {
  const { currentAccount, provider } = useContext(BlockchainContext);
  const [contract, setContract] = useState();
  useEffect(() => {
    /*
     * 請透過 ethers.js 透過 provider, contractAddress 以及 contractABI 建立 Contract 物件
     * 並將建立好的 Contract 設定在上方事先寫好的 contract state
     * 注意: 為了確保底下呼叫智能合約方法可以順利進行，請先透過 provider
     * 1. 取得 signer，將建立好的 Contract 物件透過 connect 方法連結 signer
     * 2. 取得目前 block (區塊) 中的 gas fee，並在建立 Contract 物件的時候帶入 gasLimit 參數
     * 參考資料: https://docs.ethers.io/v5/getting-started/#getting-started--contracts
     */
    if (!provider) {
      return;
    }

    const signer = provider.getSigner();

    provider.getBlock().then((block) => {  

      const contract_ = new ethers.Contract(
        contractAddress,
        contractABI,
        provider,
        { gasLimit: block.getLimit }
      ); 
      setContract(contract_.connect(signer));
    });
  }, [provider]);

  const [totalSupply, setTotalSupply] = useState();
  useEffect(() => {
    /*
     * 請在此處判斷:
     * 當 contract state 有物件之後，透過 contract state，跟智能合約取得 totalSupply 的值
     * 並且儲存上方的 totalSupply state 中
     * 如果寫成功，則 <div>目前 Mint 數量: {totalSupply}</div> 處就會顯示 totalSupply 的數值
     * 提示: 透過 ethers.js 取得的 counter 數值為 bigNumber，請想辦法轉換成數字或是字串
     */
    if (!contract) {
      return;
    }

    const getTotalSupply = async () => {
      const totalSupply_ = await contract.totalSupply();
      setTotalSupply(totalSupply_?.toNumber());
    };

    getTotalSupply();

  }, [contract]);

  const [mintPrice, setPrice] = useState();
  useEffect(() => {
    /*
     * 請在此處判斷:
     * 當 contract state 有物件之後，透過 contract state，跟智能合約取得 mintPrice 的值
     * 並且儲存上方的 mintPrice state 中
     * 如果寫成功，則 <div>Mint 價格: {totalSupply} ETH</div> 處就會顯示 mint 的價格
     * 提示:
     * 1. 透過 ethers.js 取得的 mintPrice 數值為 bigNumber
     * 2. mintPrice 為 0.01 ether，由於 ether 的數值在智能合約是用 wei 來儲存，會是一個非常大的數字，無法用 js Number 來顯示，
     *    建議透過 ethers.utils.formatEther 來轉換 (會轉換為字串)
     */

    if (!contract) {
      return;
    }

    const getMintPrice = async() => {
      const mintPrice_ = await contract.mintPrice();
      setPrice(ethers.utils.formatEther(mintPrice_))
    };

    getMintPrice();

  }, [contract]);

  const [accountBalance, setAccountBalance] = useState();
  useEffect(() => {
    /*
     * 請在此處判斷:
     * 當 contract state 有物件之後，透過 contract state，跟智能合約取得 balanceOf 的值
     * 並帶入 currentAccount 做為參數
     * 儲存於上方的 accountBalance state 中
     * 如果寫成功，則 <div>我的錢包有的數量: {accountBalance}</div> 處就會顯示 accountBalance 的數值
     * 提示: 透過 ethers.js 取得的 counter 數值為 bigNumber，請想辦法轉換成數字或是字串
     */
    if (!contract || !currentAccount) {
      return;
    }

    const getAccountBalance = async() => {
      const balanceOf_ = await contract.balanceOf(currentAccount.toString());
      setAccountBalance(balanceOf_.toNumber())
    };

    getAccountBalance();

  }, [contract]);

  const onMint = async() => {
    /*
     * 請在此處透過 contract 物件，向智能合約呼叫 mint 方法
     * 並且將目前錢包地址帶入
     * 1. from 參數: 目前錢包地址
     * 2. value 參數: mint 所需價錢，請判斷 mintPrice 有值之後再帶入，由於 mintPrice 格式為字串，
     *    建議透過 ethers.utils.formatEther 轉換為 gwei
     * 如果寫成功，則點擊 Mint 按鈕時，狐狸錢包會跳出交易資訊
     */

    if (!contract || !currentAccount) {
      return;
    }

    console.log("mint price: " + mintPrice);

    const price = (mintPrice) ? ethers.utils.parseEther(mintPrice) : null;

    await contract.mint({
        from: currentAccount.toString(),
        value: price
    });
  };

  useEffect(() => {
    /*
     * 加分項目:
     * 請透過 window.setInterval 自動透過 contract 物件每一秒鐘自動取得 totalSupply 以及 balanceOf 的數值
     * 並且儲存上方的 totalSupply state 以及 accountBalance state 中
     * 如果寫成功，則點擊 Mint 按鈕時成功後過數秒鐘後，totalSupply 以及 accountBalance 數值會產生變化
     * 注意: 由於開發時頁面會重新刷新，會導致 setInterval 無法清除，因此請透過 useEffect 中的 return 清除 setInterval
     * 參考資料: https://developer.mozilla.org/zh-TW/docs/Web/API/setInterval
     */
    let interval;
    if (contract) {
      interval = window.setInterval(async () => {
        const totalSupply_ = await contract.totalSupply();
        setTotalSupply(totalSupply_?.toNumber());

        if (currentAccount) {
          const balanceOf_ = await contract.balanceOf(currentAccount.toString());
          setAccountBalance(balanceOf_.toNumber())
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [contract]);

  return (
    <Layout>
      <h1>基礎作業: Counter</h1>

      <div>
        <div>鏈上資料:</div>
        <div className="my-3">
          <div className="mb-1">目前總 Mint 數量: {totalSupply}</div>
          <div className="mb-1">我的錢包有的數量: {accountBalance}</div>
          <div className="mb-1">Mint 價格: {mintPrice} ETH</div>
          <button onClick={onMint}>Mint</button>
        </div>

        <div>
          <div>持有者列表:</div>
          <ul>
            {/* 
                請在這裡透過 [...new Array(totalSupply)]，
                來透過 map 迭代，
                顯示 OwnerListItem Component，
                並藉由 map 中的 index 參數，
                將 index 帶入 OwnerListItem Component 的 tokenId 參數以及 contract 物件
                由於是 map 列表，請帶入 key
                注意: 由於 totalSupply 可能為 undefined，請善用 JSX 中的 condition (if / else)
                參考資料1: https://stackoverflow.com/questions/47287177/how-to-loop-over-a-number-in-react-inside-jsx
                參考資料2: https://zh-hant.reactjs.org/docs/lists-and-keys.html
             */
              totalSupply && contract ?
              [...new Array(+totalSupply)].map((el, index) => <
                OwnerListItem
                key={index}
                tokenId={index}
                contract={contract} 
              />) : ""
             }
          </ul>
        </div>
      </div>
    </Layout>
  );
};

const OwnerListItem = ({ tokenId, contract }) => {
  const { currentAccount, provider } = useContext(BlockchainContext);

  const [ownerAddress, setOwnerAddress] = useState();
  useEffect(() => {
    /*
     * 請在此處判斷:
     * 透過 contract 參數，跟智能合約取得 ownerOf 的值
     * 並且帶入 tokenId 作為參數
     * 並且儲存上方的 ownerAddress state 中
     * 如果寫成功，則 {ownerAddress} 處就會顯示 ownerAddress 的數值
     */
    const findOwner = async() => {
      const ownerAddress = await contract.ownerOf(tokenId);
      setOwnerAddress(ownerAddress)
    };

    if (contract && tokenId != undefined) {
      findOwner();
    }
  }, [contract, tokenId]);

  return (
    <li>
      Token {tokenId} 擁有者 {ownerAddress}
    </li>
  );
};

export default ERC721Assignment;
