// ENDPOINTS

const local = "http://localhost:3000";
const prod = "https://cs1eavm5d2.execute-api.us-east-1.amazonaws.com/default";


const useMe = prod;

export default {
    LOOKUP_ENDPOINT : `${useMe}/lookup-invite`,
    SAVE_RESPONSE_ENDPOINT: `${useMe}/save-response`,
    GET_RSVPS_ENDPOINT: `${useMe}/get-rsvps`,
 }