export const AUTH_CRED = 'CK_AUTH_CRED';
export const TOKEN = 'token';

export const PROJECT_STATUS = {
    LISTED: 'Listed',
    VALIDATE: 'Validated',
    VERIFIED: 'Verified',
    JOINT_VERIFICATION_AND_VALIDATION: 'Joint Verification and Validation',
    SECOND_VERIFICATION_CYCLE: 'Second Verification Cycle',
    THIRD_VERIFICATION_CYCLE: 'Third Verification Cycle'
};

export const hideManagementStatuses = [PROJECT_STATUS.LISTED, PROJECT_STATUS.VALIDATE];

export const WITHOUT_CREDITS_PROJECT_STATUS_IDS = ["67455cdff5eef2f16a39ce22", "67455d46f5eef2f16a39ce28"];