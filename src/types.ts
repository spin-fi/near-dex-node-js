import {Near, ConnectConfig, Account} from 'near-api-js';
import {TransactionManager} from 'near-transaction-manager';
import {Websocket} from '@spinfi/websocket';
import {Spin} from '@spinfi/core';

export type Config = {
  contractId?: string;
  privateKey?: string;
  accountId?: string;
  websocket?: string;
  near?: Partial<ConnectConfig>;
  onWebsocketOpen?: () => void;
  onWebsocketClose?: () => void;
  onWebsocketError?: (error: unknown) => void;
  onWebsocketComplete?: () => void;
};

export type SpinConfig = {
  account?: Account;
  websocket?: Websocket;
  transactionManager?: TransactionManager;
};

export type ContractApi = {
  near: Near;
  account: Account;
  transactionManager: TransactionManager;
  spin: Spin;
};

export type WebsocketApi = {
  websocket: Websocket;
  spin: Spin;
};

export type Api = {
  near: Near;
  account: Account;
  transactionManager: TransactionManager;
  websocket: Websocket;
  spin: Spin;
};
