// ENDPOINTS
// const local = "http://localhost:3000";
const prod = "https://mbsfvjlo6i.execute-api.us-east-1.amazonaws.com";

const useMe = prod;

export default {
    LOOKUP_ENDPOINT : `${useMe}/lookup-invite`,
    SAVE_RESPONSE_ENDPOINT: `${useMe}/save-response`,
    COMMENT_OR_QUESTION: `${useMe}/comment-or-question`,
 }