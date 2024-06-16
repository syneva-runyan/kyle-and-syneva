// ENDPOINTS

const local = "http://localhost:3000";
const prod = "https://n509kmqo15.execute-api.us-east-1.amazonaws.com/prod";

export default {
    LOOKUP_ENDPOINT : `${local}/lookup-invite`,
    SAVE_RESPONSE_ENDPOINT: `${local}/save-response`,
    GET_RSVPS_ENDPOINT: `${local}/get-rsvps`,
 }