import { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import Layout from "../components/Layout";
import { BlockchainContext } from "../contexts/BlockchainContext";

// 請至 Rinkeby Etherscan 找到合約 ABI
const contractAddress = "0xa680F60AD58000F87Cdf9EA94A5c68ac8583c6EB";
const contractABI = [];

const EntryAssignment = () => {
  const { currentAccount, provider, messageTip } = useContext(BlockchainContext);
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
  }, []);

  const [counter, setCounter] = useState();
  useEffect(() => {
    /*
     * 請在此處判斷:
     * 當 contract state 有物件之後，透過 contract state，跟智能合約取得 counter 的值
     * 並且儲存上方的 counter state 中
     * 如果寫成功，則 <div>counter: {counter}</div> 處就會顯示 counter 的數值
     * 提示: 透過 ethers.js 取得的 counter 數值為 bigNumber，請想辦法轉換成數字或是字串
     */
  }, []);

  const onIncrement = () => {
    /*
     * 請在此處透過 contract 物件，向智能合約呼叫 setIncrement 方法
     * 並且將目前錢包地址帶入 from 參數
     * 如果寫成功，則點擊 counter + 1 按鈕時，狐狸錢包會跳出交易資訊
     */
  };

  useEffect(() => {
    /*
     * 加分項目:
     * 請透過 window.setInterval 自動透過 contract 物件每一秒鐘自動取得 counter 的數值
     * 並且儲存上方的 counter state 中
     * 如果寫成功，則點擊 counter + 1 按鈕時成功後過數秒鐘後，counter 數值會產生變化
     * 注意: 由於開發時頁面會重新刷新，會導致 setInterval 無法清除，因此請透過 useEffect 中的 return 清除 setInterval
     * 參考資料: https://developer.mozilla.org/zh-TW/docs/Web/API/setInterval
     */
  }, []);

  return (
    <Layout>
      <h1>基礎作業: Counter</h1>

      <div>
        <div>{messageTip}</div>
        <div>錢包地址：{currentAccount}</div>
        <div>鏈上資料:</div>
        <div className="my-3">
          <div className="mb-1">counter: {counter}</div>
          <button onClick={onIncrement}>counter + 1</button>
        </div>
      </div>
    </Layout>
  );
};

export default EntryAssignment;
