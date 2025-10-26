const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// SMS templates
const smsTemplates = {
  collaborationRequest: (companyName, designTitle) => 
    `🎨 ${companyName} wants to collaborate on your design "${designTitle}"! Check your dashboard: ${process.env.FRONTEND_URL}/dashboard`,
  
  collaborationAccepted: (designerName, designTitle) =>
    `✅ ${designerName} accepted your collaboration request for "${designTitle}"! View details: ${process.env.FRONTEND_URL}/dashboard`,
    
  collaborationDeclined: (designerName, designTitle) =>
    `❌ ${designerName} declined your collaboration request for "${designTitle}". View other designs: ${process.env.FRONTEND_URL}/designs`,

  collaborationCompleted: (partnerName, designTitle) =>
    `🎉 Your collaboration with ${partnerName} on "${designTitle}" has been completed! View details: ${process.env.FRONTEND_URL}/dashboard`,

  newFollower: (followerName) =>
    `👥 ${followerName} started following you on The Runway! Check your profile: ${process.env.FRONTEND_URL}/profile`,

  designLiked: (likerName, designTitle) =>
    `💖 ${likerName} liked your design "${designTitle}"! View your designs: ${process.env.FRONTEND_URL}/profile`
};

// Send SMS function
const sendSMS = async (to, message, type = 'general') => {
  try {
    // Validate phone number format
    if (!to || !to.startsWith('+')) {
      throw new Error('Invalid phone number format. Must include country code with +');
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    console.log(`SMS sent successfully to ${to}:`, result.sid);
    
    return {
      success: true,
      messageSid: result.sid,
      status: result.status,
      to: to,
      type: type
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    
    return {
      success: false,
      error: error.message,
      to: to,
      type: type
    };
  }
};

// Send collaboration request SMS
const sendCollaborationRequestSMS = async (designerPhone, companyName, designTitle) => {
  const message = smsTemplates.collaborationRequest(companyName, designTitle);
  return await sendSMS(designerPhone, message, 'collaboration_request');
};

// Send collaboration accepted SMS
const sendCollaborationAcceptedSMS = async (companyPhone, designerName, designTitle) => {
  const message = smsTemplates.collaborationAccepted(designerName, designTitle);
  return await sendSMS(companyPhone, message, 'collaboration_accepted');
};

// Send collaboration declined SMS
const sendCollaborationDeclinedSMS = async (companyPhone, designerName, designTitle) => {
  const message = smsTemplates.collaborationDeclined(designerName, designTitle);
  return await sendSMS(companyPhone, message, 'collaboration_declined');
};

// Send collaboration completed SMS
const sendCollaborationCompletedSMS = async (userPhone, partnerName, designTitle) => {
  const message = smsTemplates.collaborationCompleted(partnerName, designTitle);
  return await sendSMS(userPhone, message, 'collaboration_completed');
};

// Send new follower SMS
const sendNewFollowerSMS = async (userPhone, followerName) => {
  const message = smsTemplates.newFollower(followerName);
  return await sendSMS(userPhone, message, 'new_follower');
};

// Send design liked SMS
const sendDesignLikedSMS = async (designerPhone, likerName, designTitle) => {
  const message = smsTemplates.designLiked(likerName, designTitle);
  return await sendSMS(designerPhone, message, 'design_liked');
};

// Validate phone number
const validatePhoneNumber = (phone) => {
  // Basic validation for international format
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// Get SMS delivery status
const getSMSStatus = async (messageSid) => {
  try {
    const message = await client.messages(messageSid).fetch();
    return {
      success: true,
      status: message.status,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage
    };
  } catch (error) {
    console.error('Error fetching SMS status:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendSMS,
  sendCollaborationRequestSMS,
  sendCollaborationAcceptedSMS,
  sendCollaborationDeclinedSMS,
  sendCollaborationCompletedSMS,
  sendNewFollowerSMS,
  sendDesignLikedSMS,
  validatePhoneNumber,
  getSMSStatus,
  smsTemplates
};