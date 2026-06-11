# SMS Delivery Diagnostic Report

## Issues Found 🔴

### 1. **CRITICAL: No Provider Webhook Handler**
**Issue:** The system has no endpoint to receive delivery status callbacks from Termii or Multitexter.

**Current State:**
- Webhooks system exists only for USER-defined webhooks (for developers)
- There's NO route to receive delivery confirmations FROM the SMS providers
- Gateway adapters have `getDeliveryStatus()` methods but they're not called anywhere
- Message statuses are marked as "SENT" but never updated to "DELIVERED"

**Impact:** 
- All messages show as "SENT" forever, never updating to "DELIVERED"
- No way to track actual delivery
- Reports show inaccurate delivery metrics

**What needs to be added:**
```
POST /api/webhooks/provider/termii  - Receive Termii delivery callbacks
POST /api/webhooks/provider/multitexter - Receive Multitexter delivery callbacks
```

**How to fix:** Create provider webhook handlers that:
1. Verify the signature from the provider
2. Update message status in database (SENT → DELIVERED/FAILED)
3. Dispatch user webhooks if configured

---

### 2. **POTENTIAL: Sender ID Validation on Termii**
**Issue:** Messages might be rejected if sender ID isn't properly registered with Termii.

**File:** `serrver/src/gateways/termii.adapter.js:18-21`

**Code:**
```javascript
const response = await axios.post(`${this.baseUrl}/api/sms/send`, {
  to,
  from,  // ← This is your sender ID/name
  sms: message,
  type: "plain",
  api_key: this.apiKey,
  channel: this.channel,
});
```

**Potential Problem:**
- The `from` field sends the sender ID name
- Termii requires sender IDs to be registered in their dashboard AND approved
- If not approved on Termii's side, SMS may be rejected

**Check:**
1. Log into Termii dashboard
2. Verify sender IDs are registered and active
3. Test if SMS sends without the platform (direct Termii API)

---

### 3. **LIKELY: Missing Error Logging**
**Issue:** When SMS fails, errors might not be visible.

**File:** `serrver/src/services/sms.service.js:62-72`

**Code:**
```javascript
try {
    const result = await gateway.sendSingle(to, senderID.name, message);
    gatewayRef = result.gatewayRef;
    status = "SENT";
} catch (error) {
    // Try fallback gateway
    try {
        const fallback = getGateway("MULTITEXTER");
        const result = await fallback.sendSingle(to, senderID.name, message);
        gatewayRef = result.gatewayRef;
        status = "SENT";
    } catch (fallbackError) {
        failureReason = fallbackError.message;  // ← Only last error stored
        status = "FAILED";
    }
}
```

**Problem:**
- If Termii fails, it tries Multitexter
- Only the final error is recorded
- Logs are console.log (should use Winston)
- No way to see which gateway actually failed

---

### 4. **RISK: No Validation of API Keys**
**Issue:** If `TERMII_API_KEY` or `MULTITEXTER_EMAIL/PASSWORD` are missing/wrong, all SMS fail silently.

**Check List:**
- [ ] `TERMII_API_KEY` is set in `.env`
- [ ] `MULTITEXTER_EMAIL` is set in `.env`
- [ ] `MULTITEXTER_PASSWORD` is set in `.env`
- [ ] Test Termii API key directly: `curl https://api.ng.termii.com/api/get-balance?api_key=YOUR_KEY`

---

### 5. **ISSUE: No Unit Cost Verification**
**Issue:** SMS might fail if your account doesn't have funds.

**File:** `serrver/src/gateways/termii.adapter.js:72-80`

**Code:**
```javascript
async getBalance() {
    try {
        const response = await axios.get(
            `${this.baseUrl}/api/get-balance?api_key=${this.apiKey}`
        );
        return { balance: response.data.balance };
    } catch (error) {
        return { balance: 0 };  // ← Silently returns 0 on error
    }
}
```

**Problem:**
- If balance check fails, returns 0 (but error is swallowed)
- Your Termii/Multitexter account might be out of credits
- System doesn't warn before SMS send

**Check:** 
1. Log into Termii dashboard → Check account balance
2. Log into Multitexter dashboard → Check account balance

---

## Debugging Steps

### Step 1: Enable Debug Logging
Create/update `serrver/.env`:
```
NODE_ENV=development
DEBUG=sms:*
TERMII_DEBUG=true
```

Then add to `sms.service.js`:
```javascript
const logger = require('winston'); // or console
logger.info('Attempting to send SMS:', { to, from: senderID.name, cost, balance: wallet.balance });
```

### Step 2: Check Provider Credentials
```bash
# Test Termii API directly
curl -X GET "https://api.ng.termii.com/api/get-balance?api_key=YOUR_API_KEY"

# Should return: {"balance": 123.45}
```

### Step 3: Test Single SMS
Make a direct request to your API:
```bash
curl -X POST http://localhost:5000/api/sms/send \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+234XXXXXXXXXX",
    "senderIDId": "your_sender_id_uuid",
    "message": "Test message"
  }'
```

Check the response for:
- `status: "SENT"` or `"FAILED"`
- `failureReason` if failed
- `gatewayRef` (message ID from provider)

### Step 4: Check Database
```sql
SELECT * FROM messages 
ORDER BY created_at DESC 
LIMIT 10;
-- Check if status is "SENT" or "FAILED"
```

### Step 5: Monitor Termii Dashboard
1. Go to Termii dashboard
2. Check "Message History" 
3. Verify SMS appears there (even if delivery status isn't shown)

---

## Most Likely Cause: **Provider Configuration**

Based on code review, the 3 most likely reasons:

1. **❌ Sender ID not approved on Termii/Multitexter**
   - Fix: Register sender ID in provider dashboard
   - Time to fix: 5 mins

2. **❌ Account has insufficient credits**
   - Fix: Add funds to Termii/Multitexter account
   - Time to fix: 5 mins

3. **❌ API credentials are wrong**
   - Fix: Double-check `.env` file
   - Time to fix: 2 mins

---

## Code Recommendations

### HIGH PRIORITY: Add Provider Webhook Handler
The system needs to receive delivery status updates:
```javascript
// NEW FILE: serrver/src/routes/provider-webhooks.routes.js
router.post('/termii/delivery', async (req, res) => {
  const { message_id, status } = req.body;
  
  // Find message and update status
  await prisma.message.update({
    where: { gatewayRef: message_id },
    data: { status: status === 'delivered' ? 'DELIVERED' : 'FAILED' }
  });
  
  res.json({ success: true });
});
```

### HIGH PRIORITY: Better Error Logging
```javascript
// In sms.service.js
const logger = require('./logger'); // Use Winston

logger.error('SMS gateway error:', {
  to,
  gateway: 'TERMII',
  error: error.message,
  response: error.response?.data,
  timestamp: new Date().toISOString()
});
```

### MEDIUM: Add Pre-send Validation
```javascript
// Check balance before sending
const balance = await gateway.getBalance();
if (balance.balance < cost) {
  throw new ApiError(402, 'Insufficient provider balance');
}
```

---

## Summary

| Item | Status | Action |
|------|--------|--------|
| Code Issue | ⚠️ Missing webhook receiver | Add provider webhook handler |
| Provider Config | 🔴 Unknown | Verify API credentials & balance |
| Sender ID | 🔴 Unknown | Check if registered in provider dashboard |
| Error Logging | ⚠️ Limited | Improve logging |
| Message Tracking | ❌ Not working | Add delivery status updates |

**Next Action:** Check Termii & Multitexter dashboards for:
1. API key validity
2. Account balance
3. Sender ID registration status
4. Message history (if SMS appears at all)
