import apiClient from './apiClient';

// ===================================================================
// LOCKER ACCESS FLOW
// Functions used for the multi-factor authentication process.
// ===================================================================

/**
 * Sends a captured face image to the backend for verification.
 * @param {string} base64Image - The Base64 encoded image string from the webcam.
 * @returns {Promise} Axios promise object
 */
export const verifyFace = (base64Image) => {
  return apiClient.post('/locker/verify-face', { base64_image: base64Image });
};

/**
 * Sends the user's PIN and the OTP to the backend to unlock the locker.
 * @param {string} pin - The user's 4-digit PIN.
 * @param {string} otp - The 6-digit OTP sent to the user's device.
 * @returns {Promise} Axios promise object
 */
export const unlockLocker = (pin, otp) => {
  return apiClient.post('/locker/unlock', { pin, otp });
};


// ===================================================================
// USER DASHBOARD & LOCKERS
// ===================================================================

/**
 * (Optional) Fetches updated details about the user's assigned lockers.
 * Note: Basic locker info might already be in the AuthContext user object.
 * @returns {Promise}
 */
export const getMyLockers = () => {
    return apiClient.get('/user/my-lockers');
}

/**
 * Submits an application for an additional locker.
 * @param {object} applicationData - Data required for a new locker application.
 * @returns {Promise}
 */
export const applyForNewLocker = (applicationData) => {
    return apiClient.post('/user/apply-locker', applicationData);
}


// ===================================================================
// NOMINEE MANAGEMENT
// ===================================================================

/**
 * Fetches the list of nominees for the current user.
 * @returns {Promise} Axios promise object
 */
export const getNominees = () => {
  return apiClient.get('/user/nominees');
};

/**
 * Adds a new nominee for the current user.
 * @param {object} nomineeData - The details of the new nominee.
 * @returns {Promise} Axios promise object
 */
export const addNominee = (nomineeData) => {
  return apiClient.post('/user/nominees', nomineeData);
};


// ===================================================================
// ACCOUNT SETTINGS
// ===================================================================

/**
 * Sends the old and new PIN to the backend to update it.
 * @param {{oldPin: string, newPin: string}} pinData - Object containing old and new PIN.
 * @returns {Promise} Axios promise object
 */
export const changePin = (pinData) => {
  return apiClient.put('/user/settings/change-pin', pinData);
};

/**
 * Sends the old and new password to the backend to update it.
 * @param {{oldPassword: string, newPassword: string}} passwordData
 * @returns {Promise}
 */
export const changePassword = (passwordData) => {
    return apiClient.put('/user/settings/change-password', passwordData);
}