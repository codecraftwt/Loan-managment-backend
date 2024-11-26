const messaging = require("../config/firebaseConfig");
const User = require("../models/User");

async function sendLoanStatusNotification(userId, loanStatus) {
  try {
    // Find the user by userId to get the device tokens
    const user = await User.findById(userId);
    if (!user || !user.deviceTokens || user.deviceTokens.length === 0) {
      throw new Error("User or device tokens not found");
    }

    // Prepare the notification message
    const message = {
      notification: {
        title: "Loan Status Update",
        body: `The loan has been ${loanStatus}.`,
      },
      data: {
        loanStatus: loanStatus, // Additional data you might want to send
      },
    };

    // Send the notification to all device tokens
    const promises = user.deviceTokens.map((token) => {
      return messaging.send({ ...message, token });
    });

    // Wait for all notifications to be sent
    await Promise.all(promises);

    console.log(`Loan status notification sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

module.exports = { sendLoanStatusNotification };
