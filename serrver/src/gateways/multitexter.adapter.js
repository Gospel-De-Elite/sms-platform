const axios = require("axios");
const SMSGatewayInterface = require("./gateway.interface");
const ApiError = require("../utils/ApiError");

class MultitexterAdapter extends SMSGatewayInterface {
    constructor() {
        super();
        this.email = process.env.MULTITEXTER_EMAIL;
        this.password = process.env.MULTITEXTER_PASSWORD;
        this.baseUrl = "https://app.multitexter.com/v2/app";
    }

    async sendSingle(to, from, message) {
        try {
            const response = await axios.post(`${this.baseUrl}/sms`, {
                email: this.email,
                password: this.password,
                message,
                senderName: from,
                recipients: to,
            });

            return {
                gatewayRef: response.data.messageid || `MT_${Date.now()}`,
                status: "SENT",
                raw: response.data,
            };
        } catch (error) {
            throw new ApiError(
                500,
                `Multitexter send failed: ${error.response?.data?.message || error.message}`
            );
        }
    }

    async sendBulk(recipients, from, message) {
        try {
            const recipientList = recipients.map((r) => r.to).join(",");

            const response = await axios.post(`${this.baseUrl}/sms`, {
                email: this.email,
                password: this.password,
                message,
                senderName: from,
                recipients: recipientList,
            });

            return recipients.map((r, index) => ({
                to: r.to,
                gatewayRef: `MT_${Date.now()}_${index}`,
                status: "SENT",
            }));
        } catch (error) {
            throw new ApiError(
                500,
                `Multitexter bulk send failed: ${error.response?.data?.message || error.message}`
            );
        }
    }

    async getDeliveryStatus(gatewayRef) {
        return { status: "UNKNOWN" };
    }

    async getBalance() {
        try {
            const response = await axios.post(`${this.baseUrl}/getbalance`, {
                email: this.email,
                password: this.password,
            });
            return { balance: response.data.balance };
        } catch (error) {
            return { balance: 0 };
        }
    }
}

module.exports = MultitexterAdapter;