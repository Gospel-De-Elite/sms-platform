/**
 * Base interface all SMS gateway adapters must follow.
 * Every adapter must implement these methods.
 */
class SMSGatewayInterface {
    /**
     * Send a single SMS
     * @param {string} to - recipient phone number
     * @param {string} from - sender ID
     * @param {string} message - message body
     * @returns {Promise<{gatewayRef: string, status: string}>}
     */
    async sendSingle(to, from, message) {
        throw new Error("sendSingle() must be implemented");
    }

    /**
     * Send bulk SMS
     * @param {Array<{to: string}>} recipients
     * @param {string} from - sender ID
     * @param {string} message - message body
     * @returns {Promise<Array<{to: string, gatewayRef: string, status: string}>>}
     */
    async sendBulk(recipients, from, message) {
        throw new Error("sendBulk() must be implemented");
    }

    /**
     * Get delivery status of a message
     * @param {string} gatewayRef
     * @returns {Promise<{status: string}>}
     */
    async getDeliveryStatus(gatewayRef) {
        throw new Error("getDeliveryStatus() must be implemented");
    }

    /**
     * Get account balance from gateway
     * @returns {Promise<{balance: number}>}
     */
    async getBalance() {
        throw new Error("getBalance() must be implemented");
    }
}

module.exports = SMSGatewayInterface;