import {connect, keyStores, KeyPair} from 'near-api-js';
import {TransactionManager} from 'near-transaction-manager';
import {createSpin} from '@spinfi/core';
import {responsifyAsync, responsifySync, invariant, getDevelopment} from '@spinfi/shared';
import {createWebsocket} from '@spinfi/websocket';

import {
  NEAR_PRIVATE_KEY_MESSAGE,
  NEAR_ACCOUNT_ID_MESSAGE,
  NEAR_CONTRACT_ID_MESSAGE,
  WEBSOCKET_MESSAGE,
} from './consts';
import {SpinConfig, Config, Api, ContractApi, WebsocketApi} from './types';

export const createApi = (config: Config) => {
  const getContract = async () => {
    invariant(config.privateKey, NEAR_PRIVATE_KEY_MESSAGE);
    invariant(config.accountId, NEAR_ACCOUNT_ID_MESSAGE);
    invariant(config.contractId, NEAR_CONTRACT_ID_MESSAGE);
    const keyStore = new keyStores.InMemoryKeyStore();
    const nearConfig = {...getDevelopment().near, keyStore, ...config?.near};
    const keyPair = KeyPair.fromString(config.privateKey);
    await nearConfig.keyStore.setKey(nearConfig.networkId, config.accountId, keyPair);
    const near = await connect(nearConfig);
    const account = await near.account(config.accountId);
    const transactionManager = TransactionManager.fromAccount(account);
    return {near, account, transactionManager};
  };

  const getWebsocket = () => {
    invariant(config.websocket, WEBSOCKET_MESSAGE);
    const websocket = createWebsocket({
      url: config.websocket,
      onOpen: config.onWebsocketOpen,
      onClose: config.onWebsocketClose,
      onError: config.onWebsocketError,
      onComplete: config.onWebsocketComplete,
    });
    return {websocket};
  };

  const getSpin = (spiConfig: SpinConfig) => {
    const spin = createSpin({
      ...spiConfig,
      contractId: config.contractId,
    });
    return {spin};
  };

  const initContract = responsifyAsync(async (): Promise<ContractApi> => {
    const contractData = await getContract();
    const spinData = getSpin(contractData);
    return {...contractData, ...spinData};
  });

  const initWebsocket = responsifySync((): WebsocketApi => {
    const websocketData = getWebsocket();
    const spinData = getSpin(websocketData);
    return {...websocketData, ...spinData};
  });

  const init = responsifyAsync(async (): Promise<Api> => {
    const contractData = await getContract();
    const websocketData = getWebsocket();
    const spinData = getSpin({...contractData, ...websocketData});
    return {...contractData, ...websocketData, ...spinData};
  });

  return {
    initContract,
    initWebsocket,
    init,
  };
};
