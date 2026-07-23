// ============================================================
// Patrón de Comportamiento: Observer — Sistema de Alertas
// ============================================================
// Sistema de notificaciones/alertas reactivo. El dashboard
// actúa como observador suscrito a cambios de estado de los
// surtidores (niveles críticos). Integrable con Supabase Realtime.
// ============================================================

import { Surtidor, Alerta, AlertType, AlertStatus } from '@/types';

/**
 * IObserver — Interfaz del Observador
 * 
 * Cualquier componente que desee recibir notificaciones de cambios
 * de estado en los surtidores debe implementar esta interfaz.
 */
export interface IObserver {
  id: string;
  update(event: PumpEvent): void;
}

/**
 * ISubject — Interfaz del Sujeto Observable
 * 
 * Define los métodos para gestionar la lista de observadores
 * y notificar cambios de estado.
 */
export interface ISubject {
  subscribe(observer: IObserver): void;
  unsubscribe(observerId: string): void;
  notify(event: PumpEvent): void;
}

/**
 * Tipo de evento emitido por el monitor de surtidores.
 */
export interface PumpEvent {
  type: 'LEVEL_CRITICAL' | 'LEVEL_WARNING' | 'LEVEL_NORMAL' | 'CONNECTION_LOST' | 'OVERLOAD' | 'MAINTENANCE';
  surtidor: Surtidor;
  message: string;
  timestamp: string;
  alertType?: AlertType;
}

/**
 * PumpMonitor — Subject del patrón Observer
 * 
 * Monitorea el estado de los surtidores y notifica a todos
 * los observadores suscritos cuando hay cambios relevantes.
 * Diseñado para integrarse con Supabase Realtime.
 */
export class PumpMonitor implements ISubject {
  private observers: Map<string, IObserver> = new Map();
  private static instance: PumpMonitor | null = null;

  private constructor() {}

  /**
   * Singleton — Asegura una única instancia del monitor.
   */
  static getInstance(): PumpMonitor {
    if (!PumpMonitor.instance) {
      PumpMonitor.instance = new PumpMonitor();
    }
    return PumpMonitor.instance;
  }

  /**
   * Suscribe un observador para recibir notificaciones.
   */
  subscribe(observer: IObserver): void {
    this.observers.set(observer.id, observer);
    console.log(`[PumpMonitor] Observer "${observer.id}" suscrito. Total: ${this.observers.size}`);
  }

  /**
   * Desuscribe un observador por su ID.
   */
  unsubscribe(observerId: string): void {
    this.observers.delete(observerId);
    console.log(`[PumpMonitor] Observer "${observerId}" desuscrito. Total: ${this.observers.size}`);
  }

  /**
   * Notifica a todos los observadores suscritos sobre un evento.
   */
  notify(event: PumpEvent): void {
    this.observers.forEach((observer) => {
      observer.update(event);
    });
  }

  /**
   * Evalúa el estado de un surtidor y emite eventos si es necesario.
   * Se invoca cuando cambia el nivel de un surtidor (ej. después de una venta).
   */
  checkPumpStatus(surtidor: Surtidor, safetyThreshold: number): void {
    const fillPercentage = (surtidor.nivel_actual / surtidor.capacidad_maxima) * 100;

    if (surtidor.nivel_actual <= safetyThreshold) {
      this.notify({
        type: 'LEVEL_CRITICAL',
        surtidor,
        message: `⚠️ NIVEL CRÍTICO: Surtidor #${surtidor.numero_bomba} (${surtidor.combustible}) — ` +
          `${surtidor.nivel_actual}L / ${surtidor.capacidad_maxima}L (${fillPercentage.toFixed(1)}%)`,
        timestamp: new Date().toISOString(),
        alertType: AlertType.NIVEL_CRITICO,
      });
    } else if (fillPercentage < 25) {
      this.notify({
        type: 'LEVEL_WARNING',
        surtidor,
        message: `⚡ Nivel bajo: Surtidor #${surtidor.numero_bomba} (${surtidor.combustible}) — ` +
          `${fillPercentage.toFixed(1)}% restante`,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Emite un evento de pérdida de conexión para un surtidor.
   */
  reportConnectionLost(surtidor: Surtidor): void {
    this.notify({
      type: 'CONNECTION_LOST',
      surtidor,
      message: `🔴 Conexión perdida: Surtidor #${surtidor.numero_bomba} (${surtidor.combustible})`,
      timestamp: new Date().toISOString(),
      alertType: AlertType.FALLA_CONEXION,
    });
  }

  /**
   * Retorna la cantidad de observadores suscritos.
   */
  getObserverCount(): number {
    return this.observers.size;
  }
}

/**
 * DashboardObserver — Implementación del Observer para el Dashboard
 * 
 * Recopila eventos de los surtidores y los almacena como alertas
 * que se muestran en el panel del dashboard.
 */
export class DashboardObserver implements IObserver {
  id: string;
  private alerts: Alerta[] = [];
  private onAlertCallback?: (alert: Alerta) => void;

  constructor(id: string = 'dashboard-main') {
    this.id = id;
  }

  /**
   * Registra un callback que se ejecuta al recibir una nueva alerta.
   */
  onNewAlert(callback: (alert: Alerta) => void): void {
    this.onAlertCallback = callback;
  }

  /**
   * Recibe un evento del PumpMonitor y lo convierte en una Alerta.
   */
  update(event: PumpEvent): void {
    const alert: Alerta = {
      id: crypto.randomUUID(),
      surtidor_id: event.surtidor.id,
      tipo: event.alertType || AlertType.NIVEL_CRITICO,
      estado: AlertStatus.PENDIENTE,
      fecha: event.timestamp,
      resuelto_en: null,
    };

    this.alerts.push(alert);
    console.log(`[DashboardObserver] Nueva alerta: ${event.message}`);

    if (this.onAlertCallback) {
      this.onAlertCallback(alert);
    }
  }

  /**
   * Retorna todas las alertas recopiladas.
   */
  getAlerts(): Alerta[] {
    return [...this.alerts];
  }

  /**
   * Retorna las alertas pendientes.
   */
  getPendingAlerts(): Alerta[] {
    return this.alerts.filter(a => a.estado === AlertStatus.PENDIENTE);
  }
}
