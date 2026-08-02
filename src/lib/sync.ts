/**
 * 实时同步层（模拟）。
 * 真实环境接 WebSocket / SSE；此处用 BroadcastChannel 模拟多设备同步，
 * 并加入：离线队列、事件去重、SyncMeta（在线/最近同步/待发数）。
 * 业务代码只用 sync.publish / sync.subscribe / sync.getMeta / sync.setOnline。
 */

import type { SyncEvent, SyncMeta } from '@/types';

type Listener = (e: SyncEvent) => void;

const dedupeKey = (e: SyncEvent): string => {
  const p = e.payload as Record<string, unknown>;
  if (typeof p.idempotencyKey === 'string') return `ik:${p.idempotencyKey}`;
  if (typeof p.txnId === 'string') return `txn:${p.txnId}`;
  if (typeof p.stickerId === 'string') return `stk:${p.stickerId}`;
  return `${e.type}:${JSON.stringify(p)}`;
};

class SyncClient {
  private channel: BroadcastChannel | null = null;
  private listeners = new Set<Listener>();
  private online = true;
  private meta: SyncMeta = { online: true, pendingCount: 0 };
  private seen = new Set<string>();          // 去重：已处理的事件键
  private queue: SyncEvent[] = [];           // 离线时缓存的待发事件
  private senderId = `dev-${Math.random().toString(36).slice(2, 7)}`;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('forest-study-station');
      this.channel.onmessage = (m) => this.receive(m.data as SyncEvent);
    }
  }

  publish(e: SyncEvent) {
    const ev: SyncEvent = { ...e, senderId: this.senderId, ts: new Date().toISOString() };
    if (!this.online) {
      this.queue.push(ev);
      this.updateMeta();
      return; // 离线：先缓存，恢复后再发
    }
    this.channel?.postMessage(ev);
    // 注意：本地状态由 store 直接乐观更新，这里不再本地 fanout，避免重复应用
  }

  private receive(e: SyncEvent) {
    if (e.senderId === this.senderId) return; // 自己的回声忽略
    this.fanout(e);
  }

  private fanout(e: SyncEvent) {
    const key = dedupeKey(e);
    if (this.seen.has(key)) return; // 同一事件只应用一次
    this.seen.add(key);
    this.meta = { ...this.meta, lastSyncAt: new Date().toISOString() };
    this.listeners.forEach((l) => l(e));
  }

  subscribe(l: Listener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  isOnline() { return this.online; }

  setOnline(v: boolean) {
    this.online = v;
    this.meta = { ...this.meta, online: v };
    if (v && this.queue.length) {
      const pending = [...this.queue];
      this.queue = [];
      this.updateMeta();
      pending.forEach((e) => this.publish(e)); // 恢复后增量重发
    }
  }

  /** 多设备拉取请求：触发一次全量响应 */
  requestSync() {
    this.publish({ type: 'sync.request', payload: {} });
  }

  getMeta(): SyncMeta { return { ...this.meta, pendingCount: this.queue.length }; }

  private updateMeta() {
    this.meta = { ...this.meta, pendingCount: this.queue.length, lastSyncAt: this.online ? new Date().toISOString() : this.meta.lastSyncAt };
  }
}

export const sync = new SyncClient();

/* 接 WebSocket：
   const ws = new WebSocket(import.meta.env.VITE_SYNC_URL);
   ws.onmessage = (m) => listeners.forEach(l => l(JSON.parse(m.data)));
   publish(e) { if (online) ws.send(JSON.stringify(e)); else queue.push(e); }
*/
