<!-- a3131f03-717a-48a5-b2c0-8cd43f0e3bce 6870e1a2-43e2-4500-9da0-3fe7a3f3074e -->
# Remove Name Field and Add Onboarding Flow

## Overview

Remove the name field from the login form and implement a user onboarding flow that appears after OTP verification. New users (without MongoDB entry) will see an onboarding form to enter name, phone, and future fields. Existing users will skip onboarding.

## Implementation Plan

### 1. Update User Model

- **File**: `server/models/User.js`
  - Add `phone` field to user schema
  - Keep existing fields (name, email, otp, subscriptionType)

### 2. Update Backend Auth Routes

- **File**: `server/routes/authRoutes.js`
  - Remove name from `/api/v1/send/otp/email` endpoint (already only uses email)
  - Fix `/api/v1/verify/otp/email` endpoint:
    - Properly validate OTP
    - Return `isNewUser` flag in response to indicate if user needs onboarding
    - Return token and user data
  - Create `/api/v1/user/onboarding` endpoint:
    - Accept name, phone, and other fields
    - Update existing user record with onboarding data
    - Return updated user

### 3. Update Frontend Login Components

- **File**: `frontend/src/components/auth/LoginForm.js`
  - Remove name field completely
  - Update API call to only send email
  - Update callback to only pass email

- **File**: `frontend/src/components/auth/OTPForm.js`
  - Remove name prop dependency
  - Update to handle `isNewUser` flag from verify response
  - Call `onOTPVerified` callback with email, token, and isNewUser flag

### 4. Create Onboarding Form Component

- **File**: `frontend/src/components/auth/OnboardingForm.js`
  - Create form with name and phone fields
  - Add structure for future fields (extensible)
  - Submit onboarding data to backend
  - Show loading and error states
  - Call `onComplete` callback when done

### 5. Update Login Modal

- **File**: `frontend/src/components/auth/LoginModal.js`
  - Add 'onboarding' step to state management
  - Update step flow: 'login' → 'otp' → 'onboarding' (if new user) → redirect
  - Show OnboardingForm for new users after OTP verification
  - Skip onboarding and redirect existing users directly
  - Pass email and token to onboarding form

### 6. Update Onboarding Page (Optional)

- **File**: `frontend/src/pages/onboarding.js`
  - Keep as redirect destination after onboarding completion
  - Or update to show welcome message

## Flow Diagram

```
User clicks "Start Streaming"
  ↓
Login Modal Opens
  ↓
User enters email → OTP sent
  ↓
User enters OTP → OTP verified
  ↓
Backend checks: User exists in DB?
  ├─ YES → User has name/phone? → Skip onboarding → Redirect to /onboarding
  └─ NO → Show OnboardingForm → User enters name/phone → Save to DB → Redirect to /onboarding
```

## Technical Notes

- Backend should check if user has name/phone to determine if onboarding is needed
- Onboarding form should be extensible for future fields
- Maintain all existing styling and UX patterns
- Handle error states for onboarding submission
- Ensure token is stored before showing onboarding (user is authenticated)

## Files to Create

1. `frontend/src/components/auth/OnboardingForm.js`

## Files to Modify

1. `server/models/User.js` - Add phone field
2. `server/routes/authRoutes.js` - Fix verify endpoint, add onboarding endpoint
3. `frontend/src/components/auth/LoginForm.js` - Remove name field
4. `frontend/src/components/auth/OTPForm.js` - Handle isNewUser flag
5. `frontend/src/components/auth/LoginModal.js` - Add onboarding step

### To-dos

- [ ] Create AuthContext.js with login, logout, and authentication state management
- [ ] Create api.js with axios instance and token interceptors
- [ ] Create LoginBackground.js component for cinematic background styling
- [ ] Create LoginSideImage.js component for side image display
- [ ] Create LoginForm.js component with email/name inputs and OTP send logic
- [ ] Create OTPForm.js component with OTP input and verification logic
- [ ] Create LoginModal.js component that wraps forms in Modal and manages step state
- [ ] Update Hero.js to add modal state and trigger LoginModal on 'Start Streaming' click
- [ ] Update _app.js to wrap application with AuthContext provider