/**
 * Tauri Native Desktop Bridge Abstraction Layer
 * Fallback gracefully to Web APIs when running in browser mode,
 * or invoke Rust commands when running inside Tauri 2 Desktop container.
 */

export const isTauriEnvironment = () => {
  return typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;
};

export const getSystemInformation = async () => {
  if (isTauriEnvironment()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke('get_system_info');
    } catch (e) {
      console.warn('Tauri invoke failed, using browser fallback:', e);
    }
  }

  return {
    os: navigator.platform,
    arch: 'x64',
    version: '1.0.0-web',
    is_online: navigator.onLine,
  };
};

export const saveOfflineRecord = async (entityType, entityId, operation, payload) => {
  if (isTauriEnvironment()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke('save_offline_record', {
        entityType,
        entityId,
        operation,
        payloadJson: JSON.stringify(payload),
      });
    } catch (e) {
      console.error('Tauri save_offline_record error:', e);
    }
  }

  // Fallback to localStorage sync queue
  const queue = JSON.parse(localStorage.getItem('nexus_crm_offline_queue') || '[]');
  const record = {
    id: `sync_${Date.now()}`,
    entityType,
    entityId,
    operation,
    payload,
    timestamp: new Date().toISOString(),
  };
  queue.push(record);
  localStorage.setItem('nexus_crm_offline_queue', JSON.stringify(queue));
  return record.id;
};

export const printInvoicePdf = async (invoiceNumber) => {
  if (isTauriEnvironment()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke('print_invoice_pdf', { invoiceNumber });
    } catch (e) {
      console.error('Tauri print_invoice_pdf error:', e);
    }
  }
  window.print();
  return true;
};

export const checkAppUpdate = async () => {
  if (isTauriEnvironment()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke('check_app_update');
    } catch (e) {
      console.error('Tauri check_app_update error:', e);
    }
  }
  return 'Running latest version (Web Mode)';
};
