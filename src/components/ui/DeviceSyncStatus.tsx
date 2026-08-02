import type { DeviceSession, SyncMeta } from '@/types';

interface Props {
  meta: SyncMeta;
  devices: DeviceSession[];
  /** 演示用：模拟断网 / 恢复，展示离线队列与增量重发 */
  onToggleOnline?: (online: boolean) => void;
}

const DEVICE_ICON: Record<DeviceSession['type'], string> = {
  ipad: '📱', phone: '📲', web: '💻',
};

const fmt = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

/**
 * 多设备实时同步状态（家长中心）。
 * 显示：在线/离线、最近同步时间、离线待发事件数，以及各设备的在线情况。
 * 说明幂等与增量同步，让家长信任「所有改动会实时同步到孩子设备」。
 */
export function DeviceSyncStatus({ meta, devices, onToggleOnline }: Props) {
  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${meta.online ? 'bg-forest-500' : 'bg-soil-400'}`}
              aria-hidden
            />
            <span className="font-display font-bold text-forest-800">
              {meta.online ? '实时同步已连接' : '离线中（改动将排队）'}
            </span>
          </div>
          {onToggleOnline && (
            <button
              type="button"
              onClick={() => onToggleOnline(!meta.online)}
              className="btn-ghost tap text-sm"
            >
              {meta.online ? '模拟断网' : '恢复连接'}
            </button>
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="card-barn p-3">
            <div className="text-[11px] text-forest-500">最近同步</div>
            <div className="font-display font-bold text-forest-800">{fmt(meta.lastSyncAt)}</div>
          </div>
          <div className="card-barn p-3">
            <div className="text-[11px] text-forest-500">待同步事件</div>
            <div className="font-display font-bold text-forest-800">{meta.pendingCount} 条</div>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-forest-500">
          所有金币 / 贴纸 / 步数发放均带幂等键，重复点击或断网恢复都不会重复计数。
        </p>
      </div>

      <div className="card p-4">
        <h4 className="type-h3 mb-2">已登录设备</h4>
        <ul className="divide-y divide-forest-100">
          {devices.map((d) => (
            <li key={d.id} className="py-3 flex items-center gap-3">
              <span className="text-2xl" aria-hidden>{DEVICE_ICON[d.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-forest-800 truncate">{d.name}</div>
                <div className="text-[11px] text-forest-500">最近同步 {fmt(d.lastSyncAt)}</div>
              </div>
              <span className={`pill ${d.online ? 'pill-sky' : ''}`}>{d.online ? '在线' : '离线'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
