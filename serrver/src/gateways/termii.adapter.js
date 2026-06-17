const axios = require("axios");
const SMSGatewayInterface = require("./gateway.interface");
const ApiError = require("../utils/ApiError");

class TermiiAdapter extends SMSGatewayInterface {
  constructor() {
    super();
    this.apiKey = process.env.TERMII_API_KEY;
    this.baseUrl = process.env.TERMII_BASE_URL || "https://api.ng.termii.com";
    this.channel = "generic";
  }

  async sendSingle(to, from, message) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/sms/send`, {
        to,
        from: from || "N-Alert", // fallback to generic sender
        sms: message,
        type: "plain",
        api_key: this.apiKey,
        channel: "dnd", // use dnd channel for better delivery
      });

      return {
        gatewayRef: response.data.message_id,
        status: "SENT",
        raw: response.data,
      };
    } catch (error) {
      throw new ApiError(
        500,
        `Termii send failed: ${error.response?.data?.message || error.message}`
      );
    }
  }

  async sendBulk(recipients, from, message) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/sms/send/bulk`, {
        to: recipients.map((r) => r.to),
        from: from || "N-Alert",
        sms: message,
        type: "plain",
        api_key: this.apiKey,
        channel: this.channel || "dnd",
      });

      return recipients.map((r, index) => ({
        to: r.to,
        gatewayRef: response.data.message_id || `${Date.now()}_${index}`,
        status: "SENT",
      }));
    } catch (error) {
      throw new ApiError(
        500,
        `Termii bulk send failed: ${error.response?.data?.message || error.message}`
      );
    }
  }

  async getDeliveryStatus(gatewayRef) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/sms/inbox?api_key=${this.apiKey}&message_id=${gatewayRef}`
      );
      return { status: response.data.status };
    } catch (error) {
      return { status: "UNKNOWN" };
    }
  }

  async getBalance() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/get-balance?api_key=${this.apiKey}`
      );
      return { balance: response.data.balance };
    } catch (error) {
      return { balance: 0 };
    }
  }
}

module.exports = TermiiAdapter;