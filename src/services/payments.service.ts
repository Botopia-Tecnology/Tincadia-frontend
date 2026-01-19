import { api } from '@/lib/api-client';

export enum PaymentPlan {
    PERSONAL_FREE = 'personal_free',
    PERSONAL_PREMIUM = 'personal_premium',
    PERSONAL_CORPORATE = 'personal_corporate',
    EMPRESA_FREE = 'empresa_free',
    EMPRESA_BUSINESS = 'empresa_business',
    EMPRESA_CORPORATE = 'empresa_corporate',
    COURSE_ACCESS = 'course_access',
}

export interface WompiWidgetConfig {
    publicKey: string;
    currency: string;
    amountInCents: number;
    reference: string;
    signatureIntegrity: string;
    redirectUrl?: string;
    expirationTime?: string;
    customerData?: {
        email?: string;
        fullName?: string;
        phoneNumber?: string;
        phoneNumberPrefix?: string;
        legalId?: string;
        legalIdType?: string;
    };
}

export interface InitiatePaymentRequest {
    // SEGURIDAD: El precio se determina en el backend basado en planId/planType
    // NO enviamos amountInCents desde el frontend para evitar manipulación
    planId: string;           // ID del plan en la base de datos
    planType: PaymentPlan;    // Tipo de plan
    billingCycle: 'mensual' | 'anual';  // Ciclo de facturación
    redirectUrl?: string;
    // Datos opcionales del cliente (el backend puede obtenerlos del usuario autenticado)
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
    customerPhonePrefix?: string;
    customerLegalId?: string;
    customerLegalIdType?: string;
    userId?: string;
}

export interface InitiatePaymentResponse {
    paymentId: string;
    reference: string;
    widgetConfig: WompiWidgetConfig;
    widgetScriptUrl: string;
    checkoutUrl: string;
}

export interface WompiConfig {
    publicKey: string;
    widgetScriptUrl: string;
    checkoutUrl: string;
    isSandbox: boolean;
}

export interface Payment {
    id: string;
    userId: string;
    amountInCents: number;
    currency: string;
    plan: string;
    status: string;
    wompiTransactionId: string;
    reference: string;
    paymentMethodType: string;
    customerEmail: string;
    customerName: string;
    customerPhone: string;
    finalizedAt: string;
    createdAt: string;
    updatedAt: string;
}

class PaymentsService {
    private baseUrl = '/payments';

    /**
     * Obtiene la configuración pública de Wompi
     */
    async getConfig(): Promise<WompiConfig> {
        return api.get<WompiConfig>(`${this.baseUrl}/config`);
    }

    /**
     * Inicia un nuevo pago y obtiene la configuración del widget
     */
    async initiatePayment(data: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
        return api.post<InitiatePaymentResponse>(`${this.baseUrl}/initiate`, data);
    }

    /**
     * Verifica el estado de una transacción con Wompi
     */
    async verifyPayment(transactionId: string): Promise<any> {
        return api.get(`${this.baseUrl}/verify/${transactionId}`);
    }

    /**
     * Obtiene un pago por su referencia
     */
    async getPaymentByReference(reference: string): Promise<Payment> {
        return api.get<Payment>(`${this.baseUrl}/reference/${reference}`);
    }

    /**
     * Obtiene un pago por ID
     */
    async getPayment(id: string): Promise<Payment> {
        return api.get<Payment>(`${this.baseUrl}/${id}`);
    }

    /**
     * Verifica si el usuario ha comprado un producto
     */
    async checkPurchaseStatus(userId: string, productId: string, productType: string = 'COURSE'): Promise<boolean> {
        return api.get<boolean>(`${this.baseUrl}/purchases/check?userId=${userId}&productId=${productId}&productType=${productType}`);
    }

    /**
     * Lista todos los pagos del usuario
     */
    /**
     * Procesa un pago directo con tarjeta usando un token de Wompi
     */
    async processCardPayment(data: {
        reference: string;
        cardToken: string;
        acceptanceToken: string;
        email: string;
        installments?: number;
    }): Promise<any> {
        return api.post(`${this.baseUrl}/charge-card`, data);
    }
    /**
     * Obtiene el historial de transacciones de un usuario
     */
    async getUserTransactions(userId: string): Promise<{ items: Payment[]; total: number }> {
        return api.get<{ items: Payment[]; total: number }>(`${this.baseUrl}?userId=${userId}&limit=50`);
    }

    /**
     * Obtiene la suscripción activa de un usuario
     */
    async getActiveSubscription(userId: string): Promise<any> {
        return api.get(`${this.baseUrl}/subscriptions/user/${userId}`);
    }

    async cancelSubscription(subscriptionId: string): Promise<any> {
        return api.post<any>(`${this.baseUrl}/subscriptions/${subscriptionId}/cancel`, {});
    }
}

export const paymentsService = new PaymentsService();
