# Safehouse Booking Process Workflow

## Overview

The Safehouse Booking Process is a comprehensive 6-step workflow designed to ensure safe, anonymous, and efficient placement of individuals in need of emergency shelter.

## Workflow Steps

### Step 1: User Requests Safehouse Placement

**Description**: User initiates a booking request through the system.

**Process**:
- User selects a safehouse from available options
- System validates safehouse exists and is accessible
- User provides basic information:
  - Number of guests
  - Requested check-in date/time
  - Special needs (if any)
  - Accessibility requirements
  - Transportation needs

**API Method**: `safehouse.book`

**Example Request**:
```json
{
  "safehouseId": "507f1f77bcf86cd799439011",
  "requestedCheckIn": "2024-01-15T10:00:00Z",
  "numberOfGuests": 2,
  "specialNeeds": ["medical", "counseling"],
  "accessibilityNeeds": {
    "wheelchairAccessible": true,
    "childrenFriendly": true
  },
  "transportationRequired": true,
  "pickupLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main St, New York, NY"
  },
  "urgencyLevel": "high"
}
```

---

### Step 2: System Checks Availability & Safety Match

**Description**: System validates capacity, safety requirements, and accessibility needs.

**Validation Checks**:
- ✅ Safehouse availability status
- ✅ Bed capacity vs. requested guests
- ✅ Accessibility requirements match
  - Wheelchair accessibility
  - Pet-friendly accommodation
  - Children-friendly facilities
  - LGBTQ-friendly environment
- ✅ Special needs vs. available resources
  - Medical services
  - Legal assistance
  - Counseling services
- ✅ Security level appropriateness for risk level

**Safety Scoring**:
- Score range: 0-100
- Minimum required: 50 for approval
- Factors affecting score:
  - Availability: -50 if unavailable
  - Capacity: -30 if insufficient beds
  - Accessibility: -15 to -25 per unmet need
  - Resources: -10 to -15 per unavailable service
  - Security: -20 if security level insufficient

**API Method**: `safehouse.checkSafetyMatch`

**Response**:
```json
{
  "isMatch": true,
  "safetyScore": 85,
  "reasons": []
}
```

---

### Step 3: Anonymous Reservation Created

**Description**: System creates a secure, anonymous booking record.

**Process**:
- Creates booking with anonymous session ID (if applicable)
- Reserves beds in safehouse capacity
- Generates unique booking identifier
- Notifies safehouse staff via Socket.io
- Maintains privacy - no personal information stored

**Data Stored**:
- Booking ID (anonymous identifier)
- Safehouse ID
- Number of guests
- Requested dates
- Special needs (anonymized)
- Workflow step: 3

**API Method**: `safehouse.book` (includes Step 3)

**Response**:
```json
{
  "success": true,
  "bookingId": "507f1f77bcf86cd799439012",
  "status": "pending",
  "workflowStep": 3,
  "nextSteps": [
    "Awaiting transportation",
    "Digital check-in",
    "Support services activation"
  ]
}
```

---

### Step 4: Secure Transportation Arranged

**Description**: Coordinates safe transportation to safehouse location.

**Process**:
- Calculates distance from pickup to safehouse
- Estimates travel time
- Schedules transportation (15-minute buffer)
- Updates transportation status
- Notifies transportation coordinator

**Transportation Details**:
- Pickup location (coordinates + address)
- Scheduled pickup time
- Distance (kilometers)
- Estimated travel time (minutes)
- Status: `pending` → `scheduled` → `in_transit` → `completed`

**API Method**: `safehouse.arrangeTransportation`

**Example Request**:
```json
{
  "bookingId": "507f1f77bcf86cd799439012",
  "pickupLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main St, New York, NY"
  }
}
```

**Response**:
```json
{
  "success": true,
  "bookingId": "507f1f77bcf86cd799439012",
  "transportationDetails": {
    "pickupLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "123 Main St, New York, NY"
    },
    "scheduledTime": "2024-01-15T10:15:00Z",
    "status": "scheduled",
    "distance": 12.5,
    "estimatedTravelTime": 25
  },
  "workflowStep": 4
}
```

---

### Step 5: Digital Check-in & Needs Assessment

**Description**: Performs anonymous check-in and comprehensive needs assessment.

**Check-in Process**:
- Validates booking is approved
- Records check-in timestamp
- Updates safehouse capacity (reserved → occupied)
- Notifies staff via Socket.io

**Needs Assessment**:
- Medical needs (specific requirements)
- Legal needs (documentation, restraining orders, etc.)
- Counseling needs (trauma support, crisis intervention)
- Food assistance required
- Clothing assistance required
- Documentation help needed
- Safety concerns (specific threats or risks)

**API Method**: `safehouse.digitalCheckIn`

**Example Request**:
```json
{
  "bookingId": "507f1f77bcf86cd799439012",
  "needsAssessment": {
    "medicalNeeds": ["prescription medication", "wound care"],
    "legalNeeds": ["restraining order", "custody documentation"],
    "counselingNeeds": ["trauma therapy", "crisis support"],
    "foodAssistance": true,
    "clothingAssistance": true,
    "documentationHelp": true,
    "safetyConcerns": ["stalking", "threats via phone"]
  }
}
```

**Response**:
```json
{
  "success": true,
  "bookingId": "507f1f77bcf86cd799439012",
  "status": "checked_in",
  "needsAssessment": {
    "medicalNeeds": ["prescription medication", "wound care"],
    "legalNeeds": ["restraining order", "custody documentation"],
    "counselingNeeds": ["trauma therapy", "crisis support"],
    "foodAssistance": true,
    "clothingAssistance": true,
    "documentationHelp": true,
    "safetyConcerns": ["stalking", "threats via phone"]
  },
  "workflowStep": 5
}
```

---

### Step 6: Support Services Activated

**Description**: Activates required support services based on needs assessment.

**Service Activation**:
- **Medical Services**: 
  - If available on-site: Immediate activation
  - If not available: External provider coordination (scheduled within 24 hours)
  
- **Legal Services**:
  - If available on-site: Immediate activation
  - If not available: External provider coordination
  
- **Counseling Services**:
  - If available on-site: Scheduled within 2 hours
  - Priority based on urgency
  
- **Food Assistance**:
  - Immediate activation if available
  
- **Clothing Assistance**:
  - Coordination with donation centers
  
- **Documentation Help**:
  - Coordination with legal/social services

**API Method**: `safehouse.activateServices`

**Example Request**:
```json
{
  "bookingId": "507f1f77bcf86cd799439012"
}
```

**Response**:
```json
{
  "success": true,
  "bookingId": "507f1f77bcf86cd799439012",
  "supportServices": {
    "medical": true,
    "legal": true,
    "counseling": true,
    "food": true,
    "transportation": true,
    "assignedServices": [
      {
        "serviceType": "medical",
        "status": "active",
        "scheduledDate": "2024-01-15T10:30:00Z"
      },
      {
        "serviceType": "legal",
        "status": "active"
      },
      {
        "serviceType": "counseling",
        "status": "active",
        "scheduledDate": "2024-01-15T12:00:00Z"
      },
      {
        "serviceType": "food",
        "status": "active"
      }
    ]
  },
  "workflowStep": 6
}
```

---

## Complete Workflow Execution

The system can execute all steps automatically using:

**API Method**: `safehouse.book` (with complete workflow)

This method:
1. ✅ Initiates booking request
2. ✅ Checks availability & safety match
3. ✅ Creates anonymous reservation
4. ✅ Arranges transportation (if needed)
5. ⏳ Awaits check-in (manual step)
6. ⏳ Awaits service activation (manual step)

---

## Real-time Updates

All workflow steps emit Socket.io events for real-time monitoring:

- `booking:created` - Step 3 completed
- `transportation:scheduled` - Step 4 completed
- `booking:checked_in` - Step 5 completed
- `services:activated` - Step 6 completed

---

## Privacy & Security

- **Anonymous Sessions**: All bookings support anonymous user sessions
- **Data Minimization**: Only necessary information is stored
- **Secure Transportation**: Pickup locations are encrypted
- **Access Control**: Staff-only operations for check-in and service activation
- **Audit Trail**: All workflow steps are logged with timestamps

---

## Error Handling

Each step includes comprehensive error handling:
- Validation errors return specific messages
- Safety match failures include detailed reasons
- Transportation coordination failures trigger fallback options
- Service activation failures are logged and retried

---

## Integration Points

- **Socket.io**: Real-time notifications to staff
- **Notification Service**: SMS/Email alerts for critical steps
- **Google Maps API**: Distance calculation and routing
- **External Services**: Medical, legal, and counseling provider coordination

---

## Best Practices

1. **Always check safety match** before creating reservation
2. **Verify transportation** before check-in
3. **Complete needs assessment** thoroughly during check-in
4. **Activate services promptly** after check-in
5. **Monitor workflow progress** via Socket.io events
6. **Maintain anonymity** throughout the process

---

## Support

For questions or issues with the booking workflow, contact the development team or refer to the main project documentation.

